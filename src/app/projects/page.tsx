import { sectionMetadata } from '@/content/sections'

export const metadata = sectionMetadata('projects')

/**
 * Renders nothing on purpose: the stage in the root layout draws this section,
 * so it can animate between sections. See docs/reference/architecture.md.
 */
export default function ProjectsPage() {
  return null
}
