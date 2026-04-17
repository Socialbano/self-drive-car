-- ================================================
-- Instagram Reels Table
-- Run this in Supabase SQL Editor
-- ================================================

CREATE TABLE IF NOT EXISTS public.instagram_reels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reel_url TEXT NOT NULL,
  thumbnail TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  priority INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.instagram_reels ENABLE ROW LEVEL SECURITY;

-- Public read access for active reels
CREATE POLICY "Public can read active reels"
  ON public.instagram_reels FOR SELECT
  USING (is_active = true);

-- Authenticated full access for admin
CREATE POLICY "Authenticated users can manage reels"
  ON public.instagram_reels FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert sample reels
INSERT INTO public.instagram_reels (reel_url, thumbnail, is_active, priority) VALUES
  ('https://www.instagram.com/reel/C7XNxtsPCtI/', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80', true, 1),
  ('https://www.instagram.com/reel/C6yDk7mJ82k/', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80', true, 2),
  ('https://www.instagram.com/reel/C5s-o1aP7y3/', 'https://images.unsplash.com/photo-1469285994282-454ceb49e63c?auto=format&fit=crop&q=80', true, 3);

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
