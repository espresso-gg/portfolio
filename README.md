# Uzair Khurshid — Continuous Lunar Portfolio

A cinematic Next.js portfolio prototype built as one continuous Lenis-controlled camera journey.

## Journey

The six-screen pinned sequence moves through these connected phases:

1. Distant moonlit landscape
2. Camera approach toward the same persistent moon
3. Compressed intergalactic passage
4. Close lunar orbit with portfolio disciplines around the moon
5. Descent as the moon expands beyond the camera
6. Lunar-surface destination and contact invitation

The journey does not swap pages or manage video playback state. A single Lenis scroll value drives every scene variable, so forward scrolling, reverse scrolling, anchor navigation, and refresh restoration remain deterministic.

## Architecture

- `CinematicScrollProvider` owns the global Lenis instance and synchronizes it with the GSAP ticker.
- `LunarJourney` maps Lenis scroll progress into approach, passage, orbit, descent, and surface ranges.
- A persistent CSS moon remains spatially continuous across the journey.
- Landscape, stars, orbital geometry, typography, and surface artwork are composited in one sticky viewport.
- The surface destination uses a dedicated project artwork rather than procedural placeholder mountains.
- Reduced-motion mode removes the warp treatment and decorative animation.

## Commands

```bash
npm run dev
npm run lint
npm run build
```

Local development runs at [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Production direction

The code-native journey is stable and reversible. A future visual upgrade can replace the CSS passage with two purpose-built transition clips or a WebGL camera layer, provided scroll progress remains the sole source of truth.
