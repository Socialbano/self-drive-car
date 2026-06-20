-- =========================================================================
-- 🛡️ RLS HARDENING MIGRATION — DriveKro.IN Self Drive Car Rental
-- Run this AFTER the initial setup to replace unsafe anon policies.
-- Paste this script into the Supabase SQL Editor.
-- =========================================================================

-- =====================
-- 1. CARS TABLE
-- =====================
-- Remove unsafe blanket policies
DROP POLICY IF EXISTS "anon_full_cars" ON public.cars;
DROP POLICY IF EXISTS "authenticated_full_cars" ON public.cars;

-- Anon: READ only active cars
CREATE POLICY "anon_read_active_cars" ON public.cars
  FOR SELECT TO anon
  USING (is_active = true);

-- Authenticated: Full CRUD
CREATE POLICY "auth_manage_cars" ON public.cars
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 2. CAR_IMAGES TABLE
-- =====================
DROP POLICY IF EXISTS "anon_full_car_images" ON public.car_images;
DROP POLICY IF EXISTS "authenticated_full_car_images" ON public.car_images;

-- Anon: READ only (images of active cars are accessed via cars join)
CREATE POLICY "anon_read_car_images" ON public.car_images
  FOR SELECT TO anon
  USING (true);

-- Authenticated: Full CRUD
CREATE POLICY "auth_manage_car_images" ON public.car_images
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 3. LEADS TABLE
-- =====================
DROP POLICY IF EXISTS "anon_full_leads" ON public.leads;
DROP POLICY IF EXISTS "authenticated_full_leads" ON public.leads;

-- Anon: INSERT only (website contact/booking form submissions)
CREATE POLICY "anon_insert_leads" ON public.leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Authenticated: Full CRUD (admin manages leads)
CREATE POLICY "auth_manage_leads" ON public.leads
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 4. FAQS TABLE
-- =====================
DROP POLICY IF EXISTS "anon_full_faqs" ON public.faqs;
DROP POLICY IF EXISTS "authenticated_full_faqs" ON public.faqs;

-- Anon: READ only active FAQs
CREATE POLICY "anon_read_active_faqs" ON public.faqs
  FOR SELECT TO anon
  USING (is_active = true);

-- Authenticated: Full CRUD
CREATE POLICY "auth_manage_faqs" ON public.faqs
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 5. TESTIMONIALS TABLE
-- =====================
DROP POLICY IF EXISTS "anon_full_testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "authenticated_full_testimonials" ON public.testimonials;

-- Anon: READ only approved testimonials
CREATE POLICY "anon_read_approved_testimonials" ON public.testimonials
  FOR SELECT TO anon
  USING (is_approved = true);

-- Authenticated: Full CRUD
CREATE POLICY "auth_manage_testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 6. ADMIN_SETTINGS TABLE
-- =====================
DROP POLICY IF EXISTS "anon_full_admin_settings" ON public.admin_settings;
DROP POLICY IF EXISTS "authenticated_full_admin_settings" ON public.admin_settings;

-- Anon: READ only (website needs settings like business name, phone)
CREATE POLICY "anon_read_settings" ON public.admin_settings
  FOR SELECT TO anon
  USING (true);

-- Authenticated: Full CRUD
CREATE POLICY "auth_manage_settings" ON public.admin_settings
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 7. INVOICES TABLE (Sensitive — NO anon access)
-- =====================
DROP POLICY IF EXISTS "anon_full_invoices" ON public.invoices;
DROP POLICY IF EXISTS "authenticated_full_invoices" ON public.invoices;

-- Authenticated only: Full CRUD
CREATE POLICY "auth_manage_invoices" ON public.invoices
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 8. AGREEMENTS TABLE (Sensitive — NO anon access)
-- =====================
DROP POLICY IF EXISTS "anon_full_agreements" ON public.agreements;
DROP POLICY IF EXISTS "authenticated_full_agreements" ON public.agreements;

