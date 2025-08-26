import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const { summary } = (req.body ?? {}) as { summary?: string };
  if (!summary) return res.status(400).json({ error: 'Missing summary' });

  if (!process.env.OPENAI_API_KEY) return res.status(200).json({ tip: summary });

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'user', content: `Turn this Mahjong advisor summary into a short, beginner-friendly tip:\n${summary}` }
      ]
    })
  });

  let tip = summary;
  try {
    const j = await r.json();
    tip = (j as any)?.choices?.[0]?.message?.content ?? summary;
  } catch {}
  return res.status(200).json({ tip });
}
