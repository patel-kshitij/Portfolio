/**
 * The projects, in display order (decision 21). The first one is the headline tile on arrival.
 * How the Projects section and the case study pages use this file: docs/reference/architecture.md
 */

/** The filter buttons, in the order they are shown. */
export const projectGroups = [
  { id: 'product', label: 'Products' },
  { id: 'backend', label: 'Backend & cloud' },
  { id: 'data', label: 'Data' },
] as const

export type ProjectGroup = (typeof projectGroups)[number]['id']

/**
 * One box in an architecture drawing. Boxes sit on a small grid: `col` 0 to 4 from left
 * to right, `row` 0 (top) or 1 (bottom). Keep labels to about 14 characters.
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
 * The long read at /projects/<slug>. A project only gets a case study page, and the
 * "Case study" label on its tile, once this is written (decision 21). Never ship placeholders.
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

export const projects: readonly Project[] = [
  {
    slug: 'qrakr',
    title: 'Qrakr',
    summary: 'QR tags that let whoever finds your things reach you, without ever seeing your number. My startup.',
    group: 'product',
    tags: ['Next.js', 'Supabase', 'Telnyx', 'Stripe', 'Python'],
    live: 'https://qrakr.com',
    architecture: {
      nodes: [
        { id: 'finder', label: 'Finder phone', col: 0, row: 0 },
        { id: 'page', label: 'Tag page', col: 1, row: 0 },
        { id: 'db', label: 'Supabase', col: 2, row: 0 },
        { id: 'telnyx', label: 'Telnyx bridge', col: 3, row: 0 },
        { id: 'owner', label: 'Owner phone', col: 4, row: 0 },
      ],
      links: [
        { from: 'finder', to: 'page', step: 1 },
        { from: 'page', to: 'db', step: 2 },
        { from: 'db', to: 'telnyx', step: 3 },
        { from: 'telnyx', to: 'owner', step: 4 },
      ],
    },
  },
  {
    slug: 'work-board',
    title: 'Work Board',
    summary: 'An AI work board for ADHD users: short time slots, and tasks that plan themselves from what got done.',
    group: 'product',
    tags: ['Next.js', 'Supabase', 'TypeScript'],
    live: 'https://board.patelkshitij.com',
    architecture: {
      nodes: [
        { id: 'board', label: 'Board', col: 0, row: 0 },
        { id: 'app', label: 'Next.js app', col: 1, row: 0 },
        { id: 'db', label: 'Supabase', col: 2, row: 0 },
        { id: 'planner', label: 'AI planner', col: 2, row: 1 },
        { id: 'plan', label: 'Next plan', col: 1, row: 1 },
      ],
      links: [
        { from: 'board', to: 'app', step: 1 },
        { from: 'app', to: 'db', step: 2 },
        { from: 'db', to: 'planner', step: 3 },
        { from: 'planner', to: 'plan', step: 4 },
      ],
    },
  },
  {
    slug: 'serverless-image-pipeline',
    title: 'Serverless Image Pipeline',
    summary: 'Upload through API Gateway, process in Lambda and Step Functions, rebuild it all from CloudFormation.',
    group: 'backend',
    tags: ['AWS Lambda', 'S3', 'Step Functions', 'CloudFormation'],
    code: 'https://github.com/patel-kshitij/Serverless-Image-Processing',
    architecture: {
      nodes: [
        { id: 'client', label: 'Client', col: 0, row: 0 },
        { id: 'api', label: 'API Gateway', col: 1, row: 0 },
        { id: 'lambda', label: 'Lambda', col: 2, row: 0 },
        { id: 'sfn', label: 'Step Functions', col: 3, row: 0 },
        { id: 's3', label: 'S3', col: 3, row: 1 },
        { id: 'cfn', label: 'CloudFormation', col: 1, row: 1 },
      ],
      links: [
        { from: 'client', to: 'api', step: 1 },
        { from: 'api', to: 'lambda', step: 2 },
        { from: 'lambda', to: 'sfn', step: 3 },
        { from: 'sfn', to: 's3', step: 4 },
        { from: 'cfn', to: 's3', step: 5 },
      ],
    },
  },
  {
    slug: 'skillswap',
    title: 'SkillSwap',
    summary: 'A neighbourhood app for offering and asking for skills.',
    group: 'backend',
    tags: ['Java', 'Spring', 'Next.js'],
    code: 'https://github.com/patel-kshitij/Skillswap',
    architecture: {
      nodes: [
        { id: 'web', label: 'Next.js', col: 0, row: 0 },
        { id: 'api', label: 'Spring API', col: 1, row: 0 },
        { id: 'offers', label: 'Offers', col: 2, row: 0 },
        { id: 'requests', label: 'Requests', col: 2, row: 1 },
      ],
      links: [
        { from: 'web', to: 'api' },
        { from: 'api', to: 'offers' },
        { from: 'api', to: 'requests' },
      ],
    },
  },
  {
    slug: 'ecomart-backend',
    title: 'Ecomart Backend',
    summary: 'REST APIs for a second-hand marketplace: listings, users and orders.',
    group: 'backend',
    tags: ['Python', 'Django', 'REST'],
    code: 'https://github.com/patel-kshitij/Ecomart-be',
    architecture: {
      nodes: [
        { id: 'client', label: 'Client', col: 0, row: 0 },
        { id: 'api', label: 'Django REST', col: 1, row: 0 },
        { id: 'listings', label: 'Listings', col: 2, row: 0 },
        { id: 'users', label: 'Users', col: 2, row: 1 },
        { id: 'orders', label: 'Orders', col: 3, row: 0 },
      ],
      links: [
        { from: 'client', to: 'api' },
        { from: 'api', to: 'listings' },
        { from: 'api', to: 'users' },
        { from: 'listings', to: 'orders' },
      ],
    },
  },
  {
    slug: 'player-performance-prediction',
    title: 'Player Performance Prediction',
    summary: 'Predicting how FIFA players will perform in their next matches from past match data.',
    group: 'data',
    tags: ['Python', 'Data science'],
    // The owner is adding the code link (STATUS entry 23).
    architecture: {
      nodes: [
        { id: 'data', label: 'Match data', col: 0, row: 0 },
        { id: 'model', label: 'Model', col: 1, row: 0 },
        { id: 'prediction', label: 'Prediction', col: 2, row: 0 },
      ],
      links: [
        { from: 'data', to: 'model' },
        { from: 'model', to: 'prediction' },
      ],
    },
  },
]

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
