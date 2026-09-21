---
title: Status
type: status
owner: Kshitij
reviewed: 2026-09-21
---

# Status

The one list of open work and known problems. Entries keep their number forever. When an entry is finished, move it to "Done" with the date.

## In progress

Nothing right now.

## Waiting on the owner

29. **Install the YAML reader and review the move to project files** ([DECISIONS.md](DECISIONS.md) entry 22). `package.json` adds `yaml` 2.9.1 and the `content:build` and `content:check` scripts; the six projects moved from `src/content/projects.ts` to `src/content/projects/`. The owner runs `npm install` so the lockfile changes on his machine, runs all six checks, reviews and commits. Checked in the agent's workspace: every check passes, the checker's error messages were tried with deliberate mistakes, and a published test case study was built and tested, then removed.

27. **Review the projects rebuild** ([DECISIONS.md](DECISIONS.md) entry 21). Built and checked in the agent's workspace: tiles with group filters and a headline, architecture drawings, case study pages inside the card at `/projects/<slug>`, the card resizing through `LayoutGroup`, new e2e tests, and the docs. `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:e2e` and `npm run docs:check` pass there (the build used a stand-in for the Google font, which that workspace cannot download). The case study page and its tests were checked with a temporary case study that was removed before handover. The owner runs every check on macOS, looks at `/projects` on a real screen and a phone, reviews and commits.

28. **Write the project words** ([DECISIONS.md](DECISIONS.md) entries 21 and 22). For each project, paste the prompt from [guides/case-studies.md](guides/case-studies.md) into a chat that knows it, answer its questions, and bring back the block and the "Check before publishing" list. The agent merges the block into `src/content/projects/<slug>.yaml` with `published: false`; the owner reads it and publishes. Suggested order: Qrakr, Serverless Image Pipeline, Work Board, then real drawings (no case study) for SkillSwap, Ecomart and Player Performance Prediction. Progress: qrakr's block was merged on 2026-09-21 (drawing, facts, and the case study with `published: false`); it waits for the owner to read it and publish. Workboard's block was merged on 2026-09-21 (renamed from Work Board to Personal AI-workboard, file `workboard.yaml`, address `/projects/workboard`; drawing, facts and the case study); the owner published it on 2026-09-21. Serverless Image Processor's project file was merged on 2026-09-21 (renamed from Serverless Image Pipeline, file `serverless-image-processor.yaml`, address `/projects/serverless-image-processor`; drawing, facts and the case study); the owner published it on 2026-09-21. Every other drawing is still the agent's first draft from each project's sentence and tools.

26. **Node.js 24 before 2026-10-01** ([DECISIONS.md](DECISIONS.md) entry 20). `engines` and `@types/node` changed in `package.json`, the development guide updated. The owner updates Node on his computer to 24, runs `npm install` so the lockfile changes on his machine, runs every check, reviews and commits. The first deployment after that should log Node 24 in the Vercel build output. Optionally set the dashboard's Node.js Version to 24.x as well.

23. **Player Performance Prediction has no code link.** The owner said he will add it. Fill in `code` on that entry in `src/content/projects.ts`; its status then changes from Soon to Code and its headline shows a "Code on GitHub" link.

24. **The resume on the site is a temporary one.** When the final resume is ready, export a copy without the phone number and replace `public/resume.pdf`. Nothing else changes.

25. **Review batch two of the 2026-09-18 site review** ([DECISIONS.md](DECISIONS.md) entry 17). Built and checked in the agent's workspace: every section's words, the projects drawn as a constellation with Qrakr and Work Board ([DECISIONS.md](DECISIONS.md) entries 18 and 19), the availability line on Home and Contact, Left and Right arrow keys and swipe, the resume link, and four new e2e tests. `tsc --noEmit`, `eslint .` and `npm run docs:check` pass there. The owner runs `npm run build` and `npm run test:e2e` on macOS, reads every section on a real screen, reviews and commits.

13. **Review batch one of the 2026-09-18 site review** ([DECISIONS.md](DECISIONS.md) entry 16). Built and checked in the agent's workspace: the shared focus ring, the reduced motion guard on the sky, the narrow phone name step, the shooting star key counter, the theme colour and home screen icons, the `host` line removed from robots, fixed sitemap dates, and Person structured data. `npm run typecheck`, `npm run lint` and `npm run docs:check` pass there. The owner runs `npm run build` and `npm run test:e2e` on macOS, reviews and commits.

