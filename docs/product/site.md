---
title: The site
type: product
owner: Kshitij
reviewed: 2026-09-21
---

# The site

## What it is

Kshitij Patel's personal portfolio at www.patelkshitij.com. It introduces him, shows his projects, and makes him easy to contact.

## What a visitor sees

- A night sky with twinkling stars and the occasional shooting star, always behind everything else.
- A purple card in the middle of the screen. The card never disappears; only what is inside it changes.
- Four sections in a fixed order: Home, About, Projects, Contact. Home greets the visitor and says what Kshitij is open to. About is a few paragraphs in his own voice. Projects is a set of tiles: filter buttons for the groups (Products, Backend and cloud, Data), one big headline tile, and a small tile for every other project. The headline shows the project's sentence, a drawing of how it is wired (its architecture), its facts when they are written, its tools and its link, and a "Read the case study" button when a case study is written. Each small tile shows a tiny version of its drawing, its name, its status (Live, Code or Soon), its sentence and its tools; clicking one makes it the headline. A case study is a longer read inside the card, at its own address: the problem, the drawing with numbered steps, the decisions, any numbers, and where the project is now. On a case study the round arrow turns around and leads back to the tiles. The entries live in `src/content/projects/`, one file per project. Contact has the availability sentence, the email link, the resume (a PDF at `/resume.pdf`, without a phone number), and the GitHub and LinkedIn links.
- A round arrow button moves to the next section. On the last section the arrow turns to point back, then glides to the middle with the card, and returns to Home. The exact order, titles and page descriptions live in `src/content/sections.ts`.

## How it must behave

1. **Moving between sections never reloads the page.** The old content fades out, the title words roll over, the card resizes to fit, and the new content fades in, all in under a second.
2. **Every section has its own address:** `/`, `/about`, `/projects` and `/contact`, and every written case study has one below Projects, such as `/projects/qrakr`. The address changes as the visitor moves, and the browser's Back and Forward buttons move between them with the same animation.
3. **Opening an address directly shows that section straight away,** already visible, with its own page title and description for search engines and link previews.
4. **The intro plays once per visit.** When a visit starts on Home, the line draws itself, then the greeting, the arrow and the icons appear. Coming back to Home later in the same visit skips the intro.
5. **Wrong addresses send the visitor to Home,** while the server still tells search engines that the page does not exist.
6. **Reduced motion is respected on the whole screen.** Visitors whose device asks for less motion get fades only, with no sliding or resizing, and the sky goes still: the stars stop blinking and no shooting stars appear.
7. **Text stays readable on phones.** Body text is never smaller than 14px, and a tall section scrolls inside the card.
8. **Everything works from the keyboard.** The arrow and all other links are real links.
9. **The projects work from the keyboard and without JavaScript.** Every filter and small tile is a real button, and after a tile is picked the focus moves to the new headline. The card grows or shrinks smoothly when a filter or a new headline changes its height. Without JavaScript every project's name, sentence and tools are still on the page, and the case study link works.
10. **The Left and Right arrow keys, and a sideways swipe, move between sections.** Right and a swipe to the left go forward, and after the last section that means Home, like the arrow. Left and a swipe to the right go back and stop at Home. On a case study, both Right and Left go back to the Projects tiles, like the turned arrow. Up and Down scroll a tall section as usual. A mouse drag never moves the stage. The keyboard and mouse icons in the card header say this in a tooltip and to screen readers.
11. **Nothing invented goes live.** A project gets its facts, and its case study page, only once the owner has written them. Until then its headline shows the sentence, the drawing, the tools and the link.

## Deliberately left out

A dark and light switch, an accent colour changer, and remembering visitor choices ([DECISIONS.md](../DECISIONS.md), entry 4). A contact form, a blog and a skills logo wall (entry 17). A navigation menu and a footer are not left out for good; they are deferred, with the options recorded in entry 17.
