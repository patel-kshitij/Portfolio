import { sectionMetadata } from '@/content/sections'

export const metadata = sectionMetadata('contact')

/**
 * Renders nothing on purpose: the stage in the root layout draws this section,
 * so it can animate between sections. See docs/reference/architecture.md.
 */
export default function ContactPage() {
  return null
}
