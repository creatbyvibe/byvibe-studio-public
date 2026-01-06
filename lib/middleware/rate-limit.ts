/**
 * Rate Limiting Middleware
 * Provides request rate limiting for API routes
 */

import { NextRequest, NextResponse } from 'next/server';

export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (request: NextRequest) => string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

// In-memory store (for Edge Runtime compatibility)
// In production, consider using Redis or Cloudflare KV
const store: RateLimitStore = {};

/**
 * Clean up expired entries periodically
 */
function cleanupStore() {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}

/**
 * Get client identifier for rate limiting
 */
function getClientId(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare

  if (cfConnectingIP) return `ip:${cfConnectingIP}`;
  if (realIP) return `ip:${realIP}`;
  if (forwarded) return `ip:${forwarded.split(',')[0].trim()}`;

  // Fallback to connection remote address
  return `ip:${request.ip || 'unknown'}`;
}

/**
 * Rate limiting middleware
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: RateLimitOptions
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { maxRequests, windowMs, keyGenerator = getClientId } = options;

    // Clean up expired entries
    cleanupStore();

    // Generate rate limit key
    const key = keyGenerator(request);
    const now = Date.now();

    // Get or create rate limit entry
    let entry = store[key];
    if (!entry || entry.resetAt < now) {
      entry = {
        count: 0,
        resetAt: now + windowMs,
      };
      store[key] = entry;
    }

    // Increment request count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetAt.toString(),
          },
        }
      );
    }

    // Add rate limit headers
    const response = await handler(request);
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (maxRequests - entry.count).toString());
    response.headers.set('X-RateLimit-Reset', entry.resetAt.toString());

    return response;
  };
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMITS = {
  // Public API endpoints
  PUBLIC: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  // Authenticated endpoints
  AUTHENTICATED: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  // AI generation endpoints (more restrictive)
  AI_GENERATION: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
  },
  // Email sending
  EMAIL: {
    maxRequests: 3,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;
