const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/);

if (!urlMatch || !keyMatch) {
  console.log("No match");
  process.exit(1);
}

const url = urlMatch[1].trim();
const key = keyMatch[1].trim();

fetch(`${url}/rest/v1/cars?select=*&limit=1`, {
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
}).then(res => res.json()).then(data => {
  if (data && data.length > 0) {
    console.log("Columns:", Object.keys(data[0]));
    console.log("Data:", data[0]);
  } else {
    console.log("Table is empty. Let's try inserting an empty row to see what columns matter.");
    fetch(`${url}/rest/v1/cars`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ name: 'Test' })
    }).then(r => r.json()).then(d => console.log("Insert response:", d));
  }
}).catch(e => console.log("Fetch error:", e));

