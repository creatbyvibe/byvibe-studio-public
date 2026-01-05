import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input || input.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const prompt = `
      Role: Senior Technical Product Manager.
      Task: Convert the user's raw idea into a concise technical functional requirement.
      Input: "${input}"
      Instruction: Output ONLY the refined technical description (2-3 sentences). Respond in the same language as the Input.
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!response.ok) {
      throw new Error('Gemini API error');
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ refined: text.trim() });
  } catch (error) {
    console.error('Polish error:', error);
    return NextResponse.json({ error: 'Failed to polish vibe' }, { status: 500 });
  }
}
