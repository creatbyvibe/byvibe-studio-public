import { NextRequest, NextResponse } from 'next/server';
import { getSkillsPrompt, SKILL_PROFILES } from '@/lib/ai/skills';

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

    // Build context-aware prompt based on phase with comprehensive skills
    const phaseConfig: Record<string, { role: string; skills: string; task: string }> = {
      scope: {
        role: 'Senior Technical Product Manager',
        skills: SKILL_PROFILES.productManager,
        task: 'helping define project scope, features, and requirements',
      },
      stack: {
        role: 'Lead Systems Architect',
        skills: SKILL_PROFILES.systemsArchitect,
        task: 'helping choose the right technology stack',
      },
      design: {
        role: 'Lead Systems Architect',
        skills: SKILL_PROFILES.systemsArchitect,
        task: 'helping design project architecture',
      },
      build: {
        role: 'Senior Full-Stack Developer',
        skills: `${SKILL_PROFILES.fullStackDeveloper}\n${SKILL_PROFILES.codeGenerator}`,
        task: 'helping generate production-ready code',
      },
    };

    const phaseInfo = phaseConfig[phase] || phaseConfig.scope;
    const skillsPrompt = getSkillsPrompt(phaseInfo.role, phaseInfo.task);
    
    const phaseSpecificGuidelines: Record<string, string> = {
      scope: `
## Your Role
You are helping a developer define their project scope. The user is describing their project idea.

## Your Tasks
- Help clarify core features and functionality
- Identify target users and personas
- Define use cases and scenarios
- Establish success criteria and metrics
- Identify potential challenges and edge cases
- Suggest MVP scope and phased approach

## Communication Style
- Be concise and actionable
- Ask clarifying questions when needed
- Provide concrete suggestions
- Consider both technical and business perspectives
- Think about user experience and developer experience
`,
      stack: `
## Your Role
You are helping a developer choose the right technology stack for their project.

## Your Tasks
- Suggest appropriate technologies for:
  * Frontend framework (React, Vue, Angular, etc.)
  * Backend framework (Node.js, Python, Go, etc.)
  * Database (PostgreSQL, MongoDB, Redis, etc.)
  * Deployment platform (Vercel, AWS, GCP, etc.)
  * Additional tools and libraries
- Consider scalability, performance, and maintainability
- Evaluate developer experience and ecosystem
- Consider team expertise and learning curve
- Suggest alternatives and explain trade-offs
- Consider cost and infrastructure requirements

## Communication Style
- Provide clear recommendations with rationale
- Explain trade-offs between options
- Consider project-specific requirements
- Suggest modern, well-maintained technologies
`,
      design: `
## Your Role
You are helping a developer design their project architecture.

## Your Tasks
- Design system architecture based on scope and stack
- Define component structure and boundaries
- Design data flow and state management
- Plan API design and endpoints
- Consider security architecture
- Design for scalability and performance
- Plan deployment architecture
- Consider monitoring and observability
- Design error handling and resilience patterns

## Communication Style
- Provide clear, structured architecture recommendations
- Use diagrams and visual descriptions when helpful
- Explain design decisions and trade-offs
- Consider both current needs and future growth
- Provide concrete implementation guidance
`,
      build: `
## Your Role
You are helping a developer generate production-ready code.

## Your Tasks
- Generate project structure and organization
- Create core files and components
- Generate configuration files
- Provide initial implementation
- Include proper error handling
- Add type definitions and interfaces
- Include setup and deployment instructions
- Provide code examples and patterns

## Communication Style
- Provide complete, runnable code
- Follow best practices for the selected stack
- Include comments for complex logic
- Explain code structure and organization
- Provide setup and deployment guidance
`,
    };

    const phaseGuidelines = phaseSpecificGuidelines[phase] || phaseSpecificGuidelines.scope;
    const contextStr = context ? `\n\n## Project Context\n${JSON.stringify(context, null, 2)}` : '';
    
    const fullPrompt = `
${skillsPrompt}

${phaseInfo.skills}

${phaseGuidelines}

${contextStr}

## User Message
${message}

## Instructions
- Respond in the same language as the user
- Be helpful, accurate, and actionable
- Consider the full project context
- Provide practical, implementable solutions
- Think about edge cases and potential issues
- Consider best practices and industry standards
`;

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
