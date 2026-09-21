import data from './projects.generated.json'

/**
 * The shape of the projects and the helpers the site uses (decisions 21 and 22).
 * The words live in src/content/projects/, one YAML file per project; `npm run content:build`
 * checks them and writes projects.generated.json, which this file reads. Never edit that
 * JSON by hand. How to edit the YAML files: docs/guides/case-studies.md
 */

/** A filter group's id, such as `product`. The groups are listed in src/content/projects/index.yaml. */
export type ProjectGroup = string

/**
 * One box in an architecture drawing. Boxes sit on a small grid: `col` 0 to 4 from left
 * to right, `row` 0 (top) or 1 (bottom); the YAML files say `top` and `bottom`.
 */
export interface ArchitectureNode {
  id: string
  label: string
  col: 0 | 1 | 2 | 3 | 4
  row: 0 | 1
}

/**
 * One arrow, from one box to another by `id`. `step` numbers the arrow on a case study
 * page; step 1 is explained by the first line of the case study's `steps`, and so on.
 */
export interface ArchitectureLink {
  from: string
  to: string
  step?: number
}

export interface Architecture {
  nodes: readonly ArchitectureNode[]
  links: readonly ArchitectureLink[]
}

/**
 * The long read at /projects/<slug>. It reaches the site only when its YAML says
 * `published: true` (decision 22), so a draft never goes live.
 */
export interface CaseStudy {
  /** Shown under the title and used as the page description. One or two sentences. */
  intro: string
  /** Short answers shown in a row under the intro. */
  role: string
  built: string
  /** The problem, in plain words. Each string is a paragraph. */
  problem: readonly string[]
  /** One line per numbered arrow in the architecture, in step order. */
  steps: readonly string[]
  /** The decisions that were hard: what was chosen, what lost, and why. */
  decisions: readonly { chose: string; over: string; because: string }[]
  /** Optional numbers worth showing, such as cost per month. */
  numbers?: readonly { value: string; label: string }[]
  /** Where the project is now. Each string is a paragraph. */
  now: readonly string[]
  /** The day this case study's words last changed, as YYYY-MM-DD. The sitemap reports it. */
  lastModified: string
}

export interface Project {
  /** The last part of the case study's address, and a stable id. Lowercase letters, digits and dashes. */
  slug: string
  title: string
  /** One sentence. Keep it under about 110 characters. */
  summary: string
  group: ProjectGroup
  /** Tools and services, shown as one dim line. */
  tags: readonly string[]
  /** Up to three short facts, shown on the headline tile. Only things the owner has written. */
  facts?: readonly string[]
  /** How the project is wired. Drawn full size on the headline, tiny on a tile. */
  architecture: Architecture
  /** The running product or site, when there is one. */
  live?: string
  /** The public source code, when there is some. */
  code?: string
  caseStudy?: CaseStudy
}

/** The filter buttons, in the order they are shown. */
export const projectGroups: readonly { id: ProjectGroup; label: string }[] = data.groups

/**
 * Every project, in display order. The first one is the headline tile on arrival.
 * The generated file has already been checked by scripts/content-build.mjs, so it is trusted here.
 */
export const projects = data.projects as unknown as readonly Project[]

/** Live, Code or Soon, worked out from the links (decision 21). */
export type ProjectStatus = 'live' | 'code' | 'soon'

export function projectStatus(project: Project): ProjectStatus {
  if (project.live) return 'live'
  if (project.code) return 'code'
  return 'soon'
}

/** Where the project's own link leads and what to call it, or undefined when it has none yet. */
export function projectLink(project: Project): { href: string; label: string } | undefined {
  if (project.live) return { href: project.live, label: project.live.replace(/^https?:\/\//, '') }
  if (project.code) return { href: project.code, label: 'Code on GitHub' }
  return undefined
}

/** The project for a slug, but only when it has a case study to show. */
export function getCaseStudyProject(slug: string): (Project & { caseStudy: CaseStudy }) | undefined {
  const project = projects.find((candidate) => candidate.slug === slug)
  return project?.caseStudy ? (project as Project & { caseStudy: CaseStudy }) : undefined
}

/** Every project that has a case study, in display order. */
export function caseStudyProjects(): (Project & { caseStudy: CaseStudy })[] {
  return projects.filter((project): project is Project & { caseStudy: CaseStudy } => Boolean(project.caseStudy))
}
