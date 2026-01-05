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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

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
    let rawText = data.candidates[0].content.parts[0].text.trim();
    
    // Clean up markdown code blocks if present
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const codeStructure = JSON.parse(rawText);

    return NextResponse.json(codeStructure, { status: 200 });
  } catch (error: any) {
    console.error('Generate code error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate code' },
      { status: 500 }
    );
  }
}
