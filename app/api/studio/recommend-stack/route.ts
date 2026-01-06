import { NextRequest, NextResponse } from 'next/server';
import { getSkillsPrompt, SKILL_PROFILES } from '@/lib/ai/skills';
import { ErrorHandler } from '@/lib/utils/error-handler';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scope } = body;

    if (!scope) {
      return NextResponse.json(
        { error: 'Scope context is required' },
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

    const skillsPrompt = getSkillsPrompt('Lead Systems Architect', 'recommending technology stack based on project scope');
    const architectSkills = SKILL_PROFILES.systemsArchitect;

    const prompt = `
${skillsPrompt}

${architectSkills}

## Current Task
Analyze the project scope and recommend an appropriate technology stack with justifications and compatibility checks.

## Project Scope
${JSON.stringify(scope, null, 2)}

## Instructions
1. Deeply analyze the project requirements, core features, target users, use cases, and success criteria
2. Consider the following factors:
   - Project complexity and scale
   - Target user base size and growth expectations
   - Team expertise and learning curve
   - Performance requirements
   - Security needs
   - Budget and infrastructure costs
   - Time to market
   - Long-term maintainability

3. Recommend appropriate technologies for:
   - Frontend framework (1-3 recommendations, prioritize based on project needs)
   - Backend framework (1-3 recommendations, consider API needs and scalability)
   - Database (1-3 recommendations, consider data structure and query patterns)
   - Deployment platform (1-3 recommendations, consider scalability and cost)
   - Additional tools (5-8 recommendations, include essential dev tools, libraries, and services)

4. For each recommendation, provide:
   - **name**: Technology name (exact match to available options)
   - **reason**: Detailed explanation of why it's suitable for THIS specific project (2-3 sentences)
   - **pros**: Array of 3-5 key benefits specific to this project
   - **cons**: Array of 2-3 potential concerns or limitations
   - **priority**: "high" (strongly recommended), "medium" (good option), or "low" (alternative)
   - **compatibility**: Notes on how it works with other recommended technologies

5. Check for compatibility issues between recommended technologies
6. Consider modern best practices and industry standards
7. Provide a comprehensive summary explaining the overall stack rationale

8. Output a JSON object with this exact structure:
{
  "recommendations": {
    "frontend": [
      {
        "name": "Technology Name",
        "reason": "Why it's recommended",
        "pros": ["Benefit 1", "Benefit 2"],
        "cons": ["Limitation 1", "Limitation 2"],
        "priority": "high|medium|low"
      }
    ],
    "backend": [...],
    "database": [...],
    "deployment": [...],
    "additional": [...]
  },
  "compatibility": {
    "warnings": ["Compatibility warning 1", ...],
    "notes": ["Additional note 1", ...]
  },
  "summary": "Brief summary of the recommended stack and rationale"
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
      ErrorHandler.logError(`Gemini API error: ${errorText}`, 'RecommendStack');
      
      let errorMessage = 'Failed to get recommendations';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        // Use default error message
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      ErrorHandler.logError('Invalid Gemini API response', 'RecommendStack');
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
    
    // Clean up markdown code blocks
    rawText = rawText.trim().replace(/```json/g, '').replace(/```/g, '').trim();
    
    let recommendations;
    try {
      recommendations = JSON.parse(rawText);
    } catch (parseError) {
      ErrorHandler.logError(parseError, 'RecommendStack.parseJSON');
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(recommendations, { status: 200 });
  } catch (error) {
    ErrorHandler.logError(error, 'RecommendStack');
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
