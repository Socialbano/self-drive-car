-- ============================================================
-- SQL: Create Hero Images Bucket & Set Public Permissions
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow Public Access (SELECT)
-- This ensures the images can be viewed by everyone on the website
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero-images');

-- 3. Allow Admin Upload/Update (UPSERT)
-- This allows your API (using service_role) or authenticated admin to manage files
DROP POLICY IF EXISTS "Admin Hero Manage" ON storage.objects;
CREATE POLICY "Admin Hero Manage" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'hero-images')
  WITH CHECK (bucket_id = 'hero-images');
