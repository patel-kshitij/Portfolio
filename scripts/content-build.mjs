#!/usr/bin/env node
/**
 * Reads the project files in src/content/projects/ (one YAML file per project, plus
 * index.yaml for the groups and the order), checks them, and writes the data the site
 * uses to src/content/projects.generated.json (decision 22).
 *
 *   npm run content:check   checks only, writes nothing
 *   npm run content:build   checks, then writes the generated file (runs before dev, build,
 *                           typecheck and test:e2e on its own)
 *
 * Every problem is reported in plain words with the file it is in, and stops the build.
 * A case study is only passed to the site when it says `published: true`.
 * How to edit the files: docs/guides/case-studies.md
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'src', 'content', 'projects')
const OUT = join(ROOT, 'src', 'content', 'projects.generated.json')
const CHECK_ONLY = process.argv.includes('--check')

const LIMITS = { summary: 110, fact: 70, factCount: 3, label: 14, boxes: 8, decisions: 4 }
const ROWS = { top: 0, bottom: 1 }
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

const errors = []
const notes = []

function readYaml(file) {
  try {
    return parse(readFileSync(file, 'utf8'))
  } catch (error) {
    errors.push(`${short(file)}: this is not valid YAML. ${error.message.split('\n')[0]}`)
    return undefined
  }
}

const short = (file) => relative(ROOT, file)

/** Collects problems for one file, so every message starts with its name. */
function checker(file) {
  const name = short(file)
  return {
    error: (message) => errors.push(`${name}: ${message}`),
    note: (message) => notes.push(`${name}: ${message}`),
  }
}

const isText = (value) => typeof value === 'string' && value.trim().length > 0
const isEmpty = (value) => value === undefined || value === null || value === ''

/** Reports keys that are not in the allowed list, which catches typos such as `summery`. */
function unknownKeys(object, allowed, where, report) {
  for (const key of Object.keys(object ?? {})) {
    if (!allowed.includes(key)) report.error(`${where}has an unknown field "${key}". Allowed: ${allowed.join(', ')}.`)
  }
}

/** Splits a block of text into paragraphs at blank lines. */
function paragraphs(text) {
  return String(text)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
}

function checkUrl(value, field, report) {
  if (isEmpty(value)) return undefined
  if (typeof value !== 'string' || !/^https:\/\/\S+$/.test(value)) {
    report.error(`"${field}" must be a full address starting with https://, or left empty.`)
    return undefined
  }
  return value
}

function readArchitecture(raw, report) {
  if (!raw || typeof raw !== 'object') {
    report.error('"architecture" is missing. Every project needs at least two boxes and one arrow.')
    return undefined
  }
  unknownKeys(raw, ['boxes', 'arrows'], '"architecture" ', report)
  const boxes = Array.isArray(raw.boxes) ? raw.boxes : []
  const arrows = Array.isArray(raw.arrows) ? raw.arrows : []
  if (boxes.length < 2) report.error('"architecture.boxes" needs at least two boxes.')
  if (boxes.length > LIMITS.boxes) report.error(`"architecture.boxes" has ${boxes.length} boxes; at most ${LIMITS.boxes} fit.`)
  if (arrows.length < 1) report.error('"architecture.arrows" needs at least one arrow.')

  const ids = new Set()
  const cells = new Map()
  const nodes = boxes.map((box, index) => {
    const where = `box ${index + 1}`
    unknownKeys(box, ['id', 'label', 'col', 'row'], `${where} `, report)
    if (!isText(box?.id)) report.error(`${where} has no "id".`)
    else if (ids.has(box.id)) report.error(`two boxes share the id "${box.id}".`)
    else ids.add(box.id)
    if (!isText(box?.label)) report.error(`${where} ("${box?.id}") has no "label".`)
    else if (box.label.length > LIMITS.label) {
      report.note(`box "${box.id}" has a ${box.label.length} character label; about ${LIMITS.label} fits.`)
    }
    if (!Number.isInteger(box?.col) || box.col < 0 || box.col > 4) {
      report.error(`box "${box?.id}" needs "col" as a whole number from 0 (left) to 4 (right).`)
    }
    if (!(box?.row in ROWS)) report.error(`box "${box?.id}" needs "row: top" or "row: bottom".`)
    const cell = `${box?.col}/${box?.row}`
    if (cells.has(cell)) report.error(`boxes "${cells.get(cell)}" and "${box?.id}" are in the same place (col ${box?.col}, ${box?.row}).`)
    cells.set(cell, box?.id)
    return { id: box?.id, label: box?.label, col: box?.col, row: ROWS[box?.row] }
  })

  const links = arrows.map((arrow, index) => {
    const where = `arrow ${index + 1}`
    unknownKeys(arrow, ['from', 'to', 'step'], `${where} `, report)
    for (const end of ['from', 'to']) {
      if (!ids.has(arrow?.[end])) {
        report.error(`${where} points ${end} a box called "${arrow?.[end]}", but there is no box with that id.`)
      }
    }
    if (arrow?.from === arrow?.to) report.error(`${where} starts and ends at the same box.`)
    if (!isEmpty(arrow?.step) && (!Number.isInteger(arrow.step) || arrow.step < 1)) {
      report.error(`${where} has "step: ${arrow.step}"; a step is a whole number from 1.`)
    }
    const link = { from: arrow?.from, to: arrow?.to }
    if (!isEmpty(arrow?.step)) link.step = arrow.step
    return link
  })

  return { nodes, links }
}

