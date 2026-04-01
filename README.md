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

## File structure at a glance

```
src/poems/          ← put new poems here
src/css/style.css   ← all visual styles
src/_includes/      ← page layouts (don't need to touch these)
```
