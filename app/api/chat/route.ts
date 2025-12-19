import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful academic tutor. Answer clearly, step-by-step. ' +
            'If the question is in Persian, reply in Persian. Be educational and concise.',
        },
        ...messages,
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 1024,
      stream: false,
    });

    const content = chatCompletion.choices[0]?.message?.content?.trim() || 'پاسخی دریافت نشد.';

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Groq SDK Error:', error);
    return NextResponse.json(
      { error: error.message || 'خطای ناشناخته در ارتباط با Groq' },
      { status: 500 }
    );
  }
}