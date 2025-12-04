export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
import OpenAI from 'openai';

// Initialize OpenAI client for Hugging Face
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

// Helper: Parse PDF
const parsePDF = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, true);
    parser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
    parser.on('pdfParser_dataReady', () => {
      const text = (parser as any).getRawTextContent();
      resolve(text);
    });
    parser.parseBuffer(buffer);
  });
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extractedText = await parsePDF(buffer);
    
    // Clean text
    extractedText = extractedText.replace(/[-]{2,}/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 20000);

    // Prompt for JSON output
    const prompt = `
      Based on the following text, generate 5 multiple-choice questions.
      Return the result as a strict JSON array of objects. 
      Do not include any markdown formatting (like \`\`\`json).
      
      Each object must have:
      - "question": The question string
      - "options": An array of 4 possible answers (strings)
      - "answer": The correct answer string (must match one of the options exactly)
      
      Text:
      ${extractedText}
    `;

    const completion = await client.chat.completions.create({
      model: "meta-llama/Llama-3.1-8B-Instruct:novita",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const rawContent = completion.choices[0].message.content || "[]";
    
    // Cleanup: Sometimes LLMs wrap JSON in markdown blocks, remove them
    const jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();

    let quizData;
    try {
      quizData = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON:", rawContent);
      return NextResponse.json({ error: 'Failed to generate valid quiz data' }, { status: 500 });
    }

    return NextResponse.json({ quiz: quizData });

  } catch (error: any) {
    console.error("Quiz API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}