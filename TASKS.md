# Belt Tuner — Task Tracker

> Update this file as work progresses. Mark `[/]` = in progress, `[x]` = done, `[ ]` = not started.
> Framework: **Astro.js** (static output), Vanilla CSS, Vanilla JS audio engine.

---

## Phase 1 — Astro Bootstrap & Design System
- [x] Run `npm create astro@latest` (minimal template)
- [x] Configure `astro.config.mjs` (`output: 'static'`)
- [x] Create `src/styles/global.css` — dark-mode design system
- [x] Create `src/layouts/BaseLayout.astro` — shared head, footer, nav
- [x] Create `src/pages/index.astro` — shell only
- [x] Create `src/pages/privacy.astro` — full content (mic, cookies, AdSense)
- [x] Create `src/pages/terms.astro` — full content
- [x] Create `src/pages/about.astro` — how it works + physics explainer
- [x] Create `src/pages/contact.astro` — full content
- [x] Create `README.md` — deploy + how to add a printer

## Phase 2 — Printer Target Database
- [x] Create `src/data/targets.js` — exported JS array
- [x] Add Prusa CORE One / CORE One+ / CORE One L — official ✅
- [x] Add Markforged Mark Two front belt — official ✅
- [x] Add Markforged Mark Two rear belt — official ✅
- [x] Add Markforged Metal X — official ✅
- [x] Add Prusa MK3 / MK3S X axis — community ⚠️
- [x] Add Prusa MK3 / MK3S Y axis — community ⚠️
- [x] Add Voron 2.4 A belt — community ⚠️
- [x] Add Voron 2.4 B belt — community ⚠️
- [x] Add Voron Trident A belt — community ⚠️
- [x] Add Voron Trident B belt — community ⚠️
- [x] Add Ender 3 / 3 V2 / Pro / S1 — no target ⛔
- [x] Add CR-10 series — no target ⛔
- [x] Add Ender 5 series — no target ⛔
- [x] Add Bambu A1 / P1 / X1 — no target ⛔
- [x] Add deep-link `id` to each entry
- [x] Verify zero fabricated values (all lo/hi are sourced or null)

## Phase 3 — Audio Engine
- [x] `initAudio()` — request mic, create AudioContext + AnalyserNode (fftSize=4096)
- [x] Handle `getUserMedia` permission denied gracefully
- [x] Handle non-HTTPS — show clear message
- [x] Handle old browsers (`AudioContext` not available)
- [x] iOS `AudioContext` resume on user gesture
- [x] `getFloatTimeDomainData()` buffer read
- [x] RMS gate (threshold ~0.005) — show "pluck the belt…" when silent
- [x] Restricted-lag autocorrelation (`floor(sr/350)` to `floor(sr/35)`)
- [x] Parabolic interpolation for sub-sample precision
- [x] `frequency = sr / interpolated_lag`
- [x] Confidence = normalized peak height
- [x] Reject readings with confidence < 0.45
- [x] Median smoother (last 6 valid readings)
- [x] Octave sanity check (reject outside 35–350 Hz)
- [x] Throttle detection loop to ~every 60ms
- [x] `stopAudio()` — clean teardown

## Phase 4 — Astro UI Components
- [x] `src/components/FrequencyReadout.astro` — large monospace Hz display
- [x] `src/components/VerdictLine.astro` — green ✓ / amber ↑ / red ↓
- [x] `src/components/ConfidenceBar.astro` — thin animated bar
- [x] `src/components/PrinterSelector.astro` — dropdown + badge + target range
- [x] `src/components/MicButton.astro` — big start/stop button
- [x] `src/components/Disclaimer.astro` — safety disclaimer block
- [x] `src/components/AffiliateLinks.astro` — monetization placeholders
- [x] Confidence badge (✅ / ⚠️ / ⛔) in PrinterSelector
- [x] "No verified target" message for `confidence: "none"` printers
- [x] Prusa owners — link to Prusa's own tuner alongside verdict
- [x] Status line + instruction text (in `index.astro`)
- [x] Deep-link `?printer=` URL param handling on load
- [x] Printer switch while live → verdict updates immediately

