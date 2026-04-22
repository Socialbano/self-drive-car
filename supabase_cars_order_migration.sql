-- Add display_order to cars table to allow manual reordering
-- This will be used in the Admin Fleet Management to control vehicle display order.

-- 1. Add the column if it doesn't exist
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 2. Initialize display_order based on the current default sorting (created_at DESC)
-- This ensures the initial order matches what users currently see.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.cars WHERE display_order = 0) THEN
        WITH ordered_cars AS (
            SELECT id, row_number() OVER (ORDER BY created_at DESC) as new_order
            FROM public.cars
        )
        UPDATE public.cars
        SET display_order = ordered_cars.new_order
        FROM ordered_cars
        WHERE public.cars.id = ordered_cars.id;
    END IF;
END $$;

-- 3. Ensure any new vehicles added in the future get a display_order
-- We can do this with a trigger or just handle it in the application (easier for now)
-- The application should set display_order = (max(display_order) + 1)
