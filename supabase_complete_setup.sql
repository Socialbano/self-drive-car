-- =========================================================================
-- Skydeepgroup Supabase Complete Database Setup Script
-- Paste this script directly into the Supabase SQL Editor (https://app.supabase.com)
-- This creates all 10 required tables, RLS policies, and inserts seed data.
-- =========================================================================

-- 1. DROP EXISTING TABLES TO ENSURE CLEAN SETUP (Optional - remove if database already has user data)
DROP TABLE IF EXISTS public.car_images CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.agreements CASCADE;
DROP TABLE IF EXISTS public.cars CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.admin_settings CASCADE;
DROP TABLE IF EXISTS public.marquee_messages CASCADE;
DROP TABLE IF EXISTS public.instagram_reels CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;

-- 2. CREATE public.cars TABLE
CREATE TABLE public.cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    car_type VARCHAR(50) CHECK (car_type IN ('hatchback', 'sedan', 'suv', 'luxury', 'electric', 'muv')),
    fuel_type VARCHAR(50) CHECK (fuel_type IN ('petrol', 'diesel', 'cng', 'electric')),
    transmission VARCHAR(50) CHECK (transmission IN ('manual', 'automatic')),
    seats INTEGER NOT NULL DEFAULT 5,
    image_url TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    price_12hr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    price_24hr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    km_limit_per_day INTEGER DEFAULT 300,
    extra_km_rate INTEGER DEFAULT 8,
    price_per_week INTEGER,
    price_weekend INTEGER,
    price_outstation INTEGER,
    deposit INTEGER DEFAULT 2000,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE public.car_images TABLE
CREATE TABLE public.car_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    cloudinary_id TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE public.leads TABLE
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(150),
    car_type VARCHAR(50),
    pickup_date DATE,
    message TEXT,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'closed')),
    source VARCHAR(30) DEFAULT 'website_form',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CREATE public.faqs TABLE
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CREATE public.testimonials TABLE
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(80) NOT NULL,
    city VARCHAR(50) DEFAULT 'Indore',
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT NOT NULL,
    car_rented VARCHAR(100),
    is_approved BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. CREATE public.admin_settings TABLE
CREATE TABLE public.admin_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CREATE public.invoices TABLE
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(150),
    customer_address TEXT,
    aadhaar_number VARCHAR(50),
    driving_license VARCHAR(50),
    gst_enabled BOOLEAN DEFAULT false,
    car_id UUID REFERENCES public.cars(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    daily_rate NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    manual_vehicle_name VARCHAR(255) DEFAULT NULL,
    manual_vehicle_type VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. CREATE public.agreements TABLE
CREATE TABLE public.agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    mobile VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    aadhaar_number VARCHAR(100) NOT NULL,
    driving_license VARCHAR(100) NOT NULL,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price_12hr NUMERIC(10, 2) NOT NULL,
    price_24hr NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    security_deposit NUMERIC(10, 2) NOT NULL,
    terms_accepted BOOLEAN NOT NULL DEFAULT false,
    signature_data TEXT,
    manual_vehicle_name VARCHAR(255) DEFAULT NULL,
    manual_vehicle_type VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. CREATE public.marquee_messages TABLE
CREATE TABLE public.marquee_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    link TEXT DEFAULT NULL,
    icon TEXT DEFAULT '🚗',
    is_active BOOLEAN DEFAULT true NOT NULL,
    priority INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. CREATE public.instagram_reels TABLE
CREATE TABLE public.instagram_reels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reel_url TEXT NOT NULL,
    thumbnail TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    priority INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. CREATE public.locations TABLE
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) CHECK (category IN ('city', 'area')),
    title TEXT,
    description TEXT,
    street_address TEXT,
    hero_image TEXT,
    icon_name VARCHAR(50) DEFAULT 'location_on',
    badge_text TEXT,
    heading_prefix TEXT,
    heading_highlight TEXT,
    hero_description TEXT,
    whatsapp_msg TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES SETUP
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marquee_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- 1. Secure policies for public/anonymous users (Read-only for public tables, Insert-only for leads, no access to sensitive data)
CREATE POLICY "anon_read_active_cars" ON public.cars FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read_car_images" ON public.car_images FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_leads" ON public.leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_read_active_faqs" ON public.faqs FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read_approved_testimonials" ON public.testimonials FOR SELECT TO anon USING (is_approved = true);
CREATE POLICY "anon_read_settings" ON public.admin_settings FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_active_marquee" ON public.marquee_messages FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read_active_reels" ON public.instagram_reels FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read_active_locations" ON public.locations FOR SELECT TO anon USING (is_active = true);

