'use client';

import { useState } from 'react';
import { generateAcademicResponse } from './actions';
import { formatForDisplay } from '@/utils/format';

export default function AcademicChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await generateAcademicResponse([...messages, userMsg]);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ خطا: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎓 دستیار آموزشی</h1>
      <div className="h-[500px] overflow-y-auto border rounded p-4 mb-4 bg-gray-50 text-black">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <span className="font-medium">{msg.role === 'user' ? 'شما:' : 'دستیار:'}</span>{' '}
            <div
              dangerouslySetInnerHTML={{
                __html: formatForDisplay(msg.content)
              }}
              dir='rtl'
              className="whitespace-pre-line"
            />
          </div>
        ))}
        {loading && <div className="text-gray-500">در حال تفکر...</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="سؤال آموزشی خود را بپرسید..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          ارسال
        </button>
      </form>
    </div>
  );
}