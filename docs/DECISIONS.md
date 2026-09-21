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

## 16. First batch of fixes from the 2026-09-18 site review (2026-09-18)

**Context:** The owner asked for a full review of the live site. It was read file by file and then measured in a browser at 320x568, 740x360 and full desktop. The findings are recorded in [STATUS.md](STATUS.md). This entry covers only the first batch: the changes that needed no new structure. Navigation and the content rewrite are separate work.

**Decisions, one per change:**

1. **One focus ring for every link.** `src/app/globals.css` became `src/app/globals.scss` so it can read `src/styles/_tokens.scss`, and it now carries a single `a:focus-visible` rule. The two copies of that rule in `Stage.module.scss` and `Sections.module.scss` are gone; those links keep only their `border-radius`, which the outline follows. Before this, the project links and the links inside Contact had no visible focus ring at all on the purple card.

2. **The sky obeys reduced motion.** [product/site.md](product/site.md) point 6 promised that visitors who ask for less motion get fades only. That was true of the card and false of the sky: 38 stars were measured blinking on the live site with 4 shooting stars on screen at once, none of it guarded. Blinking is now inside `@media (prefers-reduced-motion: no-preference)`. Shooting stars are not rendered at all for those visitors, and their timers never start, because a shooting star that does not move is only a white smear parked on the sky. The owner chose that over freezing them in place.

3. **The name no longer clips at 320px.** At 2rem the words "Kshitij Patel" need 250px and a 320px screen leaves 248px inside the card, which has `overflow: hidden`, so the last letter was shaved. A new `$bp-tiny: 380px` breakpoint steps the name down to 1.75rem. The owner chose this over letting the name wrap onto two lines or trimming the card's padding, because it keeps the greeting's shape and is invisible on any wider phone.

4. **Every shooting star gets its own number.** A counter in a ref replaces `key={Date.now()}` (STATUS entry 11).

5. **Phone home screen and browser bar.** A `viewport` export in `src/app/layout.tsx` sets `themeColor` to the black of the sky and owns `colorScheme`, which moved out of the stylesheet so the fact has one home. `src/app/icon.png` and `src/app/apple-icon.png` were drawn for this change: the night sky with a purple K in JetBrains Mono, the site's own font and colour.

6. **The sitemap stops lying about dates.** It reported `new Date()`, so every build claimed all four pages had changed. Each section in `src/content/sections.ts` now carries its own `lastModified`, set by hand when its words change.

7. **The `host` line is out of `robots.ts`.** Only Yandex reads that directive.

8. **Person structured data.** `src/lib/site.ts` gained `personJsonLd()`, built entirely from the values already in that file, and the root layout renders it as one JSON-LD script. Nothing about Kshitij is written twice, and nothing is invented: it carries the name, address, description, email and the two profile links that the site already shows.

**Not chosen in this batch:** anything that changes what the site says, or that adds navigation. Those are STATUS entries 3 and 14 and get their own decisions.

**Consequences:** Items 2, 3 and 5 are visible changes and want a look on a real screen before the commit. `src/app/globals.css` no longer exists; anything importing it must import `globals.scss`. Adding a section to `src/content/sections.ts` now requires a `lastModified` date, and TypeScript will say so.

## 17. Content refresh, project cards, availability, keyboard and swipe, resume (2026-09-18)

**Context:** The owner asked what the site should gain next and for a review of its words. The About text called him a "newbie", stated an age, listed Python, Java and Go, and said nothing about AWS, serverless, TypeScript or the client work he has shipped. The site description repeated the same outdated list. The Projects section had four one-line coursework entries, one without a link, and none of his real work. Contact had no availability signal and no resume. The keyboard and mouse icons promised interaction that did not exist (STATUS entries 3 and 17).

**Options put to the owner, and what he chose:**

- *Navigation menu:* inside the card header (N1), a bar across the top of the screen (N2), dots down the edge (N3), or not yet. **Not yet.** The options stay here for the next round; STATUS entry 14 remains open.
- *Footer:* a thin dim line under the card (F1) or none (F2). **None.** The resume link lives on Contact.
- *Project cards:* richer cards in the current list (B1), a page per project (B2), or screenshots (B3). **B1.** A page per project would leave the four-section loop and needs its own decision.
- *About tone:* same voice with new facts, professional and short, or unchanged. **Same voice, new facts.** The jokes and the travel and food paragraph stay; every claim now comes from his resume or his own words.
- *Availability line:* three wordings. **The warmer one:** "Looking for my next team, and taking freelance work meanwhile." under the name on Home, and a full sentence on Contact. One value in `src/lib/site.ts` with two lengths.
- *Resume:* a PDF in the repository, a section built from data, or none. **PDF**, served as `public/resume.pdf` and linked from Contact. **The copy on the site has the phone number removed**; the full resume stays off the internet. The owner called the current PDF temporary; replacing the file is the only step when the final one is ready.
- *Keyboard and swipe:* build it or drop the icons. **Build it.**

