import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { ErrorHandler } from '@/lib/utils/error-handler';
import { validateEmail } from '@/lib/utils/validation';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const { supabase, applyCookies } = createServerClient(request);

    // Resend verification email
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email.toLowerCase().trim(),
    });

    if (resendError) {
      ErrorHandler.logError(resendError, 'ResendVerification');
      
      // Check for specific error types
      if (resendError.message?.includes('rate limit')) {
        const response = NextResponse.json(
          { error: 'Too many requests. Please wait a few minutes before requesting another email.' },
          { status: 429 }
        );
        applyCookies(response);
        return response;
      }

      if (resendError.message?.includes('already confirmed')) {
        const response = NextResponse.json(
          { error: 'This email has already been verified. You can sign in now.' },
          { status: 400 }
        );
        applyCookies(response);
        return response;
      }

      const response = NextResponse.json(
        { error: resendError.message || 'Failed to resend verification email' },
        { status: 500 }
      );
      applyCookies(response);
      return response;
    }

    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Verification email sent successfully. Please check your inbox.' 
      },
      { status: 200 }
    );
    applyCookies(response);
    return response;
  } catch (error) {
    ErrorHandler.logError(error, 'ResendVerification');
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
