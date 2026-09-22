/**
 * Single source of truth for anything about the site itself.
 * Page metadata, the sitemap, robots.txt, Home and Contact all read from here,
 * so each of these values is written down exactly once.
 */
export const site = {
  name: 'Kshitij Patel',
  title: 'Kshitij Patel',
  description:
    'Software developer in Halifax, Nova Scotia. Backend systems and serverless AWS in Python and TypeScript. Founder of Qrakr Inc.',
  // patelkshitij.com redirects to www, so www is the canonical host.
  url: 'https://www.patelkshitij.com',
  locale: 'en_CA',
  email: 'me@patelkshitij.com',
  github: 'https://github.com/patel-kshitij',
  linkedin: 'https://www.linkedin.com/in/kshitijkumar-patel-077358175/',
  repo: 'https://github.com/patel-kshitij/Portfolio',
  /** The resume served from `public/`. Replace the file, not this path, when the resume changes. */
  resume: '/resume.pdf',
  /** What Kshitij is open to, the sentence on Contact (decisions 17 and 25). */
  availability:
    'I’m looking for a backend or full-stack team in Canada to join, full-time or part-time. Until then I take freelance and contract work on backends, AWS and websites, so if you have a project, say hello.',
} as const

/**
 * The site's Person entry for search engines, in schema.org form.
 * Every value is read from `site` above, so nothing here is written twice.
 * The root layout renders it as a single JSON-LD script.
 */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.url,
    description: site.description,
    email: `mailto:${site.email}`,
    sameAs: [site.github, site.linkedin],
  }
}
