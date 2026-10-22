# Le ore del mare — art direction review

## What changed

The earlier source used four near-identical full-height scroll chapters, giant italic headings, rotating polaroids and rounded booking cards. Small supporting labels competed with the photographs, while the same scene treatment gave rooms, pool and evening nearly the same visual rhythm.

`src/styles/editorial.css` replaces this with a quieter editorial system: a full photographic arrival, one small shoreline frame, a two-column introductory spread, unequal photographic crops, still outdoor interludes, clear practical information and a dark final signature. Room and day interactions are styled independently by the motion developer against the shared contract.

## Common rules implemented

- Warm ivory, espresso, terracotta and photographic peach; no green UI.
- Manrope is the principal reading and navigation face. Cormorant is a limited editorial accent rather than the site's entire identity. Both local font bundles have SIL OFL 1.1 licence files and recorded source URLs in `public/assets/fonts/`.
- Main heading is capped at 104 px on desktop and 54 px on mobile. Body copy is 14–16 px; captions and navigation are at least 11 px, except the compact brand descriptor at 10 px.
- Rectangular imagery, 1 px hairlines and 0–3 px UI corners. Glass is limited to the fixed masthead, with an opaque fallback and a reduced-transparency variant.
- Native flow, visible focus outlines and 44 px minimum primary control targets. The masthead provides booking access without a bottom overlay covering content.
- Reduced-motion rules remove transitions while leaving all content in place. No animated visibility dependency is introduced by this stylesheet.

## Responsive decisions

The desktop shoreline inset disappears on a phone to preserve the main image and legible copy. The intro becomes a reading sequence followed by asymmetric photographs, without overlapping captions. The menu becomes a plain index and removes its decorative photograph. Outdoor content, practical information and the footer reflow to a single column; their actions remain visible.

Existing room, service, gallery and contact routes receive coordinated heading sizes, captions, body copy and squared controls while retaining their existing structure.

## Verification and remaining limits

The stylesheet was parsed successfully with the project's installed PostCSS. Class contracts were checked against the current Home, Shell and InfoAndContact source. Font availability and bundled licences were inspected directly. No new assets or claims about a real property were introduced.

Rendered art review is owned by the coordinator's browser session. This document does not claim visual viewport, contrast-over-photography or device testing before those captures are available. The exact image/copy balance should be judged on those rendered captures, especially the arrival at 390 px and the introduction at tablet width.
