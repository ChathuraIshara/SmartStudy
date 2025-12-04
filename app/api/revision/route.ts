export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

const parsePDF = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, 1);
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
    
    // Clean and truncate
    extractedText = extractedText.replace(/[-]{2,}/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 25000);

    const prompt = `
      Create a comprehensive set of revision notes based on the text below.
      Organize the content into clear sections.
      
      Return a STRICT JSON array of objects. Do not use Markdown blocks.
      Each object must have:
      - "title": The section topic (string)
      - "points": An array of key facts/concepts (strings)

      Example format:
      [
        { "title": "Introduction", "points": ["Fact 1", "Fact 2"] },
        { "title": "Key Concepts", "points": ["Concept A", "Concept B"] }
      ]
      
      Text:
      ${extractedText}
    `;

    const completion = await client.chat.completions.create({
      model: "meta-llama/Llama-3.1-8B-Instruct:novita",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.6,
    });

    const rawContent = completion.choices[0].message.content || "[]";
    const jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();

    let revisionData;
    try {
      revisionData = JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON Parse Error:", rawContent);
      return NextResponse.json({ error: 'Failed to generate revision notes' }, { status: 500 });
    }

    return NextResponse.json({ revision: revisionData });

  } catch (error: any) {
    console.error("Revision API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}