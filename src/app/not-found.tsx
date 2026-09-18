import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '@/styles/Sections.module.scss'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
  // Do not inherit the home page's canonical address.
  alternates: {},
}

/**
 * Shown for the moment between a wrong address loading and the stage sending the
 * visitor home (decision 5). Without JavaScript it stays, so it offers a link.
 */
export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <p>
        This page drifted off into space. Taking you <Link href="/">home</Link>.
      </p>
    </main>
  )
}
