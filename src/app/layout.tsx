import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import ShootingStar from '@/components/ShootingStar'
import StarBackground from '@/components/StarBackground'
import Stage from '@/components/stage/Stage'
import { personJsonLd, site } from '@/lib/site'
import './globals.scss'

// Downloaded at build time and served from this site (decision 6).
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
    locale: site.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * The browser reads this before any stylesheet loads: `themeColor` paints the phone's
 * browser bar to match the night sky, and `colorScheme` stops a white flash on the
 * first paint. The black behind the stars is painted in `src/app/globals.scss`.
 */
export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        {/* Who the site is about, for search engines. Values come from src/lib/site.ts. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <StarBackground />
        <ShootingStar />
        {/* The pages render nothing; the stage draws every section. See docs/reference/architecture.md */}
        <Stage>{children}</Stage>
      </body>
    </html>
  )
}