-- Note: No anonymous policies are created for public.invoices and public.agreements to protect customer data.

-- 2. Full access policies for authenticated users (Admin Panel)
CREATE POLICY "auth_manage_cars" ON public.cars FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_manage_car_images" ON public.car_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_manage_leads" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_manage_faqs" ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_manage_testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_manage_settings" ON public.admin_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_manage_invoices" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_manage_agreements" ON public.agreements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_manage_marquee" ON public.marquee_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_manage_reels" ON public.instagram_reels FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_manage_locations" ON public.locations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- SEED INITIAL DATA
-- =========================================================================

-- Seed cars
INSERT INTO public.cars (name, slug, car_type, fuel_type, transmission, seats, image_url, description, price_12hr, price_24hr, deposit, km_limit_per_day, extra_km_rate, is_featured, is_active, is_available, display_order)
VALUES
(
  'Mahindra Thar',
  'mahindra-thar',
  'suv',
  'diesel',
  'manual',
  4,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC-2LE93H9dHo9L3sQTTPxsnbdDGQDPZihEYi_dXtiDMEA6bH9Gg3oB2_EFBG-8NPpzsIrGvOhijRZfWz-LHH3flXVXjzUXDU59bywDDw3SyH0OKmFGHLzRxfcQ_cCLvF0ox4cf8VmtYZ-EwveB_a0oa_fj-ocZ5lVpJMB7G2tjTWmQ5Wj1oUQvd2UQheU_grZPINd874m35Dkz7UmAhQ6y7pAn3ADSqMyNh9Q5a34ocmN3v1Y8xIYH9IHMXqnDItywTnIy27lKGa8',
  'The iconic Mahindra Thar is perfect for your off-road adventures and city cruising alike.',
  2275,
  3500,
  5000,
  200,
  15,
  true,
  true,
  true,
  1
),
(
  'Hyundai Creta',
  'hyundai-creta',
  'suv',
  'petrol',
  'automatic',
  5,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCx_xnbi1qxHxUMnoavsUjjoVZgIKpcUaQlD5knVg0zanRe7wp3uxbDJ1b4izuIefls89dJSw-BRiGPJnQobNsUi_lJUzRL5oXv9u79HAVAhTjza6UafbV_7A18BWtLXZ2TMKL1_VukwY2uJq81XyF1gKelQKXkni4kiZy0dOuvC8FHP7ai8ixo8lm3OpT3pQ-QvHRTzPbkNVgaj4DEbXTxxL71NcEinJZgEu0D1_RMJq9305lP5nE93urajIsLpX0bla9eShFnPok',
  'A premium and spacious SUV with incredible comfort for long highway drives.',
  1820,
  2800,
  3000,
  250,
  12,
  true,
  true,
  true,
  2
),
(
  'Maruti Baleno',
  'maruti-baleno',
  'hatchback',
  'petrol',
  'manual',
  5,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA603Y6K2OLMYJYKc8YHt0p9ps-0Ad9ETiQ-M9_PwsOkSR1OKecQceXtgredWu6wYzv12HduxRCyuVrkEwfPDZZWAt8r1c3oIYluj2YRKVcrN3CQVg5uKiVBIZV4AJl1Az6f2DQZCLlnqUpUuAGkybPMmtb19i6XQVgvYCB9xldFRUEE3sI6RzP3jZWHkszsuffPJUIJRxb8QLsnWMHxD4mOguX3pcgkZFYT2n_aj314dkSe-wRFdv04mhEbbxsc2mdmAtODncyyMc',
  'Nimble and fuel efficient, the Baleno is the ideal self-drive car for city errands.',
  780,
  1200,
  2000,
  300,
  10,
  true,
  true,
  true,
  3
)
ON CONFLICT (slug) DO NOTHING;

-- Seed admin settings
INSERT INTO public.admin_settings (key, value) VALUES
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
  ('hero_image_url',        '/images/hero-bg.jpg'),
  ('hero_tagline',          'Now Serving Indore, Goa & Jaipur'),
  ('hero_title_p1',         'Self Drive Car'),
  ('hero_title_p2',         'Rental in Indore'),
  ('hero_description',      'Premium self-drive car rental service with zero security deposit. Experience the freedom of the road with our fleet of luxury SUVs and sedans.'),
  ('hero_stat1_value',      '1500'),
  ('hero_stat1_label',      'Happy Customers'),
  ('hero_stat2_value',      '100'),
  ('hero_stat2_label',      'Cars in Fleet')
