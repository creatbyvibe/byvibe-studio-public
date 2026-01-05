# IP Usage Limit Setup

## Overview

This document explains how to set up IP-based usage limits for unregistered users. Each IP address is allowed only **1 free attempt** before requiring registration.

## Database Setup

### 1. Run the SQL Migration

Execute the following SQL in your Supabase SQL Editor:

```sql
-- IP Usage Tracking Table
CREATE TABLE IF NOT EXISTS ip_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ip_address)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ip_usage_ip_address ON ip_usage(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_usage_last_used ON ip_usage(last_used_at);

-- Enable Row Level Security (allow public read/write for IP tracking)
ALTER TABLE ip_usage ENABLE ROW LEVEL SECURITY;

-- Allow public to insert and update their own IP usage
CREATE POLICY "Allow public IP usage tracking"
  ON ip_usage FOR ALL
  USING (true)
  WITH CHECK (true);
```

Or run the migration file:
```bash
# In Supabase SQL Editor, paste the contents of:
supabase/ip_usage_schema.sql
```

## How It Works

### IP Detection

The system detects client IP addresses from multiple headers (in order of priority):
1. `cf-connecting-ip` (Cloudflare)
2. `x-real-ip`
3. `x-forwarded-for` (first IP in the list)
4. `request.ip` (fallback)

### Usage Tracking

1. **First Request**: When an unregistered user makes their first request to `/api/orchestrate`, the system:
   - Checks if the IP exists in `ip_usage` table
   - If not found, creates a new record with `usage_count = 1`
   - Allows the request to proceed

2. **Subsequent Requests**: 
   - Checks current `usage_count` for the IP
   - If `usage_count >= 1`, returns `429 Too Many Requests` with error message
   - If `usage_count < 1`, increments and allows the request

3. **Registered Users**: 
   - Registered users bypass IP limits (check is only performed for unauthenticated requests)
   - This can be extended in the future to check user authentication status

## API Response

### Success (First Attempt)
```json
{
  "difficulty": "Medium",
  "time_est": "2-3 weeks",
  "tech_stack": "Next.js, PostgreSQL, Tailwind CSS",
  ...
}
```

### Rate Limited (Subsequent Attempts)
```json
{
  "error": "Free usage limit reached. Please sign up to continue using the service.",
  "code": "USAGE_LIMIT_EXCEEDED"
}
```
Status: `429 Too Many Requests`

## Frontend Handling

The `InteractiveConsole` component automatically:
- Detects `429` status with `USAGE_LIMIT_EXCEEDED` code
- Shows the authentication modal
- Prompts user to sign up or log in

## Configuration

### Adjusting the Limit

To change the free usage limit, modify `maxFreeUsage` in `/app/api/orchestrate/route.ts`:

```typescript
const maxFreeUsage = 1; // Change this value
```

### Disabling IP Limits

If Supabase is not configured, the system defaults to allowing usage (fail-open behavior). To disable IP limits entirely, you can:

1. Remove the IP check from the API route
2. Or set `maxFreeUsage` to a very high number

## Security Considerations

1. **IP Spoofing**: IP addresses can be spoofed, but this is mitigated by:
   - Using Cloudflare's `cf-connecting-ip` header (most reliable)
   - Rate limiting at the edge (Cloudflare Workers)

2. **Shared IPs**: Users behind NAT or corporate proxies share IPs. This is a limitation of IP-based tracking.

3. **Future Improvements**:
   - Add user authentication check to bypass IP limits
   - Implement device fingerprinting
   - Add time-based limits (e.g., 1 per day)
   - Use Cloudflare Rate Limiting rules

## Monitoring

To monitor IP usage:

```sql
-- View all IP usage records
SELECT ip_address, usage_count, last_used_at, created_at
FROM ip_usage
ORDER BY last_used_at DESC
LIMIT 100;

-- Count unique IPs
SELECT COUNT(DISTINCT ip_address) as total_ips
FROM ip_usage;

-- Find IPs that have exceeded limit
SELECT ip_address, usage_count, last_used_at
FROM ip_usage
WHERE usage_count >= 1
ORDER BY last_used_at DESC;
```

## Troubleshooting

### IP Not Detected

If IP is showing as "unknown":
- Check Cloudflare settings (if using Cloudflare)
- Verify proxy headers are configured correctly
- Check `request.ip` fallback

### Database Errors

If you see database errors:
- Verify Supabase connection
- Check RLS policies are set correctly
- Ensure `ip_usage` table exists

### Users Bypassing Limits

If users can bypass limits:
- Check that IP detection is working
- Verify database updates are successful
- Check for race conditions (multiple simultaneous requests)
