# Uzair Khurshid — A Personal Orbit

A playful celestial portfolio: one interactive moon, a continuous camera journey, and a restrained fantasy-game interface.

## Run

```bash
npm ci
npm run dev
```

Local preview: http://127.0.0.1:3000
Checks: `npm run lint`, `npm run build`.

## Design direction — August 31, 2026

The user's priority is awe and exploration, not a conventional sales portfolio. The previous image-based version felt generic, artificial in motion, and disconnected. This redesign removes those landscape sections from the active route.

- Arrival: one large moon and Uzair Khurshid's name.
- Atlas: select Systems, Experiments, or Origins to explore projects.
- Maker: a brief personal background in the same celestial space.
- Signal: approach the lunar horizon and make contact.
- Style: dark celestial blue, silver, subdued brass; Cinzel, Cormorant Garamond, Instrument Serif, Geist.
- References studied: Genshin's official site, Rebelliously Optimistic, Zainab Kabira, Momento Legal. No artwork or source code copied from these sites.

## Architecture

- `components/celestial/CelestialPortfolio.tsx`: semantic content, controls, scroll state, mobile structure.
- `components/celestial/createMoonWorld.ts`: client-loaded Three.js scene, one textured sphere, orbital lines, seeded stars, camera keyframes, drag handling, disposal.
- `components/celestial/cameraPath.ts`: continuous camera spline with shared waypoint velocities. Run `node scripts/test-camera-path.mjs` on Node 22.18+ to check waypoint continuity, bounds, and surface clearance.
- `components/celestial/celestial.module.css`: scoped visual system and responsive/reduced-motion layouts.
- `components/motion/CinematicScrollProvider.tsx`: Lenis and GSAP scroll synchronization.
- The legacy section components remain on disk, but are not imported by the active page.

Moon dragging and rotation buttons work independently of ambient motion. The light slider changes the key-light direction. The pause control pauses ambient rotation; deliberate scroll and drag interaction remain available. OS reduced-motion disables the camera journey and automatic rotation. Inactive tabs do not render scene frames. Canvas resolution is capped to reduce GPU cost.

The interface never waits behind a blocking loading screen. A CSS moon remains visible until textures are ready; WebGL failure retains that fallback and all portfolio content.

The camera timeline uses measured section positions rather than assuming fixed viewport-height sections. Resize and font changes refresh those measurements. Orbital lines fade through the journey; rotation and light controls settle smoothly, including while ambient motion is paused. Reduced-motion makes manual controls immediate. The moon uses restrained surface relief and directional lighting rather than heavy postprocessing.

## Assets and credit

The moon uses real lunar maps from NASA's Scientific Visualization Studio, CGI Moon Kit (Ernie Wright; LRO/LROC/LOLA data). These are aesthetics-oriented rendering maps, not scientific measurements in this website.

Source: https://svs.gsfc.nasa.gov/4720/
- `public/moon-color.jpg`: https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_2k.jpg
- `public/moon-height.jpg`: https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/ldem_3_8bit.jpg

Combined texture delivery: approximately 570 KB. All rendering is local to the browser. No paid service or generated landscape is used in the active scene.

## Still needed

Real project screenshots, recordings, repository/demo destinations, and descriptions from Uzair. Current project descriptions preserve the existing portfolio information; no outcomes or proof have been invented. Until verified project links are supplied, project actions open an email draft.

## Recovery and publishing

The previous local design's source/configuration files were copied to:
`C:/Users/uzair/Projects/portfolio-checkpoints/before-celestial-2026-08-31`

Backup filenames replace directory separators with double underscores. Original artwork remains in `public`.
The active redesign is maintained on `main` in https://github.com/espresso-gg/uzair-portfolio.
To continue on another computer, clone that repository, run `npm ci`, then `npm run dev`.
The local recovery folder above is not included in Git. Deployment is managed separately through the repository's Vercel integration.
