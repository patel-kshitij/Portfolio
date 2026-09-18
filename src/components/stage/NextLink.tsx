'use client'

import * as m from 'motion/react-m'
import Link from 'next/link'
import { ArrowIcon } from '@/components/icons'
import type { Section } from '@/content/sections'
import styles from '@/styles/Stage.module.scss'
import { intro, swap } from './timing'

interface NextLinkProps {
  /** Where the arrow leads. */
  next: Section
  /** True when the address is the last section, so the arrow leads back to the start. */
  pointsBack: boolean
  /** True while the last section's content is on screen. The arrow then sits in the middle. */
  centered: boolean
  playIntro: boolean
}

/**
 * The round arrow. It is a real link, so it works from the keyboard and in a new tab.
 *
 * It always turns first and moves second, never both at once:
 * - it turns as soon as the address changes, while the old content fades out (`pointsBack`);
 * - it glides once the content has swapped, together with the card (`centered`).
 */
export default function NextLink({ next, pointsBack, centered, playIntro }: NextLinkProps) {
  const label = pointsBack ? `Back to ${next.label}` : `Go to ${next.label}`

  return (
    <m.div
      layout="position"
      className={styles.arrowRow}
      data-align={centered ? 'center' : 'start'}
      initial={playIntro ? { opacity: 0 } : false}
      animate={{ opacity: 1, transition: playIntro ? intro.arrow : undefined }}
    >
      {/* The slot is what moves inside the row, so it carries its own layout animation. */}
      <m.div layout="position" className={styles.arrowSlot} transition={{ layout: swap.arrowGlide }}>
        <Link href={next.path} scroll={false} aria-label={label} title={label} className={styles.arrow}>
          <m.span
            className={styles.arrowCircle}
            data-turned={pointsBack ? 'back' : 'forward'}
            initial={false}
            animate={{ rotate: pointsBack ? 180 : 0, transition: swap.arrowTurn }}
          >
            <ArrowIcon className={styles.arrowIcon} />
          </m.span>
        </Link>
      </m.div>
    </m.div>
  )
}
