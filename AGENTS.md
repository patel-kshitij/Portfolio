# AGENTS.md

The working agreement for anyone changing this repository, person or coding agent.
Read this file first, then the rule file for the area you are about to touch.
Everything else is mapped in [docs/INDEX.md](docs/INDEX.md).

## Non-negotiables

1. **The owner does all git and deploy work.** Agents never run git, never commit or push, and never touch GitHub or Vercel. Hand over the changed files for review, with a suggested commit message that has no attribution trailer.
2. **Agents install nothing on the owner's computer.** Build and test in your own workspace. The owner runs `npm install` and `npm run test:e2e:install`, so the lockfile is always produced on the owner's machine.
3. **Architecture before code.** A new feature or a structural change starts with options, their pros and cons, and a decision recorded in [docs/DECISIONS.md](docs/DECISIONS.md).
4. **Docs change together with the behaviour they describe,** in the same change. See [docs/rules/documentation.md](docs/rules/documentation.md).
5. **All checks pass before handover:** `npm run content:check`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:e2e` and `npm run docs:check`.
6. **No file or folder in this repository is named after an AI vendor.** This file is the only entry point for agents.

## Routing table

| If you are touching | Read first |
| --- | --- |
| `src/**` (pages, stage, sections, styles, content) | [docs/rules/frontend.md](docs/rules/frontend.md) |
| `e2e/**` or `playwright.config.ts` | [docs/rules/frontend.md](docs/rules/frontend.md), section "Testing" |
| `docs/**`, `AGENTS.md`, `README.md` or `scripts/docs-check.mjs` | [docs/rules/documentation.md](docs/rules/documentation.md) |
| `src/content/projects/**` or `scripts/content-build.mjs` | [docs/guides/case-studies.md](docs/guides/case-studies.md), then [docs/rules/frontend.md](docs/rules/frontend.md) rules 4 and 4a |

Rule files do not load by themselves. Open the one for your area before you change anything there.

If the owner pastes a block that starts with `=== PORTFOLIO HANDOFF v1 ===`, it is project material from another chat. Follow [docs/guides/case-studies.md](docs/guides/case-studies.md), section "Receiving a handoff".

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