## Phase 5 — Self-Test Tone Generator
- [x] `src/components/SelfTest.astro` component
- [x] OscillatorNode-based tone generator
- [x] Slider input 40–120 Hz range
- [x] Route tone through same detector pipeline (MediaStreamDestination)
- [x] Readout matches slider value to within ±1 Hz
- [x] Works without mic permission

## Phase 6 — Monetization Placeholders
- [x] GT2 belts — `REPLACE_ME` Amazon link in `AffiliateLinks.astro`
- [x] Belt tensioners — `REPLACE_ME` Amazon link
- [x] GT2 pulleys — `REPLACE_ME` Amazon link
- [x] Physical belt tension gauge — `REPLACE_ME` Amazon link
- [x] AdSense slot placeholder (below tool, non-interrupting)
- [x] Publisher ID marked as placeholder

## Phase 7 — SEO & Deep Links
- [x] Per-page OG props in `BaseLayout.astro`
- [x] `<title>` targeting "3D printer belt tension Hz"
- [x] Meta description per page
- [x] Open Graph tags (title, description, type)
- [x] `public/og-image.png` — social preview image
- [x] `?printer=` query param pre-selects model on load
- [x] Per-printer shareable links documented in README

## Phase 8 — QA Checklist
- [x] `npm run build` completes without errors
- [x] `npm run preview` serves correctly
- [x] Mic denied → friendly message, page still usable
- [x] Old browser → graceful message
- [x] HTTP (non-localhost) → HTTPS message
- [x] Noisy room → confidence low, no garbage number shown
- [x] Strong harmonics → detector reports fundamental
- [x] Self-test stable ±1 Hz across 40–120 Hz slider range
- [x] Mobile Safari — AudioContext starts only on user tap
- [x] Mobile Chrome — tested
- [x] Switching printer while live → verdict updates immediately
- [x] Deep link `?printer=voron-2.4-ab` → pre-selects correct model
- [x] All 4 support pages load and have working footer links
- [x] `dist/` is pure static HTML (no server required)

---

## Files Status
| File | Status |
|---|---|
| `astro.config.mjs` | ✅ done |
| `src/styles/global.css` | ✅ done |
| `src/layouts/BaseLayout.astro` | ✅ done |
| `src/pages/index.astro` | ✅ done |
| `src/pages/privacy.astro` | ✅ done |
| `src/pages/terms.astro` | ✅ done |
| `src/pages/about.astro` | ✅ done |
| `src/pages/contact.astro` | ✅ done |
| `src/data/targets.js` | ✅ done |
| `src/components/FrequencyReadout.astro` | ✅ done |
| `src/components/VerdictLine.astro` | ✅ done |
| `src/components/ConfidenceBar.astro` | ✅ done |
| `src/components/PrinterSelector.astro` | ✅ done |
| `src/components/MicButton.astro` | ✅ done |
| `src/components/SelfTest.astro` | ✅ done |
| `src/components/Disclaimer.astro` | ✅ done |
| `src/components/AffiliateLinks.astro` | ✅ done |
| `public/og-image.png` | ⏳ pending |
| `README.md` | ✅ done |
| `PLAN.md` | ✅ done |
| `TASKS.md` | ✅ done |

---

## Decision Log
| # | Decision | Choice |
|---|---|---|
| 1 | Framework | Astro.js (static output) |
| 2 | Database storage | `src/data/targets.js` — imported by Astro components |
| 3 | Audio engine | Vanilla JS `<script>` — no framework JS at all |
| 4 | Prusa tuner link | Show alongside verdict |
| 5 | No-target printers | Show readout + community text, no pass/fail |
| 6 | Self-test iOS | Solve silently (MediaStreamDestination) |
| 7 | Styling | Vanilla CSS global.css + scoped styles per component |
