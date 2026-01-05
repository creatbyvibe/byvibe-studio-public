import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    const prompt = `
      Role: Lead Systems Architect.
      Task: Analyze the user's requirement: "${input}".
      Instruction: Respond in the same language as the user input.
      
      Generate a structured JSON response with:
      1. "difficulty": "Low", "Medium", or "High".
      2. "time_est": Dev time estimate.
      3. "tech_stack": Recommended stack (Concise).
      4. "risks": 1 key technical risk.
      5. "file_tree": A string showing a simple ASCII file tree (max 5-6 lines, no markdown ticks).
      6. "cursor_prompt": A system prompt for an LLM (Cursor) to scaffold this project.

      Output JSON ONLY.
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
