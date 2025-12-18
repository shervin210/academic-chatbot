// src/app/api/chat/route.ts
import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

// ✅ ایجاد کلاینت Groq (فقط روی سرور اجرا میشه)
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
      model: 'llama-3.1-8b-instant', // 👈 مدلی که انتخاب کردی
      temperature: 0.3,
      max_tokens: 1024,
      stream: false, // ⚠️ مهم: stream فقط در Server Actions یا متدهای خاص کار میکنه — تو API route خام stream نمیخواد
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