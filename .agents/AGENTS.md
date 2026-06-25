# Belt Tuner — Agent Rules (AGENTS.md)

This file defines rules and behavioral constraints for any AI agent working on this project.
Read this file before making any changes to the codebase.

---

## Project Overview

Belt Tuner is a free, Astro.js-powered static site that measures 3D printer belt tension by microphone pitch detection. It is a trust/credibility tool — the accuracy and honesty of the data is the entire value proposition.

---

## Non-Negotiable Rules

### Safety (most important)
1. **NEVER fabricate a belt frequency target.** Over-tensioning a belt damages bearings and motors. If no official or community-verified source exists for a printer model, set `lo: null, hi: null, confidence: "none"`. The UI must then display "No verified frequency target" — never a made-up number.
2. **Badge every database entry:** ✅ Official | ⚠️ Community | ⛔ No target. This is not optional.
3. **The safety disclaimer must always be visible** on the main page. Never hide, minimize, or make it dismissible.

### Data Integrity
4. Every entry in `src/data/targets.js` must have a `source` field. If you add an entry, you must have a real source URL or reference.
5. Before editing any frequency range, re-verify it against the current manufacturer documentation.

### Tech Stack (non-negotiable)
6. **Framework: Astro.js** (`output: 'static'`). No Next.js, no Vite app, no SPA frameworks.
7. **Styling: Vanilla CSS only.** No Tailwind, no CSS-in-JS, no utility frameworks.
8. **Audio engine: Vanilla JS.** Web Audio API only. No audio libraries.
9. **Zero external JS libraries.** No React, no Vue, no Svelte, no lodash, no jQuery in the browser.
10. The `dist/` output must be deployable by dragging a folder to Netlify — no server required.

### Audio Engine Correctness
11. Use **time-domain autocorrelation** for pitch detection — NOT FFT peak-picking.
12. Restrict lag search to `floor(sr/350)` to `floor(sr/35)` — this is the ~35–350 Hz window.
13. Apply **parabolic interpolation** — integer-lag resolution is insufficient for distinguishing 90 Hz from 98 Hz.
14. Apply **median smoothing** over the last 6 readings — not mean.
15. **Confidence gate at 0.45** — never display a reading below this threshold.
16. Throttle detection to ~every 60ms — do not run on every animation frame.

### Privacy
17. Audio is processed **100% locally in the browser**. No audio data, recordings, or microphone samples may ever be sent to a server.
18. The privacy policy must accurately reflect this. If you add any network call, update the privacy policy or remove the call.

---

## Skills Available

Read these files before working on their respective areas:

| Skill | Path | When to use |
|---|---|---|
| Astro.js | `.agents/skills/astro-js/SKILL.md` | Any Astro component, routing, config, or build |
| Web Design Guidelines | `.agents/skills/web-design-guidelines/SKILL.md` | Any UI/CSS/layout work |
| Web Audio API | `.agents/skills/web-audio-api/SKILL.md` | Audio engine, pitch detection, self-test |
| SEO & OG Tags | `.agents/skills/seo-and-og-tags/SKILL.md` | Page `<head>`, titles, descriptions, deep links |
| Vanilla CSS | `.agents/skills/vanilla-css/SKILL.md` | Any CSS work |
| Static Deployment | `.agents/skills/static-site-deployment/SKILL.md` | Deployment, CI/CD, hosting setup |

---

## Checklist Before Every Code Change

- [ ] Have I read the relevant SKILL.md file(s)?
- [ ] Does this change preserve the "never fabricate a frequency" rule?
- [ ] Does the `dist/` output remain a static folder with no server dependency?
- [ ] Is audio still processed locally (no network calls with audio data)?
- [ ] Does `npm run build` still complete without errors?
- [ ] Do all 5 pages still load?
- [ ] Is the safety disclaimer still visible?

---

## Plan & Task Tracking

- Current plan: `PLAN.md` (in project root)
- Task checklist: `TASKS.md` (in project root)
- Update `TASKS.md` as you complete items — mark `[/]` for in-progress, `[x]` for done.

---

## Code Style

- Use CSS custom properties (variables) for all colors, spacing, and font references
- BEM naming for CSS classes: `.block__element--modifier`
- Prefer `const` and `let` over `var`
- Functions should be named, not anonymous (easier to debug on mobile)
- Add a comment above each major audio engine section explaining what it does and why

---

## What NOT to Do

- Do not add any popup, modal, or overlay that blocks the tool
- Do not autoplay any audio
- Do not add login/signup/paywall of any kind
- Do not add npm packages to the browser bundle — check `package.json` before adding
- Do not use `!important` in CSS — restructure specificity instead
- Do not use inline `style=""` except for dynamic values (e.g. confidence bar width)
