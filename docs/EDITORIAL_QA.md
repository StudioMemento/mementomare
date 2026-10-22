# QA — Le ore del mare

Reviewed 18 October 2026. Scope: the separate editorial preview in `/workspace/sites/memento-mare-editorial`. The original live demo is preserved. Automated and static checks pass; browser verification is explicitly incomplete.

## Checks executed

| Check | Result | What it establishes |
| --- | --- | --- |
| `npm test` | 15 passed, 0 failed | Date/guest validation and request-boundary behavior. 7 existing checks and 8 new checks. |
| Client + SSR + prerender build | Passed, executed by coordinator | TypeScript compiles and 12 routes plus the 404 document are generated. |
| `npm run verify` | Passed on final distribution | Direct-route documents, referenced files, nine photographs and measured compressed bundles. |
| `node scripts/verify-editorial.mjs` | Passed on final distribution | 12 rendered routes, 223 internal links, 63 image elements with alt attributes and dimensions, 18 unique image assets, no duplicate IDs or missing ARIA targets. |
| Source accessibility review | Completed | Native buttons, date/select inputs and dialogs; explicit tab selection and keyboard handlers; image fallback; reduced-motion branches and animation cleanup. This does not substitute for assistive-technology testing. |
| Source content review | Completed | Fictional property and generated photographs disclosed; no invented hotel phone/email/address, ratings, availability, prices or confirmed bookings. |
| Local font licenses | Verified | Manrope and Cormorant Garamond include SIL Open Font License 1.1 notices. No runtime font service. |

The request tests use an injected fetch stub. They verify that unset configuration or invalid inputs cannot send, that a generic HTTP 200 is not a receipt, and that HTTP failure, rate limiting, offline error and cancellation remain failures. A valid backend acknowledgment must contain a receipt ID and `accepted` or `received` status. Plan export explicitly says the request was not sent. No live endpoint or hotel recipient was contacted.

## Corrections verified in source

- Removed the legacy global reveal hook that set essential content opacity to zero and zoomed images beyond the agreed motion range.
- Connected the two introduction photographs to the bounded scroll transition; no pinning or scroll interception is used.
- Repeated hash navigation now responds to the router location key.
- Photo errors are scoped to the asset ID, try the smaller WebP derivative once, then render an accessible fallback. Decorative fallbacks stay hidden from assistive technology.
- Closed dialogs are omitted from prerendered HTML. The menu's `aria-controls` exists only while its target is mounted.
- Static prerender emits the appropriate priority-photo preload per route. Hidden dialog photographs are not included in initial HTML.
- Mobile date fields use 16px text. Anchor offset is not applied twice.
- Detail copy no longer presents Wi-Fi, air conditioning, bathroom features, meal services or room capacity as verified facts. Captions, FAQ, information and footer disclose the concept.
- Legacy unused photographs are removed from the distribution using the asset manifest; the source archive remains intact.

The installed existing libraries were reused. Package metadata records React, React DOM and React Router as MIT, and GSAP as its standard no-charge license. No new animation dependency was introduced.

## Measured distribution sizes

| Item | Size |
| --- | ---: |
| JavaScript, gzip | 145,484 bytes |
| CSS, gzip | 31,527 bytes |
| Two local WOFF2 fonts, uncompressed files | 66,472 bytes |
| 18 responsive WebP derivatives | 2,646,682 bytes |
| Homepage prerendered HTML | 20,685 bytes |
| Complete distribution, 46 files | 3,586,341 bytes |

These are local file/compression measurements, not real network transfer, loading speed, Lighthouse, Web Vitals or frame-rate scores. Below-fold photographs retain native lazy loading, responsive candidates and intrinsic dimensions. The initial content does not wait for animation code to reveal it. The preview is intentionally `noindex,nofollow` because it represents an imaginary hotel.

## Actual browser evidence and unavailable checks

The coordinator rendered the representative arrival section on a desktop viewport of **1348 × 926**. The hero and navigation were observed. Clicking “Esplora le camere” reached the room section.

At that point the first room photograph displayed “Immagine non disponibile”. The source assets are present and the coordinator verified their decoding. The fallback path was subsequently strengthened, but the rendered photograph has **not** been retested.

The next browser action was rejected by the URL protocol policy, which explicitly prohibited workarounds through alternate surfaces. Browser work stopped. No mobile/tablet render, actual touch interaction, complete keyboard walkthrough, reduced-motion render, image-failure injection, complete console inspection, all-dialog interaction check or post-publication browser test is claimed. The hero render and one anchor interaction do not verify the complete experience. No browser operations were performed by the QA agent.

## Residual limits and release context

1. This is a reviewable concept preview, not an operating hotel booking site. Provide the property's authorized official booking URL, or a verified request endpoint and recipient with receipt semantics, to enable a real request. No confirmation of receipt is simulated while configuration is empty.
2. Replace generated imagery, identity, descriptive content and location/contact information with verified material for the hotel that adopts the design.
3. Retest the room photograph and the remaining responsive, interaction and post-publication browser scenarios in an environment where browser navigation is permitted. The observed photo fallback is unresolved visually, even though source assets and static links pass.

The coordinator can publish the separate preview with these limitations disclosed. This report does not certify a completed visual, accessibility, device-compatibility or production-integration audit.
