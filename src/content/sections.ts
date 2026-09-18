import type { Metadata } from 'next'
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
}

export const sections: readonly Section[] = [
  {
    id: 'home',
    path: '/',
    label: 'Home',
    titleWords: [],
    sitemapPriority: 1,
  },
  {
    id: 'about',
    path: '/about',
    label: 'About',
    titleWords: ['About', 'Me'],
    title: 'About',
    description:
      'A little about Kshitij Patel: the languages he works in, how he approaches problem solving, and what he does away from the keyboard.',
    sitemapPriority: 0.8,
  },
  {
    id: 'projects',
    path: '/projects',
    label: 'Projects',
    titleWords: ['My', 'Projects'],
    title: 'Projects',
    description:
      'Selected projects by Kshitij Patel, including a Spring and Next.js skill sharing app, a Django marketplace API, and a serverless image processing pipeline.',
    sitemapPriority: 0.8,
  },
  {
    id: 'contact',
    path: '/contact',
    label: 'Contact',
    titleWords: ['Contact', 'Me'],
    title: 'Contact',
    description: 'Get in touch with Kshitij Patel by email, or find him on GitHub and LinkedIn.',
    sitemapPriority: 0.6,
  },
]

/** The section for an address, or undefined when the address is not a section. */
export function getSectionByPath(pathname: string | null | undefined): Section | undefined {
  if (!pathname) return undefined
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return sections.find((section) => section.path === path)
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
