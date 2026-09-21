---
title: Frontend rules
type: rules
owner: Kshitij
reviewed: 2026-09-18
---

# Frontend rules

If you have not seen how the stage works, read [reference/architecture.md](../reference/architecture.md) first.

## Sections and content

1. **`src/content/sections.ts` is the only place that defines sections:** order, addresses, link labels, title words, page titles, descriptions, sitemap priority and the `lastModified` date the sitemap reports. Nothing else hard-codes a section address or title. Change a section's `lastModified` when you change its words, and never otherwise.
2. **Section components in `src/components/sections/` draw content only.** No card, no header, no arrow, and no navigation logic.
3. **Page files (`src/app/**/page.tsx`) export `metadata` and return `null`.** Never put visible content in a page file. The stage cannot animate content it does not own, so that content would pop in and out without a transition.
4. **Site-wide facts** (name, address, email, social links, the resume path, the availability line) come from `src/lib/site.ts`. Project entries come from `src/content/projects.ts`, and every entry carries `title`, one `summary` sentence, `tags` and a `star` (position on a 100 by 60 sky, size 1 to 3, label side); `live` and `code` are optional. `constellationLines` names which stars are joined ([DECISIONS.md](../DECISIONS.md) entries 18 and 19). Words that belong to a section stay in that section's component; words that appear in more than one place get one home in `site.ts`.

## The stage

5. **`Stage` always renders `{children}`,** even though the pages render nothing. Next.js needs it for its not-found page and scroll handling.
6. **Anything a visitor clicks or taps to change section is a `next/link`,** never a `router.push` inside a click handler. Real links work from the keyboard, with "open in new tab", and for search engines. The router is called in exactly two places: `router.replace('/')` for unknown addresses, and `router.push(path, { scroll: false })` in `src/components/stage/useStageInput.ts` for arrow keys and swipes, which are not clicks and have no link to be ([DECISIONS.md](../DECISIONS.md) entry 17).
6a. **Only Left and Right are section keys, and only fingers swipe.** Never bind Up or Down, which scroll a tall section, and never treat a mouse drag as a swipe. A key press is ignored while a modifier key is held or a form control has focus. The swipe distance lives in `useStageInput.ts`, not in `timing.ts`, because it is a distance.
7. **Motion imports:** use the `m` components from `motion/react-m`, and load features once through `LazyMotion strict` in `Stage`. Never import the full `motion` component; strict mode throws if you do.
8. **Put delays on the `animate` transition only,** never on a shared `transition` prop. A shared transition is also used for the exit, so the old content would wait out the intro delay before leaving.
9. **Keep the `shownId` state.** Setting it in `onExitComplete` makes the card re-render at the moment the content swaps, and that re-render is what lets Motion animate the card's size. Without it the card jumps. The arrow's place follows it too.
10. **The arrow turns first and moves second, never both at once.** Its direction follows the address, so it turns at the click while the old content fades out, and its turn must not last longer than the exit. Its place follows `shownId` (the content on screen), so it glides at the swap, with the card. Only the element that actually moves (the arrow's slot) carries the `layout` prop, because a `layout` prop on its full-width row cannot see the arrow move inside it.
11. **Never read a ref during render to decide what to draw.** React's lint rules reject it. The intro rule adjusts state during render when the address changes instead.
12. **Respect reduced motion, everywhere.** A component that animates an SVG attribute (the constellation's lines) checks `useReducedMotion()` itself, because `MotionConfig` only covers transforms and layout. Everything on the card animates inside `MotionConfig reducedMotion="user"`. The sky is not inside it, so it guards itself: blinking stars sit in `@media (prefers-reduced-motion: no-preference)` and shooting stars are not rendered at all for those visitors. Never add an animation, in CSS or in JavaScript, that ignores `prefers-reduced-motion`.
13. **Never import Next.js internals** (anything under `next/dist/`).
14. **All durations and delays live in `src/components/stage/timing.ts`.** Do not write timing numbers inside components.
15. **Keep the `<noscript>` style in `Stage` in step with the intro.** If an element starts hidden during the intro, the style must show it when JavaScript is off.

## Styles

16. **Styles are SCSS modules in `src/styles/`** (`Sections.module.scss` for Home, About and Contact, `Constellation.module.scss` for Projects). Shared colours, sizes and breakpoints live in `src/styles/_tokens.scss`. The one global stylesheet is `src/app/globals.scss`, which reads the same tokens.
17. **No CSS transforms on the card or on anything with a Motion `layout` prop.** Motion owns their `transform` while it animates. Centre things with flexbox or grid instead.
18. **Body text is at least 14px (0.875rem) on every screen.** Tall content scrolls inside the card's content area.
19. **The font is JetBrains Mono,** loaded once in `src/app/layout.tsx` through `next/font/google` and exposed as the CSS variable `--font-mono`. Do not add other font loaders.
20. **Never give `body` a background.** The black is painted on `html`; the star layer sits at `z-index: -1` and a painted `body` would hide it.
20a. **The focus ring is written once,** as `a:focus-visible, button:focus-visible` in `src/app/globals.scss`. A link or button may set its own `border-radius`, which the outline follows, but never its own outline. Numbers here are kept as they are, because [DECISIONS.md](../DECISIONS.md) entry 2 refers to rules by number.

## Icons and accessibility

21. **Icons live in `src/components/icons.tsx`.** Decorative icons get `aria-hidden`; links that only show an icon get an `aria-label`. SVG attributes use React's camelCase names (`strokeWidth`, not `stroke-width`).
22. **External links open in a new tab** with `rel="noopener noreferrer"`. The resume link counts as one.
22b. **The constellation's lines never get `vector-effect: non-scaling-stroke`.** Motion draws them with a dash pattern, and that setting makes browsers measure the dashes in pixels, so the finished line shows gaps ([DECISIONS.md](../DECISIONS.md) entry 19).
22a. **Text that is only for screen readers** uses the `srOnly` class in `src/styles/Stage.module.scss`. Never hide it with `display: none`, which hides it from screen readers too.

## Testing

23. **`e2e/stage.spec.ts` must pass before handover** (`npm run test:e2e`). If you change how sections, addresses, the intro or unknown addresses behave, update the test in the same change.
24. **Tests find elements by role and label** (`getByRole`, `getByLabel`), not by CSS class. The stable hooks are the `data-section`, `data-intro` and `data-turned` attributes that the stage sets. A swipe is simulated by dispatching `pointerdown` and `pointerup` with `pointerType: 'touch'` on the card; Playwright's own touchscreen tap cannot travel sideways. Playwright counts `opacity: 0` as visible, so check `toHaveCSS('opacity', '1')` when it matters.
25. **Tests never depend on animation timing.** Wait for the result (an address, a visible heading, an attribute value), not for a fixed number of milliseconds.
