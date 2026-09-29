# LUME CAFE

A continuous, seven-chapter café campaign built with React, the Next.js-compatible Vinext runtime, Three.js, GSAP ScrollTrigger, and Lenis.

## Run

- `npm install`
- `npm run dev` — http://localhost:5173
- `npm run build`
- `npx tsc --noEmit`

## Structure

- `app/page.tsx`: chapter content, navigation, flavour controls, accessible order/location dialogs, and scroll progress.
- `app/World.tsx`: one persistent WebGL scene, product material, ingredients, coffee beans, camera, particles, resource disposal and adaptive rendering.
- `app/globals.css`: typography, atmospheric layers, responsive composition and reduced-motion handling.
- `public/cafe.png`: supplied photographic reference.
- `public/cup.png`: generated transparent extraction of the reference cup.

The product currently uses a textured plane inside a Three.js group: a layered 2.5D treatment rather than a full volumetric model. Replace that group's plane with a GLTFLoader asset while retaining the same positioning and timeline. Flavour variants currently use shader/material tinting and image filters; dedicated flavour textures can replace these later.

Order totals work as a local preview only. Prices are illustrative. No payment is taken, and no order is sent. Locations are intentionally unannounced until real café details are supplied.

Verified: TypeScript check and production build; desktop and phone layouts; flavour switching; chapter navigation; menu selection; quantity calculation. WebGL pixel density and particle counts are limited for mobile, and the renderer pauses while the tab is hidden.
