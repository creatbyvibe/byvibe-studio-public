/**
 * Authentication Middleware for API Routes
 * Provides unified authentication and authorization for API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { ErrorHandler } from '@/lib/utils/error-handler';

export interface AuthContext {
  user: {
    id: string;
    email: string;
    [key: string]: unknown;
  };
  supabase: ReturnType<typeof createServerClient>['supabase'];
  applyCookies: ReturnType<typeof createServerClient>['applyCookies'];
}

export interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  requireEmailVerified?: boolean;
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(
  request: NextRequest
): Promise<{ user: AuthContext['user'] | null; supabase: AuthContext['supabase']; applyCookies: AuthContext['applyCookies'] }> {
  try {
    const { supabase, applyCookies } = createServerClient(request);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null, supabase, applyCookies };
    }

    return {
      user: {
        ...user,
        id: user.id,
        email: user.email || '',
      },
      supabase,
      applyCookies,
    };
  } catch (error) {
    ErrorHandler.logError(error, 'getAuthUser');
    // fallback: still return a client so callers can proceed with consistent shape
    const { supabase, applyCookies } = createServerClient(request);
    return { user: null, supabase, applyCookies };
  }
}

/**
 * Authentication middleware wrapper
 * Use this to protect API routes
 */
export function withAuth(
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>,
  options: AuthMiddlewareOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { requireAuth = true, requireEmailVerified = false } = options;

    // Get authenticated user
    const { user, supabase, applyCookies } = await getAuthUser(request);

    // Check if authentication is required
    if (requireAuth && !user) {
      return NextResponse.json(
        ErrorHandler.createError('Authentication required', 'AUTH_REQUIRED', undefined, 401),
        { status: 401 }
      );
    }

    // Check if email verification is required
    if (requireEmailVerified && user) {
      const {
        data: { user: fullUser },
      } = await supabase.auth.getUser();
      
      if (!fullUser?.email_confirmed_at) {
        return NextResponse.json(
          ErrorHandler.createError(
            'Email verification required',
            'EMAIL_NOT_VERIFIED',
            undefined,
            403
          ),
          { status: 403 }
        );
      }
    }

    // Create auth context
    const authContext: AuthContext = {
      user: user!,
      supabase,
      applyCookies,
    };

    // Call the handler with auth context
    try {
      const response = await handler(request, authContext);
      applyCookies(response);
      return response;
    } catch (error) {
      ErrorHandler.logError(error, 'withAuth.handler');
      const appError = ErrorHandler.handleFetchError(error, 'API');
      const response = NextResponse.json(appError, { status: appError.statusCode || 500 });
      applyCookies(response);
      return response;
    }
  };
}

/**
 * Optional auth - get user if available, but don't require it
 */
export function withOptionalAuth(
  handler: (request: NextRequest, context: { user: AuthContext['user'] | null; supabase: AuthContext['supabase']; applyCookies: AuthContext['applyCookies'] }) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { user, supabase, applyCookies } = await getAuthUser(request);

    try {
      const response = await handler(request, { user, supabase, applyCookies });
      applyCookies(response);
      return response;
    } catch (error) {
      ErrorHandler.logError(error, 'withOptionalAuth.handler');
      const appError = ErrorHandler.handleFetchError(error, 'API');
      const response = NextResponse.json(appError, { status: appError.statusCode || 500 });
      applyCookies(response);
      return response;
    }
  };
}
