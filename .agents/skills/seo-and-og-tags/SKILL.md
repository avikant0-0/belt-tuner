---
name: seo-and-og-tags
description: SEO best practices — title tags, meta descriptions, Open Graph tags, structured data, canonical URLs, and deep-link URL params. Use this skill when working on any page's <head> or sharing features.
---

# SEO & Open Graph Tags Skill

Source: https://developers.google.com/search/docs | https://ogp.me/ | https://web.dev/learn/html/metadata/

---

## Overview

Belt Tuner's credibility depends on being findable and shareable. The primary distribution channel is Reddit/Discord links — OG tags control the preview card. SEO targets: "3D printer belt tension", "3D printer belt tension hz", "[printer model] belt tension frequency".

---

## Checklist

### Per-Page `<head>` Requirements
- [ ] `<title>` — unique per page, 50-60 chars, keyword at front
- [ ] `<meta name="description">` — 120-160 chars, compelling, includes keyword
- [ ] `<link rel="canonical">` — absolute URL, prevents duplicate content
- [ ] `<meta name="robots" content="index, follow">` — on all public pages
- [ ] `lang="en"` on `<html>` element

### Open Graph Tags (controls Reddit/Discord/Twitter previews)
- [ ] `og:title` — same as `<title>` or slightly longer
- [ ] `og:description` — same as meta description
- [ ] `og:type` — `"website"` for main page
- [ ] `og:url` — canonical URL
- [ ] `og:image` — absolute URL, at least 1200×630px, `public/og-image.png`
- [ ] `og:site_name` — "Belt Tuner"
- [ ] `twitter:card` — `"summary_large_image"`
- [ ] `twitter:title`, `twitter:description`, `twitter:image`

### BaseLayout.astro — Complete Head Template
```astro
---
interface Props {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
}
const {
  title,
  description,
  canonicalUrl = new URL(Astro.url.pathname, Astro.site).href,
  ogImage = new URL('/og-image.png', Astro.site).href,
} = Astro.props;
---
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:site_name" content="Belt Tuner" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
```

### Per-Page Titles & Descriptions
| Page | Title | Description |
|---|---|---|
| index | `Belt Tuner — 3D Printer Belt Tension by Frequency` | `Free tool: use your phone's mic to measure 3D printer belt tension in Hz. Works with Prusa, Voron, Ender 3, and more.` |
| about | `How Belt Tuner Works — The Physics of Belt Tension` | `Learn how plucking a belt like a guitar string reveals its tension through frequency measurement.` |
| privacy | `Privacy Policy — Belt Tuner` | `Belt Tuner processes audio locally in your browser. No audio is ever uploaded or recorded.` |
| terms | `Terms of Use — Belt Tuner` | `Terms for using the Belt Tuner belt tension measurement tool.` |
| contact | `Contact — Belt Tuner` | `Get in touch with the Belt Tuner team.` |

### Deep Links — `?printer=` URL Param
- [ ] Each printer entry has a unique `id` field (e.g. `voron-2.4-ab`)
- [ ] On page load (in `<script>`), read `new URLSearchParams(window.location.search).get('printer')`
- [ ] If found, pre-select that printer in the dropdown
- [ ] Update URL when user changes printer: `history.replaceState({}, '', '?printer=' + id)`

```js
// On load
const params = new URLSearchParams(window.location.search);
const printerId = params.get('printer');
if (printerId) {
  const option = document.querySelector(`option[value="${printerId}"]`);
  if (option) {
    document.getElementById('printer-select').value = printerId;
    // trigger change event to update verdict
    document.getElementById('printer-select').dispatchEvent(new Event('change'));
  }
}

// On printer change
select.addEventListener('change', () => {
  const id = select.value;
  history.replaceState({}, '', id ? `?printer=${id}` : '/');
  updateVerdict(id);
});
```

### Semantic HTML for SEO
- [ ] One `<h1>` per page — the main topic
- [ ] `<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`, `<article>` where appropriate
- [ ] `<time>` for any dates
- [ ] `<abbr>` for Hz (e.g. `<abbr title="Hertz">Hz</abbr>`)

### Performance (Core Web Vitals)
- [ ] LCP (Largest Contentful Paint) < 2.5s — frequency readout renders instantly (no async load)
- [ ] CLS (Cumulative Layout Shift) = 0 — no images or late-loading elements above fold
- [ ] FID/INP — mic button responds immediately
- [ ] No render-blocking resources — fonts use `display: swap`

---

## References
- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Open Graph Protocol: https://ogp.me/
- Twitter Cards: https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started
- Web.dev Metadata: https://web.dev/learn/html/metadata/
