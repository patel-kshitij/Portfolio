---
title: Documentation rules
type: rules
owner: Kshitij
reviewed: 2026-09-18
---

# Documentation rules

## In plain English

The documentation works like a small library. [INDEX.md](../INDEX.md) is the catalogue: it only tells you which shelf to look on. Every book carries a label saying what kind of book it is. Each fact is written in exactly one book, and other books point to it instead of copying it. A small checker (`npm run docs:check`) keeps the catalogue and the labels honest.

## The rules

1. **INDEX.md holds zero facts.** It contains only pointers of the form "question, then file". When you learn something new, write it in the right typed doc. If that doc is new, add one pointer line to INDEX.md.
   Why: file names change rarely and facts change often. A list of pointers stays true; a list of facts goes stale.
2. **Every doc under `docs/` except INDEX.md has exactly one type,** declared in its frontmatter. If a doc needs two types, it is two docs.

   | Type | What it holds | Example |
   | --- | --- | --- |
   | `rules` | How things must be done | this file |
   | `reference` | How things work right now | [architecture.md](../reference/architecture.md) |
   | `decision` | The append-only decision log | [DECISIONS.md](../DECISIONS.md) |
   | `guide` | Step by step instructions | [development.md](../guides/development.md) |
   | `status` | The one list of open work and known problems | [STATUS.md](../STATUS.md) |
   | `product` | What the site must do for visitors | [site.md](../product/site.md) |

3. **Frontmatter has four required fields:** `title`, `type`, `owner`, and `reviewed` (a date like 2026-09-16: the last day someone read the doc against the code).
4. **There is exactly one status doc,** [STATUS.md](../STATUS.md). Never start a second to-do list anywhere else, including in code comments.
5. **Each fact has one home.** Other docs link to that home. Code paths are written as inline code (`src/...`), not as links, so moving code never breaks the docs.
6. **DECISIONS.md is append-only.** Never edit or delete an entry. To change a decision, add a new entry that names the entry it replaces.
7. **Same change rule.** A change in behaviour updates its doc in the same change.
8. **Only update `reviewed` after reading the doc against the code.** Never update dates in bulk. An old date is honest; a faked date is not.
9. **Dated audits are the one exemption.** A file named `AUDIT-YYYY-MM-DD.md` in the repository root is skipped by the checker, which warns on every run until its findings are moved into STATUS.md and the file is deleted. Never add frontmatter to an audit file to quiet the checker.

## Entry files

`AGENTS.md`, `README.md` and `docs/INDEX.md` are entry points, not typed docs. They have no frontmatter, but their links are checked.

`AGENTS.md` ends with a managed block marked `nextjs-agent-rules`, written there by Next.js itself ([DECISIONS.md](../DECISIONS.md), entries 10 and 15). Leave it exactly as Next.js wrote it. `next dev` rewrites it only if a future Next.js release changes its wording.

## The checker

`npm run docs:check` runs `scripts/docs-check.mjs`. It **fails** when:

- a doc under `docs/` has missing or incomplete frontmatter, an unknown type, or a badly written or future `reviewed` date;
- there is not exactly one `status` doc;
- a doc under `docs/` is not linked from INDEX.md;
- a list item in INDEX.md has no link;
- a relative link in `AGENTS.md`, `README.md` or any doc points to a file that does not exist.

It only **warns** when a doc has not been reviewed for longer than its type allows:

| Type | Warn after |
| --- | --- |
| `status` | 30 days |
| `reference` | 90 days |
| `rules`, `guide`, `product` | 180 days |
| `decision` | never |

Why warn instead of fail: a check that fails because of a date teaches people to fake the date.
