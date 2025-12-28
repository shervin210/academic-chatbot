import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TELEGRAM_API = "https://api.telegram.org";

export async function POST(req: Request) {
    const body = await req.json();
    if (body.callback_query) {
        const chatId = body.callback_query.message.chat.id;
        const data = body.callback_query.data;

        if (data === "LAUNCH_CHAT") {
            await fetch(
                `${TELEGRAM_API}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "✍️ عالی! حالا سوالت رو بنویس 🙂",
                    }),
                }
            );
        }

        return NextResponse.json({ ok: true });
    }

    if (!body.message || body.message.from?.is_bot) {
        return NextResponse.json({ ok: true });
    }

    const chatId = body.message.chat.id;
    const text = body.message.text;

    if (text === "/start") {
        await fetch(
            `${TELEGRAM_API}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `👋 خوش اومدی!\n\nبرای شروع چت با ربات، روی دکمه زیر بزن 👇`,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "🚀 Launch Chat",
                                    callback_data: "LAUNCH_CHAT",
                                },
                            ],
                        ],
                    },
                }),
            }
        );

        return NextResponse.json({ ok: true });
    }

    const aiRes = await fetch(
        "https://academic-chatbot-objx.vercel.app/api/chat",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
        }
    );

    const aiData = await aiRes.json();

    await fetch(
        `${TELEGRAM_API}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: aiData.reply || "❌ خطایی پیش اومد",
            }),
        }
    );

    return NextResponse.json({ ok: true });
}
