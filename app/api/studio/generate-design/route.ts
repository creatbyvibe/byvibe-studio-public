import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, scope, stack } = body;

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

    const prompt = `You are a Lead Systems Architect. Based on the following project scope and technology stack, generate a Mermaid architecture diagram.

Project Scope:
${JSON.stringify(scope, null, 2)}

Technology Stack:
${JSON.stringify(stack, null, 2)}

Generate a Mermaid diagram that shows:
1. System architecture (components, services, databases)
2. Data flow between components
3. Key integrations and APIs
4. Deployment structure

Output ONLY the Mermaid diagram code (without markdown code blocks). Use appropriate Mermaid diagram types (graph, flowchart, or architecture diagrams).

Example format:
graph TB
    A[Frontend] --> B[API Gateway]
    B --> C[Backend Service]
    C --> D[Database]
`;

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
      
      let errorMessage = 'Failed to generate design';
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

    let diagram = data.candidates[0].content.parts[0].text;
    if (!diagram) {
      return NextResponse.json(
        { error: 'Empty response from AI service' },
        { status: 500 }
      );
    }
    
    // Clean up markdown code blocks if present
    diagram = diagram.trim().replace(/```mermaid/g, '').replace(/```/g, '').trim();

    return NextResponse.json({ diagram }, { status: 200 });
  } catch (error: any) {
    console.error('Generate design error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate design',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
