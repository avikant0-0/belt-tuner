---
name: vanilla-css
description: Vanilla CSS design system patterns — custom properties, BEM naming, responsive layout with CSS Grid/Flexbox, component patterns, and scoped styles in Astro. Use this skill when writing any CSS for this project.
---

# Vanilla CSS Skill

Source: https://developer.mozilla.org/en-US/docs/Web/CSS | https://web.dev/learn/css/

---

## Overview

This project uses **vanilla CSS only** — no Tailwind, no CSS-in-JS, no utility frameworks. CSS lives in:
- `src/styles/global.css` — design tokens + reset + global base styles
- Per-component `<style>` blocks in `.astro` files (automatically scoped by Astro)

---

## Checklist

### global.css Structure
- [ ] CSS reset (box-sizing, margins)
- [ ] CSS custom properties (design tokens)
- [ ] Base typography
- [ ] Reusable utility classes (minimal)
- [ ] Global component styles that span multiple pages

### Reset
```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-base);
  color: var(--text-primary);
  line-height: 1.5;
  min-height: 100vh;
}

img, video {
  max-width: 100%;
  display: block;
}

button, input, select {
  font: inherit;
}
```

### BEM Naming Convention
Use BEM (Block__Element--Modifier) for component classes:
```css
/* Block */
.frequency-readout {}

/* Element */
.frequency-readout__value {}
.frequency-readout__label {}

/* Modifier */
.frequency-readout--active {}
.frequency-readout--silent {}
```

### Key Component Patterns

#### Frequency Readout
```css
.frequency-readout {
  font-family: var(--font-mono);
  font-size: clamp(3rem, 15vw, 6rem);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  text-align: center;
  line-height: 1;
  aria-live: polite; /* set in HTML */
}

.frequency-readout--silent {
  color: var(--text-muted);
  font-size: clamp(1.25rem, 5vw, 1.5rem);
}
```

#### Verdict Line
```css
.verdict {
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.verdict--in-range {
  color: var(--color-success);
  background: hsl(142, 71%, 10%);
}

.verdict--too-loose {
  color: var(--color-warning);
  background: hsl(38, 92%, 10%);
}

.verdict--too-tight {
  color: var(--color-danger);
  background: hsl(0, 84%, 10%);
}

.verdict--no-target {
  color: var(--text-secondary);
  background: transparent;
}
```

#### Confidence Bar
```css
.confidence-bar {
  width: 100%;
  height: 4px;
  background: var(--bg-elevated);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.confidence-bar__fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: var(--radius-full);
  transition: width 0.15s ease;
  /* width set via inline style: style="width: 73%" */
}
```

#### Big Button
```css
.btn-mic {
  width: 100%;
  min-height: 64px;
  font-size: 1.125rem;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  transition: transform 0.1s, background 0.2s;
}

.btn-mic--start {
  background: var(--color-accent);
  color: white;
}

.btn-mic--stop {
  background: var(--color-danger);
  color: white;
}

.btn-mic:active {
  transform: scale(0.97);
}

/* Focus ring for keyboard users */
.btn-mic:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
```

#### Safety Disclaimer
```css
.disclaimer {
  border-left: 4px solid var(--color-warning);
  background: hsl(38, 92%, 8%);
  padding: var(--space-4);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
```

#### Badge (confidence level)
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
}

.badge--official {
  background: hsl(142, 71%, 10%);
  color: var(--color-success);
  border: 1px solid hsl(142, 71%, 20%);
}

.badge--community {
  background: hsl(38, 92%, 10%);
  color: var(--color-warning);
  border: 1px solid hsl(38, 92%, 20%);
}

.badge--none {
  background: var(--bg-elevated);
  color: var(--text-muted);
  border: 1px solid var(--border);
}
```

### Responsive Layout
```css
.tool-container {
  max-width: 480px;
  margin: 0 auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  min-height: 100vh;
}

/* Larger screens — slightly more breathing room */
@media (min-width: 600px) {
  .tool-container {
    padding: var(--space-8);
  }
}
```

### Astro Scoped Styles
In `.astro` files, `<style>` is scoped automatically — class names get a unique hash:
```astro
<style>
  /* This .card only applies to THIS component */
  .card {
    background: var(--bg-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
  }
</style>
```

For global overrides from within a component:
```astro
<style>
  :global(body) {
    overflow-x: hidden;
  }
</style>
```

### Print Styles
```css
@media print {
  .btn-mic,
  .confidence-bar,
  .affiliate-links { display: none; }
}
```

---

## References
- MDN CSS Reference: https://developer.mozilla.org/en-US/docs/Web/CSS
- Web.dev Learn CSS: https://web.dev/learn/css/
- CSS Custom Properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- BEM Methodology: https://getbem.com/
