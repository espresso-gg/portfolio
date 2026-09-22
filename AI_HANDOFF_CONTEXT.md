# Portfolio Website — AI Handoff Context

Last updated: September 22, 2026

## 1. Purpose of this document

This file is the working handoff for another AI or developer continuing the portfolio. It explains:

- how the application actually runs;
- which files control the visible website;
- how the scroll-driven Kuhenkki animation works;
- how the footer evolved and what the current design direction is;
- which performance problems were found and how they were addressed;
- constraints and decisions that should be preserved;
- how to run and verify the project safely.

Read this before editing the footer, the long scroll trail, or the shared navigation.

---

## 2. Project runtime and architecture

### Technology

- Next.js `16.2.10`
- React `19.2.6`
- TypeScript
- A large static portfolio implementation inside `public/reference/index.html`
- Shared static CSS in `public/css/site.css`
- Shared browser behavior and Web Components in `public/js/site.js`

### Important architectural detail

The visible homepage is **not rendered directly by the React components** in `src/components/`.

`src/app/page.tsx` renders a full-viewport iframe:

```tsx
<iframe src="/reference/index.html" />
```

Therefore, most visible changes must be made in:

- `public/reference/index.html`
- `public/css/site.css`
- `public/js/site.js`

Editing `src/components/portfolio-experience.tsx` will not change the currently displayed homepage unless the iframe architecture is removed.

### Asset routing

`next.config.ts` rewrites `/assets/*` to the original remote asset host:

```ts
{ source: "/assets/:path*", destination: "https://zainabkabira.com/assets/:path*" }
```

Locally owned visual assets used by the Kuhenkki work live in `public/hero/`, including:

- `lunar-spirit.webp` — the Kuhenkki sprite;
- `moon-blossom.webp` — the small glowing flower used for the trail and shoreline;
- testimonial lunar background exports, retained for other sections but no longer used by the footer.

### Shared Web Components

`public/js/site.js` defines:

- `<site-nav>` through `SiteNav`;
- `<site-footer>` through `SiteFooter`.

The footer HTML is stored in the `FOOTER_HTML` template string. `SiteFooter.connectedCallback()` inserts the markup and initializes footer behavior.

---

## 3. Local development

Install dependencies if needed, then run:

```bash
npm run dev -- --port 3000
```

The website is available at:

```text
http://localhost:3000
```

The iframe source can be inspected directly at:

```text
http://localhost:3000/reference/index.html
```

Useful checks:

```bash
node --check public/js/site.js
npx eslint public/js/site.js
npm run build:next
```

`npm run build:next` has been verified successfully after the latest footer work.

The repository-wide ESLint command also scans generated and unrelated directories and currently produces pre-existing warnings/errors. Targeted linting of `public/js/site.js` is more useful for this feature area. At the time of this handoff it has no errors and three existing unused-variable warnings, including an unused legacy `initGarden()` function.

### Next.js repository instruction

This project contains an `AGENTS.md` warning that this Next.js version differs from older conventions. Before changing Next.js APIs or structure, read the relevant guide under:

```text
node_modules/next/dist/docs/
```

The current footer work is static HTML/CSS/JS and does not rely on a new Next.js API.

---

## 4. Existing long-page Kuhenkki trail

The portfolio already had a scroll-driven Kuhenkki that travels through the main page.

### Markup and styling

The main trail is in `public/reference/index.html` around the `.plane-fly` section. Important elements include:

- `.plane-fly`
- `.plane-trail`
- `#planeMotionPath`
- `#planeTrailPath`
- `.plane-blossoms`
- `.plane-sprite`

The sprite source is:

```text
/hero/lunar-spirit.webp
```

The trail uses SVG path geometry. JavaScript samples points and tangents from the path, aligns the sprite to the direction of travel, and reveals moon-blossom markers as the user scrolls.

### Main-page scroll scheduler

`public/reference/index.html` defines a global `window.Scroll` scheduler. It batches scroll work into one `requestAnimationFrame`, performs layout reads before writes, and provides cached helpers such as:

- `Scroll.add(fn)`
- `Scroll.rect(element)`
- `Scroll.y()`
- `Scroll.vh()`
- `Scroll.vw()`
- `Scroll.kick()`

New scroll-driven work should use this scheduler. Do not add independent high-frequency scroll listeners that call `getBoundingClientRect()` and write styles in the same frame.

### Relationship to the footer

The main SVG trail ends before the footer. The footer uses a second sprite instance to create a visual continuation. It is intentionally a handoff rather than one enormous page-spanning SVG path. This keeps the footer implementation isolated and makes its responsive geometry manageable.

---

## 5. Current footer direction: Celestial Lake

### Design goal

The footer should feel like a quiet conclusion, not another showcase section.

The current direction is:

- a nearly black navy night sky;
- sparse, static stars;
- one small crescent;
- a restrained horizon glow;
- a broad reflective lake occupying the lower portion;
- a thin shoreline of Nod-Krai-inspired luminous flowers;
- a single Kuhenkki descent and droplet impact;
- a compact CTA and restrained social bar.