function readCaseStudy(raw, report, architecture) {
  if (isEmpty(raw)) return undefined
  if (typeof raw !== 'object') {
    report.error('"case_study" must be a block of fields, or left out.')
    return undefined
  }
  const allowed = ['published', 'intro', 'role', 'built', 'problem', 'steps', 'decisions', 'numbers', 'now', 'last_modified']
  unknownKeys(raw, allowed, '"case_study" ', report)

  if (raw.published !== true) {
    report.note('case study is a draft (published is not true), so it stays hidden.')
    return undefined
  }

  for (const field of ['intro', 'role', 'built', 'problem', 'now']) {
    if (!isText(raw[field])) report.error(`the published case study has no "${field}".`)
  }
  if (!DATE.test(String(raw.last_modified ?? ''))) {
    report.error('the published case study needs "last_modified" as a date like 2026-09-21.')
  }

  const steps = Array.isArray(raw.steps) ? raw.steps : []
  if (steps.some((step) => !isText(step))) report.error('every line in "steps" must be a sentence.')
  const numbered = (architecture?.links ?? []).map((link) => link.step).filter((step) => step !== undefined)
  const expected = numbered.slice().sort((a, b) => a - b)
  if (numbered.length === 0) {
    report.error('a published case study needs numbered arrows: give its arrows "step: 1", "step: 2" and so on.')
  } else if (expected.some((step, index) => step !== index + 1)) {
    report.error(`the arrow steps must be 1, 2, 3 and so on with no gaps or repeats; found ${expected.join(', ')}.`)
  } else if (steps.length !== numbered.length) {
    report.error(`there are ${numbered.length} numbered arrows but ${steps.length} lines in "steps"; they must match.`)
  }

  const decisions = Array.isArray(raw.decisions) ? raw.decisions : []
  if (decisions.length < 1 || decisions.length > LIMITS.decisions) {
    report.error(`"decisions" needs between 1 and ${LIMITS.decisions} entries; it has ${decisions.length}.`)
  }
  decisions.forEach((decision, index) => {
    unknownKeys(decision, ['chose', 'over', 'because'], `decision ${index + 1} `, report)
    for (const field of ['chose', 'over', 'because']) {
      if (!isText(decision?.[field])) report.error(`decision ${index + 1} has no "${field}".`)
    }
  })

  const numbers = Array.isArray(raw.numbers) ? raw.numbers : []
  numbers.forEach((number, index) => {
    unknownKeys(number, ['value', 'label'], `number ${index + 1} `, report)
    if (isEmpty(number?.value) || !isText(number?.label)) report.error(`number ${index + 1} needs both "value" and "label".`)
  })

  const study = {
    intro: String(raw.intro ?? '').trim(),
    role: String(raw.role ?? '').trim(),
    built: String(raw.built ?? '').trim(),
    problem: paragraphs(raw.problem ?? ''),
    steps: steps.map((step) => String(step).trim()),
    decisions: decisions.map((decision) => ({
      chose: String(decision?.chose ?? '').trim(),
      over: String(decision?.over ?? '').trim(),
      because: String(decision?.because ?? '').trim(),
    })),
    now: paragraphs(raw.now ?? ''),
    lastModified: String(raw.last_modified ?? ''),
  }
  if (numbers.length > 0) study.numbers = numbers.map((number) => ({ value: String(number.value), label: String(number.label) }))
  return study
}

