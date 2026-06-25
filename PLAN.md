# Belt Tuner — Implementation Plan

A free, **Astro.js-powered** static site for measuring 3D printer belt tension via microphone pitch detection.

---

## Overview

Built with **Astro.js** (static output mode — `output: 'static'`). Astro is ideal here because:

- **Zero JS by default** — pages ship no runtime JS unless explicitly opted in. The audio engine is the only client-side JS, kept in an isolated `<script>` island.
- **Component-based** — each UI section (readout, selector, confidence bar, self-test) is its own `.astro` component, making phases independently buildable and testable.
- **File-based routing** — `src/pages/privacy.astro`, `about.astro` etc. map directly to `/privacy`, `/about` — no config needed.
- **Built-in SEO primitives** — layouts handle `<head>`, OG tags, meta descriptions in one place.
- **Deploys identically to vanilla HTML** — `npm run build` outputs a `dist/` folder, drag-and-drop to Netlify / Cloudflare Pages / GitHub Pages.
- **Shared Layout** — one `BaseLayout.astro` handles the footer, nav, and meta tags for all pages — no copy-paste.

> **The audio engine remains 100% vanilla JS** (Web Audio API). No React, no Vue, no Svelte. Astro just provides the project structure and build step.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Astro 4.x (static) | Zero-runtime components, file routing, layout sharing |
| Styling | Vanilla CSS (global + scoped) | Full control, no Tailwind overhead |
| JavaScript | Vanilla JS (`<script>` tags) | Web Audio API — no library needed |
| Data | `src/data/targets.js` | Exported JS object, imported by Astro components |
| Build output | `dist/` (static HTML) | Drop on any static host |
| Package manager | npm | Standard |

---

## Project Structure

```
belt-tuner/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro       # Shared head, footer, nav
│   ├── pages/
│   │   ├── index.astro            # Main tool page
│   │   ├── privacy.astro
│   │   ├── terms.astro
│   │   ├── about.astro
│   │   └── contact.astro
│   ├── components/
│   │   ├── FrequencyReadout.astro # Big Hz display
│   │   ├── VerdictLine.astro      # green/amber/red status
│   │   ├── ConfidenceBar.astro    # thin confidence strip
│   │   ├── PrinterSelector.astro  # dropdown + badge
│   │   ├── MicButton.astro        # start/stop button
│   │   ├── SelfTest.astro         # tone generator
│   │   ├── Disclaimer.astro       # safety disclaimer
│   │   └── AffiliateLinks.astro   # monetization placeholders
│   ├── data/
│   │   └── targets.js             # Printer frequency database
│   └── styles/
│       └── global.css             # Design system tokens + base styles
├── public/
│   └── og-image.png               # Open Graph preview image
├── astro.config.mjs
├── package.json
├── README.md
├── PLAN.md
└── TASKS.md
```

---

## Phased Breakdown

### Phase 1 — Astro Project Bootstrap & Design System
**Goal:** Initialize Astro, establish the design system, create all pages as shells.

**Checklist:**
- [ ] `npm create astro@latest` — minimal template, static output
- [ ] Configure `astro.config.mjs` (`output: 'static'`)
- [ ] Create `src/styles/global.css` — dark-mode design system (colors, typography, layout tokens)
- [ ] Create `src/layouts/BaseLayout.astro` — shared head, footer, nav
- [ ] Create `src/pages/index.astro` — shell only
- [ ] Create `src/pages/privacy.astro` — full content (mic, cookies, AdSense)
- [ ] Create `src/pages/terms.astro` — full content
- [ ] Create `src/pages/about.astro` — how it works + physics explainer
- [ ] Create `src/pages/contact.astro` — full content
- [ ] Create `README.md` — deploy + how to add a printer

---

### Phase 2 — Printer Target Database
**Goal:** Build `src/data/targets.js` — never fabricate a number, badge each entry.

**File:** `src/data/targets.js` (exported JS array, imported by Astro components)

**Entries to seed:**
| Entry | Confidence | Source |
|---|---|---|
| Prusa CORE One / CORE One+ / CORE One L — XY upper belt | official | Prusa KB |
| Markforged Mark Two — front belt | official | Markforged docs |
| Markforged Mark Two — rear belt | official | Markforged docs |
| Markforged Metal X | official | Integrator guide |
| Prusa MK3 / MK3S X axis | community | Community measured |
| Prusa MK3 / MK3S Y axis | community | Community measured |
| Voron 2.4 A belt | community | Community cited |
| Voron 2.4 B belt | community | Community cited |
| Voron Trident A belt | community | Community cited |
| Voron Trident B belt | community | Community cited |
| Ender 3 / 3 V2 / Pro / S1 | none | No spec |
| CR-10 series | none | No spec |
| Ender 5 series | none | No spec |
| Bambu A1 / P1 / X1 | none | No spec |

