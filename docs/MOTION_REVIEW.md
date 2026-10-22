# Motion and photographic interaction review

## Delivered components

- `RoomExplorer`: three room tabs; one broad, stable photograph; details, material observations, dedicated-page link and booking action. The booking action passes the selected `roomId` into the existing UI context. No prices, capacities or unverifiable amenities added.
- `DayDial`: morning / afternoon / last-light selector using three independent existing concept images (breakfast, pool exterior, aperitivo). A photographic daybook rather than a fabricated timelapse of one place. Narrative hours are explicitly distinguished from service opening times.
- `useEditorialMotion`: bounded native-scroll movement of arrival photograph and inset; optional two photograph targets in the intro transition. It never hides text, essential imagery or controls; never pins the document or changes the cursor.
- `explorer.css`: component-owned styles, warm shared palette, rectangular layout, usable mobile arrangements and full reduced-motion states.

## Interaction contract

Both selectors implement the standard tab pattern with unique `useId` IDs, `aria-selected`, a labelled tab panel, roving `tabIndex`, Left/Right wrapping, and Home/End. Direct buttons are available to mouse and touch; dragging is neither required nor implemented. Selected details remain in the normal document flow and links can be tabbed to. Images are crossfaded in place, reserving aspect ratio to prevent layout shift.

## Motion grammar

- UI state: 200–300 ms.
- Photograph opacity: 550 ms, `cubic-bezier(.22,.61,.36,1)`.
- Selection image settling: scale 1.025 → 1 over 800 ms.
- Arrival native scroll: image scale 1.025 → 1.045, translate ≤22 px; inset moves −24 px on desktop only.
- Intro targets carrying `data-ed-photo-drift`: translations of at most 20 px desktop / 8 px mobile.
- No endless loops; no animation on body text; no opacity gate; no pinning; no new dependency.
- `prefers-reduced-motion` removes all photographic interpolation and preserves usable selection. The explicit `.ed-motion-off` parent also removes these transitions.

## Lifecycle and loading

The hook creates a scoped GSAP context, media-query context and optional ResizeObserver. Image-load and font-ready updates coalesce through a single animation frame. Teardown removes image listeners, cancels a scheduled frame, disconnects ResizeObserver and reverts only its own GSAP contexts. GSAP responds to viewport/media changes; no global kill operation affects other components.

Photographs use the shared `Photo` component, responsive `sizes` hints and its existing error state. Unselected images are `aria-hidden` and decorative. Noninitial images remain lazy. Aspect ratio is reserved before any asset finishes loading. The surrounding details and controls remain readable if an image fails.

## Verification honestly completed

- `npm run typecheck`: passed after both components and hook were written.
- Manual source review: keyboard state transitions, wrap limits, IDs, label relationships, minimum button areas, valid links and room-ID propagation.
- Reduced-motion and cleanup behavior reviewed in source; browser verification remains the coordinator's responsibility.
- No claim of rendered/mobile/browser performance testing is made by this agent. The coordinator owns the shared browser session and will record those results separately.

## Integration notes

Import `explorer.css` after `editorial.css`. Import RoomExplorer and DayDial by named or default export. Hook receives the Home root ref and the motion boolean. Add `data-ed-photo-drift` only to the two intended intro photograph wrappers if that small transitional movement is desired; all content is otherwise fully visible.

Assets are the existing fictional/generated Memento Hotel & Beach set. They must be replaced with authorized real-hotel material before this becomes a property booking site. The components intentionally do not add factual hotel claims.
