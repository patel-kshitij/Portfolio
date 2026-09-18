---
title: Architecture
type: reference
owner: Kshitij
reviewed: 2026-09-16
---

# Architecture

## In plain English

Think of a theatre.

- **The sky** (stars and shooting stars) is the backdrop. It is drawn once and never redrawn.
- **The stage** is the purple card. It never leaves the screen. It holds the icons, the title, the line, the arrow and one spot for content, and it reads the web address to decide what goes in that spot.
- **The acts** are the sections: Home, About, Projects and Contact. Only one is on stage at a time.

When the address changes, because the arrow was clicked or Back or Forward was pressed:

1. the current act fades out while the title words roll over,
2. the card grows or shrinks to fit the next act,
3. the next act fades in.

Each address still has its own page file, but that file only gives search engines and link previews the page's title and description. The stage does all the drawing.

## The pieces

| Piece | Where | Job |
| --- | --- | --- |
| Root layout | `src/app/layout.tsx` | Loads the font, sets site-wide metadata, draws the sky, wraps everything in the stage |
| Sky | `src/components/StarBackground.tsx`, `src/components/ShootingStar.tsx` | Background animation, unchanged by the stage |
| Section list | `src/content/sections.ts` | Order, addresses, link labels, title words, page metadata, sitemap priority |
| Project list | `src/content/projects.ts` | The entries shown in the Projects section |
| Stage | `src/components/stage/Stage.tsx` | Picks the section from the address, runs every transition, applies the intro rule, sends unknown addresses home |
| Title | `src/components/stage/StageTitle.tsx` | Rolls the title words over |
| Arrow | `src/components/stage/NextLink.tsx` | Link to the next section; on the last section it turns around, then glides to the middle |
| Timings | `src/components/stage/timing.ts` | Every duration and delay used by the stage |
| Sections | `src/components/sections/` | Content only, one component per section |
| Icons | `src/components/icons.tsx` | Every SVG icon |
| Page files | `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/projects/page.tsx`, `src/app/contact/page.tsx` | Metadata only; they render nothing |
| Not found | `src/app/not-found.tsx` | A short "taking you home" note for the moment before the redirect |
| Sitemap | `src/app/sitemap.ts` | Built from the section list |
| Styles | `src/styles/_tokens.scss`, `src/styles/Stage.module.scss`, `src/styles/Sections.module.scss`, `src/app/globals.css` | Colours, sizes, and the look of the card and sections |
| End-to-end test | `e2e/stage.spec.ts`, `playwright.config.ts` | Clicks through the built site in Chromium |

## What happens on a click

1. The arrow is a `next/link`. Next.js navigates on the client without a reload, so the root layout, and `Stage` with it, stays mounted.
2. `usePathname()` returns the new address, and `Stage` looks the section up with `getSectionByPath()`.
3. **Title words:** `StageTitle` renders one element per word inside `AnimatePresence mode="popLayout"`, keyed by position and text. Old words move up and fade out while new words rise in.
4. **Content:** `AnimatePresence mode="wait"` is keyed by section id. The old section runs its exit animation (0.25 s). Only then does the new section mount.
5. **Card:** in the same render as that swap, `onExitComplete` sets the `shownId` state. The card (`m.main` with the `layout` prop) re-renders, Motion measures its old and new size, and springs between them (about 0.5 s).
6. The new section fades in after a 0.15 s delay, while the card settles.
7. **Arrow:** it always turns first and moves second, never both at once.
   - Its direction follows the address, so it turns at the click, while the old content fades out (0.25 s, the same length as the exit).
   - Its place follows `shownId`, so it glides at the swap, together with the card (its own spring, same length, no bounce).

Measured in a production build in Chromium: the old content is gone by about 0.3 s, the card resizes between 0.36 s and 0.8 s, and the new content is fully visible by 0.8 s. In both directions the arrow turns during roughly the first 0.35 s and glides between about 0.36 s and 0.9 s.

## Special cases

- **Direct visits.** Every section address is prerendered at build time. `usePathname()` works during prerendering, so the HTML for `/projects` already contains the Projects section, already visible. `sectionMetadata()` gives each page its own title, description, canonical address and link preview (Open Graph and Twitter) tags.
- **Without JavaScript.** Home starts with its intro elements hidden, waiting for the animation. For browsers without JavaScript, the stage adds a `<noscript>` style that shows them straight away.
- **The intro.** `Stage` keeps a `navigated` state that becomes true the first time the address moves away from a known section. It is updated during render, following React's "adjusting some state when a prop changes" pattern, because React's lint rules forbid reading refs during render. The intro plays only while `navigated` is false and the section is Home. On that first render the divider, greeting, arrow and icons start hidden and animate in; every other section is prerendered visible.
- **Unknown addresses.** Next.js answers 404 and renders `src/app/not-found.tsx` through `{children}`. `Stage` finds no matching section, draws no card, and calls `router.replace('/')`. Replacing (instead of pushing) keeps the bad address out of the history, so Back does not return to it. Because the first section shown is then Home, the intro plays.
- **Back and Forward.** They change the address exactly like a link does, so the same sequence runs.
- **One spring for everything.** `MotionConfig` gives every layout animation the card's spring, so the card, header, line and content move in step. The arrow is the one exception: it uses the same length without the bounce, so it comes to a clean stop.
- **Reduced motion.** `MotionConfig reducedMotion="user"` turns off movement and resizing for visitors who ask for less motion. Fades remain.
- **The sky and the page background.** The black background is painted on `html` only. The star layer sits at `z-index: -1`, so a background on `body` (which now has height, because the stage is in the normal page flow) would cover the stars.

## Size and cost

- Motion 13.3.0 is loaded through `LazyMotion` with the `domMax` feature set, which layout animations need. Measured on 2026-09-16, the home page's JavaScript grew from 171 KB to 218 KB (compressed), so the stage costs about 47 KB. That is more than Motion's own estimate of about 30 KB, because `AnimatePresence` and layout animations add to it.
- Loading the features later (a lazy `LazyMotion` import) was tried: it cut the first load to 196 KB but raised the total to about 223 KB, and a click in the first moments would not animate. It was not kept.
- All four sections are client components in one bundle. The site is small, so this is fine. Revisit it if a section becomes heavy.
- The page files render nothing, which is unusual for Next.js. Anyone new to the repository should read this document before changing a page file.

## Deliberately not used

- **React's `<ViewTransition>`**, option A in [DECISIONS.md](../DECISIONS.md) entry 2. It needs no extra library, but the owner chose Motion's feel.
- **Freezing the Next.js router context** (often called "FrozenRouter"). It relies on Next.js internals and breaks on upgrades.
- **`template.tsx`.** It re-mounts content on every navigation but cannot play exit animations.