ON CONFLICT (key) DO NOTHING;

-- Seed marquee messages
INSERT INTO public.marquee_messages (text, icon, is_active, priority) VALUES
  ('Flat 20% OFF on Self Drive Cars — Limited Time!', '🔥', true, 1),
  ('No Security Deposit Required on All Cars', '✅', true, 2),
  ('Book Instantly via WhatsApp — 24/7 Available', '💬', true, 3),
  ('Free Delivery at Indore Airport', '✈️', true, 4);

-- Seed instagram reels
INSERT INTO public.instagram_reels (reel_url, thumbnail, is_active, priority) VALUES
  ('https://www.instagram.com/reel/C7XNxtsPCtI/', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80', true, 1),
  ('https://www.instagram.com/reel/C6yDk7mJ82k/', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80', true, 2),
  ('https://www.instagram.com/reel/C5s-o1aP7y3/', 'https://images.unsplash.com/photo-1469285994282-454ceb49e63c?auto=format&fit=crop&q=80', true, 3);

-- Seed faqs
INSERT INTO public.faqs (question, answer, category, display_order, is_active) VALUES
  ('Can I get a self drive car in Indore?', 'Yes! SkydeepGroup offers the most reliable self drive car Indore service. Whether you need a simple hatchback for city errands or a big SUV for family travel, you can easily rent a car without driver from us.', 'General', 1, true),
  ('What is the self drive car Indore price per day?', 'Humara pricing bohot simple aur transparent hai. Our self drive car Indore price starts from just ₹1200 per day. Koi hidden charges nahi hain; what you see is exactly what you pay!', 'Pricing', 2, true),
  ('What documents do I need to rent a car?', 'Gaadi rent karne ke liye aapko bas ek valid original Indian Driving License, apna Aadhaar Card, aur ek alternative ID (like Voter ID or Passport) dikhani hogi. Simple document check and you are good to go!', 'Documents', 3, true),
  ('Can I get a self drive car Indore airport par?', 'Haan bilkul! Hum hassle-free airport pickup aur drop facility provide karte hain. Agar aap landing ke baad seedhe safely apne hotel jana chahte hain, toh choose our self drive car Indore airport delivery options.', 'Delivery', 4, true),
  ('Do you deliver cars in the Vijay Nagar area?', 'Yes, we offer fast delivery for car rental Indore Vijay Nagar and surrounding prime areas. Agar aap Vijay Nagar ya Bhawarkua mein hain, toh aap easily humari home delivery facilities ka fayda utha sakte hain.', 'Delivery', 5, true),
  ('How to quickly book a self drive car near me?', 'Booking is super easy! Apni pasand ki car website par select karein and WhatsApp button dabayein. For a quick "self drive car near me" search, just ping us your location and we''ll arrange the closest available vehicle.', 'Booking', 6, true),
  ('Kya main outstation travel ke liye gaadi le ja sakta hu?', 'Absolutely! Our car rental Indore without driver is perfect for outstation trips like Ujjain Mahakal, Omkareshwar, ya out-of-state travel. Hum long road trips ke liye specially customized packages bhi dete hain.', 'Outstation', 7, true),
  ('Is there a daily KM limit for road trips?', 'Standard daily rentals mein generally 300 KM per day ki generous limit hoti hai. Agar aap limit cross karte hain, toh sirf ek nominal per KM charge apply hota hai. No heavy penalties!', 'Rules', 8, true),
  ('What is your fuel policy for self-drive cars?', 'Hum "Level-to-Level" fuel policy effectively follow karte hain. Jis fuel level par hum aapko gaadi deliver karte hain, exactly ussi level par aapko gaadi wapis karni hoti hai. Simple and clean.', 'Rules', 9, true),
  ('Is any security deposit required to rent a vehicle?', 'Hum zero hidden fees mein believe karte hain! Bas approval/verification process ke dauran ek chhota refundable security deposit liya jata hai. Safely car return karne ke baad ye amount instantly refund ho jata hai.', 'Deposit', 10, true),
  ('What is the minimum age to drive your rental cars?', 'SkydeepGroup se directly gaadi rent karne ke liye aapki age at least 21 saal honi chahiye. Saath hi, safety standards ke liye aapke paas kam se kam ek saal purana valid driving license hona zaroori hai.', 'Rules', 11, true),
  ('Can I book a luxury car rental Indore for a wedding?', 'Ji haan! Hum premium luxury car rental Indore options bhi provide karte hain. Whether it''s a VIP event, a wedding, or a special anniversary, you can book our top-tier SUVs and sedans in advance.', 'Booking', 12, true),
  ('How can I securely pay for my car booking?', 'Aap UPI apps (Google Pay, PhonePe, Paytm), Net Banking, ya bank transfer ke through payment kar sakte hain. Secure your booking online on WhatsApp before taking the keys!', 'Payment', 13, true),
  ('How can I just book a vehicle via WhatsApp?', 'Sabse fast confirmation ke liye, humari website pe "Book via WhatsApp" button par click karein. Humari 24/7 support team aapse instantly connect karegi and aapki gaadi confirm kar degi.', 'Booking', 14, true),
  ('What is your cancellation and refund policy?', 'Because travel plans can change, hum flexible cancellation options dete hain. Agar aapko cancel karna hai, toh please trip start hone se 24 hours pehle bata dein taaki standard refund process initiate ho sake.', 'Refund', 15, true),
  ('What happens if I return the car late?', 'Agar aap raste mein stuck ho gaye hain aur late hain, toh please humari team ko time se pehle urgently inform karein. Uninformed late returns par standard hourly rental penalty apply hota hai.', 'Rules', 16, true),
  ('How do I know if my favorite car is available?', 'Humari fleet hamesha in-demand rehti hai. Apni choice ki SUV ya hatchback select karke turant hume WhatsApp drop karein. We will check real-time availability and block the car for your dates immediately.', 'Availability', 17, true);

-- Seed locations
INSERT INTO public.locations (name, slug, category, title, description, street_address, hero_image, icon_name, badge_text, heading_prefix, heading_highlight, hero_description, whatsapp_msg, display_order)
VALUES
(
  'Goa', 'goa', 'city',
  'Self Drive Car Rental Goa | Hire Self Drive Cars in Goa - SkydeepGroup',
  'Rent self-drive cars in Goa. Hatchbacks, SUVs, and luxury cars available on daily rent at Goa Airport, Madgaon, and Panaji. Book with zero security deposit.',
  'Goa Airport / Madgaon / Panaji',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80',
  'explore', 'Explore Goa by Road', 'Self Drive Car Rental in', 'Goa',
  'Experience Goa on your own terms. Drive your favorite car across beaches, forts, and scenic roads with complete privacy.',
  'Hi Skydeepgroup! I want to rent a self drive car in Goa.', 1
),
(
  'Jaipur', 'jaipur', 'city',
  'Self Drive Car Rental Jaipur | Rent Car Without Driver Jaipur - SkydeepGroup',
  'Book best self-drive cars in Jaipur. Explore the Pink City in SUVs, sedans, and hatchbacks with fast airport delivery and zero security deposit.',
  'Jaipur Airport / Railway Station',
  'https://images.unsplash.com/photo-1477587458883-47135dfdb56f?auto=format&fit=crop&q=80',
  'explore', 'Rent Car in Jaipur', 'Self Drive Car Rental in', 'Jaipur',
  'Rent a car in the Pink City. Drive around historical palaces and heritage sites at your own comfort.',
  'Hi Skydeepgroup! I want to rent a self drive car in Jaipur.', 2
),
(
  'Indore', 'indore', 'city',
  'Self Drive Car Rental in Indore | Car on Rent Without Driver - SkydeepGroup',
  'Book the best self-drive cars in Indore. Hatchbacks, sedans, and luxury SUVs available on daily and monthly rent. Zero security deposit, 24/7 delivery.',
  'Bhawarkua / Vijay Nagar / Airport, Indore',
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80',
  'location_city', 'Self Drive Indore', 'Self Drive Car Rental in', 'Indore',
  'Choose from our premium self-drive cars in Indore. Safe, sanitized, and well-maintained fleet ready for your city or outstation rides.',
  'Hi Skydeepgroup! I want to rent a self drive car in Indore.', 3
),
(
  'Vijay Nagar', 'vijay-nagar', 'area',
  'Self Drive Car Rental Vijay Nagar Indore | SkydeepGroup',
  'Looking for a self drive car in Vijay Nagar, Indore? SkydeepGroup offers fast delivery of hatchbacks, sedans, and SUVs directly to Vijay Nagar with zero security deposit.',
  'Vijay Nagar, Indore',
  'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80',
  'location_on', 'Fast Delivery in Vijay Nagar', 'Self Drive Car Rental in', 'Vijay Nagar',
  'Enjoy premium self-drive car rentals delivered right to your doorstep in Vijay Nagar, Indore. Hatchbacks, sedans, and SUVs with zero security deposit.',
  'Hi Skydeepgroup! I want to book a self drive car in Vijay Nagar, Indore.', 4
),
(
  'Bhanwar Kuan', 'bhanwar-kuan', 'area',
  'Car Rental Bhawar Kua Indore | Self Drive Near Bhanwar Kuan | SkydeepGroup',
  'Rent a self drive car near Bhanwar Kuan (Bhawarkua) Indore. SkydeepGroup offers hatchbacks, sedans, and SUVs with zero security deposit directly from our nearby office.',
  'Bhanwar Kuan, Indore',
  'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80',
  'location_on', 'Pick up near Bhanwar Kuan', 'Car Rental', 'Bhanwar Kuan',
  'Renting a self-drive car in Indore is now super easy. Pick up your clean, well-maintained vehicle right next to Bhanwar Kuan square.',
  'Hi Skydeepgroup! I want to book a car near Bhanwar Kuan.', 5
),
(
  'Airport', 'airport', 'area',
  'Self Drive Car Rental Indore Airport | Airport Pickup | SkydeepGroup',
  'Arriving at Devi Ahilya Bai Holkar Airport? SkydeepGroup provides instant self-drive car rental delivery at Indore airport. Zero security deposit.',
  'Devi Ahilya Bai Holkar Airport, Indore',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80',
  'flight_land', 'Indore Airport Delivery', 'Car Rental', 'Indore Airport',
  'Skip the taxi line. Step off your flight and straight into your pre-booked self-drive car at Devi Ahilya Bai Holkar Airport.',
  'Hi Skydeepgroup! I need a car rental delivery at Indore Airport.', 6
),
(
  'Ashok Nagar', 'ashok-nagar', 'area',
  'Self Drive Car Rental Ashok Nagar Indore | SkydeepGroup',
  'Rent a self drive car in Ashok Nagar, Indore. Premium and budget cars on rent with zero security deposit, instant door delivery, and fully sanitized cars.',
  'Ashok Nagar, Indore',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80',
  'location_on', 'Doorstep Delivery in Ashok Nagar', 'Self Drive Car in', 'Ashok Nagar',
  'Get your car delivered directly to your home or office in Ashok Nagar. Fully flexible self drive options with zero deposit.',
  'Hi Skydeepgroup! I want to book a self drive car in Ashok Nagar, Indore.', 7
)
ON CONFLICT (slug) DO NOTHING;

-- =========================================================================
-- STORAGE BUCKETS SETUP
-- =========================================================================

-- Create storage bucket for hero-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Grant public read access to hero-images bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero-images');

-- Grant upload/delete access to admin/service role
DROP POLICY IF EXISTS "Admin Hero Manage" ON storage.objects;
CREATE POLICY "Admin Hero Manage" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'hero-images')
  WITH CHECK (bucket_id = 'hero-images');

DROP POLICY IF EXISTS "Authenticated Hero Manage" ON storage.objects;
CREATE POLICY "Authenticated Hero Manage" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'hero-images')
  WITH CHECK (bucket_id = 'hero-images');

DROP POLICY IF EXISTS "Anon Hero Manage" ON storage.objects;
CREATE POLICY "Anon Hero Manage" ON storage.objects
  FOR ALL TO anon
  USING (bucket_id = 'hero-images')
  WITH CHECK (bucket_id = 'hero-images');

-- 11. CREATE public.blogs TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_description TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  date VARCHAR(100) NOT NULL DEFAULT TO_CHAR(CURRENT_DATE, 'Mon DD, YYYY'),
  category VARCHAR(100) NOT NULL,
  image TEXT NOT NULL,
  content TEXT NOT NULL,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow public read blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow admin full access blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow anon full access blogs" ON public.blogs;
DROP POLICY IF EXISTS "anon_read_blogs" ON public.blogs;
DROP POLICY IF EXISTS "auth_manage_blogs" ON public.blogs;

CREATE POLICY "anon_read_blogs" ON public.blogs FOR SELECT TO anon USING (true);
CREATE POLICY "auth_manage_blogs" ON public.blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Database Indexes for Performance Optimization
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

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
