-- Drop the existing table if it exists to ensure a clean slate based on requested schema
DROP TABLE IF EXISTS public.cars CASCADE;
DROP TABLE IF EXISTS public.agreements CASCADE;

-- Create the perfect cars table based on the explicit schema
CREATE TABLE public.cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    price_12hr NUMERIC(10, 2) NOT NULL,
    price_24hr NUMERIC(10, 2) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    transmission VARCHAR(50) NOT NULL,
    car_type VARCHAR(50) NOT NULL,
    seats INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Enable read access for all users" ON public.cars
    FOR SELECT USING (true);

-- Allow anonymous insert access (For admin form functionality without Auth setup yet)
CREATE POLICY "Enable insert for anonymous users" ON public.cars
    FOR INSERT WITH CHECK (true);

-- Allow anonymous update access (For admin form functionality without Auth setup yet)
CREATE POLICY "Enable update for anonymous users" ON public.cars
    FOR UPDATE USING (true);

-- Allow anonymous delete access (For admin form functionality without Auth setup yet)
CREATE POLICY "Enable delete for anonymous users" ON public.cars
    FOR DELETE USING (true);

-- Seed Initial Data
INSERT INTO public.cars (name, slug, price_12hr, price_24hr, fuel_type, transmission, car_type, seats, image_url, description, is_active, is_featured)
VALUES 
    (
        'Mahindra Thar', 'mahindra-thar', 2275, 3500, 'diesel', 'manual', 'suv', 4, 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC-2LE93H9dHo9L3sQTTPxsnbdDGQDPZihEYi_dXtiDMEA6bH9Gg3oB2_EFBG-8NPpzsIrGvOhijRZfWz-LHH3flXVXjzUXDU59bywDDw3SyH0OKmFGHLzRxfcQ_cCLvF0ox4cf8VmtYZ-EwveB_a0oa_fj-ocZ5lVpJMB7G2tjTWmQ5Wj1oUQvd2UQheU_grZPINd874m35Dkz7UmAhQ6y7pAn3ADSqMyNh9Q5a34ocmN3v1Y8xIYH9IHMXqnDItywTnIy27lKGa8',
        'The iconic Mahindra Thar is perfect for your off-road adventures and city cruising alike.', true, true
    ),
    (
        'Hyundai Creta', 'hyundai-creta', 1820, 2800, 'petrol', 'automatic', 'suv', 5,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCx_xnbi1qxHxUMnoavsUjjoVZgIKpcUaQlD5knVg0zanRe7wp3uxbDJ1b4izuIefls89dJSw-BRiGPJnQobNsUi_lJUzRL5oXv9u79HAVAhTjza6UafbV_7A18BWtLXZ2TMKL1_VukwY2uJq81XyF1gKelQKXkni4kiZy0dOuvC8FHP7ai8ixo8lm3OpT3pQ-QvHRTzPbkNVgaj4DEbXTxxL71NcEinJZgEu0D1_RMJq9305lP5nE93urajIsLpX0bla9eShFnPok',
        'A premium and spacious SUV with incredible comfort for long highway drives.', true, true
    ),
    (
        'Maruti Baleno', 'maruti-baleno', 780, 1200, 'petrol', 'manual', 'hatchback', 5,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA603Y6K2OLMYJYKc8YHt0p9ps-0Ad9ETiQ-M9_PwsOkSR1OKecQceXtgredWu6wYzv12HduxRCyuVrkEwfPDZZWAt8r1c3oIYluj2YRKVcrN3CQVg5uKiVBIZV4AJl1Az6f2DQZCLlnqUpUuAGkybPMmtb19i6XQVgvYCB9xldFRUEE3sI6RzP3jZWHkszsuffPJUIJRxb8QLsnWMHxD4mOguX3pcgkZFYT2n_aj314dkSe-wRFdv04mhEbbxsc2mdmAtODncyyMc',
        'Nimble and fuel efficient, the Baleno is the ideal self-drive car for city errands.', true, true
    );

-- CREATE AGREEMENTS TABLE
CREATE TABLE public.agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    mobile VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    aadhaar_number VARCHAR(100) NOT NULL,
    driving_license VARCHAR(100) NOT NULL,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price_12hr NUMERIC(10, 2) NOT NULL,
    price_24hr NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    security_deposit NUMERIC(10, 2) NOT NULL,
    terms_accepted BOOLEAN NOT NULL DEFAULT false,
    signature_data TEXT, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Enable read access for all users" ON public.agreements
    FOR SELECT USING (true);

-- Allow anonymous insert access 
CREATE POLICY "Enable insert for anonymous users" ON public.agreements
    FOR INSERT WITH CHECK (true);

-- Allow anonymous update access 
CREATE POLICY "Enable update for anonymous users" ON public.agreements
    FOR UPDATE USING (true);

-- Allow anonymous delete access 
CREATE POLICY "Enable delete for anonymous users" ON public.agreements
    FOR DELETE USING (true);
