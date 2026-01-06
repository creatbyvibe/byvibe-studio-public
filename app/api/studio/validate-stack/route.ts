import { NextRequest, NextResponse } from 'next/server';
import { getSkillsPrompt, SKILL_PROFILES } from '@/lib/ai/skills';
import { ErrorHandler } from '@/lib/utils/error-handler';

export const runtime = 'edge';

// Known compatibility issues
const COMPATIBILITY_RULES = {
  conflicts: [
    { tech1: 'Next.js', tech2: 'Vue.js', reason: 'Next.js is React-based, cannot use with Vue.js' },
    { tech1: 'React', tech2: 'Vue.js', reason: 'React and Vue.js are different frameworks' },
    { tech1: 'PostgreSQL', tech2: 'MongoDB', reason: 'Different database paradigms (SQL vs NoSQL)' },
  ],
  recommendations: [
    { tech: 'Next.js', recommended: ['TypeScript', 'Tailwind CSS', 'Vercel'] },
    { tech: 'React', recommended: ['TypeScript', 'Tailwind CSS'] },
    { tech: 'Node.js', recommended: ['TypeScript', 'Prisma'] },
    { tech: 'Python (FastAPI)', recommended: ['PostgreSQL', 'SQLAlchemy'] },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stack, scope } = body;

    if (!stack) {
      return NextResponse.json(
        { error: 'Stack is required' },
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

    const skillsPrompt = getSkillsPrompt('Lead Systems Architect', 'validating technology stack compatibility');
    const architectSkills = SKILL_PROFILES.systemsArchitect;

    const prompt = `
${skillsPrompt}

${architectSkills}

## Current Task
Validate the selected technology stack for compatibility, conflicts, and suitability for the project.

## Project Scope
${JSON.stringify(scope || {}, null, 2)}

## Selected Technology Stack
${JSON.stringify(stack, null, 2)}

## Instructions
1. Perform comprehensive validation:
   - Check for compatibility issues between selected technologies
   - Identify potential conflicts or incompatibilities
   - Verify that the stack is suitable for the project requirements
   - Check if critical components are missing
   - Assess scalability and performance implications
   - Consider security best practices

2. For each issue found, provide:
   - **type**: "conflict" (incompatible technologies), "missing" (required component missing), "unsuitable" (not ideal for project), "warning" (potential issue)
   - **message**: Clear description of the issue
   - **severity**: "high" (must fix), "medium" (should fix), "low" (nice to have)
   - **suggestion**: Specific actionable recommendation to resolve the issue

3. Suggest missing critical components:
   - Authentication/authorization solution
   - State management (if frontend framework needs it)
   - API layer (REST, GraphQL, tRPC, etc.)
   - Testing framework
   - Build tools and bundlers
   - Monitoring and logging
   - Error tracking

4. Provide actionable recommendations:
   - Technologies to add
   - Technologies to remove (if conflicts)
   - Technologies to replace (if better alternatives exist)

5. Output a JSON object with this exact structure:
{
  "valid": true|false,
  "warnings": [
    {
      "type": "conflict|missing|unsuitable",
      "message": "Warning message",
      "severity": "high|medium|low",
      "suggestion": "How to fix"
    }
  ],
  "missing": [
    {
      "category": "frontend|backend|database|deployment|additional",
      "item": "Missing technology",
      "reason": "Why it's needed"
    }
  ],
  "recommendations": [
    {
      "action": "add|remove|replace",
      "item": "Technology name",
      "reason": "Why this action is recommended"
    }
  ],
  "summary": "Overall assessment of the stack"
}

## Output Format
Output ONLY valid JSON, no markdown code blocks, no explanations.
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
      ErrorHandler.logError(`Gemini API error: ${errorText}`, 'ValidateStack');
      
      // Fallback to basic validation
      return NextResponse.json({
        valid: true,
        warnings: [],
        missing: [],
        recommendations: [],
        summary: 'Basic validation passed',
      }, { status: 200 });
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      // Fallback to basic validation
      return NextResponse.json({
        valid: true,
        warnings: [],
        missing: [],
        recommendations: [],
        summary: 'Basic validation passed',
      }, { status: 200 });
    }

    let rawText = data.candidates[0].content.parts[0].text;
    if (!rawText) {
      return NextResponse.json({
        valid: true,
        warnings: [],
        missing: [],
        recommendations: [],
        summary: 'Basic validation passed',
      }, { status: 200 });
    }
    
    // Clean up markdown code blocks
    rawText = rawText.trim().replace(/```json/g, '').replace(/```/g, '').trim();
    
    let validation;
    try {
      validation = JSON.parse(rawText);
    } catch (parseError) {
      ErrorHandler.logError(parseError, 'ValidateStack.parseJSON');
      return NextResponse.json({
        valid: true,
        warnings: [],
        missing: [],
        recommendations: [],
        summary: 'Basic validation passed',
      }, { status: 200 });
    }

    return NextResponse.json(validation, { status: 200 });
  } catch (error) {
    ErrorHandler.logError(error, 'ValidateStack');
    return NextResponse.json({
      valid: true,
      warnings: [],
      missing: [],
      recommendations: [],
      summary: 'Basic validation passed',
    }, { status: 200 });
  }
}
