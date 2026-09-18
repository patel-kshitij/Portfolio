---
title: Development guide
type: guide
owner: Kshitij
reviewed: 2026-09-16
---

# Development guide

## What you need

- Node.js 22 or newer, with npm.
- Internet access when you build or run the site in development, because the JetBrains Mono font is downloaded from Google Fonts at build time.

## First setup

```bash
npm install                 # installs everything into node_modules
npm run test:e2e:install    # downloads the test browser (only needed for npm run test:e2e)
```

The test browser is stored inside `node_modules`, not system-wide, because the test scripts set `PLAYWRIGHT_BROWSERS_PATH=0`. Deleting `node_modules` removes it. After a fresh `npm install`, run `npm run test:e2e:install` again.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the site at http://localhost:3000 and updates it as you edit |
| `npm run build` | Builds the production site into `.next/` |
| `npm run start` | Serves the last build at http://localhost:3000 |
| `npm run typecheck` | Checks the TypeScript types |
| `npm run lint` | Checks code style and React rules. `npm run lint:fix` fixes what it can |
| `npm run test:e2e:install` | Downloads the Chromium build that the end-to-end test uses |
| `npm run test:e2e` | Builds the site, serves it on port 3100, and clicks through it in Chromium |
| `npm run docs:check` | Checks the documentation system. See [rules/documentation.md](../rules/documentation.md) |

## Open the site at localhost

While `npm run dev` runs, open **http://localhost:3000**, not the "Network" address it also prints (such as http://192.168.x.x:3000). The Next.js development server only accepts its live connection from localhost. From any other address it refuses that connection, and every click then reloads the whole page, so the sections stop gliding into each other. When this happens, the dev server log shows `Blocked cross-origin request to Next.js dev resource /_next/hmr`. The production server (`npm run build`, then `npm run start`) has no such limit.

## Before you commit

Run all five checks: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:e2e` and `npm run docs:check`.

If `npm run test:e2e` fails, the trace of the failed test is saved in `test-results/`. Open it with `npx playwright show-trace <path to trace.zip>` to replay the run step by step.

## Add a new section

1. Add an entry to `src/content/sections.ts`, in the position where the section should appear.
2. Create its content component in `src/components/sections/`. Content only; see [rules/frontend.md](../rules/frontend.md).
3. Add the component to the `sectionContent` map in `src/components/stage/Stage.tsx`.
4. Create `src/app/<address>/page.tsx`. It exports `metadata = sectionMetadata('<id>')` and returns `null`.
5. Update `e2e/stage.spec.ts` for the new arrow order.
6. Update [product/site.md](../product/site.md), and add an entry to [DECISIONS.md](../DECISIONS.md) if adding the section was a decision.