The memorable moment is the landing ripple, not the amount of scenery.

### Current footer markup

The template is in `public/js/site.js` under `FOOTER_HTML`.

The main scene elements are:

```html
<div class="ft-nodkrai-scene">
  <div class="ft-stars"></div>
  <div class="ft-horizon-glow"></div>
  <div class="ft-crescent"></div>
  <div class="ft-lake"><i></i></div>
  <div class="ft-lumen-field"></div>
  <div class="ft-kuhenkki-arrival">...</div>
</div>
```

The CTA is deliberately separated from the heading:

```html
<h2 class="ft-head">Shall we make something unforgettable?</h2>
<button class="ft-lake-cta" data-contact-open>Work with me</button>
```

`data-contact-open` is handled through delegated click behavior in `site.js`, so the CTA opens the existing contact drawer.

### Current styling

The current footer-specific CSS starts at the comment:

```css
CELESTIAL LAKE FINALE
```

in `public/css/site.css`.

The design uses gradients rather than a new full-screen image. This is intentional for both restraint and performance.

Key classes:

- `.footer.ft-nodkrai` — overall palette and background;
- `.ft-nodkrai-scene` — isolated paint/layout container;
- `.ft-stars` — static star tile made from radial gradients;
- `.ft-crescent` — CSS crescent;
- `.ft-horizon-glow` — subtle light above the waterline;
- `.ft-lake` — water surface and horizontal reflections;
- `.ft-lumen-field` — thin flower shoreline;
- `.ft-lake-cta` — compact contact action;
- `.ft-impact` and children — droplet, splash, ripples, and sparks.

### Responsive behavior

Desktop:

- the CTA content remains centered above the horizon;
- the headline stays on one line when space permits;
- the lake occupies roughly the lower 44%;
- flowers form a sparse line close to the footer base.

Mobile:

- the headline wraps into a centered three-line lockup;
- the lake uses roughly the lower 45%;
- the flower shoreline is lifted above the social navigation;
- the crescent is smaller and shifts toward the left edge;
- the CTA becomes a compact pill;
- the final resting footer has no continuously running animations.

Desktop and mobile were visually captured and checked after implementation.

---

## 6. Footer Kuhenkki landing and droplet effect

### Initialization

`SiteFooter.connectedCallback()` calls:

```js
initFooterGrow();
initKuhenkkiLanding();
initReveal(this);
```

The former `initGarden()` call was removed. The function still exists as unused legacy code, but it is not executed.

### `initKuhenkkiLanding()`

This function lives in `public/js/site.js`.

It performs four tasks:

1. Generates a deterministic, sparse flower shoreline.
2. Generates nine trail blossoms.
3. Calculates a cubic Bézier flight path inside the footer.
4. Triggers a time-based impact sequence when the scroll reaches the landing threshold.

### Deterministic flowers

A seeded pseudo-random generator keeps the shoreline composition stable between reloads.

Current counts:

- 26 flowers on desktop;
- 18 flowers on mobile.

Avoid increasing this back to a dense field without measuring performance.

### Flight geometry

The path is expressed as a cubic curve with four points. Geometry is recalculated only when the footer size changes. Flower trail positions are also written only during that geometry setup.

During normal scrolling, the code updates:

- the Kuhenkki transform and opacity;
- at most nine trail blossom opacity values;
- the impact trigger state.

This is much cheaper than recalculating and rewriting every blossom position per frame.

### Why the droplet is time-based

The first implementation tied the entire impact to a narrow scroll-progress range. Fast scrolling could skip the visible transition, making Kuhenkki appear to simply vanish.

The corrected version triggers a guaranteed one-shot animation when progress crosses the threshold:

```js
if (p >= 0.8) triggerImpact();
```

`triggerImpact()` adds `.is-impacting` for 1.35 seconds, then changes the state to `.impact-settled`.

The sequence is:

1. Kuhenkki contracts and fades.
2. A blue-white droplet becomes visible above the lake.
3. The droplet falls and stretches.
4. It squashes against the surface.
5. A narrow splash rises.
6. Two elliptical ripples expand.
7. Three particles scatter.
8. A subtle resting ripple/glow remains.

Scrolling upward past the reset threshold rearms the impact so it can play again.

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- the travelling spirit and trail blossoms are hidden;
- the impact rests in a subtle static state;
- no landing animation is required.

Preserve this behavior.

---

## 7. Performance history and decisions

### Heavy version that was rejected

An earlier footer iteration used:

- the testimonial lunar background repeated as a full-screen footer backdrop;
- an animated aurora;
- a large spiral portal;
- a remote meadow image;
- 76 procedural flower images on desktop;
- 20 generated SVG garden plants;
- per-plant sway animations;
- animated filters and drop shadows;
- a watering-can cursor and particle system;
- 15 trail blossoms with position writes on every scroll frame.

