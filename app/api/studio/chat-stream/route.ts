import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getSkillsPrompt, SKILL_PROFILES } from '@/lib/ai/skills';
import { ErrorHandler } from '@/lib/utils/error-handler';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, projectId, phase, context, conversationHistory } = body;

    if (!message || !projectId || !phase) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: message, projectId, phase' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build conversation history for context
    const historyMessages = conversationHistory?.slice(-10) || []; // Last 10 messages for context
    
    const phaseInfo = {
      scope: {
        role: 'Senior Technical Product Manager',
        skills: SKILL_PROFILES.productManager,
        task: 'helping define project scope',
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

    const phaseConfig = phaseInfo[phase as keyof typeof phaseInfo] || phaseInfo.scope;
    const skillsPrompt = getSkillsPrompt(phaseConfig.role, phaseConfig.task);

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
`,
      stack: `
## Your Role
You are helping a developer choose the right technology stack for their project.

## Your Tasks
- Suggest appropriate technologies based on project scope
- Consider scalability, performance, and maintainability
- Evaluate developer experience and ecosystem
- Suggest alternatives and explain trade-offs
- Consider team expertise and learning curve

## Communication Style
- Provide clear recommendations with rationale
- Explain trade-offs between options
- Consider project-specific requirements
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

## Communication Style
- Provide clear, structured architecture recommendations
- Use diagrams and visual descriptions when helpful
- Explain design decisions and trade-offs
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

## Communication Style
- Provide complete, runnable code
- Follow best practices for the selected stack
- Include comments for complex logic
`,
    };

    const phaseGuidelines = phaseSpecificGuidelines[phase] || phaseSpecificGuidelines.scope;
    const contextStr = context ? `\n\n## Project Context\n${JSON.stringify(context, null, 2)}` : '';
    const historyStr = historyMessages.length > 0 
      ? `\n\n## Conversation History\n${historyMessages.map((m: any) => `${m.role}: ${m.content}`).join('\n')}`
      : '';

    const fullPrompt = `
${skillsPrompt}

${phaseConfig.skills}

${phaseGuidelines}

${contextStr}

${historyStr}

## User Message
${message}

## Instructions
- Respond in the same language as the user
- Be helpful, accurate, and actionable
- Consider the full project context and conversation history
- Provide practical, implementable solutions
- Think about edge cases and potential issues
- Consider best practices and industry standards
`;

    // Use Gemini streaming API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      ErrorHandler.logError(`Gemini API error: ${errorText}`, 'ChatStream');
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    const text = data.candidates[0].content.parts[0].text;
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          ErrorHandler.logError(error, 'ChatStream.read');
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    ErrorHandler.logError(error, 'ChatStream');
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
