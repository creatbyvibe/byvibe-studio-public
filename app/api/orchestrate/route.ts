import { NextRequest, NextResponse } from 'next/server';

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
      Role: Lead Systems Architect.
      Task: Analyze the user's requirement: "${input}".
      Instruction: Respond in the same language as the user input.
      
      Generate a structured JSON response with:
      1. "difficulty": "Low", "Medium", or "High".
      2. "time_est": Dev time estimate.
      3. "tech_stack": Recommended stack (Concise).
      4. "risks": 1 key technical risk.
      5. "file_tree": A string showing a simple ASCII file tree (max 5-6 lines, no markdown ticks).
      6. "cursor_prompt": A system prompt for an LLM (Cursor) to scaffold this project.

      Output JSON ONLY.
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error('Gemini API error');
    }

    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const plan = JSON.parse(rawText);

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Orchestrate error:', error);
    return NextResponse.json({ error: 'Failed to orchestrate plan' }, { status: 500 });
  }
}
