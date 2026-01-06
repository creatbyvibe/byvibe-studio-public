# API Middleware Documentation

This directory contains reusable middleware for API routes.

## Authentication Middleware (`auth.ts`)

### `withAuth(handler, options)`

Protects API routes requiring authentication.

```typescript
import { withAuth } from '@/lib/middleware/auth';

export const POST = withAuth(async (request, context) => {
  // context.user contains authenticated user
  // context.supabase contains Supabase client
  const { user, supabase } = context;
  
  // Your handler logic here
  return NextResponse.json({ success: true });
}, {
  requireAuth: true,        // Default: true
  requireEmailVerified: false  // Default: false
});
```

### `withOptionalAuth(handler)`

Gets user if available, but doesn't require authentication.

```typescript
import { withOptionalAuth } from '@/lib/middleware/auth';

export const POST = withOptionalAuth(async (request, context) => {
  // context.user may be null
  // context.supabase always available
  if (context.user) {
    // User is authenticated
  }
  
  return NextResponse.json({ success: true });
});
```

## Rate Limiting Middleware (`rate-limit.ts`)

### `withRateLimit(handler, options)`

Adds rate limiting to API routes.

```typescript
import { withRateLimit, RATE_LIMITS } from '@/lib/middleware/rate-limit';

export const POST = withRateLimit(async (request) => {
  // Your handler logic
  return NextResponse.json({ success: true });
}, RATE_LIMITS.PUBLIC); // or RATE_LIMITS.AUTHENTICATED, etc.
```

### Predefined Rate Limits

- `RATE_LIMITS.PUBLIC`: 10 requests/minute
- `RATE_LIMITS.AUTHENTICATED`: 100 requests/minute
- `RATE_LIMITS.AI_GENERATION`: 5 requests/minute
- `RATE_LIMITS.EMAIL`: 3 requests/minute

## Validation Middleware (`validate.ts`)

### `withValidation(handler, rules)`

Validates request body against rules.

```typescript
import { withValidation } from '@/lib/middleware/validate';

export const POST = withValidation(async (request, body) => {
  // body is validated and typed
  const { email, name } = body;
  
  return NextResponse.json({ success: true });
}, [
  {
    field: 'email',
    required: true,
    type: 'email',
  },
  {
    field: 'name',
    required: false,
    type: 'string',
    minLength: 2,
    maxLength: 100,
  },
]);
```

## Combining Middleware

You can combine multiple middleware:

```typescript
import { withAuth } from '@/lib/middleware/auth';
import { withRateLimit, RATE_LIMITS } from '@/lib/middleware/rate-limit';
import { withValidation } from '@/lib/middleware/validate';

const handler = async (request: NextRequest, context: AuthContext, body: Record<string, unknown>) => {
  // Your logic here
  return NextResponse.json({ success: true });
};

export const POST = withAuth(
  withRateLimit(
    withValidation(handler, [
      { field: 'input', required: true, type: 'string', minLength: 2 }
    ]),
    RATE_LIMITS.AI_GENERATION
  )
);
```

## Error Handling

All middleware uses the unified `ErrorHandler` from `@/lib/utils/error-handler`:

- Consistent error format
- User-friendly error messages
- Proper HTTP status codes
- Error logging (development only)
