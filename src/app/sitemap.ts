import type { MetadataRoute } from 'next'
import { sections } from '@/content/sections'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return sections.map((section) => ({
    url: section.path === '/' ? site.url : `${site.url}${section.path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: section.sitemapPriority,
  }))
}
