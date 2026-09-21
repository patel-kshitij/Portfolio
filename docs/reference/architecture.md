---
title: Architecture
type: reference
owner: Kshitij
reviewed: 2026-09-21
---

# Architecture

## In plain English

Think of a theatre.

- **The sky** (stars and shooting stars) is the backdrop. It is drawn once and never redrawn.
- **The stage** is the purple card. It never leaves the screen. It holds the icons, the title, the line, the arrow and one spot for content, and it reads the web address to decide what goes in that spot.
- **The acts** are the sections: Home, About, Projects and Contact. Only one is on stage at a time.
- **A scene** is a case study: part of the Projects act, with its own address such as `/projects/qrakr`. The stage treats a scene change exactly like an act change.

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
| Section list | `src/content/sections.ts` | Order, addresses, link labels, title words, page metadata, sitemap priority, the next and previous section; `getViewByPath()` turns an address into a section or a case study, and `caseStudyPath()` and `caseStudyMetadata()` serve the case study pages |
| Project files | `src/content/projects/*.yaml` | One file per project (words, links, facts, architecture, case study with its `published` switch) and `index.yaml` (groups and order) |
| Content build | `scripts/content-build.mjs` | Checks the project files and writes `src/content/projects.generated.json` (not committed); runs before dev, build, typecheck and e2e |
| Project list | `src/content/projects.ts` | The types, the generated data, and the status, link and case study helpers |
| Site facts | `src/lib/site.ts` | Name, address, email, profile links, the resume path, the availability line |
| Resume | `public/resume.pdf` | Served as is at `/resume.pdf`; a copy without the phone number |
| Stage | `src/components/stage/Stage.tsx` | Picks the section from the address, runs every transition, applies the intro rule, sends unknown addresses home |
| Title | `src/components/stage/StageTitle.tsx` | Rolls the title words over |
| Arrow | `src/components/stage/NextLink.tsx` | Link to the next section; on the last section it turns around, then glides to the middle |
| Timings | `src/components/stage/timing.ts` | Every duration and delay used by the stage |
| Input | `src/components/stage/useStageInput.ts` | Left and Right arrow keys and sideways swipes, plus the hint the icons show |
| Sections | `src/components/sections/` | Content only, one component per section, plus `CaseStudySection` for a case study. `ProjectsSection` keeps the chosen filter and headline as its own state |
| Architecture drawing | `src/components/ArchitectureDiagram.tsx` | Draws a project's architecture as SVG: labelled boxes and arrows (with step numbers on a case study), or dots and lines for a small tile |
| Icons | `src/components/icons.tsx` | Every SVG icon |
| Page files | `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/projects/page.tsx`, `src/app/contact/page.tsx`, `src/app/projects/[slug]/page.tsx` | Metadata only; they render nothing. The case study page file also lists which slugs to prerender, and answers 404 for any other |
| Not found | `src/app/not-found.tsx` | A short "taking you home" note for the moment before the redirect |
| Sitemap | `src/app/sitemap.ts` | Built from the section list and the written case studies |
| Styles | `src/styles/_tokens.scss`, `src/styles/Stage.module.scss`, `src/styles/Sections.module.scss`, `src/styles/Projects.module.scss`, `src/styles/CaseStudy.module.scss`, `src/styles/Architecture.module.scss`, `src/app/globals.scss` | Colours, sizes, and the look of the card and sections |
| End-to-end test | `e2e/stage.spec.ts`, `playwright.config.ts` | Clicks through the built site in Chromium |

## What happens on a click

1. The arrow is a `next/link`. Next.js navigates on the client without a reload, so the root layout, and `Stage` with it, stays mounted.
2. `usePathname()` returns the new address, and `Stage` looks the view up with `getViewByPath()`: a section, or the Projects section plus one project for a case study. Views are cached, so the same address always gives the same object.
3. **Title words:** `StageTitle` renders one element per word inside `AnimatePresence mode="popLayout"`, keyed by position and text. Old words move up and fade out while new words rise in.
4. **Content:** `AnimatePresence mode="wait"` is keyed by the view's key: the section id, or `projects/<slug>` for a case study. The old section runs its exit animation (0.25 s). Only then does the new section mount.
5. **Card:** in the same render as that swap, `onExitComplete` sets the `shownView` state (its section id is still called `shownId`). The card (`m.main` with the `layout` prop) re-renders, Motion measures its old and new size, and springs between them (about 0.5 s).
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
- **Arrow keys and swipes.** `useStageInput` listens for `keydown` on the window and for pointer events on the card. Right, or a swipe to the left, pushes the next section's address; Left, or a swipe to the right, pushes the previous one and does nothing on Home. It calls `router.push` with `scroll: false`, and from there the sequence is the same as for a link. Only `pointerType === 'touch'` counts as a swipe, and the card's `touch-action: pan-y` keeps vertical scrolling with the browser so a sideways finger still reaches `pointerup`.
- **One spring for everything.** `MotionConfig` gives every layout animation the card's spring, so the card, header, line and content move in step. The arrow is the one exception: it uses the same length without the bounce, so it comes to a clean stop.
- **Reduced motion.** `MotionConfig reducedMotion="user"` turns off movement and resizing on the card for visitors who ask for less motion; fades remain. The sky sits outside that config and guards itself: blinking is wrapped in `@media (prefers-reduced-motion: no-preference)` and `ShootingStar` renders nothing and starts no timers.
- **The projects tiles.** A three column grid (two on a tablet or phone). The headline spans two columns and two rows; `grid-auto-flow: dense` lets the small tiles fill around it. The filter and the headline are plain React state inside the section; nothing about them reaches the address. The grid, the headline and every tile carry Motion's `layout` prop, and `Stage` wraps the card in `LayoutGroup`, so when a filter or a new headline changes the section's height, the card measures again and springs to its new size with the same spring as a section change. Leaving tiles fade out through `AnimatePresence mode="popLayout"`. When a visitor picks a tile, focus moves to the new headline's heading, because the tile they clicked is gone.
- **Case studies.** A case study is a view, not a fifth section: its section is Projects, its title words are the project's name, and its content is `CaseStudySection`. The arrow turns around (`pointsBack`) and leads back to `/projects`, and it stays at the left because its place still follows the section on screen, which is Projects. `useStageInput` sends both keys, and both swipe directions, to `/projects` too. There is no back link inside the case study ([DECISIONS.md](../DECISIONS.md) entry 23). `src/app/projects/[slug]/page.tsx` prerenders one page per written case study with `generateStaticParams` and sets `dynamicParams = false`, so any other slug answers 404 and the stage sends the visitor home, like any wrong address. `next start` logs a `NoFallbackError` line for such a 404; it is Next.js reporting the 404 and needs no fix. While no case study is published the route prerenders nothing.
- **Architecture drawings.** `ArchitectureDiagram` places boxes on a grid of up to five columns and two rows. Arrows along a row join the boxes' sides; arrows between rows leave from the bottom or top. Colours come from `Architecture.module.scss`. The full drawing never shrinks below 30rem; its frame scrolls sideways on a phone. Its accessible name lists every arrow in words ("Finder phone to Tag page, ..."), and the small tile's version is hidden from screen readers because the tile's button already names the project.
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
