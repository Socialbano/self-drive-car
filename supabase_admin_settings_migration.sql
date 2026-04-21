-- ============================================================
-- Migration: Admin Settings Table + Hero Image URL seed
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Create admin_settings if it doesn't exist yet
CREATE TABLE IF NOT EXISTS admin_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the hero image key with a sensible default
-- (this will be overwritten once you upload via the admin panel)
INSERT INTO admin_settings (key, value)
VALUES ('hero_image_url', '/images/hero-bg.jpg')
ON CONFLICT (key) DO NOTHING;

-- Optional: allow the anon/public role to READ settings (for GET /api/hero-settings)
-- If you use a service-role key server-side this isn't needed, but it's safe to add.
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop policies if they already exist to avoid errors on re-run
DROP POLICY IF EXISTS "Allow anon read" ON admin_settings;
DROP POLICY IF EXISTS "Allow service role full access" ON admin_settings;

-- Allow public read (heroImage is not sensitive)
CREATE POLICY "Allow anon read"
  ON admin_settings FOR SELECT
  USING (true);

-- Allow authenticated (admin) users full write access
CREATE POLICY "Allow service role full access"
  ON admin_settings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
