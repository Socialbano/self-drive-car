import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const carsToInsert = [
    {
      name: 'Mahindra Thar',
      slug: 'mahindra-thar',
      car_type: 'suv',
      fuel_type: 'diesel',
      transmission: 'manual',
      seats: 4,
      engine_cc: 2184,
      mileage_kmpl: 15.2,
      has_ac: true,
      boot_space_l: 600,
      ground_clearance_mm: 226,
      price_per_day: 3500,
      deposit: 5000,
      km_limit_per_day: 200,
      extra_km_rate: 15,
      min_rental_age: 21,
      features: ['4x4 Capability', 'Removable Hardtop', 'Touchscreen Infotainment'],
      description: 'The iconic Mahindra Thar is perfect for your off-road adventures and city cruising alike.',
      primary_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-2LE93H9dHo9L3sQTTPxsnbdDGQDPZihEYi_dXtiDMEA6bH9Gg3oB2_EFBG-8NPpzsIrGvOhijRZfWz-LHH3flXVXjzUXDU59bywDDw3SyH0OKmFGHLzRxfcQ_cCLvF0ox4cf8VmtYZ-EwveB_a0oa_fj-ocZ5lVpJMB7G2tjTWmQ5Wj1oUQvd2UQheU_grZPINd874m35Dkz7UmAhQ6y7pAn3ADSqMyNh9Q5a34ocmN3v1Y8xIYH9IHMXqnDItywTnIy27lKGa8',
      is_featured: true,
      is_active: true,
      is_available: true
    },
    {
      name: 'Hyundai Creta',
      slug: 'hyundai-creta',
      car_type: 'suv',
      fuel_type: 'petrol',
      transmission: 'automatic',
      seats: 5,
      engine_cc: 1497,
      mileage_kmpl: 16.8,
      has_ac: true,
      boot_space_l: 433,
      ground_clearance_mm: 190,
      price_per_day: 2800,
      deposit: 3000,
      km_limit_per_day: 250,
      extra_km_rate: 12,
      min_rental_age: 21,
      features: ['Panoramic Sunroof', 'Ventilated Seats', 'Bose Sound System'],
      description: 'A premium and spacious SUV with incredible comfort for long highway drives.',
      primary_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx_xnbi1qxHxUMnoavsUjjoVZgIKpcUaQlD5knVg0zanRe7wp3uxbDJ1b4izuIefls89dJSw-BRiGPJnQobNsUi_lJUzRL5oXv9u79HAVAhTjza6UafbV_7A18BWtLXZ2TMKL1_VukwY2uJq81XyF1gKelQKXkni4kiZy0dOuvC8FHP7ai8ixo8lm3OpT3pQ-QvHRTzPbkNVgaj4DEbXTxxL71NcEinJZgEu0D1_RMJq9305lP5nE93urajIsLpX0bla9eShFnPok',
      is_featured: true,
      is_active: true,
      is_available: true
    },
    {
      name: 'Maruti Baleno',
      slug: 'maruti-baleno',
      car_type: 'hatchback',
      fuel_type: 'petrol',
      transmission: 'manual',
      seats: 5,
      engine_cc: 1197,
      mileage_kmpl: 22.3,
      has_ac: true,
      boot_space_l: 318,
      ground_clearance_mm: 170,
      price_per_day: 1200,
      deposit: 2000,
      km_limit_per_day: 300,
      extra_km_rate: 10,
      min_rental_age: 21,
      features: ['SmartPlay Studio', 'Auto Climate Control', 'Reverse Camera'],
      description: 'Nimble and fuel efficient, the Baleno is the ideal self-drive car for city errands.',
      primary_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA603Y6K2OLMYJYKc8YHt0p9ps-0Ad9ETiQ-M9_PwsOkSR1OKecQceXtgredWu6wYzv12HduxRCyuVrkEwfPDZZWAt8r1c3oIYluj2YRKVcrN3CQVg5uKiVBIZV4AJl1Az6f2DQZCLlnqUpUuAGkybPMmtb19i6XQVgvYCB9xldFRUEE3sI6RzP3jZWHkszsuffPJUIJRxb8QLsnWMHxD4mOguX3pcgkZFYT2n_aj314dkSe-wRFdv04mhEbbxsc2mdmAtODncyyMc',
      is_featured: true,
      is_active: true,
      is_available: true
    }
  ];

  try {
    for (const car of carsToInsert) {
      // Check if it already exists to prevent duplicates
      const { data: existing } = await supabase.from('cars').select('id').eq('slug', car.slug).single();
      
      if (!existing) {
        const { error } = await supabase.from('cars').insert([car]);
        if (error) {
          console.error(`Error inserting ${car.name}:`, error);
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
      }
    }
    return NextResponse.json({ success: true, message: 'Seeded successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
