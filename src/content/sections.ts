import type { Metadata } from 'next'
import { getCaseStudyProject, type CaseStudy, type Project } from '@/content/projects'
import { site } from '@/lib/site'

/**
 * The one list of sections, in the order the arrow visits them.
 * The stage, the page files and the sitemap all read from here.
 * How it fits together: docs/reference/architecture.md
 */
export type SectionId = 'home' | 'about' | 'projects' | 'contact'

export interface Section {
  id: SectionId
  /** The section's address. */
  path: string
  /** Short name used in link labels, for example "Go to About". */
  label: string
  /** Words shown in the card's title. Home has none, because its content is the greeting. */
  titleWords: readonly string[]
  /** Browser tab and search result title. Home falls back to the site title. */
  title?: string
  /** Search result and link preview description. Home falls back to the site description. */
  description?: string
  /** Hint for search engines, between 0 and 1. */
  sitemapPriority: number
  /**
   * The day this section's words last changed, as YYYY-MM-DD. The sitemap reports it.
   * Change it when you change the section's content, and not otherwise: a date that
   * moves on every build tells search engines nothing.
   */
  lastModified: string
}

export const sections: readonly Section[] = [
  {
    id: 'home',
    path: '/',
    label: 'Home',
    titleWords: [],
    sitemapPriority: 1,
    lastModified: '2026-09-18',
  },
  {
    id: 'about',
    path: '/about',
    label: 'About',
    titleWords: ['About', 'Me'],
    title: 'About',
    description:
      'About Kshitij Patel: a backend developer in Halifax working in Python, TypeScript and AWS, founder of Qrakr Inc., and what he does away from the keyboard.',
    sitemapPriority: 0.8,
    lastModified: '2026-09-18',
  },
  {
    id: 'projects',
    path: '/projects',
    label: 'Projects',
    titleWords: ['My', 'Projects'],
    title: 'Projects',
    description:
      'Projects by Kshitij Patel: Qrakr, an AI work board for ADHD users, a serverless image pipeline on AWS, and more.',
    sitemapPriority: 0.8,
    lastModified: '2026-09-21',
  },
  {
    id: 'contact',
    path: '/contact',
    label: 'Contact',
    titleWords: ['Contact', 'Me'],
    title: 'Contact',
    description:
      'Get in touch with Kshitij Patel by email, read his resume, or find him on GitHub and LinkedIn.',
    sitemapPriority: 0.6,
    lastModified: '2026-09-18',
  },
]

/** The section for an address, or undefined when the address is not a section. */
export function getSectionByPath(pathname: string | null | undefined): Section | undefined {
  if (!pathname) return undefined
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return sections.find((section) => section.path === path)
}

/** A project that has a case study to show. */
export type CaseStudyProject = Project & { caseStudy: CaseStudy }

/**
 * What the stage shows for an address (decision 21): a section, or a case study, which is
 * the Projects section plus one project. `key` tells the stage when the content changes;
 * for a plain section it is the section's id.
 */
export interface StageView {
  key: string
  section: Section
  titleWords: readonly string[]
  project?: CaseStudyProject
}

/** The address of a project's case study page, below the Projects section's address. */
export function caseStudyPath(project: Project): string {
  return `${getSection('projects').path}/${project.slug}`
}

/** One object per view, so the stage's effects see the same view until the address really changes. */
const views = new Map<string, StageView>()

function remember(view: StageView): StageView {
  const known = views.get(view.key)
  if (known) return known
  views.set(view.key, view)
  return view
}

/** The view for an address, or undefined when the address is neither a section nor a written case study. */
export function getViewByPath(pathname: string | null | undefined): StageView | undefined {
  const section = getSectionByPath(pathname)
  if (section) return remember({ key: section.id, section, titleWords: section.titleWords })
  if (!pathname) return undefined

  const projectsSection = getSection('projects')
  const path = pathname.replace(/\/+$/, '')
  const prefix = `${projectsSection.path}/`
  if (!path.startsWith(prefix)) return undefined
  const project = getCaseStudyProject(path.slice(prefix.length))
  if (!project) return undefined
  return remember({
    key: `${projectsSection.id}/${project.slug}`,
    section: projectsSection,
    titleWords: project.title.split(' '),
    project,
  })
}

export function getSection(id: SectionId): Section {
  const section = sections.find((candidate) => candidate.id === id)
  if (!section) throw new Error(`Unknown section "${id}"`)
  return section
}

/** Where the arrow leads. After the last section it goes back to the first. */
export function getNextSection(section: Section): Section {
  const index = sections.findIndex((candidate) => candidate.id === section.id)
  return sections[(index + 1) % sections.length]
}

/**
 * The section before this one, or undefined on the first section. Unlike the arrow,
 * going back does not wrap around: the Left key and a swipe to the right stop at Home.
 */
export function getPreviousSection(section: Section): Section | undefined {
  const index = sections.findIndex((candidate) => candidate.id === section.id)
  return index > 0 ? sections[index - 1] : undefined
}

/** Whether the section with this id is the last one. False when there is no section. */
export function isLastSection(id: SectionId | undefined): boolean {
  return id !== undefined && sections[sections.length - 1].id === id
}

/** Metadata for a section's page file: tab title, description, canonical address and link previews. */
export function sectionMetadata(id: SectionId): Metadata {
  const section = getSection(id)
  const title = section.title ? `${section.title} | ${site.name}` : site.title
  const description = section.description ?? site.description

  return {
    ...(section.title ? { title: section.title } : {}),
    description,
    alternates: { canonical: section.path },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: site.locale,
      url: section.path,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

/** Metadata for a case study's page file, shaped like a section's (decision 21). */
export function caseStudyMetadata(project: CaseStudyProject): Metadata {
  const path = caseStudyPath(project)
  const pageTitle = `${project.title} case study`
  const title = `${pageTitle} | ${site.name}`
  const description = project.caseStudy.intro

  return {
    title: pageTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      siteName: site.name,
      locale: site.locale,
      url: path,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