**Decisions on the details:**

1. **Projects are structured.** Each entry in `src/content/projects.ts` carries `years`, `problem`, `built`, `tags`, and optional `live` and `code` links. The card title links to the live product first, the code second, and is plain text otherwise. Qrakr and Work Board are new. Player Performance Prediction stays; the owner is adding its code link (STATUS entry 23).
2. **Only Left and Right move the stage.** Up and Down are left to the browser, because they scroll a tall section inside the card (decision 7). Right follows the arrow, so after the last section it goes to Home. Left goes to the previous section and stops at Home; wrapping backwards from Home to Contact would surprise more people than it helps. A key press is ignored while a modifier key is held or while a form control has focus.
3. **Only fingers swipe.** A mouse drag selects text and keeps doing so. A swipe needs at least 50px sideways and more sideways than up or down. The card gets `touch-action: pan-y`, so the browser keeps vertical scrolling and leaves sideways movement to the handlers. A swipe to the left goes forward, a swipe to the right goes back, with the same stops as the keys.
4. **Keys and swipes use the router, not a link.** Rule 6 in [rules/frontend.md](rules/frontend.md) said sections only change through real links. That stays true for anything a visitor clicks or taps. Key presses and swipes are not clicks, so `useStageInput` calls `router.push` with `scroll: false`. The rule now says so.
5. **The icons explain themselves.** The keyboard and mouse icons carry a tooltip and a visually hidden sentence for screen readers, both from one constant in `src/components/stage/useStageInput.ts`.
6. **Pages the words changed on get a new `lastModified`:** all four, because Home gained the availability line.

**Not chosen:** a contact form (needs a backend or a paid service and attracts spam), a blog (an empty one looks worse than none), a skills logo wall (the tools are woven into About and the project tags instead), analytics (STATUS entry 21 stays open), and Up and Down as section keys.

**Consequences:** Every section's words changed, so the whole site wants a read on a real screen before the commit. `src/content/projects.ts` has a new shape; TypeScript rejects an entry without `years`, `problem`, `built` and `tags`. The e2e suite gained four tests. `public/` exists for the first time. The folder in the repository root named after an AI vendor, which held three screenshots from the 2026-09-18 review, was emptied into `previews/` (decision 14) and removed, with the owner's permission for that one deletion.

## 18. Projects are a grid of tiles (2026-09-18)

**Replaces:** detail 1 of entry 17 (the shape of a project entry). The rest of entry 17 holds.

**Context:** The owner looked at the stacked cards from entry 17 and rejected them: two paragraphs per project read like a resume, six tall cards made the section scroll inside the card, and the boxes, the pill tags, the lone "Live" link and the small year next to each title looked wrong to him.

**Options:** one project at a time with dots to step through; a grid of small tiles; a compact list that opens on tap; the same stacked cards with less text. **Chosen: the grid.**

**Decision:** `src/content/projects.ts` entries carry `title`, one `summary` sentence, `tags`, and optional `live` and `code`. The years and the two paragraphs are gone. Each tile shows the title, the sentence, and the tools as one dim line separated by middle dots. The title links to the live site first and the code second, the link stretches over the whole tile so the tile is one target, and a small dim "live" or "code" marker in the corner says where it leads. Tiles fill the card three across on a desktop, two on a tablet and one on a phone, using `auto-fit` with a 300px minimum and a 1100px cap on the grid, so no breakpoint rule is needed and a fourth column never appears.

**Why:** Six tiles fit a desktop screen without scrolling. One sentence forces each project to say the one thing that matters. A tile that is entirely a link needs no separate "Live" word.

**Consequences:** A phone still scrolls the section, but each tile is a third of the old height. The e2e project test now checks tiles. The `years` field is gone; if dates come back they get their own decision.

## 19. Projects are a constellation (2026-09-18)

**Replaces:** entry 18 (the tile grid). Entry 18's content shape (`title`, one `summary`, `tags`, optional `live` and `code`) still holds; only how it is shown changes.

**Context:** With the tiles in place the owner said the site still felt like "the basic site that everyone has" and asked for something built around the theme. Five ideas were put to him: the real night sky over Halifax as the background, the projects drawn as a constellation, a live signal from his work, and textures (star streaks on navigation, a sky that follows the mouse, mission-log wording, a HUD-styled card). **He chose the constellation** and no textures.

