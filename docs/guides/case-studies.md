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

Keep labels to about 14 characters and use at most 8 boxes. On a published case study, number the arrows of one request's path with `step: 1`, `step: 2` and so on; `case_study.steps` needs exactly one sentence per numbered arrow, in the same order. The checker enforces this.

## Getting the words: the prompt for another chat

The case study material comes from the project's own code and from you, never from guesses. Paste the prompt below into a chat that knows the project (for example the project's own Cowork chat, where it can read the code), fill in the project name, and answer its questions. It hands back a block in exactly this file format, plus a "Check before publishing" list. Save the block as `src/content/projects/<slug>.yaml` (or merge it into the existing file), keep `published: false`, and read it before switching it to `true`.

````text
I am writing the case study for one of my projects for my portfolio site, patelkshitij.com. The people reading it are hiring managers and engineers looking for a backend, AWS and serverless developer. I want you to help me gather the real material and hand it back in one fixed format.

PROJECT: [write the project name here]

HOW TO WORK WITH ME

1. Do not invent anything. Every fact, number and reason must come from me or from code you can actually read. If you are unsure, ask me.
2. If you can read this project's code, read it first and base the architecture on it. Tell me which files you read.
3. Then interview me. Ask at most 5 questions at a time. Give each question multiple choice options where you can, plus "other". Cover: the problem and who it is for, the path one request takes through the system, the 3 hardest decisions (what I chose, what I rejected, why), what broke or surprised me, numbers I am happy to share, and where the project is now.
4. Keep private things out: no API keys, internal addresses, database or project IDs, customer data, or details of how the security or abuse protection works. If something is borderline, ask me.
5. Write in plain English that someone non-technical can follow. Short sentences. Never use dashes (no em dashes, no "--") in sentences.

WHEN THE INTERVIEW IS DONE, give me exactly two things:

A. One YAML block in exactly this format. Keep every key. Leave a value empty rather than guessing.

```yaml
slug: my-project              # lowercase letters, digits and dashes; becomes /projects/my-project
title: My Project
summary: One sentence, at most 110 characters.
group: product                # one of: product, backend, data
tags: [Tool, Service, Language]
live:                         # full https:// address of the running product, or empty
code:                         # full https:// address of the public code, or empty
facts:                        # up to 3, each under 70 characters, concrete (what it does, what it survived)
  - First fact
  - Second fact
  - Third fact
architecture:                 # the real system, at most 8 boxes
  boxes:                      # col: 0 to 4, left to right. row: top or bottom. Labels at most 14 characters.
    - { id: user, label: User phone, col: 0, row: top }
    - { id: api, label: API, col: 1, row: top }
  arrows:                     # the path of one request, in order. Each step number matches a line in case_study.steps
    - { from: user, to: api, step: 1 }
case_study:
  published: false            # I switch this to true only after I have read and approved every line
  intro: One or two sentences that say what it is and why it matters.
  role: My role, for example Founder, sole engineer
  built: When, for example 2025 to now
  problem: |
    First paragraph, in plain words, about 50 words.

    Second paragraph, about 40 words.
  steps:                      # one sentence per numbered arrow, same order
    - What happens at step 1.
  decisions:                  # exactly 3
    - chose: What I picked
      over: What I did not pick
      because: One or two sentences on why.
  numbers:                    # only real numbers I agreed to share; delete the list if none
    - value: "100"
      label: What the number counts
  now: |
    Where the project is today, one or two short paragraphs.
  last_modified: YYYY-MM-DD   # today's date
```

B. A short list titled "Check before publishing" with anything you inferred rather than heard from me, anything borderline for privacy, and anything I still need to answer.
````
