import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSkillsPrompt, SKILL_PROFILES } from '@/lib/ai/skills';

export const runtime = 'edge';

// Get client IP address
function getClientIP(request: NextRequest): string {
  // Try various headers for IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  // Fallback to connection remote address
  return request.ip || 'unknown';
}

// Check and update IP usage
async function checkIPUsage(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If Supabase not configured, allow usage (fallback)
    return { allowed: true, remaining: 1 };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Check current usage
    const { data: existing, error: fetchError } = await supabase
      .from('ip_usage')
      .select('usage_count')
      .eq('ip_address', ip)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // Error other than "not found", log and allow (fail open)
      console.error('Error checking IP usage:', fetchError);
      return { allowed: true, remaining: 1 };
    }

    const currentCount = existing?.usage_count || 0;
    const maxFreeUsage = 1;

    if (currentCount >= maxFreeUsage) {
      return { allowed: false, remaining: 0 };
    }

    // Update or insert usage count
    const { error: upsertError } = await supabase
      .from('ip_usage')
      .upsert({
        ip_address: ip,
        usage_count: currentCount + 1,
        last_used_at: new Date().toISOString(),
      }, {
        onConflict: 'ip_address',
      });

    if (upsertError) {
      console.error('Error updating IP usage:', upsertError);
      // Fail open - allow usage if database update fails
      return { allowed: true, remaining: 1 };
    }

    return { allowed: true, remaining: maxFreeUsage - currentCount - 1 };
  } catch (error) {
    console.error('Error in checkIPUsage:', error);
    // Fail open - allow usage if check fails
    return { allowed: true, remaining: 1 };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input || input.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Check IP usage limit
    const clientIP = getClientIP(request);
    const ipCheck = await checkIPUsage(clientIP);

    if (!ipCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Free usage limit reached. Please sign up to continue using the service.',
          code: 'USAGE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    const skillsPrompt = getSkillsPrompt('Lead Systems Architect and Technical Project Manager', 'comprehensive project planning and architecture design');
    const architectSkills = SKILL_PROFILES.systemsArchitect;

    const prompt = `
${skillsPrompt}

${architectSkills}

## Current Task
Analyze the user's requirement and generate a comprehensive project plan with technical architecture, risk assessment, and implementation roadmap.

## User Requirement
"${input}"

## Analysis Guidelines
1. Deeply understand the user's requirement, identifying core functionality, target users, and business goals
2. Consider scalability, performance, security, and maintainability from the start
3. Evaluate technology stack options based on project requirements, team expertise, and ecosystem
4. Identify potential risks, challenges, and mitigation strategies
5. Estimate realistic development time considering complexity, dependencies, and team size
6. Design project structure following best practices and industry standards
7. Create comprehensive context for code generation tools

## Output Requirements
Generate a comprehensive, structured JSON response with the following fields:

1. "difficulty": "Low", "Medium", or "High" - Overall project complexity assessment.

2. "time_est": A string like "2 weeks" or "1-2 months" - Development time estimate.

3. "tech_stack": A concise string listing recommended technologies (e.g., "Python (FastAPI), React, PostgreSQL, Docker").

4. "risks": An array of risk objects, each with:
   - "category": Risk category (e.g., "Technical", "Scalability", "Security", "Maintenance")
   - "description": Detailed risk description
   - "severity": "Low", "Medium", or "High"
   - "mitigation": Mitigation strategy

5. "tasks": An array of task objects for task breakdown, each with:
   - "phase": Phase name (e.g., "Setup", "Development", "Testing", "Deployment")
   - "title": Task title
   - "description": Task description
   - "estimated_hours": Estimated hours
   - "dependencies": Array of task indices this depends on (empty if none)

6. "roadmap": An array of roadmap items, each with:
   - "week": Week number (1, 2, 3, etc.)
   - "milestone": Milestone name
   - "deliverables": Array of deliverable strings
   - "dependencies": Array of previous week numbers

7. "architecture_diagram": A Mermaid diagram code string (without markdown code blocks) showing:
   - System architecture (components, services, databases)
   - Data flow between components
   - Key integrations and APIs
   - Use appropriate Mermaid syntax (graph TB, flowchart TD, etc.)

8. "tech_comparison": An array of technology comparison objects, each with:
   - "category": Technology category (e.g., "Frontend Framework", "Database", "Deployment")
   - "options": Array of option objects, each with:
     - "name": Technology name
     - "pros": Array of pros
     - "cons": Array of cons
     - "recommendation": "Recommended" or "Alternative"

9. "code_preview": An object with:
   - "language": Primary programming language
   - "files": Array of file preview objects, each with:
     - "path": File path
     - "snippet": Code snippet (first 20-30 lines, well-commented)
     - "description": What this file does

10. "deployment": An object with:
    - "strategy": Deployment strategy (e.g., "Docker + Cloud Run", "Vercel + Supabase")
    - "steps": Array of deployment step strings
    - "infrastructure": Infrastructure requirements
    - "cost_estimate": Cost estimate string (e.g., "$50-100/month")

11. "cost_breakdown": An object with:
    - "development": Development cost estimate
    - "infrastructure": Monthly infrastructure cost
    - "maintenance": Monthly maintenance cost estimate
    - "total_first_year": Total first year cost estimate
    - "notes": Cost notes

12. "file_tree": A string showing a simple ASCII file tree (max 8-10 lines, no markdown ticks).

13. "cursor_prompt": A comprehensive system prompt for an LLM (Cursor) to scaffold this project.

## Response Language
Respond in the same language as the user input.

## Output Format
Output ONLY valid JSON, no markdown code blocks, no explanations.
`;

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
      
      // Try to parse error response
      let errorMessage = 'Failed to generate plan';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        // Use default error message
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
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
      console.error('Empty response from Gemini:', JSON.stringify(data));
      return NextResponse.json(
        { error: 'Empty response from AI service' },
        { status: 500 }
      );
    }

    // Clean up markdown code blocks
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Try to parse JSON
    let plan;
    try {
      plan = JSON.parse(rawText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw text:', rawText);
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(plan);
  } catch (error: any) {
    console.error('Orchestrate error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to orchestrate plan',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
