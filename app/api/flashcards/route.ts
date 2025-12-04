export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
import OpenAI from 'openai';


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
    
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extractedText = await parsePDF(buffer);
    
    // Clean and truncate
    extractedText = extractedText.replace(/[-]{2,}/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 20000);

    const prompt = `
      Based on the text below, generate exactly 6 flashcards.
      Return the result as a strict JSON array of objects.
      Each object must have:
      - "front": A short question or concept (max 10 words)
      - "back": A concise definition or answer (max 30 words)
      
      Do not include markdown blocks. Just the raw JSON array.
      
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
    const jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();

    let flashcards;
    try {
      flashcards = JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON Parse Error:", rawContent);
      return NextResponse.json({ error: 'Failed to parse flashcards' }, { status: 500 });
    }

    return NextResponse.json({ flashcards });

  } catch (error: any) {
    console.error("Flashcard API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}