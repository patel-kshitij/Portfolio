/**
 * Single source of truth for anything about the site itself.
 * Page metadata, the sitemap, robots.txt and the contact page all read from here,
 * so each of these values is written down exactly once.
 */
export const site = {
  name: 'Kshitij Patel',
  title: 'Kshitij Patel',
  description:
    'Software developer working in Python, Java and Go. Projects across serverless AWS, Django, Spring and data science.',
  // patelkshitij.com redirects to www, so www is the canonical host.
  url: 'https://www.patelkshitij.com',
  locale: 'en_CA',
  email: 'me@patelkshitij.com',
  github: 'https://github.com/patel-kshitij',
  linkedin: 'https://www.linkedin.com/in/kshitijkumar-patel-077358175/',
  repo: 'https://github.com/patel-kshitij/Portfolio',
} as const
