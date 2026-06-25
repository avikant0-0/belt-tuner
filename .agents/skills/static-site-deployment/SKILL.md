---
name: static-site-deployment
description: Deploying Astro static sites to Netlify, Cloudflare Pages, and GitHub Pages. Includes build commands, environment setup, and domain configuration. Use this skill when setting up deployment or CI/CD.
---

# Static Site Deployment Skill

Source: https://docs.astro.build/en/guides/deploy/ | Netlify, Cloudflare Pages, GitHub Pages docs

---

## Overview

Belt Tuner builds to a static `dist/` folder — no server required. The same `dist/` can be deployed to any static host. HTTPS is provided automatically by all three hosts below (required for `getUserMedia`).

---

## Checklist

### Pre-Deploy
- [ ] `npm run build` completes with no errors
- [ ] `npm run preview` — verify `dist/` works locally
- [ ] Verify all pages load: `/`, `/privacy`, `/terms`, `/about`, `/contact`
- [ ] Verify OG image exists at `/og-image.png`
- [ ] `site` set in `astro.config.mjs` with the final domain

### Build Commands (all hosts)
| Command | Purpose |
|---|---|
| `npm run build` | Build to `dist/` |
| `npm run preview` | Local preview of `dist/` |
| Build command for host: | `npm run build` |
| Output directory: | `dist` |

---

## Netlify

### Deploy Steps
- [ ] Push repo to GitHub/GitLab
- [ ] Connect repo in Netlify dashboard
- [ ] Set: Build command = `npm run build`, Publish directory = `dist`
- [ ] Deploy — Netlify auto-detects Astro and handles node version
- [ ] Custom domain → Settings → Domain management → Add custom domain
- [ ] HTTPS is automatic (Let's Encrypt)

### netlify.toml (optional, put in project root)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

### Redirects (for clean URLs if needed)
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
> Note: Astro static mode generates `.html` files — Netlify handles routing automatically. This redirect is only needed if you use client-side routing.

---

## Cloudflare Pages

### Deploy Steps
- [ ] Push repo to GitHub
- [ ] Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect Git
- [ ] Framework preset: Astro (auto-detected)
- [ ] Build command: `npm run build`
- [ ] Build output directory: `dist`
- [ ] Deploy
- [ ] Custom domain → Pages project → Custom domains

### _headers (optional, put in `public/` folder)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(self)
```
> `microphone=(self)` allows mic on your own domain only — good security practice.

---

## GitHub Pages

### Deploy Steps
- [ ] Add `base` to `astro.config.mjs` if deploying to a sub-path (e.g. `username.github.io/belt-tuner`)
- [ ] Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```
- [ ] Enable Pages in repo Settings → Pages → Source = GitHub Actions
- [ ] If using sub-path, set in astro.config.mjs:
```js
export default defineConfig({
  base: '/belt-tuner/', // match your repo name
  output: 'static',
});
```

---

## Post-Deploy Verification
- [ ] Site loads over HTTPS
- [ ] Mic permission works (requires HTTPS — confirm on real phone)
- [ ] All 5 pages accessible: `/`, `/privacy`, `/terms`, `/about`, `/contact`
- [ ] `?printer=voron-2.4-ab` deep link works
- [ ] OG preview renders on Discord/Reddit (use https://opengraph.xyz/ to test)
- [ ] Page load < 1 second on 4G

---

## References
- Astro Deploy Guide: https://docs.astro.build/en/guides/deploy/
- Netlify Docs: https://docs.netlify.com/
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- GitHub Pages: https://docs.github.com/en/pages