**Options on the constellation, and his choices:**

- *Where it lives:* in the real sky behind a smaller card, or inside the card as a window onto the sky. **Inside the card.** The sky behind the card has nowhere to be on a phone, and the card rule (it holds everything) would break.
- *Shape:* the letter K, a free shape, or the Big Dipper's. **A free shape.**
- *A click on a star:* selects it, or opens its link. **Selects it**, with the first star (Qrakr) selected on arrival so the panel is never empty.

**Decision:** `src/components/sections/ProjectsSection.tsx` draws a panel with the proportions of a 100 by 60 drawing space: faint fixed dust, the lines from `constellationLines`, and one real `<button>` per project placed by percentage from its `star` position in `src/content/projects.ts`. Size 3 is the main work, size 1 the smallest. Hovering, focusing or clicking a star selects it; the panel beside the sky (below it on a phone) shows that project's title, sentence, tools and link. All six panels are in the HTML, stacked in one grid cell so the card never changes size; the unselected ones are `visibility: hidden`, and a `<noscript>` style shows them all when JavaScript is off. Each star has a name for screen readers ("Qrakr, project 1 of 6") and `aria-pressed`. The lines draw themselves in on arrival and the panel fades between projects; visitors who ask for reduced motion get neither, through Motion's `useReducedMotion`. Timings live in `timing.ts` under `constellation`. The focus ring in `globals.scss` now covers buttons too, since the stars are the site's first buttons.

**Why:** It is the one idea where the theme carries the content instead of sitting behind it, and the card keeps its rules.

**Details settled while building:** the lines must not use `vector-effect: non-scaling-stroke`, because Motion draws them with a dash pattern and that setting makes browsers measure the dashes in pixels, which leaves gaps; the stroke is in drawing units instead. Labels sit on the side named by `labelSide`, chosen by hand so no label runs off the panel or over another on a 375px phone.

**Consequences:** `src/styles/Constellation.module.scss` is new and the tile styles are gone. Adding a project now means choosing a position, a size, a label side and at least one line. The e2e project test checks selection, the card's height and the keyboard. About 5 KB more JavaScript. The other ideas (the real Halifax sky, the live signal, the textures) are not rejected; they wait for the owner.

## 20. Node.js 24, pinned in package.json (2026-09-21)

**Context:** Vercel disables Node.js 20 on 2026-10-01; after that, a project set to 20 fails on every new deployment. `package.json` named no Node version, so Vercel used the one picked in the project's dashboard settings, which was 20.

**Options:** pin `24.x` in `package.json`; pin `22.x` in `package.json`; change only the dashboard setting. **Chosen: pin `24.x`.**

**Decision:** `package.json` has `"engines": { "node": "24.x" }`, which overrides the dashboard setting on every deployment. `@types/node` moves to `^24.0.0` so the types match the runtime.

**Why:** A version written in the repository is visible in review and cannot drift in a dashboard. 24 is Vercel's default and has the longest support left (about April 2028); 22 ends about April 2027 and would mean doing this again within a year. Next.js 16 needs Node 20.9 or newer, so 24 is inside its range.

**Consequences:** The owner's computer runs Node 22; npm warns about the engine until it is updated to 24, and the site still builds. `npm install` must be run once so `package-lock.json` records the new `engines` and `@types/node`. The dashboard setting no longer matters but can be set to 24.x too, so it does not mislead.

## 21. Projects are tiles with a headline, groups, architecture drawings and case studies (2026-09-21)

**Replaces:** entry 19 (the constellation). Entry 18's rule that every project has one `summary` sentence, `tags`, and optional `live` and `code` still holds.

**Context:** The owner was not satisfied with the constellation. His reasons: the section said nothing about the work, the star map was decoration pretending to be navigation, it was hard to scan with one project visible at a time, it still looked like every other portfolio, and it had no room or grouping for more projects. Four directions were mocked inside the real card: a grouped list (the "manifest"), one headline project with the rest below, case study pages, and the architecture of each project instead of a screenshot. He chose the groups, the headline and the architecture, laid out as tiles, with case studies behind them.

**Options on the two structural questions, and his choices:**

- *Where a case study lives:* inside the card, at its own address such as `/projects/qrakr`, with the same transition as a section change; or as a separate plain page outside the card. **Inside the card.** It keeps the one rule that the card holds everything, and Back returns to the tiles with the same animation.
- *What goes live before the words are written:* only projects whose case study has been written get the "Case study" label and a page; or the agent drafts the case studies and the owner corrects them; or placeholders shown as "coming soon". **Only written case studies go live.** Nothing invented ever reaches the site.

