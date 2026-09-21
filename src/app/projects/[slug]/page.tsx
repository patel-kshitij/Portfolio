import type { Metadata } from 'next'
import { caseStudyProjects, getCaseStudyProject } from '@/content/projects'
import { caseStudyMetadata } from '@/content/sections'

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

/** Only projects with a written case study get a page (decision 21). Every other slug answers 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return caseStudyProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const project = getCaseStudyProject((await params).slug)
  return project ? caseStudyMetadata(project) : {}
}

/**
 * Renders nothing on purpose: the stage in the root layout draws the case study inside
 * the card, so it can animate to and from the tiles. See docs/reference/architecture.md.
 */
export default function CaseStudyPage() {
  return null
}
