// 1. FORCE NODEJS RUNTIME (Required for pdf2json)
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import PDFParser from 'pdf2json'; // Import the new library
import OpenAI from 'openai'; // Import the SDK

// Initialize OpenAI client pointing to Hugging Face
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1", // Same URL as your Python script
  apiKey: process.env.HF_TOKEN,
});

// Helper Function: Wrap pdf2json in a Promise to make it async/await compatible
const parsePDF = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null); // '1' tells it to parse as Raw Text

    parser.on('pdfParser_dataError', (errData: any) => {
      console.error(errData.parserError);
      reject(errData.parserError);
    });

    parser.on('pdfParser_dataReady', () => {
      // Get the raw text content when parsing is done
      const text = (parser as any).getRawTextContent();
      resolve(text);
    });

    // Start parsing
    parser.parseBuffer(buffer);
  });
};

export async function POST(req: NextRequest) {
  try {
    // Check for Token
    if (!process.env.HF_TOKEN) {
      return NextResponse.json({ error: 'Missing API Token' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log(`Processing file: ${file.name}`);

    // Convert to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Extract Text using our new pdf2json helper
    let extractedText = "";
    try {
      extractedText = await parsePDF(buffer);
      console.log("Extracted Text Length:", extractedText);
    } catch (parseError) {
      console.error("PDF Parsing failed:", parseError);
      return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 });
    }

    // 3. Clean up the text (pdf2json sometimes leaves weird spacing)
    // This regex replaces multiple dashes/spaces with a single space
    const cleanText = extractedText.replace(/[-]{2,}/g, ' ').replace(/\s+/g, ' ').trim();

    // Truncate to safe limit (15,000 chars)
    const truncatedText = cleanText.substring(0, 15000);

    console.log("Sending to AI...");

    // 4. Send to Hugging Face
   const response = await client.chat.completions.create({
      model: "meta-llama/Llama-3.1-8B-Instruct:novita", // Using standard 3.1 ID
      messages: [
        {
          role: "user",
          content: `Summarize the following text into concise bullet points:\n\n${truncatedText}`
        }
      ],
      max_tokens: 500,
    });
    console.log("response",response);

    // if (response.data.error) {
    //    throw new Error(response.data.error);
    // }

const summary = response.choices[0].message.content || "No summary generated.";
    return NextResponse.json({ summary });

  } catch (error: any) {
    console.error("API ERROR:", error.response?.data || error.message);
    
    if (error.response?.data?.error?.includes("loading")) {
        return NextResponse.json({ error: 'Model is loading... try again in 30s.' }, { status: 503 });
    }

    return NextResponse.json({ 
      error: error.response?.data?.error || error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}