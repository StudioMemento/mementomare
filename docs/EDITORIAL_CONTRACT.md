# Le ore del mare — shared design and implementation contract

## Project and boundaries
Working copy ONLY: /workspace/sites/memento-mare-editorial. Original /workspace/sites/hospitality-beach stays unchanged, original source commit 165cda077de448ff7bdde556d6778c3c2f8a4ed0. A separate public preview is authorized; no replacement of existing live site.

MEMENTO Hotel & Beach is a fictional concept for northern Adriatic hospitality. All nine photographs are generated concept assets already in the repo. There is NO actual hotel/address/contact/booking engine. Never invent property facts, ratings, availability, testimonials or receipt confirmations. Label the experience discreetly but clearly as concept. No new imagery necessary. Actual submission can be enabled only with an authorized official destination; currently blocked.

## Creative rule
“Le ore del mare”: an editorial daybook from arrival, into rooms, outside, then evening and planning. Photography dominates. Rectangular compositions and hairlines; intentional unfilled space; no dominant card grid, giant polaroids, repetitive sticky scenes or obligatory journey. Native scrolling, no scroll trapping, custom cursor, audio or preload gate.

Palette from existing photographs: warm ivory #f6f1e7; ink espresso #362a24; terrace terracotta #a64b34; pale peach #ead7c7; sunlight #e6bd67. No green UI. Glass only in restrained navbar. Manrope for UI/body and most titles; Cormorant for occasional editorial accents. Both local OFL fonts already bundled. Main desktop H1 max104px, mobile 54px; body14–16px; UI11–13px; no 7–9px information. Corners0–4px except pills for small status. Warm dark footer.

## Layout and DOM contracts
Global wrapper `.editorial-site` on outer App div. All new components use prefix `ed-`. `src/styles/editorial.css` loaded after legacy styles, scopes resets to `.editorial-site` where needed. Existing detail pages remain with coordinated modest restyling. Retain URLs and data identifiers.
Home /:
1. `#arrivo` / `.ed-arrival` photo hero with name, “Alto Adriatico · Concept”, h1 “Il mare. / Il resto può aspettare.” Primary Prenota, secondary Camere. Hero photo `spa` shows exterior; small `hero-beach` landscape inset. `.ed-arrival-media` img transform target; `.ed-arrival-window` inset photo transform target.
2. `#dimora` / `.ed-intro` editorial short arrival text and two contrasting crops, no additional claims. One slim text strip and numbered timing.
3. `#camere` RoomExplorer exported default/named from `src/components/RoomExplorer.tsx`. No props required; uses existing content.rooms and useUI.openBooking. Clear three selection buttons, arrows/key navigation, large active image, stable details region and room detail link, selection carried to booking. No hotspot fiction. `.ed-room-*` classes.
4. `#giornata` DayDial exported from `src/components/DayDial.tsx`. Three existing image/activity states morning(food), afternoon(spa), golden hour(dining); segmented buttons + native range optional. Crossfade independent images, no claim same-view timelapse. Text/activity link always accessible. `.ed-day-*`.
5. `#fuori` / `.ed-outside` calm full-width private-beach photograph with small caption and biking detail; links to existing service pages.
6. `#informazioni` / `.ed-information` useful details + honest concept geography, no fake map/address. Provided InfoAndContact component from frontend agent may be used.
7. `#soggiorno` BookingInvitation retained export updated by UX; concise horizontal dates invitation, no 3-card grid. Footer.

## API and shared dependencies
Keep UIContext overlay union and BookingDraft shape unless coordinator agrees. `openBooking({roomId?,interest?})` retained. `Photo` existing IDs include hero-beach/private-beach/spa/fitness/dining/food/care and 3 suite IDs; root will enhance `sizes` optional prop (string) and fallback semantics. `Arrow`, `Eyebrow`, `Modal` retained.
`useEditorialMotion(root: RefObject<HTMLDivElement|null>, enabled:boolean)` exported from motion/useEditorialMotion.ts. Default content visible. Motion can transform photographs lightly with native scroll; no initial opacity0 on essential content. Cleanup on unmount/matchMedia. Motion disabled at prefers-reduced-motion. No pinning >30vh, prefer no pins. Home has motion toggle if needed.

Booking config at src/booking/config.ts exported `bookingConfig`: officialUrl:string|null, requestEndpoint:string|null, recipientLabel:string|null. No invented destination. Form supports authorized endpoint only, errors truthful; no local success masquerading as received. When unset, show planning form and explicitly unavailable real send, allow copying/downloading request summary if useful. Don't ask personal data while no recipient exists. Root will report one outstanding integration action.

## Motion grammar
Durations200ms UI / 550ms photo / 800ms entrance; ease cubic-bezier(.22,.61,.36,1). Photograph max scale1.045, translations≤32px. No endless ambient movement. Three main moments + still interludes. Reduced motion changes instant; all controls work.

## Ownership — no cross edits
Coordinator/root: App.tsx, Home.tsx, Primitives.tsx, main.tsx, metadata/build, asset optimization, integration/publication; owns shared contract.
Art director: src/styles/editorial.css ONLY + docs/ART_REVIEW.md. Style shell/home/info/default detail pages from class contract; may communicate suggestions, no component changes.
UX designer: components/Booking.tsx, booking/config.ts, booking/request.ts, styles/booking-editorial.css + docs/UX_REVIEW.md. Existing validation.ts read-only unless requested. Keep exports BookingDrawer, BookingInvitation, HeroBooking.
Motion designer: components/RoomExplorer.tsx, components/DayDial.tsx, motion/useEditorialMotion.ts, styles/explorer.css + docs/MOTION_REVIEW.md.
Frontend: components/Shell.tsx, components/InfoAndContact.tsx, pages/Details.tsx, data/editorial.ts + docs/CONTENT_REVIEW.md. Shell .ed-header/.ed-nav/.ed-menu/.ed-footer. Add links #camere #giornata #informazioni and “Prenota”. No fixed mobile CTA covering content; header reachable on mobile. No false contacts/map. Existing page routes preserved.
QA: docs/EDITORIAL_QA.md and tests/editorial.test.ts or scripts/verify-editorial.mjs ONLY; read-only rest. Root owns browser session. Review real source, identify actionable issues, no fake browser checks.

## Staged delivery
First build only arrival + transition + RoomExplorer and render before expanding Home. Agents may prepare their independent components but root integrates after representative slice inspection. Follow current user requests over legacy docs. No deployment/credentials/branch changes by subagents. No new dependencies without coordinator.
