import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ErrorHandler } from '@/lib/utils/error-handler';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        ErrorHandler.createError('Authorization code is required', 'NO_CODE', undefined, 400),
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const orcidClientId = process.env.NEXT_PUBLIC_ORCID_CLIENT_ID;
    const orcidClientSecret = process.env.ORCID_CLIENT_SECRET;

    if (!supabaseUrl || !supabaseAnonKey || !orcidClientId || !orcidClientSecret) {
      return NextResponse.json(
        ErrorHandler.createError('ORCID configuration is missing', 'CONFIG_MISSING', undefined, 500),
        { status: 500 }
      );
    }

    const requestUrl = new URL(request.url);
    const redirectUri = `${requestUrl.origin}/auth/orcid/callback`;

    // Exchange code for access token
    const tokenResponse = await fetch('https://orcid.org/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        client_id: orcidClientId,
        client_secret: orcidClientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      ErrorHandler.logError(`ORCID token exchange failed: ${errorData}`, 'ORCIDAuth');
      return NextResponse.json(
        ErrorHandler.createError('Failed to exchange authorization code', 'TOKEN_EXCHANGE_FAILED', undefined, 400),
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch ORCID user information
    const userResponse = await fetch('https://pub.orcid.org/v3.0/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!userResponse.ok) {
      ErrorHandler.logError('Failed to fetch ORCID user info', 'ORCIDAuth');
      return NextResponse.json(
        ErrorHandler.createError('Failed to fetch user information', 'USER_INFO_FAILED', undefined, 400),
        { status: 400 }
      );
    }

    const userData = await userResponse.json();
    const orcidId = userData.path || userData['orcid-identifier']?.path;
    const givenName = userData.person?.name?.['given-names']?.value || '';
    const familyName = userData.person?.name?.['family-name']?.value || '';
    const name = `${givenName} ${familyName}`.trim() || 'ORCID User';
    const email = userData.person?.emails?.['email']?.[0]?.['email'] || null;

    if (!orcidId) {
      return NextResponse.json(
        ErrorHandler.createError('Invalid ORCID response: missing ORCID ID', 'INVALID_RESPONSE', undefined, 400),
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    if (email) {
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email).catch(() => ({ data: { user: null } }));
      
      if (existingUser?.user) {
        // User exists - check if ORCID is already linked
        // For now, return requiresLinking flag
        return NextResponse.json({
          success: false,
          requiresLinking: true,
          orcidId,
          name,
          email,
          existingEmail: email,
        });
      }
    }

    // Check if ORCID ID is already linked to an account
    // Note: This requires storing ORCID ID in user metadata or a separate table
    // For now, we'll return requiresRegistration
    
    return NextResponse.json({
      success: false,
      requiresRegistration: true,
      orcidId,
      name,
      email: email || `${orcidId}@orcid.temp`,
    });
  } catch (error: any) {
    ErrorHandler.logError(error, 'ORCIDAuth');
    const appError = ErrorHandler.handleFetchError(error, 'ORCIDAuth');
    return NextResponse.json(appError, { status: appError.statusCode || 500 });
  }
}
