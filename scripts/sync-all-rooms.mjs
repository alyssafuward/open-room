/**
 * One-time script to sync all registry rooms into Supabase.
 * Reads every public/registry/<room-id>/config.json and updates the matching
 * Supabase row (by registry_id) — setting name and status to active.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/sync-all-rooms.mjs
 *
 * To run against dev instead:
 *   SUPABASE_URL=<dev-url> SUPABASE_SERVICE_ROLE_KEY=<dev-key> node scripts/sync-all-rooms.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registryDir = path.join(__dirname, '..', 'public', 'registry');

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const folders = fs.readdirSync(registryDir).filter(f => {
  if (f === '_template') return false;
  const configPath = path.join(registryDir, f, 'config.json');
  return fs.existsSync(configPath);
});

console.log(`Found ${folders.length} rooms: ${folders.join(', ')}\n`);

async function syncRoom(folder) {
  const configPath = path.join(registryDir, folder, 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const name = config.room_display_name;

  if (!name) {
    console.warn(`⚠ ${folder}: no room_display_name, skipping`);
    return;
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/rooms?registry_id=eq.${encodeURIComponent(folder)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ name, status: 'active' }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error(`✗ ${folder}:`, data);
    return;
  }

  if (!data.length) {
    console.warn(`⚠ ${folder}: no row found with registry_id="${folder}" — was it reserved?`);
  } else {
    console.log(`✓ ${folder} → "${name}", status: active`);
  }
}

for (const folder of folders) {
  await syncRoom(folder);
}
