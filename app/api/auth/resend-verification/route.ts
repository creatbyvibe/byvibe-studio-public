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

    const supabase = createServerClient();

    // Resend verification email
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email.toLowerCase().trim(),
    });

    if (resendError) {
      ErrorHandler.logError(resendError, 'ResendVerification');
      
      // Check for specific error types
      if (resendError.message?.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a few minutes before requesting another email.' },
          { status: 429 }
        );
      }

      if (resendError.message?.includes('already confirmed')) {
        return NextResponse.json(
          { error: 'This email has already been verified. You can sign in now.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: resendError.message || 'Failed to resend verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Verification email sent successfully. Please check your inbox.' 
      },
      { status: 200 }
    );
  } catch (error) {
    ErrorHandler.logError(error, 'ResendVerification');
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
