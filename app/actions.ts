'use server';

import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateAcademicResponse(
    messages: ChatCompletionMessageParam[]
) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful academic tutor. Answer clearly and step-by-step. ' +
                        'If the question is in Persian, reply in Persian. Be concise and educational.',
                },
                ...messages,
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.3,
            max_tokens: 1024,
            stream: false,
        });

        return chatCompletion.choices[0]?.message?.content?.trim() || 'پاسخی دریافت نشد.';
    } catch (error: any) {
        console.error('Groq Error:', error);
        throw new Error(`خطا در تولید پاسخ: ${error.message || 'unknown'}`);
    }
}