---
name: web-design-guidelines
description: Modern web design system — dark mode, typography, color palettes, spacing, micro-animations, mobile-first layout, accessibility, and glassmorphism. Use this skill when building or reviewing any UI/UX work on this project.
---

# Web Design Guidelines Skill

Source: MDN Web Docs, Google Material Design 3, Web.dev, A11y Project

---

## Design Philosophy for Belt Tuner

The user is **standing at their printer holding a phone**. Every design decision must serve that context:
- Big tap targets (minimum 48×48px)
- High contrast (outdoor legible)
- Dark mode (reduces eye strain, saves OLED battery)
- Instant load (no layout shift)
- One-handed portrait use

---

## Checklist

### Color System
- [ ] Define CSS custom properties (variables) for the entire palette — never hardcode colors
- [ ] Use HSL for palette — allows easy lightness/saturation tweaks
- [ ] Minimum contrast ratio 4.5:1 for text (WCAG AA), 7:1 preferred (WCAG AAA)
- [ ] Semantic color tokens: `--color-success`, `--color-warning`, `--color-danger`, `--color-neutral`
- [ ] Verdict colors: green (#22c55e / hsl(142, 71%, 45%)), amber (#f59e0b), red (#ef4444)

```css
:root {
  /* Base palette */
  --bg-base:       hsl(220, 15%, 8%);
  --bg-surface:    hsl(220, 14%, 12%);
  --bg-elevated:   hsl(220, 12%, 16%);
  --border:        hsl(220, 10%, 22%);

  /* Text */
  --text-primary:   hsl(220, 20%, 95%);
  --text-secondary: hsl(220, 10%, 60%);
  --text-muted:     hsl(220, 8%, 40%);

  /* Semantic */
  --color-success: hsl(142, 71%, 45%);
  --color-warning: hsl(38, 92%, 50%);
  --color-danger:  hsl(0, 84%, 60%);
  --color-accent:  hsl(217, 91%, 60%);

  /* Typography */
  --font-sans:  'Inter', system-ui, sans-serif;
  --font-mono:  'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing scale (4px base) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1.25rem;
  --radius-full: 9999px;
}
```

### Typography
- [ ] Import from Google Fonts: `Inter` (UI) + `JetBrains Mono` (readout)
- [ ] Use `font-display: swap` to avoid FOUT
- [ ] Base size: 16px, scale: 1.25 (Major Third)
- [ ] Line height: 1.5 for body, 1.2 for headings
- [ ] The frequency readout is the hero — use `font-size: clamp(3rem, 15vw, 6rem)`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
```

### Layout — Mobile First
- [ ] Base styles target 375px (iPhone SE) portrait
- [ ] Use `max-width: 480px; margin: 0 auto; padding: 1rem` for the tool container
- [ ] Tap targets: minimum `min-height: 48px; min-width: 48px`
- [ ] The Start/Stop button: `min-height: 64px; font-size: 1.125rem`
- [ ] No horizontal scroll at any viewport width

### Micro-Animations
- [ ] Confidence bar: `transition: width 0.15s ease`
- [ ] Verdict line color change: `transition: color 0.2s ease, background 0.2s ease`
- [ ] Frequency readout: NO animation — numbers must be readable, not blurry
- [ ] Button active state: `transform: scale(0.97); transition: transform 0.1s`
- [ ] Respect `prefers-reduced-motion`: wrap animations in `@media (prefers-reduced-motion: no-preference)`

```css
@media (prefers-reduced-motion: no-preference) {
  .confidence-bar { transition: width 0.15s ease; }
  .verdict { transition: color 0.2s ease; }
}
```

### Glassmorphism (for cards/panels)
```css
.card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
}
```

### Accessibility
- [ ] All form controls have `<label>` elements
- [ ] Color is never the ONLY indicator (always pair with text/icon)
- [ ] Focus rings: `outline: 2px solid var(--color-accent); outline-offset: 2px`
- [ ] `aria-live="polite"` on frequency readout (screen reader updates)
- [ ] `aria-label` on icon-only buttons
- [ ] Tab order follows visual order (no `tabindex > 0`)
- [ ] Keyboard: Space/Enter activates the mic button

### Prominent Elements — Priority Order
1. Frequency readout (largest element on page)
2. Verdict line (second largest, color-coded)
3. Start/Stop button (large, always visible)
4. Printer selector (prominent but secondary)
5. Confidence bar (small, supporting info)

### Safety Disclaimer Styling
- Amber/orange background, not red (informational, not error)
- Border: `border-left: 4px solid var(--color-warning)`
- Never dismissible — always visible

---

## References
- MDN CSS: https://developer.mozilla.org/en-US/docs/Web/CSS
- Web.dev contrast: https://web.dev/color-and-contrast-accessibility/
- A11y Project: https://www.a11yproject.com/checklist/
- Google Fonts: https://fonts.google.com/specimen/Inter
