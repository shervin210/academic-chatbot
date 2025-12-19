import { NextResponse } from "next/server";

const TELEGRAM_API = "https://api.telegram.org";

export async function POST(req: Request) {
    const body = await req.json();

    const message = body.message;
    if (!message?.text) {
        return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const userText = message.text;

    const botResponse = await fetch(
        "https://academic-chatbot-objx.vercel.app/api/chat",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText }),
        }
    );

    const data = await botResponse.json();
    const replyText = data.reply || "مشکلی پیش اومد 😕";

    await fetch(
        `${TELEGRAM_API}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: replyText,
            }),
        }
    );

    return NextResponse.json({ ok: true });
}
