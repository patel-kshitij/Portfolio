---
title: Decisions
type: decision
owner: Kshitij
reviewed: 2026-09-18
---

# Decisions

Append-only. Never edit or delete an entry; add a new one that names the entry it replaces.

## 1. Typed documentation system (2026-09-16)

**Decision:** Document this repository with a typed system: `AGENTS.md` as the entry point, `docs/INDEX.md` holding pointers only, one [STATUS.md](STATUS.md), this append-only log, typed docs with frontmatter, and `npm run docs:check`. The rules are in [rules/documentation.md](rules/documentation.md).

**Why:** The project instructions pointed to an `AGENTS.md` that did not exist, and the owner documents every project this way. An index of pointers stays true while facts change, and giving each fact one home stops copies from drifting apart.

**Consequences:** Every behaviour change updates its doc in the same change, and `docs:check` must pass before handover.

## 2. Single page system built with a Motion stage (2026-09-16)

**Context:** The owner wants the site to feel like uditkarode.github.io: a frame that stays on screen while only the content changes, with animated transitions. The site already moved between pages without reloading (Next.js client navigation, checked on the live site), but each page drew its own card and header, so every click replaced the whole card.

**Options considered:**
- A. Keep Next.js and use React's built-in `<ViewTransition>`. No new library. This was the agent's recommendation.
- B. Keep Next.js and add Motion, with a stage in the root layout that owns all visible content.
- C. Rebuild as a Vite and React Router single page app, like the reference site.
- D. Put every section on one address.

**Decision:** B. The root layout holds a client component, `Stage`, which picks the section from the address and animates between sections with Motion. Page files only export metadata. Details are in [reference/architecture.md](reference/architecture.md).

**Why B over A:** It is the closest match to the reference site's springy feel, it behaves the same in every browser, and it gives full control over the order and timing of each animation.

**Why not C:** Pages would no longer arrive as finished HTML, which hurts link previews and search, and direct links need extra hosting rules. The reference site itself shows GitHub's 404 page when /projects is opened directly (checked 2026-09-16).

**Why not D:** It breaks existing addresses and turns four pages into one for search engines.

**Costs accepted:** About 30 KB more JavaScript. Page files that render nothing, which is unusual for Next.js. More animation code to maintain.

**Evidence:** A throwaway build on Next.js 16.3.5, React 19.3.0 and Motion 13.3.0 confirmed finished HTML per page, no reloads, the same animation for Back and Forward, and no console warnings. It also exposed two timing bugs, which [rules/frontend.md](rules/frontend.md) now guards against (rules 8 and 9).

## 3. Keep the space look (2026-09-16)

**Decision:** Keep the star field, shooting stars, purple card, keyboard and mouse icons, and colours. The card becomes the frame that stays on screen and resizes to fit each section. A divider line sits under the title on every section. Titles become two words each: "About Me", "My Projects" and "Contact Me", so the words can roll over.

**Not chosen:** the reference site's flat look, and a flat header floating over the stars.

## 4. The intro plays once per visit (2026-09-16)

**Decision:** The home intro (the line draws itself, then the greeting, the arrow and the icons appear) plays only when the first section of a visit is Home. Returning to Home later in the same visit skips it. A reload or a new tab starts a new visit. Nothing is stored in the browser.

**Not chosen:** a dark and light switch, an accent colour changer, and remembering visitor choices between visits.

## 5. Wrong addresses send visitors home (2026-09-16)

**Decision:** For an unknown address the server still answers 404. The stage then replaces the address with Home in the browser.

**Why:** The owner wants lost visitors to land on Home. Keeping the real 404 answer avoids a "soft 404": Google does not render pages that answer with a status other than 200 (Google Search Central, "JavaScript SEO basics"), so it never sees the redirect.

**Not chosen:** a "lost in space" message inside the card, and the Next.js default 404 page, which on the live site was black text on the black sky with no way back.

## 6. Load JetBrains Mono (2026-09-16)

**Decision:** Load JetBrains Mono with `next/font/google`, which downloads the font at build time and serves it from the site itself.

**Why:** The styles asked for JetBrains Mono but never loaded it, so visitors saw whatever monospace font their device had.

**Consequence:** A build needs internet access to Google Fonts. The owner's computer and Vercel both have it.

## 7. Readable text on phones (2026-09-16)

**Decision:** Body text is never smaller than 14px. A section taller than the screen scrolls inside the card.

**Why:** The About text shrank to 8px on screens narrower than 451px, and the Projects text did the same on short screens such as a phone turned sideways.

## 8. End-to-end test in the repository (2026-09-16)

**Decision:** Add a Playwright test, run with `npm run test:e2e`, covering the section flow, Back and Forward, direct visits, wrong addresses and the intro rule. The test browser is installed inside the project (`PLAYWRIGHT_BROWSERS_PATH=0`), not system-wide.

**Why:** The stage can break without any visible error, and a click-through test catches that.

**Cost accepted:** Playwright and one Chromium build inside `node_modules`, well over 100 MB.

## 9. Details settled while building the stage (2026-09-16)

**Exact versions:** Motion is pinned to 13.3.0 and Playwright to 1.63.0, like Next.js and React already are. Motion 13.4.0 had been published only hours earlier, and a Playwright version change also changes which browser build it downloads.

**Arrow on the last section:** it turns around and moves to the middle of the card, as the old Contact page had it.

**Link previews:** each section now has its own Open Graph and Twitter title and description. Before, every page shared the home page's preview.

**Without JavaScript:** a `<noscript>` style shows the home intro's elements, which otherwise stay hidden until the animation runs.

