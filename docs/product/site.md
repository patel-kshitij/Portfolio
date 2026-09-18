---
title: The site
type: product
owner: Kshitij
reviewed: 2026-09-16
---

# The site

## What it is

Kshitij Patel's personal portfolio at www.patelkshitij.com. It introduces him, shows his projects, and makes him easy to contact.

## What a visitor sees

- A night sky with twinkling stars and the occasional shooting star, always behind everything else.
- A purple card in the middle of the screen. The card never disappears; only what is inside it changes.
- Four sections in a fixed order: Home, About, Projects, Contact. A round arrow button moves to the next section. On the last section the arrow turns to point back, then glides to the middle with the card, and returns to Home. The exact order, titles and page descriptions live in `src/content/sections.ts`.

## How it must behave

1. **Moving between sections never reloads the page.** The old content fades out, the title words roll over, the card resizes to fit, and the new content fades in, all in under a second.
2. **Every section has its own address:** `/`, `/about`, `/projects` and `/contact`. The address changes as the visitor moves, and the browser's Back and Forward buttons move between sections with the same animation.
3. **Opening an address directly shows that section straight away,** already visible, with its own page title and description for search engines and link previews.
4. **The intro plays once per visit.** When a visit starts on Home, the line draws itself, then the greeting, the arrow and the icons appear. Coming back to Home later in the same visit skips the intro.
5. **Wrong addresses send the visitor to Home,** while the server still tells search engines that the page does not exist.
6. **Reduced motion is respected.** Visitors whose device asks for less motion get fades only, with no sliding or resizing.
7. **Text stays readable on phones.** Body text is never smaller than 14px, and a tall section scrolls inside the card.
8. **Everything works from the keyboard.** The arrow and all other links are real links.

## Deliberately left out

A dark and light switch, an accent colour changer, and remembering visitor choices. See [DECISIONS.md](../DECISIONS.md), entry 4.
