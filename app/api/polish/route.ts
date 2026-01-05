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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

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
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      let errorMessage = 'Failed to refine input';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        // Use default error message
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    
    // Check if response has candidates
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini API response:', JSON.stringify(data));
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      );
    }

    const text = data.candidates[0].content.parts[0].text;
    if (!text) {
      return NextResponse.json(
        { error: 'Empty response from AI service' },
        { status: 500 }
      );
    }

    return NextResponse.json({ refined: text.trim() });
  } catch (error: any) {
    console.error('Polish error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to polish vibe',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
