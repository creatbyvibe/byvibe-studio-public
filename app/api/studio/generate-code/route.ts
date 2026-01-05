import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, scope, stack, design } = body;

    if (!scope || !stack) {
      return NextResponse.json(
        { error: 'Missing required fields: scope, stack' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      );
    }

    const prompt = `You are a Senior Full-Stack Developer. Based on the project scope, technology stack, and architecture design, generate a complete project structure with code files.

Project Scope:
${JSON.stringify(scope, null, 2)}

Technology Stack:
${JSON.stringify(stack, null, 2)}

Architecture Design:
${design || 'No specific design provided'}

Generate a JSON response with the following structure:
{
  "fileTree": {
    "path": "file content or nested structure"
  },
  "files": [
    {
      "path": "relative/path/to/file.ext",
      "content": "file content here",
      "language": "typescript|javascript|python|etc"
    }
  ],
  "instructions": "Setup and deployment instructions"
}

Include:
1. Project structure (package.json, config files)
2. Core application files
3. Key components/modules
4. Configuration files
5. README with setup instructions

Output ONLY valid JSON, no markdown code blocks.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      let errorMessage = 'Failed to generate code';
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

    let rawText = data.candidates[0].content.parts[0].text;
    if (!rawText) {
      return NextResponse.json(
        { error: 'Empty response from AI service' },
        { status: 500 }
      );
    }
    
    rawText = rawText.trim();
    
    // Clean up markdown code blocks if present
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let codeStructure;
    try {
      codeStructure = JSON.parse(rawText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw text:', rawText);
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(codeStructure, { status: 200 });
  } catch (error: any) {
    console.error('Generate code error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate code',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
