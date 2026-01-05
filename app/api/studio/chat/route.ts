import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, projectId, phase, context } = body;

    if (!message || !projectId || !phase) {
      return NextResponse.json(
        { error: 'Missing required fields: message, projectId, phase' },
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

    // Build context-aware prompt based on phase
    const phasePrompts: Record<string, string> = {
      scope: `You are an AI assistant helping a developer define their project scope. 
The user is describing their project idea. Help them clarify:
- Core features and functionality
- Target users
- Use cases and scenarios
- Success criteria

Be concise, ask clarifying questions if needed, and provide actionable suggestions. Respond in the same language as the user.`,
      stack: `You are an AI assistant helping a developer choose the right technology stack.
Based on the project scope, suggest appropriate technologies for:
- Frontend framework
- Backend framework
- Database
- Deployment platform
- Additional tools

Consider scalability, developer experience, and project requirements. Respond in the same language as the user.`,
      design: `You are an AI assistant helping a developer design their project architecture.
Based on the scope and chosen stack, help design:
- System architecture
- Component structure
- Data flow
- API design
- Security considerations

Provide clear, structured architecture recommendations. Respond in the same language as the user.`,
      build: `You are an AI assistant helping a developer generate code.
Based on the project scope, stack, and design, help generate:
- Project structure
- Core files and components
- Configuration files
- Initial implementation

Provide production-ready, well-structured code. Respond in the same language as the user.`,
    };

    const systemPrompt = phasePrompts[phase] || phasePrompts.scope;
    const contextStr = context ? `\n\nProject Context: ${JSON.stringify(context)}` : '';
    const fullPrompt = `${systemPrompt}${contextStr}\n\nUser Message: ${message}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error('Gemini API error');
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ message: text.trim() }, { status: 200 });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}