## Known problems (not fixed yet)

8. `npm install` reports ESLint 9.39.5 as no longer supported.
9. There is no CI, so checks only run when someone runs them.
12. Entry numbers in this file are kept forever, but a markdown renderer ignores them and numbers each list from its first entry. The source is the truth; the rendered numbers drift once a section's entries are no longer contiguous.

14. **The arrow is the only way to move.** There is no navigation menu, no `nav` landmark and no footer. Measured on 2026-09-18: the whole of `/about` has exactly one focusable element, the arrow. Someone who arrives on `/projects` from a search cannot see how to reach Contact. Agreed as the next batch of work.
15. **The card's scroll area cannot be scrolled from the keyboard** in Firefox and Safari. It has `tabIndex -1`, and only Chrome 127 and later makes such a box focusable on its own. Measured on a 740x360 screen: the About text is 405px tall inside a 175px box. Part of the next batch.
16. **Moving between sections is silent for screen readers.** The address and the content change with nothing announced. Part of the next batch.
18. **The sky is 300 to 600 real DOM elements**, about one in ten animating forever, and the resize handler in `src/components/StarBackground.tsx` rebuilds every one of them on every resize event with no debounce. On a phone the address bar sliding away is a resize, so the star pattern visibly jumps.
19. **One link preview image is shared by all four pages.** `src/app/opengraph-image.png` is site wide; no section has its own.
20. **No security headers beyond HSTS.** Checked live on 2026-09-18: no Content-Security-Policy, no Referrer-Policy, no X-Content-Type-Options, no Permissions-Policy.
21. **Nothing measures visits.** There is no way to tell whether anyone reaches the site or which section they land on.
22. **The end to end suite runs desktop Chromium only.** No mobile screen size and no accessibility check, which is why entries 15 and 16 went unnoticed.

## Done

1. **Single page stage** ([DECISIONS.md](DECISIONS.md) entries 2 to 9, 11 and 12). Committed and deployed. Confirmed live on 2026-09-18. 2026-09-18.
2. **The Next.js 16.3.5 and React 19.3 upgrade is live.** Confirmed on 2026-09-18: the live site serves per section titles and descriptions, the link preview image, the sitemap with the priorities from `src/content/sections.ts`, and robots rules. 2026-09-18.
4. `src/config/starsConfig.ts`: `blinkingStarPercentage` was 0.5 while its comment said 3%. Set to 0.1 with a matching comment, and the stale "3% chance" comment in `src/components/StarBackground.tsx` removed ([DECISIONS.md](DECISIONS.md) entry 13). 2026-09-18.
5. `src/styles/StarBackground.module.scss`: the last blinking keyframe set opacity to 1.5, above the maximum of 1. Now 1. Browsers already clamped it, so nothing changed on screen. 2026-09-18.
6. `src/components/ShootingStar.tsx`: every timer the effect starts is now tracked and cleared when the effect is torn down, and the stars on screen are cleared with them, so development mode no longer runs two shooting star loops. 2026-09-18.
7. `src/app/fonts/` held two unused Geist font files. Both files and the folder are deleted. The site loads JetBrains Mono through `next/font/google`. 2026-09-18.
10. **`npm run build` and `npm run test:e2e` on macOS for the stage change.** Done by the owner before the commit that took the stage live. The same limit still applies to every handover: the agent's shell on the owner's computer is a Linux sandbox with macOS `node_modules`, so those two checks always belong to the owner. 2026-09-18.
3. **Content refresh** ([DECISIONS.md](DECISIONS.md) entry 17). About rewritten in the same voice from the resume, site description and page descriptions updated, six structured project cards, availability line, resume link. Handed over as entry 25. 2026-09-18.
17. **Arrow keys and swipe** ([DECISIONS.md](DECISIONS.md) entry 17). Left and Right keys and a sideways swipe move between sections; the icons carry a tooltip and a screen reader hint. Handed over as entry 25. 2026-09-18.
11. `src/components/ShootingStar.tsx` keyed each star with `Date.now()`, so two stars created in the same millisecond would share a React key. A counter held in a ref now gives every star its own number. 2026-09-18.
