import { NextRequest, NextResponse } from 'next/server';
import { getSkillsPrompt, SKILL_PROFILES } from '@/lib/ai/skills';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, scope, stack, viewType = 'system' } = body;

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

    const skillsPrompt = getSkillsPrompt('Lead Systems Architect', 'generating system architecture diagrams');
    const architectSkills = SKILL_PROFILES.systemsArchitect;

    const prompt = `
${skillsPrompt}

${architectSkills}

## Current Task
Generate a comprehensive Mermaid architecture diagram based on the project scope and technology stack.

## Project Scope
${JSON.stringify(scope, null, 2)}

## Technology Stack
${JSON.stringify(stack, null, 2)}

## Architecture Design Guidelines
${viewType === 'system' ? `
1. Design a scalable, maintainable system architecture
2. Show clear separation of concerns and component boundaries
3. Include all key components (frontend, backend, database, APIs, services)
4. Show relationships and interactions between components
5. Consider security boundaries and authentication flows
6. Include monitoring and logging infrastructure
7. Design for horizontal and vertical scalability
` : viewType === 'dataflow' ? `
1. Focus on data flow through the system
2. Show request/response patterns
3. Illustrate event streams and data pipelines
4. Show data transformations and processing steps
5. Include caching and data storage layers
6. Show data validation and error handling flows
` : viewType === 'deployment' ? `
1. Show deployment architecture and infrastructure
2. Include client, server, database, CDN layers
3. Show load balancing and scaling strategies
4. Include CI/CD pipelines
5. Show environment separation (dev, staging, prod)
6. Include monitoring and observability infrastructure
` : `
1. Design a comprehensive system architecture
2. Show all components and their relationships
3. Include deployment and data flow considerations
`}

## Diagram Requirements
- Use appropriate Mermaid diagram types (graph TB, flowchart TD, or architecture diagrams)
- Use clear, descriptive node labels
- Show relationships with proper edge labels
- Group related components logically
- Use consistent styling and colors
- Include legend or annotations if needed
- Make it production-ready and comprehensive
- Focus on ${viewType === 'system' ? 'system components and structure' : viewType === 'dataflow' ? 'data flow patterns' : 'deployment infrastructure'}

## Output Format
Output ONLY the Mermaid diagram code (without markdown code blocks).

Example format:
graph TB
    A[Frontend] --> B[API Gateway]
    B --> C[Backend Service]
    C --> D[Database]
    B --> E[Cache Layer]
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: `${skillsPrompt}\n\n${architectSkills}` }]
        },
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
