-- IP Usage Tracking Table
-- Track free usage attempts by IP address

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
