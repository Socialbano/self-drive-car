const fs = require('fs');
const dotenv = require('dotenv');
const keys = dotenv.parse(fs.readFileSync('.env.local'));
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(keys.NEXT_PUBLIC_SUPABASE_URL, keys.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data: cars } = await supabase.from('cars').select('*');
  console.log("Total cars in DB:", cars ? cars.length : 0);
  if (cars && cars.length > 0) {
    console.log("Cars:", cars.map(c => `${c.name} (active: ${c.is_active})`));
  } else {
    console.log("Attempting to insert a test car...");
    const { data, error } = await supabase.from('cars').insert([{
      name: 'Hyundai Creta',
      slug: 'hyundai-creta-test',
      car_type: 'suv',
      fuel_type: 'petrol',
      transmission: 'automatic',
      seats: 5,
      price_per_day: 4000,
      is_active: true,
      is_available: true
    }]).select();
    console.log("Insert response:", data, error);
  }
}
run();
