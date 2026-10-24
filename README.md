# LUME CAFE

A continuous, seven-chapter café campaign built with React, the Next.js-compatible Vinext runtime, Three.js, GSAP ScrollTrigger, and Lenis.

## Run

- `npm install`
- `npm run dev` — http://localhost:5173
- `npm run build`
- `npx tsc --noEmit`

## Structure

- `app/page.tsx`: chapter content, navigation, black/white themes, flavour controls and accessible order/location dialogs.
- `app/World.tsx`: one persistent WebGL scene, three photographic product materials, moving ingredients, orbit ribbons, droplets, camera and adaptive rendering.
- `app/use-journey.ts`: reversible scroll choreography, Lenis and inactive-scene focus management.
- `app/LoadingRitual.tsx`: photographic barista intro with actual asset-loading progress.
- `app/CraftStory.tsx`: four-step island-to-cup story timeline with autoplay, pause and manual selection.
- `app/CafeMenu.tsx`: animated category showcases and 25-item café menu.
- `app/cafe-data.ts`: editable Sri Lankan business details, menu, prices and flavour data.
- `app/globals.css`: typography, atmospheric layers, responsive composition and reduced-motion handling.
- `public/cafe.png`: supplied photographic reference.
- `public/cup.png`: generated transparent extraction of the reference cup.

The product uses a curved photographic plane inside a Three.js group: a layered 2.5D treatment, not a full volumetric model. Its automatic showcase movement deliberately stays within a realistic viewing angle. Replace the group's plane with a GLTFLoader asset while retaining the camera and scroll timeline for a full 360-degree turntable. Strawberry, caramel and mocha each have a separate generated product photograph with their own sauces and toppings; the shader blends images instead of recolouring the strawberry image. WebP assets are served at runtime.

The menu, Colombo 07 location and opening hours are provisional details approved for the design. Replace them in cafe-data.ts before commercial launch. Café interiors are illustrative generated photography. The map opens the neighbourhood, not an invented street address. The basket persists only in the visitor's browser and supports quantities, totals and copying a list. No payment is taken and no order is sent.

Accessibility and performance: inactive chapters are inert; dialogs trap focus; controls have accessible names. The requested campaign motion starts enabled, with an explicit navigation control to pause animations and smooth scrolling; that preference persists across visits. Rendering pauses in hidden tabs; mobile pixel density and particle geometry are limited. The loading intro is short choreography rather than an artificial progress counter.

The ingredient chapter uses three distinct upright exploded-view photographs with interactive ingredient notes. The finale uses a separate cup pose, and the craft chapter has dedicated barista photography. Recipe and paper-straw details are proposed and need confirmation before launch; no nutritional or compostability claims are made.


The closing chapters use distinct compositions: an editorial interior scene and a new overhead coffee still life (`finale-flatlay.webp`). A reversible spatial dissolve connects them without scroll-based enlargement. `app/refinements.css` holds the new layouts, responsive framing and menu/navigation refinements. Menu search spans all categories and supports Escape to clear. Hero-to-ingredient motion uses registered image geometry, a spatial reveal and scroll-driven vertical expansion (2.5D, not a video).
