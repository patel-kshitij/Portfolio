#!/usr/bin/env node
/**
 * Checks the typed documentation system described in docs/rules/documentation.md.
 *
 * Fails (exit code 1) on broken structure: missing or invalid frontmatter,
 * unknown doc types, not exactly one status doc, docs missing from the index,
 * index lines without a pointer, and relative links to files that do not exist.
 * Only warns about staleness, so nobody is tempted to fake a reviewed date.
 *
 * Plain Node.js, no dependencies. Run with `npm run docs:check`.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DOCS_DIR = join(ROOT, 'docs')
const INDEX = join(DOCS_DIR, 'INDEX.md')
const ENTRY_FILES = ['AGENTS.md', 'README.md'].map((name) => join(ROOT, name))

/** Allowed doc types and how many days each may go without a review before we warn. */
const STALE_AFTER_DAYS = {
  rules: 180,
  reference: 90,
  guide: 180,
  status: 30,
  product: 180,
  decision: Number.POSITIVE_INFINITY,
}
const REQUIRED_FIELDS = ['title', 'type', 'owner', 'reviewed']
const AUDIT_FILE = /^AUDIT-\d{4}-\d{2}-\d{2}\.md$/
const DAY_MS = 24 * 60 * 60 * 1000

const errors = []
const warnings = []
const shortPath = (file) => relative(ROOT, file).split(sep).join('/')

function markdownFilesIn(dir) {
  const found = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) found.push(...markdownFilesIn(full))
    else if (entry.name.endsWith('.md')) found.push(full)
  }
  return found.sort()
}

function readFrontmatter(text) {
  const normalised = text.replace(/\r\n/g, '\n')
  if (!normalised.startsWith('---\n')) return null
  const end = normalised.indexOf('\n---', 4)
  if (end === -1) return null
  const fields = {}
  for (const line of normalised.slice(4, end).split('\n')) {
    const match = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (match) fields[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
  return fields
}

/** Relative link targets in a markdown text, ignoring code, web links and pure anchors. */
function relativeLinks(text) {
  const withoutCode = text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')
  const targets = []
  for (const match of withoutCode.matchAll(/\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) {
    const target = match[1]
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('#')) continue
    const withoutAnchor = target.split('#')[0]
    if (withoutAnchor) targets.push(withoutAnchor)
  }
  return targets
}

function resolveLink(fromFile, target) {
  let decoded = target
  try {
    decoded = decodeURIComponent(target)
  } catch {
    // keep the raw target if it is not valid percent-encoding
  }
  return resolve(dirname(fromFile), decoded)
}

function checkLinks(file, text) {
  for (const target of relativeLinks(text)) {
    if (!existsSync(resolveLink(file, target))) {
      errors.push(`${shortPath(file)}: broken link to "${target}"`)
    }
  }
}

// 1. Dated audits in the repo root are skipped, but never silently.
for (const name of readdirSync(ROOT)) {
  if (AUDIT_FILE.test(name)) {
    warnings.push(`${name}: dated audit. Move its findings into docs/STATUS.md, then delete it.`)
  }
}

// 2. The index: pointers only, and every pointer must resolve.
const listedInIndex = new Set()
if (!existsSync(INDEX)) {
  errors.push('docs/INDEX.md is missing')
} else {
  const indexText = readFileSync(INDEX, 'utf8')
  indexText.split(/\r?\n/).forEach((line, i) => {
    if (/^\s*([-*+]|\d+\.)\s+/.test(line) && relativeLinks(line).length === 0) {
      errors.push(`docs/INDEX.md:${i + 1}: list item without a link (the index holds pointers only)`)
    }
  })
  checkLinks(INDEX, indexText)
  for (const target of relativeLinks(indexText)) listedInIndex.add(resolveLink(INDEX, target))
}

// 3. Every typed doc.
const typedDocs = existsSync(DOCS_DIR) ? markdownFilesIn(DOCS_DIR).filter((file) => file !== INDEX) : []
let statusDocs = 0
const now = Date.now()

for (const file of typedDocs) {
  const name = shortPath(file)
  const text = readFileSync(file, 'utf8')
  const fields = readFrontmatter(text)

  if (!fields) {
    errors.push(`${name}: missing frontmatter (see docs/rules/documentation.md)`)
  } else {
    for (const field of REQUIRED_FIELDS) {
      if (!fields[field]) errors.push(`${name}: frontmatter is missing "${field}"`)
    }
    const knownType = Object.hasOwn(STALE_AFTER_DAYS, fields.type)
    if (fields.type && !knownType) {
      errors.push(`${name}: unknown type "${fields.type}" (allowed: ${Object.keys(STALE_AFTER_DAYS).join(', ')})`)
    }
    if (fields.type === 'status') statusDocs += 1

    if (fields.reviewed) {
      const reviewedAt = Date.parse(fields.reviewed)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.reviewed) || Number.isNaN(reviewedAt)) {
        errors.push(`${name}: "reviewed" must be a date written like 2026-09-16`)
      } else if (knownType) {
        const ageDays = Math.floor((now - reviewedAt) / DAY_MS)
        const budget = STALE_AFTER_DAYS[fields.type]
        if (ageDays < -1) {
          errors.push(`${name}: "reviewed" is in the future`)
        } else if (ageDays > budget) {
          warnings.push(
            `${name}: last reviewed ${ageDays} days ago (the limit for ${fields.type} docs is ${budget}). ` +
              'Read it against the code, then update "reviewed".',
          )
        }
      }
    }
  }

  if (!listedInIndex.has(file)) errors.push(`${name}: not listed in docs/INDEX.md`)
  checkLinks(file, text)
}

if (statusDocs !== 1) {
  errors.push(`expected exactly one doc with type "status", found ${statusDocs}`)
}

// 4. Entry files must exist and their links must resolve.
for (const file of ENTRY_FILES) {
  if (!existsSync(file)) errors.push(`${shortPath(file)} is missing`)
  else checkLinks(file, readFileSync(file, 'utf8'))
}

for (const warning of warnings) console.warn(`warn   ${warning}`)
for (const error of errors) console.error(`error  ${error}`)

if (errors.length > 0) {
  console.error(`\ndocs:check failed with ${errors.length} error(s) and ${warnings.length} warning(s).`)
  process.exit(1)
}
console.log(`docs:check passed: ${typedDocs.length} typed docs plus the index checked, ${warnings.length} warning(s).`)
