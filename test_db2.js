const https = require('https');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*['"]?(.*?)['"]?\s*$/m);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*['"]?(.*?)['"]?\s*$/m);

if (!urlMatch || !keyMatch) {
  console.log("No credentials found");
  process.exit(1);
}

const urlStr = urlMatch[1].replace(/\/$/, '') + '/rest/v1/cars';
const key = keyMatch[1];
const url = new URL(urlStr);

const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname + url.search,
  method: 'POST',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log(data);
  });
});

req.on('error', e => {
  console.error(e);
});

req.write(JSON.stringify({ 
  name: 'Test Car',
  slug: 'test-car-' + Date.now(),
  price_per_day: 1000,
  car_type: 'suv',
  fuel_type: 'petrol',
  transmission: 'manual',
  seats: 5,
  has_ac: true,
  boot_space_l: 300,
  ground_clearance_mm: 180,
  deposit: 2000,
  km_limit_per_day: 200,
  extra_km_rate: 10,
  min_rental_age: 21,
  is_active: true,
  is_featured: true,
  is_available: true
}));
req.end();
