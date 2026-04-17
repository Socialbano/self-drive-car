const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/invoices?select=id,cars(name)&limit=1';
fetch(url, {
  headers: {
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
}).then(r => r.json().then(b => console.log(r.status, b))).catch(console.error);
