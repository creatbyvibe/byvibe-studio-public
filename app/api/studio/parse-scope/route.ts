import { NextRequest, NextResponse } from 'next/server';
import { getSkillsPrompt, SKILL_PROFILES } from '@/lib/ai/skills';
import { ErrorHandler } from '@/lib/utils/error-handler';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters long' },
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

    const skillsPrompt = getSkillsPrompt('Senior Technical Product Manager', 'parsing project descriptions into structured scope');
    const productManagerSkills = SKILL_PROFILES.productManager;

    const prompt = `
${skillsPrompt}

${productManagerSkills}

## Current Task
Parse the user's project description into a structured project scope with core features, target users, use cases, and success criteria.

## User Description
"${description}"

## Instructions
1. Analyze the project description deeply, understanding the core concept, goals, and value proposition
2. Extract and structure the following information with high quality:
   - **Description**: Refined and expanded project description (2-4 sentences, 50-200 words)
   - **Core Features**: 3-7 key features that are specific, actionable, and essential to the project
   - **Target Users**: Specific description of target users including demographics, needs, and characteristics (2-3 sentences)
   - **Use Cases**: 3-5 concrete scenarios showing how users would interact with the project
   - **Success Criteria**: Measurable success criteria with specific metrics or goals (2-3 sentences)

3. Quality Requirements:
   - Core features should be specific, actionable, and distinct (each 5-20 words)
   - Target users should be detailed enough to guide design decisions
   - Use cases should be concrete scenarios with clear user actions and outcomes (each 10-30 words)
   - Success criteria should include measurable metrics or clear indicators

4. Output a JSON object with this exact structure:
{
  "description": "Refined and expanded project description (2-4 sentences)",
  "coreFeatures": ["Specific feature 1", "Specific feature 2", "Specific feature 3", ...],
  "targetUsers": "Detailed description of target users (2-3 sentences)",
  "useCases": ["Concrete use case scenario 1", "Concrete use case scenario 2", ...],
  "successCriteria": "Measurable success criteria with metrics (2-3 sentences)"
}

5. Ensure all fields are filled and meet quality requirements
6. If the description is vague, make reasonable inferences based on common patterns
7. Prioritize clarity, specificity, and actionability

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
      ErrorHandler.logError(`Gemini API error: ${errorText}`, 'ParseScope');
      
      let errorMessage = 'Failed to parse scope';
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
      ErrorHandler.logError('Invalid Gemini API response', 'ParseScope');
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
    
    let parsedScope;
    try {
      parsedScope = JSON.parse(rawText);
    } catch (parseError) {
      ErrorHandler.logError(parseError, 'ParseScope.parseJSON');
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    // Validate structure
    if (!parsedScope.description || !parsedScope.coreFeatures || !Array.isArray(parsedScope.coreFeatures)) {
      return NextResponse.json(
        { error: 'Invalid scope structure from AI' },
        { status: 500 }
      );
    }

    // Ensure arrays are not empty
    if (parsedScope.coreFeatures.length === 0) {
      parsedScope.coreFeatures = [''];
    }
    if (!parsedScope.useCases || parsedScope.useCases.length === 0) {
      parsedScope.useCases = [''];
    }

    return NextResponse.json(parsedScope, { status: 200 });
  } catch (error) {
    ErrorHandler.logError(error, 'ParseScope');
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
