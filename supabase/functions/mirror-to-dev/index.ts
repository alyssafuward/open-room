import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const DEV_URL = Deno.env.get('DEV_URL')!;
const DEV_KEY = Deno.env.get('DEV_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const payload = await req.json();

  if (payload.type !== 'INSERT') {
    return new Response('Ignored', { status: 200 });
  }

  const room = payload.record;

  const res = await fetch(`${DEV_URL}/rest/v1/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': DEV_KEY,
      'Authorization': `Bearer ${DEV_KEY}`,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify(room),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('Failed to mirror room to dev:', error);
    return new Response('Failed to mirror', { status: 500 });
  }

  console.log(`✓ Mirrored room ${room.registry_id} to dev`);
  return new Response(JSON.stringify({ mirrored: room.registry_id }), { status: 200 });
});
