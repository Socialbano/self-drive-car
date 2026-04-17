-- Phase 2: Skydeepgroup Supabase Schema & Initial Data
-- Copy and paste this directly into the Supabase SQL editor

-- TABLE 1: cars
CREATE TABLE cars (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(100) NOT NULL,
  slug                VARCHAR(120) UNIQUE NOT NULL,
  car_type            VARCHAR(20) CHECK (car_type IN ('hatchback','sedan','suv','luxury','electric')),
  fuel_type           VARCHAR(20) CHECK (fuel_type IN ('petrol','diesel','cng','electric')),
  transmission        VARCHAR(10) CHECK (transmission IN ('manual','automatic')),
  seats               INTEGER NOT NULL DEFAULT 5,
  engine_cc           INTEGER,
  mileage_kmpl        NUMERIC(4,1),
  has_ac              BOOLEAN DEFAULT true,
  boot_space_l        INTEGER,
  ground_clearance_mm INTEGER,
  price_per_day       INTEGER NOT NULL,
  price_per_week      INTEGER,
  price_weekend       INTEGER,
  price_outstation    INTEGER,
  deposit             INTEGER NOT NULL DEFAULT 2000,
  km_limit_per_day    INTEGER DEFAULT 300,
  extra_km_rate       INTEGER DEFAULT 8,
  min_rental_age      INTEGER DEFAULT 21,
  features            TEXT[],
  description         TEXT,
  primary_image_url   TEXT,
  is_featured         BOOLEAN DEFAULT false,
  is_active           BOOLEAN DEFAULT true,
  is_available        BOOLEAN DEFAULT true,
  display_order       INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 2: car_images
CREATE TABLE car_images (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id         UUID REFERENCES cars(id) ON DELETE CASCADE,
  url            TEXT NOT NULL,
  cloudinary_id  TEXT NOT NULL,
  display_order  INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 3: leads
CREATE TABLE leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  phone        VARCHAR(15) NOT NULL,
  email        VARCHAR(150),
  car_type     VARCHAR(50),
  pickup_date  DATE,
  message      TEXT,
  status       VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','contacted','booked','closed')),
  source       VARCHAR(30) DEFAULT 'website_form',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 4: faqs
CREATE TABLE faqs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question      TEXT NOT NULL,
  answer        TEXT NOT NULL,
  category      VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 5: testimonials
CREATE TABLE testimonials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(80) NOT NULL,
  city          VARCHAR(50) DEFAULT 'Indore',
  rating        INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text   TEXT NOT NULL,
  car_rented    VARCHAR(100),
  is_approved   BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 6: admin_settings
CREATE TABLE admin_settings (
  key        VARCHAR(100) PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO admin_settings (key, value) VALUES
  ('business_name',         'Skydeepgroup'),
  ('business_phone',        '+919111330558'),
  ('business_whatsapp',     '+919111330558'),
  ('business_address',      'Near HDFC Bank, Ramesh Dosa, Vishnupuri, Bhawarkua, Indore 452001'),
  ('business_city',         'Indore'),
  ('business_state',        'Madhya Pradesh'),
  ('business_pincode',      '452001'),
  ('business_hours',        'Mon–Sun 8:00 AM – 9:00 PM'),
  ('whatsapp_default_msg',  'Hi Skydeepgroup! I want to book a self drive car in Indore.'),
  ('offer_banner_text',     ''),
  ('offer_banner_active',   'false'),
  ('maps_embed_url',        'https://www.google.com/maps/embed?pb=...');

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- CARS: Public read, Admin full access
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active cars" ON cars FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Admin full access to cars" ON cars FOR ALL TO authenticated USING (true);

-- CAR_IMAGES: Public read, Admin full access
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view car images" ON car_images FOR SELECT TO anon USING (true);
CREATE POLICY "Admin full access to car images" ON car_images FOR ALL TO authenticated USING (true);

-- LEADS: Public INSERT only, Admin full access
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert leads" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin can manage leads" ON leads FOR ALL TO authenticated USING (true);

-- FAQS: Public read, Admin full access
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active FAQs" ON faqs FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Admin full access to FAQs" ON faqs FOR ALL TO authenticated USING (true);

-- TESTIMONIALS: Public read approved, Admin full access
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view approved testimonials" ON testimonials FOR SELECT TO anon USING (is_approved = true);
CREATE POLICY "Admin full access to testimonials" ON testimonials FOR ALL TO authenticated USING (true);

-- ADMIN_SETTINGS: Public read, Admin full access
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read settings" ON admin_settings FOR SELECT TO anon USING (true);
CREATE POLICY "Admin full access to settings" ON admin_settings FOR ALL TO authenticated USING (true);

-- =========================================================================
-- BILLING & INVOICING
-- =========================================================================

-- TABLE 7: invoices
CREATE TABLE invoices (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number    VARCHAR(50) UNIQUE NOT NULL,
  customer_name     VARCHAR(100) NOT NULL,
  customer_phone    VARCHAR(20) NOT NULL,
  customer_email    VARCHAR(150),
  customer_address  TEXT,
  aadhaar_number    VARCHAR(50),
  driving_license   VARCHAR(50),
  gst_enabled       BOOLEAN DEFAULT false,
  car_id            UUID REFERENCES cars(id) ON DELETE SET NULL,
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  daily_rate        NUMERIC(10,2) NOT NULL,
  subtotal          NUMERIC(10,2) NOT NULL,
  tax_amount        NUMERIC(10,2) NOT NULL,
  total_amount      NUMERIC(10,2) NOT NULL,
  status            VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- INVOICES: Admin full access
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access to invoices" ON invoices FOR ALL TO authenticated USING (true);
