import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { ErrorHandler } from '@/lib/utils/error-handler';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const provider = requestUrl.searchParams.get('provider') || 'unknown';

  // Handle OAuth errors
  if (error) {
    const errorMessage = errorDescription || error;
    ErrorHandler.logError(`OAuth error from ${provider}: ${errorMessage}`, 'OAuthCallback');
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(error)}&provider=${provider}`, requestUrl.origin)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth?error=no_code&provider=' + provider, requestUrl.origin)
    );
  }

  try {
    // Exchange code for session (Supabase handles this automatically for Google/GitHub)
    const supabase = createServerClient();
    const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    if (authError) {
      ErrorHandler.logError(authError, 'OAuthCallback.exchangeCodeForSession');
      return NextResponse.redirect(
        new URL(`/auth?error=auth_failed&provider=${provider}`, requestUrl.origin)
      );
    }

    if (data?.user) {
      // Success - redirect to home or return URL
      const returnUrl = requestUrl.searchParams.get('return_url') || '/';
      return NextResponse.redirect(new URL(returnUrl, requestUrl.origin));
    }

    // No user data - redirect to auth page
    return NextResponse.redirect(
      new URL('/auth?error=no_user_data&provider=' + provider, requestUrl.origin)
    );
  } catch (error) {
    ErrorHandler.logError(error, 'OAuthCallback');
    return NextResponse.redirect(
      new URL(`/auth?error=callback_error&provider=${provider}`, requestUrl.origin)
    );
  }
}
