-- Migration Script for 12hr and 24hr Pricing
-- Execute this script in your Supabase SQL Editor

-- 1. Add new columns
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS price_12hr NUMERIC(10, 2);
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS price_24hr NUMERIC(10, 2);

-- 2. Migrate existing data (assuming price_per_day exists)
UPDATE public.cars 
SET price_24hr = price_per_day, 
    price_12hr = ROUND(price_per_day * 0.65)
WHERE price_24hr IS NULL AND price_per_day IS NOT NULL;

-- 3. In case there is no old data, set a default to prevent NOT NULL constraints from failing if there are any rows
UPDATE public.cars SET price_24hr = 0, price_12hr = 0 WHERE price_24hr IS NULL;

-- 4. Set NOT NULL constraints
ALTER TABLE public.cars ALTER COLUMN price_12hr SET NOT NULL;
ALTER TABLE public.cars ALTER COLUMN price_24hr SET NOT NULL;

-- 5. Drop the old column
ALTER TABLE public.cars DROP COLUMN IF EXISTS price_per_day;

-- View updated cars
SELECT name, price_12hr, price_24hr FROM public.cars;
