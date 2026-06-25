# Belt Tuner

A free, Astro.js-powered static site for measuring 3D printer belt tension via microphone pitch detection.

## How to Add a Printer

1. Open `src/data/targets.js`.
2. Add a new object to the exported array with the following structure:
   ```javascript
   {
     id: "manufacturer-model-axis",
     name: "Manufacturer Model — Axis",
     lo: 90, // Lower bound frequency in Hz
     hi: 95, // Upper bound frequency in Hz
     confidence: "official", // "official" | "community" | "none"
     source: "https://link-to-source.com",
     notes: "Any specific instructions on where to position the carriage before plucking."
   }
   ```
   *Note: Never fabricate a frequency. If there is no known target, set `lo: null`, `hi: null`, and `confidence: "none"`.*

## Shareable Deep Links
You can link directly to a specific printer by appending `?printer=id` to the URL. For example:
`https://belttuner.com/?printer=prusa-core-one-xy`

## Deployment

This project uses Astro with `output: 'static'`.
1. Run `npm install`
2. Run `npm run build`
3. Drag and drop the `dist/` folder to Netlify, Cloudflare Pages, or GitHub Pages.
