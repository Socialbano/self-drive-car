-- =========================================================================
-- FIX: Missing columns and RLS issues for Admin Panel
-- Run this in your Supabase SQL Editor (https://app.supabase.com)
-- =========================================================================

-- 1. ADD MISSING COLUMNS (Ensures the app doesn't crash on ordering/saving)
ALTER TABLE cars ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE car_images ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 2. FIX RLS POLICIES (Allows admin panel to work without Auth login)
-- The admin panel uses the "anon" key, so we need to give it permissions

-- CARS: Enable all for anon (for local admin console)
DROP POLICY IF EXISTS "Public can view active cars" ON cars;
DROP POLICY IF EXISTS "Anon can select all cars for admin" ON cars;
DROP POLICY IF EXISTS "Anon can insert cars" ON cars;
DROP POLICY IF EXISTS "Anon can update cars" ON cars;
DROP POLICY IF EXISTS "Anon can delete cars" ON cars;

CREATE POLICY "Allow anon select all" ON cars FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON cars FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON cars FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon delete" ON cars FOR DELETE TO anon USING (true);

-- LEADS: Enable select/update/delete for anon (admin panel status management)
DROP POLICY IF EXISTS "Anon can read leads" ON leads;
DROP POLICY IF EXISTS "Anon can update leads" ON leads;
DROP POLICY IF EXISTS "Anon can delete leads" ON leads;

CREATE POLICY "Allow anon select leads" ON leads FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon update leads" ON leads FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon delete leads" ON leads FOR DELETE TO anon USING (true);

-- INVOICES: Enable all for anon (admin billing management)
DROP POLICY IF EXISTS "Anon can manage invoices" ON invoices;

CREATE POLICY "Allow anon manage invoices" ON invoices 
FOR ALL TO anon 
USING (true)
WITH CHECK (true);

-- ADMIN_SETTINGS: Ensure anon can update settings
DROP POLICY IF EXISTS "Admin update settings" ON admin_settings;
CREATE POLICY "Allow anon update settings" ON admin_settings FOR UPDATE TO anon USING (true);
