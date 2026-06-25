---
name: web-audio-api
description: Web Audio API — getUserMedia, AudioContext, AnalyserNode, autocorrelation pitch detection, OscillatorNode, and mobile/iOS quirks. Use this skill when working on the audio engine or self-test generator.
---

# Web Audio API Skill

Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

---

## Overview

The Web Audio API provides the entire audio pipeline for Belt Tuner:
- `getUserMedia` → microphone access
- `AudioContext` + `AnalyserNode` → signal processing
- `getFloatTimeDomainData` → raw samples for autocorrelation
- `OscillatorNode` + `MediaStreamDestination` → self-test tone

---

## Checklist

### Environment Checks (MUST run before anything else)
- [ ] Check `navigator.mediaDevices?.getUserMedia` exists — old browser fallback
- [ ] Check `window.AudioContext || window.webkitAudioContext` — Safari prefix
- [ ] Check `location.protocol === 'https:' || location.hostname === 'localhost'` — HTTPS gate
- [ ] Show clear error messages for each failure mode, do NOT silently break

```js
function checkEnvironment() {
  if (!window.AudioContext && !window.webkitAudioContext) {
    return { ok: false, msg: 'Your browser does not support Web Audio API. Try Chrome or Firefox.' };
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    return { ok: false, msg: 'Microphone access not available. Try Chrome or Firefox.' };
  }
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    return { ok: false, msg: 'Microphone requires HTTPS. Please use a secure connection.' };
  }
  return { ok: true };
}
```

### AudioContext Setup
- [ ] Create `AudioContext` ONLY inside a user gesture handler (button click) — required by iOS
- [ ] If context state is `'suspended'`, call `ctx.resume()` — iOS autoplay policy
- [ ] Use `const AudioCtx = window.AudioContext || window.webkitAudioContext`

```js
let audioCtx = null;

async function initAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!audioCtx) {
    audioCtx = new AudioCtx();
  }
  // iOS: must resume after user gesture
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
  // ...
}
```

### AnalyserNode Configuration
- [ ] `fftSize = 4096` — gives 4096 time-domain samples (required for 35Hz detection)
- [ ] No `smoothingTimeConstant` adjustment needed for time-domain data
- [ ] Use `getFloatTimeDomainData` (NOT `getByteTimeDomainData`) — float precision required

```js
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 4096;
const buf = new Float32Array(analyser.fftSize);

// In the detection loop:
analyser.getFloatTimeDomainData(buf);
```

### Microphone Pipeline
```js
const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
const source = audioCtx.createMediaStreamSource(stream);
source.connect(analyser);
// DO NOT connect analyser to audioCtx.destination (would cause feedback)
```

### RMS Gate
- [ ] Compute RMS of buffer; if below ~0.005, show "pluck the belt…" and skip detection

```js
function computeRMS(buf) {
  let sum = 0;
  for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
  return Math.sqrt(sum / buf.length);
}
const rms = computeRMS(buf);
if (rms < 0.005) { showPrompt('Pluck the belt…'); return; }
```

### Autocorrelation Pitch Detection
- [ ] Search lags from `Math.floor(sr/350)` to `Math.floor(sr/35)` ONLY
- [ ] Normalize by `c[0]` (energy at lag=0)
- [ ] Find lag with highest normalized correlation

```js
function detectPitch(buf, sr) {
  const n = buf.length;
  const minLag = Math.floor(sr / 350);
  const maxLag = Math.floor(sr / 35);

  let c0 = 0;
  for (let i = 0; i < n; i++) c0 += buf[i] * buf[i];
  if (c0 === 0) return null;

  let bestLag = -1, bestVal = -Infinity;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let c = 0;
    for (let i = 0; i < n - lag; i++) c += buf[i] * buf[i + lag];
    const norm = c / c0;
    if (norm > bestVal) { bestVal = norm; bestLag = lag; }
  }

  // Parabolic interpolation for sub-sample precision
  if (bestLag > minLag && bestLag < maxLag) {
    const y1 = /* c[bestLag-1] / c0 */ getPeakVal(buf, bestLag - 1, c0, n);
    const y2 = bestVal;
    const y3 = /* c[bestLag+1] / c0 */ getPeakVal(buf, bestLag + 1, c0, n);
    const delta = (y3 - y1) / (2 * (2 * y2 - y1 - y3));
    bestLag += delta;
  }

  const freq = sr / bestLag;
  if (freq < 35 || freq > 350) return null; // sanity check
  return { freq, confidence: bestVal };
}
```

### Parabolic Interpolation Helper
```js
function getPeakVal(buf, lag, c0, n) {
  let c = 0;
  for (let i = 0; i < n - lag; i++) c += buf[i] * buf[i + lag];
  return c / c0;
}
```

### Confidence & Smoothing
- [ ] Reject readings where `confidence < 0.45`
- [ ] Keep circular buffer of last 6 valid readings
- [ ] Display **median** of the buffer (not mean — median is robust to outliers)

```js
const readings = [];
const BUFFER_SIZE = 6;

function addReading(freq) {
  readings.push(freq);
  if (readings.length > BUFFER_SIZE) readings.shift();
  return median(readings);
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
```

### Detection Loop Throttling
- [ ] Do NOT run autocorrelation every animation frame (~60fps = too expensive on mobile)
- [ ] Throttle to every 60ms

```js
let lastDetect = 0;

function loop() {
  requestAnimationFrame(loop);
  const now = performance.now();
  if (now - lastDetect < 60) return;
  lastDetect = now;
  analyser.getFloatTimeDomainData(buf);
  // ... run detection
}
```

### Self-Test: OscillatorNode through Detector
- [ ] Create `OscillatorNode` + `MediaStreamDestination`
- [ ] Route oscillator → destination → MediaStreamSource → analyser
- [ ] This lets the same `detectPitch()` function see the test tone

```js
async function startSelfTest(freq) {
  const osc = audioCtx.createOscillator();
  const dest = audioCtx.createMediaStreamDestination();
  osc.frequency.value = freq;
  osc.connect(dest);

  const source = audioCtx.createMediaStreamSource(dest.stream);
  source.connect(analyser);
  osc.start();
  return osc; // caller stores ref to call osc.stop() later
}
```

### Teardown
- [ ] Stop all MediaStreamTracks when mic is stopped
- [ ] Disconnect nodes
- [ ] Optionally close/suspend AudioContext

```js
function stopAudio(stream, source) {
  stream.getTracks().forEach(t => t.stop());
  source.disconnect();
  // audioCtx.suspend(); // optional — allows restart without new permissions
}
```

---

## References
- MDN AudioContext: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
- MDN AnalyserNode: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
- MDN getUserMedia: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- MDN OscillatorNode: https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode
