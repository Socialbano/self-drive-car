const fs = require('fs');
const dotenv = require('dotenv');
const keys = dotenv.parse(fs.readFileSync('.env.local'));
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(keys.NEXT_PUBLIC_SUPABASE_URL, keys.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  try {
    const { data: cars } = await supabase.from('cars').select('id').limit(1);
    const car_id = cars && cars.length > 0 ? cars[0].id : null;

    const invoiceData = {
      invoice_number: 'INV-2026-9999',
      customer_name: 'Test Client',
      customer_phone: '9999999999',
      customer_email: 'test@example.com',
      customer_address: 'Test Address',
      aadhaar_number: '1234',
      driving_license: 'DL-1234',
      car_id: car_id,
      start_date: '2026-04-01',
      end_date: '2026-04-02',
      daily_rate: 1000,
      subtotal: 1000,
      gst_enabled: false,
      tax_amount: 0,
      total_amount: 1000,
      status: 'pending'
    };
    
    console.log("Attempting Insert...", invoiceData);
    const { data, error } = await supabase.from('invoices').insert([invoiceData]).select();
    console.log("INSERT RESULT DATA:", data);
    if (error) {
      console.log("INSERT ERROR:", error);
    }
  } catch (err) {
    console.error("EXCEPTION:", err);
  }
}

run();
