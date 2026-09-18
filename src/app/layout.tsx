import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import ShootingStar from '@/components/ShootingStar'
import StarBackground from '@/components/StarBackground'
import Stage from '@/components/stage/Stage'
import { site } from '@/lib/site'
import './globals.css'

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        <StarBackground />
        <ShootingStar />
        {/* The pages render nothing; the stage draws every section. See docs/reference/architecture.md */}
        <Stage>{children}</Stage>
      </body>
    </html>
  )
}
