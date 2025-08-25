import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { generateAdviceSummary, analyzeHand } from '@majongapp/core';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { summary } = req.body;

    if (!summary) {
      return res.status(400).json({ error: 'Summary is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Generate enhanced advice using OpenAI
    const systemPrompt = `You are a helpful Mahjong coach for Hong Kong Basic Mahjong. 
    Provide clear, beginner-friendly advice based on the game situation. 
    Keep responses concise (1-2 sentences) and focus on practical tips.
    Use simple language and explain your reasoning briefly.`;

    const userPrompt = `Game situation: ${summary}

Please provide a helpful tip or strategic advice for this Mahjong situation.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const tip = completion.choices[0]?.message?.content?.trim();

    if (!tip) {
      return res.status(500).json({ error: 'Failed to generate advice' });
    }

    return res.status(200).json({ tip });

  } catch (error) {
    console.error('Error generating advice:', error);
    
    // Return a fallback tip if OpenAI fails
    const fallbackTips = [
      "Focus on building melds (sets of 3) and keep your hand flexible.",
      "Look for sequences in the same suit - they're often easier to complete.",
      "Don't hold onto too many honor tiles unless you can form triplets.",
      "Consider what tiles your opponents might need before discarding.",
      "Keep pairs that could become triplets or complete sequences."
    ];
    
    const randomTip = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    
    return res.status(200).json({ 
      tip: randomTip,
      fallback: true 
    });
  }
}