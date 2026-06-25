---
name: astro-js
description: Astro.js framework — file-based routing, component syntax, static output, layouts, islands architecture, and deployment. Use this skill when building or modifying any Astro project.
---

# Astro.js Skill

Source: https://docs.astro.build/en/getting-started/ | https://docs.astro.build/en/concepts/why-astro/

---

## What Astro Is

Astro is a **static-first web framework** for content-driven websites. Its key feature: **zero JS shipped by default** — components render to HTML at build time. Client-side JS only runs when explicitly opted in via `client:*` directives.

For this project, Astro provides:
- File-based routing (`src/pages/` → URL)
- Shared layouts (`src/layouts/BaseLayout.astro`)
- Scoped CSS per component (`:global()` for overrides)
- `output: 'static'` → pure HTML in `dist/` for drag-and-drop deployment

---

## Project Checklist

### Bootstrap
- [ ] Run `npm create astro@latest ./ -- --template minimal --no-install --no-git`
- [ ] Set `output: 'static'` in `astro.config.mjs`
- [ ] Run `npm install`
- [ ] Verify `npm run dev` starts without errors

### astro.config.mjs
```js
import { defineConfig } from 'astro/config';
export default defineConfig({
  output: 'static',
  site: 'https://YOUR_DOMAIN.com', // for canonical URLs and OG tags
});
```

### File-Based Routing
- [ ] `src/pages/index.astro` → `/`
- [ ] `src/pages/privacy.astro` → `/privacy`
- [ ] `src/pages/terms.astro` → `/terms`
- [ ] `src/pages/about.astro` → `/about`
- [ ] `src/pages/contact.astro` → `/contact`

### Component Syntax
```astro
---
// Frontmatter: runs at BUILD TIME only (server/Node)
import MyComponent from '../components/MyComponent.astro';
const { title } = Astro.props;
---
<!-- Template: HTML with Astro expressions -->
<h1>{title}</h1>
<MyComponent />

<style>
  /* Scoped to this component automatically */
  h1 { color: red; }
</style>

<script>
  // Client-side JS — runs in the browser
  console.log('Hello browser');
</script>
```

### Layouts
```astro
---
// src/layouts/BaseLayout.astro
const { title, description } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <slot /> <!-- page content goes here -->
  </body>
</html>
```

### Props / Data Passing
- Props pass parent → child via attributes
- `Astro.props` reads them in frontmatter
- Data files (`src/data/targets.js`) are imported in frontmatter, NOT in `<script>` tags (build-time only)

### Client-Side JS (Audio Engine)
- The Web Audio API must run in the browser — use a bare `<script>` tag (not `is:inline` unless needed)
- `<script>` tags in Astro are **bundled and deduped** automatically
- For truly raw inline JS without bundling: `<script is:inline>`
- iOS `AudioContext` fix: resume on first user gesture inside the `<script>`

### Islands Architecture (NOT needed for this project)
- `client:load` — hydrate on page load
- `client:idle` — hydrate when browser is idle
- Skip for Belt Tuner — all interactivity is vanilla JS `<script>`, no framework islands

### `Astro.url` — for deep links
```js
// In frontmatter
const params = new URL(Astro.request.url).searchParams; // build-time only
// OR in <script> (runtime):
const params = new URLSearchParams(window.location.search);
const printer = params.get('printer');
```

### Build & Deploy
- [ ] `npm run build` → outputs `dist/`
- [ ] `npm run preview` → local preview of `dist/`
- [ ] Drop `dist/` onto Netlify / Cloudflare Pages / GitHub Pages

### Common Gotchas
- Frontmatter runs **server/build time** — no `window`, `document`, `localStorage` there
- Use `<script>` tags for all browser APIs
- `import` in frontmatter = build-time data only
- CSS `<style>` is scoped by default — use `:global(selector)` for global overrides
- `public/` folder files are copied as-is to `dist/` (use for `og-image.png`, `favicon.ico`)

---

## References
- Docs: https://docs.astro.build/en/getting-started/
- Why Astro: https://docs.astro.build/en/concepts/why-astro/
- Project Structure: https://docs.astro.build/en/basics/project-structure/
- Astro Components: https://docs.astro.build/en/basics/astro-components/
- Static Deployment: https://docs.astro.build/en/guides/deploy/
