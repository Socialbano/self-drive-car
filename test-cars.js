const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
async function run() {
  const { data } = await supabase.from('cars').select('id, name, is_active');
  console.log(data);
}
run();