**Hard rules (safety matter):**
- NEVER fabricate a frequency. Over-tensioning damages hardware.
- `confidence: "none"` → `lo/hi` are `null` → UI shows "No verified target" message.
- Badge every entry: ✅ Official | ⚠️ Community | ⛔ No target

---

### Phase 3 — Audio Engine
**Goal:** Full pitch detection pipeline as vanilla JS in a `<script>` tag on `index.astro`.

**Algorithm:**
1. `AudioContext` + `AnalyserNode` (`fftSize = 4096`)
2. `getFloatTimeDomainData()` → RMS gate (< 0.005 → show "pluck belt…")
3. Restricted-lag normalized autocorrelation: lags `floor(sr/350)` to `floor(sr/35)` (~35–350 Hz)
4. Parabolic interpolation for sub-sample precision
5. `frequency = sr / interpolated_lag`
6. Confidence = normalized peak height; reject if < 0.45
7. Median of last 6 valid readings
8. Reject outside 35–350 Hz (octave sanity check)
9. Throttle to ~every 60ms

**Edge cases:**
- `getUserMedia` denied → friendly message
- Non-HTTPS → explain HTTPS requirement
- Old browser (`AudioContext` not available) → graceful fallback
- iOS → `AudioContext` must resume on user gesture

---

### Phase 4 — UI Components
**Goal:** Build each UI element as an `.astro` component, wire to audio engine via vanilla JS events.

**Components:**
- `FrequencyReadout.astro` — large monospace Hz display
- `VerdictLine.astro` — green ✓ / amber ↑ / red ↓ (hidden when no target)
- `ConfidenceBar.astro` — thin animated bar
- `PrinterSelector.astro` — alphabetically sorted dropdown + badge + target range
- `MicButton.astro` — big start/stop button
- `Disclaimer.astro` — safety disclaimer block
- Status line, instruction text (inline in `index.astro`)
- Deep-link `?printer=` URL param handling (in `<script>` on index)
- Prusa owners: link to Prusa's own tuner alongside verdict

---

### Phase 5 — Self-Test Tone Generator
**Goal:** Verify detector math without a printer.

- `SelfTest.astro` component
- OscillatorNode → `MediaStreamDestination` → same detector pipeline
- Slider 40–120 Hz
- Readout matches slider ±1 Hz
- Works without mic permission

---

### Phase 6 — Monetization Placeholders
**Goal:** Non-intrusive placeholder slots.

- `AffiliateLinks.astro` — "Replacement parts" section below tool
  - GT2 belts, tensioners, pulleys, physical gauge → `REPLACE_ME` Amazon links
- AdSense slot placeholder (below tool, non-interrupting)
- Publisher ID as placeholder

---

### Phase 7 — SEO & Deep Links
- OG tags in `BaseLayout.astro` (per-page props)
- `<title>` targeting "3D printer belt tension Hz"
- Meta description per page
- `?printer=` query param pre-selects model on load
- `public/og-image.png` for social previews
- Per-printer shareable links in README

---

### Phase 8 — QA Checklist
- `npm run build` completes with no errors
- `npm run preview` serves correctly
- Mic denied → friendly message, page usable
- Old browser → graceful message
- HTTP → HTTPS message shown
- Noisy room → confidence low, no garbage number
- Strong harmonics → detector reports fundamental
- Self-test stable ±1 Hz across 40–120 Hz
- Mobile Safari — AudioContext on user tap only
- Mobile Chrome — tested
- Live printer switch → verdict updates immediately
- Deep link `?printer=voron-2.4-ab` → pre-selects correct model
- All 4 support pages load with working footer links
- `dist/` output is pure static HTML (no server required)

---

## Design Decisions
| # | Decision | Choice |
|---|---|---|
| 1 | Framework | Astro.js (static output) |
| 2 | Database storage | `src/data/targets.js` — imported by components |
| 3 | Audio engine | Vanilla JS `<script>` tag — no Astro magic |
| 4 | Prusa tuner link | Show alongside verdict |
| 5 | No-target printers | Show readout + community text, no pass/fail |
| 6 | Self-test iOS | Solve silently (MediaStreamDestination) |
| 7 | Styling | Vanilla CSS in `global.css` + scoped per component |

---

## Deliverables
| File/Path | Purpose |
|---|---|
| `src/pages/index.astro` | Main tool page |
| `src/pages/privacy.astro` | Privacy policy |
| `src/pages/terms.astro` | Terms of use |
| `src/pages/about.astro` | About + physics explainer |
| `src/pages/contact.astro` | Contact page |
| `src/layouts/BaseLayout.astro` | Shared layout |
| `src/data/targets.js` | Printer database |
| `src/styles/global.css` | Design system |
| `public/og-image.png` | OG social preview |
| `README.md` | Deploy guide + how to add a printer |
| `PLAN.md` | This file |
| `TASKS.md` | Task tracker |