-- Authenticated only: Full CRUD
CREATE POLICY "auth_manage_agreements" ON public.agreements
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 9. MARQUEE_MESSAGES TABLE
-- =====================
DROP POLICY IF EXISTS "anon_full_marquee_messages" ON public.marquee_messages;
DROP POLICY IF EXISTS "authenticated_full_marquee_messages" ON public.marquee_messages;

-- Anon: READ only active messages
CREATE POLICY "anon_read_active_marquee" ON public.marquee_messages
  FOR SELECT TO anon
  USING (is_active = true);

-- Authenticated: Full CRUD
CREATE POLICY "auth_manage_marquee" ON public.marquee_messages
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 10. INSTAGRAM_REELS TABLE
-- =====================
DROP POLICY IF EXISTS "anon_full_instagram_reels" ON public.instagram_reels;
DROP POLICY IF EXISTS "authenticated_full_instagram_reels" ON public.instagram_reels;

-- Anon: READ only active reels
CREATE POLICY "anon_read_active_reels" ON public.instagram_reels
  FOR SELECT TO anon
  USING (is_active = true);

-- Authenticated: Full CRUD
CREATE POLICY "auth_manage_reels" ON public.instagram_reels
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 11. LOCATIONS TABLE
-- =====================
DROP POLICY IF EXISTS "anon_full_locations" ON public.locations;
DROP POLICY IF EXISTS "authenticated_full_locations" ON public.locations;

-- Anon: READ only active locations
CREATE POLICY "anon_read_active_locations" ON public.locations
  FOR SELECT TO anon
  USING (is_active = true);

-- Authenticated: Full CRUD
CREATE POLICY "auth_manage_locations" ON public.locations
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 12. BLOGS TABLE
-- =====================
DROP POLICY IF EXISTS "Allow public read blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow admin full access blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow anon full access blogs" ON public.blogs;

-- Anon: READ only (all published blogs are public)
CREATE POLICY "anon_read_blogs" ON public.blogs
  FOR SELECT TO anon
  USING (true);

-- Authenticated: Full CRUD
CREATE POLICY "auth_manage_blogs" ON public.blogs
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 13. STORAGE: Remove unsafe anon full-access to hero-images
-- =====================
DROP POLICY IF EXISTS "Anon Hero Manage" ON storage.objects;
-- Anon should only have SELECT (view) access to hero images, NOT upload/delete

-- =====================
-- 14. DATABASE INDEXES for Performance
-- =====================
CREATE INDEX IF NOT EXISTS idx_cars_slug ON public.cars(slug);
CREATE INDEX IF NOT EXISTS idx_cars_active_featured ON public.cars(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_cars_display_order ON public.cars(display_order);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_faqs_active_order ON public.faqs(is_active, display_order);

CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON public.testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON public.testimonials(display_order);

CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created ON public.invoices(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agreements_created ON public.agreements(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_location ON public.blogs(location_id);
CREATE INDEX IF NOT EXISTS idx_blogs_created ON public.blogs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_locations_slug ON public.locations(slug);
CREATE INDEX IF NOT EXISTS idx_locations_active_order ON public.locations(is_active, display_order);

CREATE INDEX IF NOT EXISTS idx_marquee_active ON public.marquee_messages(is_active, priority);
CREATE INDEX IF NOT EXISTS idx_reels_active ON public.instagram_reels(is_active, priority);

-- =====================
-- 15. RELOAD SCHEMA CACHE
-- =====================
NOTIFY pgrst, 'reload schema';

-- =========================================================================
-- ✅ RLS HARDENING COMPLETE
-- Summary:
--   • Anonymous users: READ-only on public content, INSERT-only for leads
--   • Authenticated users: Full CRUD on all tables
--   • Invoices & Agreements: Zero anon access (PII protection)
--   • Storage: Anon can only view hero images, not upload/delete
--   • Added 18 performance indexes across all tables
-- =========================================================================
