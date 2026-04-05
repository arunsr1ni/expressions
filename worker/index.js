/**
 * Cloudflare Worker — expressions-comments
 *
 * Receives a comment POST, appends it to comments.json in the GitHub repo,
 * and commits the update so GitHub Pages rebuilds.
 *
 * Environment secrets (set via `wrangler secret put`):
 *   GITHUB_TOKEN  — fine-grained PAT, Contents read+write on the expressions repo
 *
 * Environment variables (set in wrangler.toml):
 *   GITHUB_OWNER  — e.g. "arunsr1ni"
 *   GITHUB_REPO   — e.g. "expressions"
 *   COMMENTS_PATH — e.g. "src/_data/comments.json"
 */

const ALLOWED_ORIGIN = 'https://retrophile.blog';

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return corsResponse('', 204, env);
    }

    if (request.method !== 'POST') {
      return corsResponse('Method not allowed', 405, env);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse('Invalid JSON', 400, env);
    }

    const { slug, name, text, date } = body;
    if (!slug || !name || !text) {
      return corsResponse('Missing fields', 400, env);
    }

    // Sanitise inputs
    const clean = (s) => String(s).slice(0, 500).trim();
    const comment = {
      name: clean(name),
      text: clean(text),
      date: date || new Date().toISOString(),
    };

    const apiBase = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${env.COMMENTS_PATH}`;
    const headers = {
      Authorization: `token ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'expressions-comments-worker',
    };

    // Fetch current file
    const getRes = await fetch(apiBase, { headers });
    if (!getRes.ok) {
      return corsResponse('Failed to fetch comments file', 502, env);
    }
    const fileData = await getRes.json();
    const sha = fileData.sha;
    const current = JSON.parse(atob(fileData.content.replace(/\n/g, '')));

    // Append comment
    if (!Array.isArray(current[slug])) current[slug] = [];
    current[slug].push(comment);

    // Commit updated file
    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `comment: ${slug} by ${comment.name}`,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(current, null, 2)))),
        sha,
      }),
    });

    if (!putRes.ok) {
      const err = await putRes.text();
      return corsResponse('Failed to save comment: ' + err, 502, env);
    }

    return corsResponse(JSON.stringify({ ok: true }), 200, env);
  },
};

function corsResponse(body, status, env) {
  return new Response(body, {
    status,
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    },
  });
}