**Page background:** the black background is painted on `html` only. With the stage in the normal page flow, a black `body` covered the star layer.

**Measured size:** the stage adds about 47 KB of compressed JavaScript to the home page (171 KB before, 218 KB after), not the 30 KB estimated in entry 2. Loading Motion's features later would shrink the first load but grow the total, so they load with the page. Details: [reference/architecture.md](reference/architecture.md), "Size and cost".

## 10. Next.js may add its own block to AGENTS.md (2026-09-16)

**Context:** Next.js 16.3 appends a managed block of AI instructions to `AGENTS.md` when an AI coding tool runs `next dev`. In a folder without `AGENTS.md` it also creates a second, vendor-named instructions file. The setting `agentRules: false` in `next.config.ts` turns this off.

**Decision:** Keep the default. If the block appears in `AGENTS.md`, that is expected.

**Consequences:** The block can show up as an uncommitted change after an AI tool runs the dev server, and again whenever Next.js changes its wording. Because `AGENTS.md` exists, Next.js never creates the vendor-named file here; deleting `AGENTS.md` would bring that back.

## 11. The arrow moves in sequence (2026-09-16)

**Context:** The owner reviewed the stage and reported that, going from Projects to Contact, the arrow jumped from the left to the middle, and turned while it moved, so it looked out of sync. Measured: the arrow jumped to the middle 0.1 s after the click, turned while the old content faded out, then jumped again when the card started to shrink.

**Decision:** The arrow's place follows the content on screen, so it glides together with the card instead of jumping at the click. Turning and gliding never overlap: arriving at the last section it glides to the middle and then turns to point back; leaving it, it turns forward first and then glides back.

**Why:** One movement at a time reads as deliberate. Moving with the card keeps the arrow in step with everything else on the stage.

**Cost accepted:** Arriving at the last section now takes about 1.2 s until the arrow has finished turning (the content itself is fully visible by 0.8 s).

## 12. The arrow turns before it moves (2026-09-16)

**Replaces:** the order in entry 11 for arriving at the last section. Everything else in entry 11 still holds.

**Context:** The owner asked for the arrow to rotate first and then move.

**Decision:** In both directions the arrow turns first, at the click, while the old content fades out. It then glides together with the card once the content has swapped. The turn takes 0.25 s, no longer than the fade-out, so it is always finished before the glide starts.

**Why:** The owner prefers this order. Using the same order both ways also makes the arrow simpler to follow and removes the extra wait from entry 11: arriving at the last section is done in about 0.9 s again, instead of 1.2 s.


## 13. Ten percent of the stars blink (2026-09-18)

**Context:** `src/config/starsConfig.ts` set `blinkingStarPercentage` to 0.5 while its comment claimed 3%, and `src/components/StarBackground.tsx` repeated the 3% claim. Nobody could tell which number was intended (STATUS entry 4).

**Decision:** 0.1, so one star in ten blinks, with the comment saying the same thing. The duplicate comment in `StarBackground.tsx` is gone, leaving the value one home.

**Why:** 0.5 made half the sky blink, which reads as a light show rather than a night sky. 3% is close to invisible at the small screen star count of 100. The owner picked a middle value on purpose instead of crowning one side of a typo.

**Consequences:** This is a visible change. The sky is calmer than the version now live, and it wants a look on a real screen before the commit. No other file reads this value.

## 14. Local preview images live in an ignored `previews/` folder (2026-09-18)

**Context:** A folder named after an AI vendor sat in the repository root holding two stage screenshots and two arrow recordings from the review behind entries 11 and 12. It broke non-negotiable 6 in [AGENTS.md](../AGENTS.md), and it was not ignored, so the next commit would have swallowed it.

**Decision:** Renamed to `previews/` and added to `.gitignore`. The images stay on the owner's disk and never enter the repository.

**Why:** Non-negotiable 6 admits no exceptions, and a rule that is quietly broken stops being a rule. Committing binaries that go stale the moment an animation changes costs history size for pictures nobody refreshes.

**Consequences:** `previews/` is local only. A fresh clone will not have it and no document may link to it, because `docs:check` would call that a broken link. If a picture ever has to be part of the documentation, that is a new decision and a tracked file.

## 15. The Next.js agent block is placed on purpose, not left to appear (2026-09-18)

**Extends:** entry 10, which still holds. Nothing there is replaced.

**Context:** Entry 10 expected the managed block to show up on its own whenever an AI tool ran `next dev`. It never did, for two reasons found on 2026-09-18. First, Next.js writes the block only when `@vercel/detect-agent` recognises an AI coding tool from environment markers, and the shell an agent gets on the owner's computer carries none, so the check returns `isAgent: false`. Second, that shell is a Linux arm64 sandbox while `node_modules` was installed on macOS, so only `@next/swc-darwin-arm64` exists and the sandbox has no network to fetch the Linux binary. `next dev` fails to start there at all.

**Decision:** The block was written by calling Next.js's own `writeAgentFiles` from `node_modules/next/dist/server/lib/generate-agent-files.js` with plain Node, which needs no compiled binary. The bytes are therefore exactly what `next dev` writes, `hasCurrentAgentRules` now reports it as current, and the block is handed over to be committed with this change.

**Why:** Once the block is current, `next dev` leaves `AGENTS.md` alone, so it can never turn up as a surprise uncommitted change on the owner's machine. Typing the block by hand would risk one byte differing, which would make Next.js rewrite the file on every run.

**Consequences:** If a future Next.js release changes the block's wording, `next dev` rewrites it once and the diff comes back. Leave the block exactly as Next.js wrote it. Because `AGENTS.md` exists and hosts the block, no vendor named instructions file is ever created here.
