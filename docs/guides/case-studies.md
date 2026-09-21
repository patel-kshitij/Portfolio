---
title: Projects and case studies
type: guide
owner: Kshitij
reviewed: 2026-09-21
---

# Projects and case studies

## In plain English

Every project on the Projects page is one small text file in `src/content/projects/`. Open the file, change the words, save. A checker reads every file before the site is built and tells you in plain words if something is wrong, such as a missing field or an arrow pointing at a box that does not exist. A case study stays hidden until its file says `published: true`, so a half written one never goes live ([DECISIONS.md](../DECISIONS.md) entry 22).

## The files

| File | What it holds |
| --- | --- |
| `src/content/projects/index.yaml` | The filter groups, and the order of the projects. The first project is the headline when someone arrives. |
| `src/content/projects/<slug>.yaml` | One project: its words, links, facts, architecture drawing and, when written, its case study. The file name is the project's `slug`. |
| `src/content/projects.generated.json` | Made by the checker from the files above. Never edit it; it is not committed. |

## Everyday changes

- **Change a sentence, a link or a tool:** edit that project's file.
- **Change the order, or which project is the headline:** move its name in `order` in `index.yaml`.
- **Add a project:** copy an existing file, rename it to the new slug, change `slug` inside it to match, fill it in, and add the slug to `order` in `index.yaml`.
- **Publish a case study:** fill in `case_study`, read it once more, then set `published: true` and set `last_modified` to today. Its page at `/projects/<slug>`, the "Read the case study" button, the "Case study" label on its tile and its sitemap entry all appear by themselves.
- **Hide a case study again:** set `published: false`. Nothing else changes.
- **Check your work:** `npm run content:check`. It also runs by itself before `npm run dev`, `npm run build`, `npm run typecheck` and `npm run test:e2e`, and a problem stops them.

## The architecture drawing

Boxes sit on a small grid: `col` 0 to 4 from left to right, and `row` either `top` or `bottom`. Two boxes cannot share a spot. Arrows join boxes by their `id`. Arrows along a row join the boxes' sides; arrows between the rows leave from the bottom or top.

```
col:     0          1          2            3
top:     [User] --> [API] --> [Worker] --> [Storage]
                     |
bottom:             [Login]
```

Keep labels to about 14 characters and use at most 8 boxes. The checker refuses an arrow along a row that jumps over another box, and an arrow between the rows that moves more than one column, because both would be drawn straight through a box. On a published case study, number the arrows of one request's path with `step: 1`, `step: 2` and so on; `case_study.steps` needs exactly one sentence per numbered arrow, in the same order. The checker enforces this.

## Getting the words: the prompt for another chat

The case study material comes from the project's own code and from you, never from guesses. Paste the prompt below into a chat that knows the project (for example the project's own Cowork chat, where it can read the code), fill in the project name, and answer its questions. It replies with one block that starts with `=== PORTFOLIO HANDOFF v1 ===`. Copy that whole block and paste it into a Portfolio chat. You do not need to add anything; the block says what it is and where it goes.

````text
I am writing the case study for one of my projects for my portfolio site, patelkshitij.com. The people reading it are hiring managers and engineers looking for a backend, AWS and serverless developer. Help me gather the real material and hand it back in one fixed format that another chat will read.

PROJECT: [write the project name here]

HOW TO WORK WITH ME

1. Do not invent anything. Every fact, number and reason must come from me or from code you can actually read. If you are unsure, ask me.
2. If you can read this project's code, read it first and base the architecture on it. Tell me which files you read.
3. Then interview me. Ask at most 5 questions at a time. Give each question multiple choice options where you can, plus "other". Cover: the problem and who it is for, the path one request takes through the system, the 3 hardest decisions (what I chose, what I rejected, why), what broke or surprised me, numbers I am happy to share, and where the project is now.
4. Keep private things out: no API keys, internal addresses, database or project IDs, customer data, or details of how the security or abuse protection works. If something is borderline, ask me.
5. Write in plain English that someone non-technical can follow. Short sentences. Never use dashes (no em dashes, no "--") in sentences.

RULES FOR THE DRAWING

- At most 8 boxes, on a grid: col 0 to 4 from left to right, row top or bottom. Labels at most 14 characters.
- An arrow along a row may only join boxes with no box between them. If it would jump over a box, move the boxes.
- Arrows between the rows should go straight up or down (same col) or to the next col over, so they never cross another box.
- Number the arrows of one request's path 1, 2, 3 in order. Write exactly one line in case_study.steps per numbered arrow.

WHEN THE INTERVIEW IS DONE, reply with ONE code block and nothing else, in exactly this shape. Start and end it with the two marker lines exactly as written, because another chat looks for them. Keep every key. Leave a value empty rather than guessing.

```
=== PORTFOLIO HANDOFF v1 ===
What this is: project material for the Portfolio project (patelkshitij.com). Receiver: follow docs/guides/case-studies.md, section "Receiving a handoff".
project: my-project
save to: src/content/projects/my-project.yaml

--- project file ---
slug: my-project              # lowercase letters, digits and dashes; becomes /projects/my-project
title: My Project
summary: One sentence, at most 110 characters.
group: product                # one of: product, backend, data
tags: [Tool, Service, Language]
live:                         # full https:// address of the running product, or empty
code:                         # full https:// address of the public code, or empty
facts:                        # up to 3, each under 70 characters, concrete (what it does, what it survived)
  - First fact
architecture:
  boxes:
    - { id: user, label: User phone, col: 0, row: top }
    - { id: api, label: API, col: 1, row: top }
  arrows:
    - { from: user, to: api, step: 1 }
case_study:
  published: false            # the owner switches this to true after reading every line
  intro: One or two sentences that say what it is and why it matters.
  role: My role, for example Founder, sole engineer
  built: When, for example 2025 to now
  problem: |
    First paragraph, in plain words, about 50 words.

    Second paragraph, about 40 words.
  steps:                      # one sentence per numbered arrow, same order
    - What happens at step 1.
  decisions:                  # exactly 3; chose and over start with a small letter, because the page shows "Chose ... over ..."
    - chose: what I picked
      over: what I did not pick
      because: One or two sentences on why.
  numbers:                    # only real numbers I agreed to share; delete the list if none
    - value: "100"
      label: What the number counts
  now: |
    Where the project is today, one or two short paragraphs.
  last_modified: YYYY-MM-DD   # today's date

--- check before publishing ---
- Anything you inferred rather than heard from me.
- Anything borderline for privacy.
- Anything I still need to answer.
=== END PORTFOLIO HANDOFF ===
```
````

## Receiving a handoff

For whoever works in this repository when the owner pastes a block starting with `=== PORTFOLIO HANDOFF v1 ===` (or a bare project file in the same shape):

1. **Find the file.** The `save to:` line names it. If the file exists, merge into it: take every field from the handoff, keep the file's comments, and keep anything the handoff left empty only if the owner confirms it.
2. **Keep it hidden.** Leave `published: false`, even if the handoff says otherwise, unless the owner says to publish in the same message.
3. **Check the drawing.** Run `npm run content:check`. It refuses an arrow that jumps over a box on its row. Also look for arrows between the rows that cut across a box, and move boxes to fix it without changing what connects to what.
4. **Check the words.** Decisions read as "Chose ... over ...", so `chose` and `over` start with a small letter unless they begin with a name. Remove any dashes in sentences. Nothing is added that the handoff does not say.
5. **Show a preview.** Publish it in your own workspace only, build, and send the owner a picture of the tiles and the case study.
6. **Hand back.** List what you changed from the handoff, repeat its "check before publishing" list with your own findings, write the file into the repository, and give the commit commands.