It looked visually dense and stuttered while entering the footer.

Do **not** restore that approach.

### Performance fixes already made

- Removed `initGarden()` from footer initialization.
- Removed the generated garden DOM from `FOOTER_HTML`.
- Removed the watering interaction from the rendered footer.
- Replaced the repeated full-screen artwork with gradients.
- Removed the portal and large meadow layer.
- Reduced the shoreline to 26/18 flowers.
- Reduced flight blossoms from 15 to 9.
- Removed per-flower infinite animations.
- Removed large per-flower filters and blend modes.
- Moved trail position calculations out of the normal scroll loop.
- Added `contain: layout paint style` to `.ft-nodkrai-scene`.
- Converted the impact to a short one-shot compositor-friendly sequence using primarily transform and opacity.
- Kept the resting footer at zero continuously running animations in the final visual check.

### Future performance guidance

If additional detail is requested:

1. Prefer one flattened WebP/AVIF backdrop over dozens of animated elements.
2. Animate a parent layer rather than individual flowers.
3. Use transform and opacity only during scroll whenever possible.
4. Avoid animating `filter`, `box-shadow`, `blur`, large gradients, or `mix-blend-mode` during scrolling.
5. Keep scroll reads inside the shared `Scroll` read phase.
6. Recalculate geometry on resize, not every frame.
7. Profile before increasing flower or particle counts.
8. Keep the footer visually quiet; negative space is part of the design.

---

## 8. Design direction going forward

### Preserve

- The footer is a calm ending.
- The lake is the dominant visual element.
- The crescent stays small and secondary.
- Flowers remain a thin border rather than a full meadow.
- Kuhenkki's landing is the only dramatic motion.
- The CTA stays compact and clearly actionable.
- The footer must remain legible and smooth on mobile.

### Avoid

- Repeating the testimonial background in the footer.
- Adding another large moon, portal, tree, or illustrated landscape.
- Filling the entire lower half with large flowers.
- Multiple simultaneous ambient animations.
- Permanent blur/filter effects on large moving layers.
- Scroll logic that depends on a tiny progress interval for a critical visual beat.
- Turning the footer into another case-study panel.

### Good next refinements

If the footer needs another pass, suitable improvements are:

- refine the lake's horizontal reflection lines;
- adjust the exact landing point after real-device testing;
- add a very subtle reflection of Kuhenkki immediately before impact;
- tune the crescent size and position per breakpoint;
- improve contrast between the CTA copy and the horizon;
- remove the unused legacy `initGarden()` code from `site.js` as cleanup;
- add a small automated visual regression capture for desktop and mobile footer states.

Avoid adding new artwork unless a CSS/asset-light solution cannot achieve the requested result. No Higgsfield tokens were used for the celestial lake implementation.

---

## 9. Known caveats

### Iframe architecture

The top-level URL renders an iframe. A fragment such as `/#contact` affects the outer page, not necessarily the iframe document. For direct footer debugging and automated screenshots, use:

```text
http://localhost:3000/reference/index.html#contact
```

or control the iframe document directly.

### Legacy code

`public/js/site.js` still contains the old `initGarden()` implementation and its SVG plant builders. It is no longer called. Removing this dead code would reduce parse size and eliminate one lint warning, but it should be done as a focused cleanup to avoid accidentally deleting adjacent footer utilities.

### Unrelated working-tree content

At the time of this handoff, Git status also showed unrelated untracked content such as:

- `public/hero/testimonials-lunar-candidate-2.png`
- `reference-source/`
- `seo-audit-solcreatix/`

These were not created or modified as part of the celestial lake work. Do not delete or revert them without confirming ownership.

### External assets

Some `/assets/*` requests depend on the remote rewrite in `next.config.ts`. The core celestial lake backdrop does not depend on those remote images, but navigation and other pre-existing sections still may.

---

## 10. Primary files for the next AI

Start here:

1. `AI_HANDOFF_CONTEXT.md` — this document.
2. `public/js/site.js` — footer markup, contact drawer, landing animation.
3. `public/css/site.css` — shared chrome and celestial lake styling.
4. `public/reference/index.html` — the full static site, main Kuhenkki trail, scroll scheduler, and routed views.
5. `src/app/page.tsx` — iframe wrapper.
6. `next.config.ts` — external asset rewrite.
7. `AGENTS.md` — repository-specific Next.js instructions.

Before changing the footer, inspect both the footer-specific CSS and the responsive footer rules earlier in `site.css`; the final result is produced by both layers of rules.

---

## 11. Current intended experience

The desired closing sequence is:

1. Testimonials recede.
2. A dark, uncluttered sky rises into view.
3. The CTA settles above a faint horizon.
4. Kuhenkki curves down from the ongoing page trail.
5. It contracts into a visible droplet.
6. The droplet strikes the lake.
7. A brief splash and ripple create the final magical beat.
8. The scene becomes still, leaving the user with the CTA and social links.

The key principle is: **one strong motion moment inside a quiet final composition**.
