import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const carsToInsert = [
  {
    name: 'Mahindra Thar',
    slug: 'mahindra-thar',
    car_type: 'suv',
    fuel_type: 'diesel',
    transmission: 'manual',
    price_per_day: 3500,
    features: ['4x4 Capability', 'Removable Hardtop', 'Touchscreen Infotainment'],
    description: 'The iconic Mahindra Thar is perfect for your off-road adventures and city cruising alike.',
    primary_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-2LE93H9dHo9L3sQTTPxsnbdDGQDPZihEYi_dXtiDMEA6bH9Gg3oB2_EFBG-8NPpzsIrGvOhijRZfWz-LHH3flXVXjzUXDU59bywDDw3SyH0OKmFGHLzRxfcQ_cCLvF0ox4cf8VmtYZ-EwveB_a0oa_fj-ocZ5lVpJMB7G2tjTWmQ5Wj1oUQvd2UQheU_grZPINd874m35Dkz7UmAhQ6y7pAn3ADSqMyNh9Q5a34ocmN3v1Y8xIYH9IHMXqnDItywTnIy27lKGa8',
    seats: 4,
  },
  {
    name: 'Hyundai Creta',
    slug: 'hyundai-creta',
    car_type: 'suv',
    fuel_type: 'petrol',
    transmission: 'automatic',
    price_per_day: 2800,
    features: ['Panoramic Sunroof', 'Ventilated Seats', 'Bose Sound System'],
    description: 'A premium and spacious SUV with incredible comfort for long highway drives.',
    primary_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx_xnbi1qxHxUMnoavsUjjoVZgIKpcUaQlD5knVg0zanRe7wp3uxbDJ1b4izuIefls89dJSw-BRiGPJnQobNsUi_lJUzRL5oXv9u79HAVAhTjza6UafbV_7A18BWtLXZ2TMKL1_VukwY2uJq81XyF1gKelQKXkni4kiZy0dOuvC8FHP7ai8ixo8lm3OpT3pQ-QvHRTzPbkNVgaj4DEbXTxxL71NcEinJZgEu0D1_RMJq9305lP5nE93urajIsLpX0bla9eShFnPok',
    seats: 5,
  },
  {
    name: 'Maruti Baleno',
    slug: 'maruti-baleno',
    car_type: 'hatchback',
    fuel_type: 'petrol',
    transmission: 'manual',
    price_per_day: 1200,
    features: ['SmartPlay Studio', 'Auto Climate Control', 'Reverse Camera'],
    description: 'Nimble and fuel efficient, the Baleno is the ideal self-drive car for city errands.',
    primary_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA603Y6K2OLMYJYKc8YHt0p9ps-0Ad9ETiQ-M9_PwsOkSR1OKecQceXtgredWu6wYzv12HduxRCyuVrkEwfPDZZWAt8r1c3oIYluj2YRKVcrN3CQVg5uKiVBIZV4AJl1Az6f2DQZCLlnqUpUuAGkybPMmtb19i6XQVgvYCB9xldFRUEE3sI6RzP3jZWHkszsuffPJUIJRxb8QLsnWMHxD4mOguX3pcgkZFYT2n_aj314dkSe-wRFdv04mhEbbxsc2mdmAtODncyyMc',
    seats: 5,
  }
];

async function seed() {
  for (const car of carsToInsert) {
    const { data: existing } = await supabase.from('cars').select('id').eq('slug', car.slug).single();
    if (!existing) {
      const { error } = await supabase.from('cars').insert([car]);
      if (error) {
        console.error(`Failed to insert ${car.name}:`, error.message);
      } else {
        console.log(`Inserted ${car.name}`);
      }
    } else {
      console.log(`${car.name} already exists`);
    }
  }
}
seed();
