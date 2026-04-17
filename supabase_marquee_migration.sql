-- ================================================
-- Marquee Messages Table
-- Run this in Supabase SQL Editor
-- ================================================

CREATE TABLE IF NOT EXISTS public.marquee_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  link TEXT DEFAULT NULL,
  icon TEXT DEFAULT '🚗',
  is_active BOOLEAN DEFAULT true NOT NULL,
  priority INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.marquee_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for active messages
CREATE POLICY "Public can read active marquee messages"
  ON public.marquee_messages FOR SELECT
  USING (is_active = true);

-- Authenticated full access for admin
CREATE POLICY "Authenticated users can manage marquee messages"
  ON public.marquee_messages FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert sample messages
INSERT INTO public.marquee_messages (text, icon, is_active, priority) VALUES
  ('Flat 20% OFF on Self Drive Cars — Limited Time!', '🔥', true, 1),
  ('No Security Deposit Required on All Cars', '✅', true, 2),
  ('Book Instantly via WhatsApp — 24/7 Available', '💬', true, 3),
  ('Free Delivery at Indore Airport', '✈️', true, 4);

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
