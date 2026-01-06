import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { ErrorHandler } from '@/lib/utils/error-handler';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token = requestUrl.searchParams.get('token');
  const type = requestUrl.searchParams.get('type'); // 'signup', 'recovery', etc.
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const provider = requestUrl.searchParams.get('provider') || 'unknown';

  // Handle OAuth errors
  if (error) {
    const errorMessage = errorDescription || error;
    ErrorHandler.logError(`OAuth error from ${provider}: ${errorMessage}`, 'OAuthCallback');
    return NextResponse.redirect(
      new URL(`/auth/verify?error=${encodeURIComponent(error)}&type=oauth`, requestUrl.origin)
    );
  }

  // Handle password reset (type=recovery)
  if (type === 'recovery' && (token || code)) {
    try {
      const { supabase, applyCookies } = createServerClient(request);
      
      let verifyData;
      let verifyError;

      // Try using code first (newer Supabase format)
      if (code) {
        const result = await supabase.auth.exchangeCodeForSession(code);
        verifyData = result.data;
        verifyError = result.error;
        
        if (!verifyError && verifyData?.session) {
          // Session established, redirect to reset password page
          const response = NextResponse.redirect(
            new URL(`/auth/reset-password?code=${code}&type=recovery`, requestUrl.origin)
          );
          applyCookies(response);
          return response;
        }
      } 
      // Fallback to token-based verification (older format)
      else if (token) {
        // Redirect to reset password page with token
        return NextResponse.redirect(
          new URL(`/auth/reset-password?token=${token}&type=recovery`, requestUrl.origin)
        );
      }

      if (verifyError) {
        ErrorHandler.logError(verifyError, 'PasswordReset');
        
        // Check if token is expired
        if (verifyError.message?.includes('expired') || 
            verifyError.message?.includes('invalid') ||
            verifyError.message?.includes('expired_token')) {
          return NextResponse.redirect(
            new URL('/auth/reset-password?error=token_expired&type=recovery', requestUrl.origin)
          );
        }
        
        return NextResponse.redirect(
          new URL(`/auth/reset-password?error=${encodeURIComponent(verifyError.message)}&type=recovery`, requestUrl.origin)
        );
      }

      // Should not reach here, but just in case
      return NextResponse.redirect(
        new URL('/auth/reset-password?error=reset_failed&type=recovery', requestUrl.origin)
      );
    } catch (error) {
      ErrorHandler.logError(error, 'PasswordReset');
      return NextResponse.redirect(
        new URL('/auth/reset-password?error=reset_error&type=recovery', requestUrl.origin)
      );
    }
  }

  // Handle email verification (type=signup)
  // Supabase sends verification links with either 'token' or 'code' parameter
  if (type === 'signup' && (token || code)) {
    try {
      const { supabase, applyCookies } = createServerClient(request);
      
      let verifyData;
      let verifyError;

      // Try using code first (newer Supabase format)
      if (code) {
        const result = await supabase.auth.exchangeCodeForSession(code);
        verifyData = result.data;
        verifyError = result.error;
      } 
      // Fallback to token-based verification (older format)
      else if (token) {
        // Try verifyOtp with token_hash
        const result = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup',
        });
        verifyData = result.data;
        verifyError = result.error;
      }

      if (verifyError) {
        ErrorHandler.logError(verifyError, 'EmailVerification');
        
        // Check if token is expired
        if (verifyError.message?.includes('expired') || 
            verifyError.message?.includes('invalid') ||
            verifyError.message?.includes('expired_token')) {
          return NextResponse.redirect(
            new URL('/auth/verify?error=token_expired&type=signup' + (code ? `&email=${encodeURIComponent(requestUrl.searchParams.get('email') || '')}` : ''), requestUrl.origin)
          );
        }
        
        return NextResponse.redirect(
          new URL(`/auth/verify?error=${encodeURIComponent(verifyError.message)}&type=signup`, requestUrl.origin)
        );
      }

      if (verifyData?.user) {
        // Email verified successfully
        const response = NextResponse.redirect(
          new URL('/auth/verify?success=true&type=signup&email=' + encodeURIComponent(verifyData.user.email || ''), requestUrl.origin)
        );
        applyCookies(response);
        return response;
      }

      return NextResponse.redirect(
        new URL('/auth/verify?error=verification_failed&type=signup', requestUrl.origin)
      );
    } catch (error) {
      ErrorHandler.logError(error, 'EmailVerification');
      return NextResponse.redirect(
        new URL('/auth/verify?error=verification_error&type=signup', requestUrl.origin)
      );
    }
  }

  // Handle OAuth callback (code-based)
  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/verify?error=no_code&type=oauth&provider=' + provider, requestUrl.origin)
    );
  }

  try {
    // Exchange code for session (Supabase handles this automatically for Google/GitHub)
    const { supabase, applyCookies } = createServerClient(request);
    const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    if (authError) {
      ErrorHandler.logError(authError, 'OAuthCallback.exchangeCodeForSession');
      return NextResponse.redirect(
        new URL(`/auth/verify?error=auth_failed&type=oauth&provider=${provider}`, requestUrl.origin)
      );
    }

    if (data?.user) {
      // Success - redirect to home or return URL
      const returnUrl = requestUrl.searchParams.get('return_url') || '/';
      const response = NextResponse.redirect(new URL(returnUrl, requestUrl.origin));
      applyCookies(response);
      return response;
    }

    // No user data - redirect to auth page
    return NextResponse.redirect(
      new URL('/auth/verify?error=no_user_data&type=oauth&provider=' + provider, requestUrl.origin)
    );
  } catch (error) {
    ErrorHandler.logError(error, 'OAuthCallback');
    return NextResponse.redirect(
      new URL(`/auth/verify?error=callback_error&type=oauth&provider=${provider}`, requestUrl.origin)
    );
  }
}
