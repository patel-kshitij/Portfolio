'use client'

import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import styles from '@/styles/Stage.module.scss'
import { swap } from './timing'

/**
 * The card's title. Between two titled sections each word rolls over on its own.
 * Going to or from Home, which has no title, the whole title fades instead.
 */
export default function StageTitle({ words }: { words: readonly string[] }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {words.length > 0 && (
        <m.h1
          key="title"
          layout="position"
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: swap.words }}
          exit={{ opacity: 0, transition: swap.exit }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {words.map((word, index) => (
              <m.span
                key={`${index}-${word}`}
                className={styles.titleWord}
                initial={{ opacity: 0, y: '0.6em' }}
                animate={{ opacity: 1, y: 0, transition: swap.words }}
                exit={{ opacity: 0, y: '-0.6em', transition: swap.words }}
              >
                {/* The trailing space keeps the heading's text readable as "About Me". */}
                {index < words.length - 1 ? `${word} ` : word}
              </m.span>
            ))}
          </AnimatePresence>
        </m.h1>
      )}
    </AnimatePresence>
  )
}
