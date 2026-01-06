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
  supabase: ReturnType<typeof createServerClient>;
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
): Promise<{ user: AuthContext['user'] | null; supabase: ReturnType<typeof createServerClient> }> {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null, supabase };
    }

    return {
      user: {
        ...user,
        id: user.id,
        email: user.email || '',
      },
      supabase,
    };
  } catch (error) {
    ErrorHandler.logError(error, 'getAuthUser');
    return { user: null, supabase: createServerClient() };
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
    const { user, supabase } = await getAuthUser(request);

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
    };

    // Call the handler with auth context
    try {
      return await handler(request, authContext);
    } catch (error) {
      ErrorHandler.logError(error, 'withAuth.handler');
      const appError = ErrorHandler.handleFetchError(error, 'API');
      return NextResponse.json(appError, { status: appError.statusCode || 500 });
    }
  };
}

/**
 * Optional auth - get user if available, but don't require it
 */
export function withOptionalAuth(
  handler: (request: NextRequest, context: { user: AuthContext['user'] | null; supabase: ReturnType<typeof createServerClient> }) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { user, supabase } = await getAuthUser(request);

    try {
      return await handler(request, { user, supabase });
    } catch (error) {
      ErrorHandler.logError(error, 'withOptionalAuth.handler');
      const appError = ErrorHandler.handleFetchError(error, 'API');
      return NextResponse.json(appError, { status: appError.statusCode || 500 });
    }
  };
}
