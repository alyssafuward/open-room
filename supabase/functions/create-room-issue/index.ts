import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN')!;
const GITHUB_REPO = 'alyssafuward/open-room-open-source';

serve(async (req) => {
  // Supabase database webhooks send a POST with the record payload
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const payload = await req.json();

  // Only handle INSERT events
  if (payload.type !== 'INSERT') {
    return new Response('Ignored', { status: 200 });
  }

  const room = payload.record;

  // Skip the common room
  if (room.grid_x === 0 && room.grid_y === 0) {
    return new Response('Skipped common room', { status: 200 });
  }

  const registryId = room.registry_id ?? 'unknown';
  const github = room.github_username ? `@${room.github_username}` : 'unknown';

  const title = `Room reserved: ${registryId} (${github})`;
  const body = [
    `A new room has been reserved on the floor plan.`,
    ``,
    `| Field | Value |`,
    `|-------|-------|`,
    `| Registry ID | \`${registryId}\` |`,
    `| GitHub | ${github} |`,
    `| Grid position | (${room.grid_x}, ${room.grid_y}) |`,
    `| Reserved at | ${room.reserved_at ?? 'unknown'} |`,
    ``,
    `**Next step:** the builder should fork the repo, copy the template to \`public/registry/${registryId}/\`, and open a PR.`,
  ].join('\n');

  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ title, body, labels: ['room'] }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('GitHub API error:', error);
    return new Response('Failed to create issue', { status: 500 });
  }

  const issue = await response.json();
  console.log(`Created issue #${issue.number}: ${title}`);
  return new Response(JSON.stringify({ issue: issue.number }), { status: 200 });
});
