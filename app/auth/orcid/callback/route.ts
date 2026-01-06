import { NextRequest, NextResponse } from 'next/server';
import { ErrorHandler } from '@/lib/utils/error-handler';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    const errorMessage = errorDescription || error;
    ErrorHandler.logError(`ORCID OAuth error: ${errorMessage}`, 'ORCIDCallback');
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(error)}&provider=orcid`, requestUrl.origin)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth?error=no_code&provider=orcid', requestUrl.origin)
    );
  }

  try {
    // Call internal API to handle ORCID token exchange
    const apiUrl = new URL('/api/auth/orcid', requestUrl.origin);
    
    const apiResponse = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      const errorCode = errorData.error || 'orcid_auth_failed';
      ErrorHandler.logError(`ORCID API error: ${errorCode}`, 'ORCIDCallback');
      return NextResponse.redirect(
        new URL(`/auth?error=${errorCode}&provider=orcid`, requestUrl.origin)
      );
    }

    const result = await apiResponse.json();
    
    // Success - redirect to home or return URL
    if (result.success) {
      const returnUrl = requestUrl.searchParams.get('return_url') || '/';
      return NextResponse.redirect(new URL(returnUrl, requestUrl.origin));
    }

    // Requires registration - redirect with ORCID info
    if (result.requiresRegistration) {
      const params = new URLSearchParams({
        orcid_id: result.orcidId || '',
        orcid_name: result.name || '',
        orcid_email: result.email || '',
        provider: 'orcid',
      });
      return NextResponse.redirect(
        new URL(`/auth?${params.toString()}`, requestUrl.origin)
      );
    }

    // Account linking - redirect with linking info
    if (result.requiresLinking) {
      const params = new URLSearchParams({
        link_account: 'true',
        orcid_id: result.orcidId || '',
        provider: 'orcid',
      });
      return NextResponse.redirect(
        new URL(`/auth?${params.toString()}`, requestUrl.origin)
      );
    }

    return NextResponse.redirect(
      new URL('/auth?error=unknown&provider=orcid', requestUrl.origin)
    );
  } catch (error: any) {
    ErrorHandler.logError(error, 'ORCIDCallback');
    return NextResponse.redirect(
      new URL('/auth?error=orcid_callback_error&provider=orcid', requestUrl.origin)
    );
  }
}
