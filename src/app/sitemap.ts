import type { MetadataRoute } from 'next'
import { caseStudyProjects } from '@/content/projects'
import { caseStudyPath, sections } from '@/content/sections'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  // The date comes from each section and case study, not from the clock. A build must never
  // claim that every page changed just because a build happened.
  const sectionEntries: MetadataRoute.Sitemap = sections.map((section) => ({
    url: section.path === '/' ? site.url : `${site.url}${section.path}`,
    lastModified: section.lastModified,
    changeFrequency: 'monthly',
    priority: section.sitemapPriority,
  }))

  // Case studies (decision 21) sit just below the Projects section.
  const caseStudyEntries: MetadataRoute.Sitemap = caseStudyProjects().map((project) => ({
    url: `${site.url}${caseStudyPath(project)}`,
    lastModified: project.caseStudy.lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...sectionEntries, ...caseStudyEntries]
}
