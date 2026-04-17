const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  const { data, error } = await supabase.from('cars').select('*');
  if (error) {
    console.error('Supabase Error:', error.message, error.details, error.hint);
  } else {
    console.log('Cars in DB:', data.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

testSupabase();