**Decision:**

- `src/content/projects.ts` gives every project a `slug`, a `group` (Products, Backend and cloud, Data), its `architecture` (boxes on a small grid and the arrows between them), and optionally `facts` (up to three short lines) and a `caseStudy`. A project's status (Live, Code, Soon) is worked out from `live` and `code`, never written by hand.
- `src/components/sections/ProjectsSection.tsx` shows filter buttons for the groups, one headline tile, and a small tile for every other project. The headline shows the full architecture drawing, the facts when there are any, the tools, the link, and "Read the case study" when one exists. Each small tile shows a tiny version of its own drawing, dots and lines without labels. Clicking a small tile makes it the headline. The first project in the list is the headline on arrival.
- A case study is a stage view, not a new section. `getViewByPath()` in `src/content/sections.ts` turns `/projects/<slug>` into the Projects section plus that project, and `Stage` keys its content, its title words and its `shownKey` by the view. The arrow still leads to Contact; the Left key and a swipe to the right go back to `/projects`. `src/app/projects/[slug]/page.tsx` exports metadata and returns `null`, like every page file, and prerenders only projects that have a case study; any other slug answers 404 and the stage sends the visitor home.
- `src/components/ArchitectureDiagram.tsx` draws every architecture as SVG from the same data, in two sizes. On a case study the arrows carry step numbers that match a numbered list under the drawing.
- The card animates when the Projects section changes height (a filter, or a new headline). `Stage` wraps the card in Motion's `LayoutGroup`, so a layout change inside the section makes the card measure again, the same way a section change does.

**Why:** The tiles fix scanning and room to grow; the headline fixes the sense of what matters most; the architecture is the one picture of backend work that says something and that no generic portfolio has; the case studies carry the proof. Putting case studies inside the card reuses the stage instead of building a second kind of page.

**Costs accepted:** Every project needs an architecture, even small ones. The stage now knows about one kind of address below a section. Until a case study is written the case study page, its route and its e2e tests exist but are not reachable on the live site; the e2e tests for it skip themselves while no project has one. The headline tile looks thin until facts are written.

**Consequences:** `src/styles/Constellation.module.scss` is deleted; `src/styles/Projects.module.scss`, `src/styles/CaseStudy.module.scss` and `src/styles/Architecture.module.scss` are new. The `star` field and `constellationLines` are gone. Entry 19's rule that selecting a project never changes the card's size is replaced by the `LayoutGroup` rule above. The architecture drawings shipped with this change were drafted by the agent from each project's existing sentence and tools and must be checked by the owner before they go live.

## 22. Project words live in one YAML file per project, and case studies publish only when marked (2026-09-21)

**Replaces:** the part of entry 21 that put project content in `src/content/projects.ts`, and entry 21's rule that only a written case study exists. The rest of entry 21 holds.

**Context:** The owner wants to gather the real architecture and case study material in other chats, bring it back in a fixed shape, and edit it himself later without touching code. Entry 21 kept the content as TypeScript, where every change means quotes, commas and brackets in one long file.

**Options:** one YAML file per project, checked by a script; keep everything in `src/content/projects.ts`; one Markdown file per project with the case study as prose under headings. **Chosen: one YAML file per project.**

**Decision:**

- Every project is `src/content/projects/<slug>.yaml`, in the same shape the prompt in [guides/case-studies.md](guides/case-studies.md) asks another chat to produce. `src/content/projects/index.yaml` holds the filter groups and the order.
- `scripts/content-build.mjs` reads and checks them and writes `src/content/projects.generated.json`, which `src/content/projects.ts` imports. The generated file is not committed. `npm run content:check` only checks; `npm run content:build` runs by itself before `dev`, `build`, `typecheck` and `test:e2e`, so Vercel builds it too. Any problem stops the build with a plain sentence naming the file.
- A case study reaches the site only when it says `published: true`. Drafts stay in the file, hidden. This replaces entry 21's "only owner's words" rule: an agent may draft from the owner's answers and the code, and the owner publishes after reading every line.
- The package `yaml` 2.9.1 (no dependencies of its own) reads the files. It is a development dependency, because only the build script uses it; the site sends no YAML reader to visitors.

**Why YAML over TypeScript:** plain text with no punctuation to get wrong, one file per project, and the files match what the prompt returns, so saving an answer is a copy and paste. **Why not Markdown:** splitting prose back into steps, decisions and numbers breaks as soon as a heading changes.

**Costs accepted:** One more dependency and one more script. Types are no longer checked by TypeScript at the source; the script's checks replace them. The group ids are now plain strings from `index.yaml`.

