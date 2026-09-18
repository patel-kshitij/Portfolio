---
title: Status
type: status
owner: Kshitij
reviewed: 2026-09-18
---

# Status

The one list of open work and known problems. Entries keep their number forever. When an entry is finished, move it to "Done" with the date.

## In progress

Nothing right now.

## Waiting on the owner

1. **Single page stage** ([DECISIONS.md](DECISIONS.md) entries 2 to 9, 11 and 12). Built and checked in the agent's workspace. The owner installs the new packages, runs the five checks, reviews and commits.

2. **Today's upgrade is not live yet.** The working tree has Next.js 16.3.5, React 19.3, per page titles and descriptions, a sitemap, robots rules and a link preview image. On 2026-09-16 the live site still had an empty page title.
3. **Content refresh.** The About text calls Kshitij a "newbie", states an age, and lists Python, Java and Go. The site description in `src/lib/site.ts` also lists Python, Java and Go. The owner decides the new wording.
10. **`npm run build` and `npm run test:e2e` still need a run on macOS.** The agent's shell on the owner's computer is a Linux sandbox, but `node_modules` was installed on macOS, so only `@next/swc-darwin-arm64` is present and the sandbox has no network to fetch the Linux build. `npm run typecheck`, `npm run lint` and `npm run docs:check` were run there and pass. `npm run build` and `npm run test:e2e` cannot be, so the owner runs those two before committing.

## Known problems (not fixed yet)

8. `npm install` reports ESLint 9.39.5 as no longer supported.
9. There is no CI, so checks only run when someone runs them.
11. `src/components/ShootingStar.tsx` keys each star with `Date.now()`, so two stars created in the same millisecond would share a React key. Not seen in practice. The owner decides whether it is worth a counter.
12. Entry numbers in this file are kept forever, but a markdown renderer ignores them and numbers each list from its first entry. The source is the truth; the rendered numbers drift once a section's entries are no longer contiguous.

## Done

4. `src/config/starsConfig.ts`: `blinkingStarPercentage` was 0.5 while its comment said 3%. Set to 0.1 with a matching comment, and the stale "3% chance" comment in `src/components/StarBackground.tsx` removed ([DECISIONS.md](DECISIONS.md) entry 13). 2026-09-18.
5. `src/styles/StarBackground.module.scss`: the last blinking keyframe set opacity to 1.5, above the maximum of 1. Now 1. Browsers already clamped it, so nothing changed on screen. 2026-09-18.
6. `src/components/ShootingStar.tsx`: every timer the effect starts is now tracked and cleared when the effect is torn down, and the stars on screen are cleared with them, so development mode no longer runs two shooting star loops. 2026-09-18.
7. `src/app/fonts/` held two unused Geist font files. Both files and the folder are deleted. The site loads JetBrains Mono through `next/font/google`. 2026-09-18.
