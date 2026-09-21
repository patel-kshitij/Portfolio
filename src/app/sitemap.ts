import type { MetadataRoute } from 'next'
import { sections } from '@/content/sections'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  // The date comes from each section, not from the clock. A build must never claim
  // that every page changed just because a build happened.
  return sections.map((section) => ({
    url: section.path === '/' ? site.url : `${site.url}${section.path}`,
    lastModified: section.lastModified,
    changeFrequency: 'monthly',
    priority: section.sitemapPriority,
  }))
}
