export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

// Helper: Parse PDF Buffer
const parsePDF = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, true); // true = Raw Text
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

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = await parsePDF(buffer);
    
    // Clean up text slightly (remove excessive dashes/spaces)
    extractedText = extractedText.replace(/[-]{2,}/g, ' ').replace(/\s+/g, ' ').trim();

    return NextResponse.json({ text: extractedText });

  } catch (error: any) {
    console.error("Extraction Error:", error);
    return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 });
  }
}