function readProject(file, slug, groupIds) {
  const report = checker(file)
  const raw = readYaml(file)
  if (raw === undefined) return undefined
  if (!raw || typeof raw !== 'object') {
    report.error('the file is empty.')
    return undefined
  }
  const allowed = ['slug', 'title', 'summary', 'group', 'tags', 'live', 'code', 'facts', 'architecture', 'case_study']
  unknownKeys(raw, allowed, 'the file ', report)

  if (raw.slug !== slug) report.error(`"slug" is "${raw.slug}" but the file is called ${slug}.yaml; they must match.`)
  if (!SLUG.test(slug)) report.error('the file name must use lowercase letters, digits and dashes only.')
  if (!isText(raw.title)) report.error('"title" is missing.')
  if (!isText(raw.summary)) report.error('"summary" is missing.')
  else if (raw.summary.length > LIMITS.summary) {
    report.note(`"summary" is ${raw.summary.length} characters; about ${LIMITS.summary} fits a tile.`)
  }
  if (!groupIds.includes(raw.group)) report.error(`"group" is "${raw.group}"; it must be one of: ${groupIds.join(', ')} (see index.yaml).`)
  if (!Array.isArray(raw.tags) || raw.tags.length === 0 || raw.tags.some((tag) => !isText(String(tag)))) {
    report.error('"tags" needs at least one tool, written like [Next.js, Supabase].')
  }

  const facts = isEmpty(raw.facts) ? [] : raw.facts
  if (!Array.isArray(facts)) report.error('"facts" must be a list, or [] for none.')
  else {
    if (facts.length > LIMITS.factCount) report.error(`"facts" has ${facts.length} entries; at most ${LIMITS.factCount} are shown.`)
    for (const fact of facts) {
      if (!isText(fact)) report.error('every fact must be a sentence.')
      else if (fact.length > LIMITS.fact) report.note(`a fact is ${fact.length} characters; about ${LIMITS.fact} reads well.`)
    }
  }

  const architecture = readArchitecture(raw.architecture, report)
  const caseStudy = readCaseStudy(raw.case_study, report, architecture)

  const project = {
    slug,
    title: String(raw.title ?? '').trim(),
    summary: String(raw.summary ?? '').trim(),
    group: raw.group,
    tags: (raw.tags ?? []).map((tag) => String(tag).trim()),
    architecture,
  }
  const live = checkUrl(raw.live, 'live', report)
  const code = checkUrl(raw.code, 'code', report)
  if (live) project.live = live
  if (code) project.code = code
  if (Array.isArray(facts) && facts.length > 0) project.facts = facts.map((fact) => String(fact).trim())
  if (caseStudy) project.caseStudy = caseStudy
  return project
}

// index.yaml: the groups and the order.
const indexFile = join(DIR, 'index.yaml')
const index = readYaml(indexFile) ?? {}
const indexReport = checker(indexFile)
unknownKeys(index, ['groups', 'order'], 'the file ', indexReport)
const groups = Array.isArray(index.groups) ? index.groups : []
if (groups.length === 0) indexReport.error('"groups" needs at least one group.')
groups.forEach((group, i) => {
  unknownKeys(group, ['id', 'label'], `group ${i + 1} `, indexReport)
  if (!isText(group?.id) || !isText(group?.label)) indexReport.error(`group ${i + 1} needs both "id" and "label".`)
})
const groupIds = groups.map((group) => group?.id)
const order = Array.isArray(index.order) ? index.order : []

const files = readdirSync(DIR)
  .filter((name) => name.endsWith('.yaml') && name !== 'index.yaml')
  .map((name) => name.slice(0, -'.yaml'.length))

for (const slug of files) {
  if (!order.includes(slug)) indexReport.error(`${slug}.yaml is not listed under "order", so it would never show. Add it.`)
}
const seen = new Set()
for (const slug of order) {
  if (seen.has(slug)) indexReport.error(`"${slug}" is listed twice under "order".`)
  seen.add(slug)
  if (!files.includes(slug)) indexReport.error(`"order" lists "${slug}", but there is no ${slug}.yaml in this folder.`)
}
if (order.length === 0) indexReport.error('"order" lists no projects.')

const projects = order
  .filter((slug) => files.includes(slug))
  .map((slug) => readProject(join(DIR, `${slug}.yaml`), slug, groupIds))
  .filter(Boolean)

for (const note of notes) console.log(`note  ${note}`)
if (errors.length > 0) {
  for (const error of errors) console.error(`error ${error}`)
  console.error(`\ncontent check failed: ${errors.length} problem(s) to fix in src/content/projects/.`)
  process.exit(1)
}

const published = projects.filter((project) => project.caseStudy).length
if (!CHECK_ONLY) {
  const data = { groups: groups.map((group) => ({ id: group.id, label: group.label })), projects }
  writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`)
}
console.log(
  `content ${CHECK_ONLY ? 'check passed' : 'built'}: ${projects.length} projects, ${published} published case stud${published === 1 ? 'y' : 'ies'}.`,
)
