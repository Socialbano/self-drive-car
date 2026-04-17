-- =========================================================================
-- SEED DATA: Insert the 3 homepage cars into the database
-- Run this in Supabase SQL Editor AFTER creating the 'cars' table
-- =========================================================================

-- First, make sure the cars table exists
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  car_type VARCHAR(20),
  fuel_type VARCHAR(20),
  transmission VARCHAR(10),
  seats INTEGER NOT NULL DEFAULT 5,
  engine_cc INTEGER,
  mileage_kmpl NUMERIC(4,1),
  has_ac BOOLEAN DEFAULT true,
  boot_space_l INTEGER,
  ground_clearance_mm INTEGER,
  price_per_day INTEGER NOT NULL,
  price_per_week INTEGER,
  price_weekend INTEGER,
  price_outstation INTEGER,
  deposit INTEGER NOT NULL DEFAULT 2000,
  km_limit_per_day INTEGER DEFAULT 300,
  extra_km_rate INTEGER DEFAULT 8,
  min_rental_age INTEGER DEFAULT 21,
  features TEXT[],
  description TEXT,
  primary_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create car_images table
CREATE TABLE IF NOT EXISTS car_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  cloudinary_id TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(150),
  car_type VARCHAR(50),
  pickup_date DATE,
  message TEXT,
  status VARCHAR(20) DEFAULT 'new',
  source VARCHAR(30) DEFAULT 'website_form',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(150),
  customer_address TEXT,
  aadhaar_number VARCHAR(50),
  driving_license VARCHAR(50),
  gst_enabled BOOLEAN DEFAULT false,
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  daily_rate NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ENABLE RLS + GRANT FULL ACCESS TO ANON (for admin panel)
-- =========================================================================
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Allow anon select all" ON cars;
DROP POLICY IF EXISTS "Allow anon insert" ON cars;
DROP POLICY IF EXISTS "Allow anon update" ON cars;
DROP POLICY IF EXISTS "Allow anon delete" ON cars;
DROP POLICY IF EXISTS "Admin Select Cars" ON cars;
DROP POLICY IF EXISTS "Admin Manage Cars" ON cars;
DROP POLICY IF EXISTS "Admin Manage Images" ON car_images;
DROP POLICY IF EXISTS "Admin Manage Leads" ON leads;
DROP POLICY IF EXISTS "Admin Manage Invoices" ON invoices;
DROP POLICY IF EXISTS "Admin Manage Settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow anon manage images" ON car_images;
DROP POLICY IF EXISTS "Allow anon select leads" ON leads;
DROP POLICY IF EXISTS "Allow anon update leads" ON leads;
DROP POLICY IF EXISTS "Allow anon delete leads" ON leads;
DROP POLICY IF EXISTS "Allow anon manage invoices" ON invoices;
DROP POLICY IF EXISTS "Allow anon update settings" ON admin_settings;
DROP POLICY IF EXISTS "Public can view active cars" ON cars;
DROP POLICY IF EXISTS "Anon can select all cars for admin" ON cars;
DROP POLICY IF EXISTS "Anon can insert cars" ON cars;
DROP POLICY IF EXISTS "Anon can update cars" ON cars;
DROP POLICY IF EXISTS "Anon can delete cars" ON cars;
DROP POLICY IF EXISTS "Allow anon manage leads" ON leads;

-- Create new policies - full access for anon role (admin panel uses anon key)
CREATE POLICY "anon_full_cars" ON cars FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_images" ON car_images FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_leads" ON leads FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_invoices" ON invoices FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_settings" ON admin_settings FOR ALL TO anon USING (true) WITH CHECK (true);

-- =========================================================================
-- SEED: Insert the 3 cars that were previously hardcoded on homepage
-- =========================================================================

INSERT INTO cars (name, slug, car_type, fuel_type, transmission, seats, engine_cc, mileage_kmpl, has_ac, boot_space_l, ground_clearance_mm, price_per_day, deposit, km_limit_per_day, extra_km_rate, min_rental_age, features, description, primary_image_url, is_featured, is_active, is_available)
VALUES
(
  'Mahindra Thar',
  'mahindra-thar',
  'suv',
  'diesel',
  'manual',
  4,
  2184,
  15.2,
  true,
  600,
  226,
  3500,
  5000,
  200,
  15,
  21,
  ARRAY['4x4 Capability', 'Removable Hardtop', 'Touchscreen Infotainment'],
  'The iconic Mahindra Thar is perfect for your off-road adventures and city cruising alike.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC-2LE93H9dHo9L3sQTTPxsnbdDGQDPZihEYi_dXtiDMEA6bH9Gg3oB2_EFBG-8NPpzsIrGvOhijRZfWz-LHH3flXVXjzUXDU59bywDDw3SyH0OKmFGHLzRxfcQ_cCLvF0ox4cf8VmtYZ-EwveB_a0oa_fj-ocZ5lVpJMB7G2tjTWmQ5Wj1oUQvd2UQheU_grZPINd874m35Dkz7UmAhQ6y7pAn3ADSqMyNh9Q5a34ocmN3v1Y8xIYH9IHMXqnDItywTnIy27lKGa8',
  true,
  true,
  true
),
(
  'Hyundai Creta',
  'hyundai-creta',
  'suv',
  'petrol',
  'automatic',
  5,
  1497,
  16.8,
  true,
  433,
  190,
  2800,
  3000,
  250,
  12,
  21,
  ARRAY['Panoramic Sunroof', 'Ventilated Seats', 'Bose Sound System'],
  'A premium and spacious SUV with incredible comfort for long highway drives.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCx_xnbi1qxHxUMnoavsUjjoVZgIKpcUaQlD5knVg0zanRe7wp3uxbDJ1b4izuIefls89dJSw-BRiGPJnQobNsUi_lJUzRL5oXv9u79HAVAhTjza6UafbV_7A18BWtLXZ2TMKL1_VukwY2uJq81XyF1gKelQKXkni4kiZy0dOuvC8FHP7ai8ixo8lm3OpT3pQ-QvHRTzPbkNVgaj4DEbXTxxL71NcEinJZgEu0D1_RMJq9305lP5nE93urajIsLpX0bla9eShFnPok',
  true,
  true,
  true
),
(
  'Maruti Baleno',
  'maruti-baleno',
  'hatchback',
  'petrol',
  'manual',
  5,
  1197,
  22.3,
  true,
  318,
  170,
  1200,
  2000,
  300,
  10,
  21,
  ARRAY['SmartPlay Studio', 'Auto Climate Control', 'Reverse Camera'],
  'Nimble and fuel efficient, the Baleno is the ideal self-drive car for city errands.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA603Y6K2OLMYJYKc8YHt0p9ps-0Ad9ETiQ-M9_PwsOkSR1OKecQceXtgredWu6wYzv12HduxRCyuVrkEwfPDZZWAt8r1c3oIYluj2YRKVcrN3CQVg5uKiVBIZV4AJl1Az6f2DQZCLlnqUpUuAGkybPMmtb19i6XQVgvYCB9xldFRUEE3sI6RzP3jZWHkszsuffPJUIJRxb8QLsnWMHxD4mOguX3pcgkZFYT2n_aj314dkSe-wRFdv04mhEbbxsc2mdmAtODncyyMc',
  true,
  true,
  true
)
ON CONFLICT (slug) DO NOTHING;
