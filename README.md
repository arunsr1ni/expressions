# Expressions of an Analog Soul

A minimal poetry blog built with [Eleventy](https://www.11ty.dev/) and hosted on GitHub Pages.

---

## Adding a New Poem

1. Create a file in `src/poems/` — name it after the poem using hyphens, e.g. `src/poems/the-quiet-hour.md`

2. Paste this template at the top of the file:

```markdown
---
title: "Your Poem Title"
date: 2026-04-01
excerpt: "one line that teases the poem (optional)"
layout: poem.njk
---

Your poem goes here.

Stanzas are separated by a blank line.

Each line break is preserved naturally.
```

3. Save, then push:

```bash
git add .
git commit -m "add: Your Poem Title"
git push
```

GitHub Actions builds and deploys the site automatically in about 30–60 seconds.

---

## Running Locally

```bash
npm install        # first time only
npm start          # serves at http://localhost:8080
```

---

## Hosting (one-time setup)

1. Create a GitHub repository (can be private or public)
2. Push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. Go to your repo → **Settings → Pages**
4. Under **Source**, select **Deploy from a branch** → choose `gh-pages` → `/ (root)` → Save
5. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Custom domain (optional)

In **Settings → Pages → Custom domain**, enter your domain (e.g. `analogsoul.com`).  
Then add a CNAME DNS record pointing to `YOUR_USERNAME.github.io`.

---

## Setting Up Comments (one-time)

Comments are stored in `src/_data/comments.json` in the repo. A Cloudflare Worker (free tier) receives each new comment and commits it back to GitHub, which triggers a redeploy.

### Step 1 — GitHub Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens) → **Fine-grained tokens** → Generate new token
2. Set repository access to **Only select repositories** → `expressions`
3. Under **Repository permissions**, set **Contents** to **Read and write**
4. Copy the token

### Step 2 — Deploy the Cloudflare Worker

```bash
npm install -g wrangler
wrangler login
cd worker
wrangler deploy
wrangler secret put GITHUB_TOKEN
# paste your token when prompted
```

After deploy, Wrangler will print your worker URL, e.g.:
`https://expressions-comments.YOUR_SUBDOMAIN.workers.dev`

### Step 3 — Set the Worker URL in the blog

Open `src/js/comments.js` and replace the placeholder:

```js
var WORKER_URL = 'https://expressions-comments.YOUR_SUBDOMAIN.workers.dev';
```

Then push:

```bash
git add .
git commit -m "chore: connect comments worker"
git push
```

Comments will now appear immediately for the person posting, and for all visitors after the ~60s GitHub Pages redeploy.

---

## File structure at a glance

```
src/poems/              ← put new poems here
src/_data/comments.json ← all comments (managed automatically)
src/js/comments.js      ← client-side comment handler
src/css/style.css       ← all visual styles
src/_includes/          ← page layouts (don't need to touch these)
worker/                 ← Cloudflare Worker source
```
