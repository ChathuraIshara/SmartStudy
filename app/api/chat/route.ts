export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';



export async function POST(req: NextRequest) {
  try {
    const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});
    const { messages, context } = await req.json();

    // System prompt forces the AI to only answer based on the provided notes
    const systemMessage = {
      role: "system",
      content: `You are a helpful study assistant. 
      Answer the user's questions based ONLY on the following study material context. 
      If the answer is not in the context, say "I couldn't find that information in your notes."
      
      Context:
      ${context.substring(0, 20000)}` // Limit context size to avoid token errors
    };

    const completion = await client.chat.completions.create({
      model: "meta-llama/Llama-3.1-8B-Instruct:novita",
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    });

    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}