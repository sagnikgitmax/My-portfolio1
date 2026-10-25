# Sagnik Ghosh — Portfolio

A zero-build, two-file portfolio:

- `index.html` — all markup and CSS
- `app.js` — the animation/interaction engine

There is no build step: open `index.html` directly, or drop the folder on any static host. Keep both
files together.

## Before you publish

Contact details are already wired: **Sagnik Ghosh** · `work.contactmax@gmail.com` (the email link opens
`mailto:` and also copies the address on click). The Education card shows **Holy Cross School ·
ISC · Class XII**.

One optional content gap:

- **Project links.** "App Lock" and "AI-assisted mini apps" have no public URL, so those cards are not
  links. Add an `href` to the arrow once they're published.

LinkedIn and GitHub already point at your profiles (`CONFIG` at the top of `app.js`).

## Deploying

### GitHub Pages (free, ~2 minutes)

```bash
git init
git add index.html app.js README.md
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/sagnikgitmax/sagnikgitmax.github.io.git
git push -u origin main
```

The repo must be named **`sagnikgitmax.github.io`**, then the site is live at
`https://sagnikgitmax.github.io/` within a minute or two, with no build step.

Alternatively: **Netlify** or **Vercel** → drag the folder onto the dashboard. No config needed.

## What's inside

- **Sticky scroll showcase** — the Safeguard card starts tilted back and flattens as you scroll
  (disabled below 980px where it becomes a normal section).
- **Interactive 3D hardware scene** — three.js loads lazily (only when the section is near the viewport)
  and builds the Safeguard prototype the way it actually looks on a bench: a breadboard with a drilled
  hole grid and red/blue power rails, an ESP32 dev board with headers and a metal shield, a blue GPS
  board with a white ceramic patch, a piezo siren, a red SOS button and a LiPo pouch, all joined by
  multicoloured jumper wires, with the phone floating on the end of a long teal lead. It tilts with the
  pointer, modules pop and explain themselves on hover, a white LED light follows the cursor, and a
  tight contact shadow sits under the board. The three.js download starts while the hero is on screen,
  so the card is usually ready as soon as you reach it. If WebGL or the CDN is unavailable, a bright
  breadboard illustration of the same modules takes its place — still hoverable, still explaining each
  part — and a status chip says why. The chip only appears when the build is genuinely slow
  ("Preparing 3D view").
- **Custom cursor** — dot + lagging ring that grows and shows a label over interactive elements.
  Only enabled for precise pointers; touch devices keep the native experience.
- **Aurora background** — a 20%-resolution canvas upscaled by the browser (no CSS blur), blobs gently
  pulled toward the cursor.
- **Particle constellation** — links are batched into a single path so the cost stays flat.
- **Reversing marquees** — the giant band and the two skill rows change direction with your scroll
  direction (and speed up with scroll velocity), then drift while idle.
- **Radar** — one conic-gradient sweep at ~15 s per revolution, so it reads as scanning instead of
  spinning like a fan.
- **Spotlight + 3D tilt** on cards, magnetic buttons, scroll progress bar, scrollspy nav,
  animated counters, scramble-in section titles.
- **`prefers-reduced-motion`** is respected: all continuous animation stops and content renders statically.
- **No dependencies** except Google Fonts (Plus Jakarta Sans, JetBrains Mono) and three.js from a CDN
  for the 3D scene only.

## Editing content

All copy is plain HTML inside `<main>`. Sections are marked with `<!-- ===== NAME ===== -->` comments.
Colours and spacing are CSS variables at the top of the `<style>` block:

```css
--bg:#05080f; --ink:#eaf1f8; --muted:#93a4b8;
--teal:#14b8a6; --aqua:#7fd6d0; --deep:#0f766e;
```

The palette is taken from your resume design (dark navy `#14213D`, teal `#0F766E`, mint `#7FD6D0`),
tuned for a dark site.

## Performance notes

Everything runs from **one `requestAnimationFrame` loop** instead of five competing ones:

| work | budget |
| --- | --- |
| cursor / marquees / card tilt | every frame (transform-only writes) |
| aurora canvas | 20 fps at 20% resolution |
| particle field + radar | 30 fps, and only while visible |
| three.js scene | 45 fps, and only while in view |

Other choices that keep scrolling smooth in Chrome:

- card spotlights are a fixed 460 px blob moved with `transform` (no `background` repaints);
- the scroll progress bar animates `transform: scaleX()` instead of `width`;
- the nav blur is 10 px, the full-screen grain blend is gone, and the hero glow is a static gradient;
- the radar and particle loops pause off-screen, and everything pauses when the tab is hidden;
- particle links are one batched path, and the particle count scales with viewport area;
- the 3D shadow map refreshes every other frame, and the tiny header pins are excluded from it;
- the 3D engine prefetches while idle, the first shader compile is capped at 3 s, and a software
  renderer (SwiftShader/llvmpipe) automatically drops the environment map, shadows and pixel ratio.

Measured in headless Edge at 1440×900 while scrolling: ~28% less main-thread task time and ~58% less
script time than the first version, with 0 frames over 32 ms. (Absolute frame rates vary a lot between
headless runs, so the numbers to trust are the long-frame count — it stays at zero.)
