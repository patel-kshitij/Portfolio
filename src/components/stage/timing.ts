import type { Transition } from 'motion/react'

/**
 * Animation timings, in seconds. What they look like together:
 * docs/reference/architecture.md, "What happens on a click".
 */
export const swap = {
  /** The old content fades out. */
  exit: { duration: 0.25, ease: 'easeIn' },
  /** The new content fades in once the old content is gone and the card has started resizing. */
  enter: { duration: 0.3, delay: 0.15, ease: 'easeOut' },
  /** The title words roll over. */
  words: { duration: 0.3, ease: 'easeInOut' },
  /** The card grows or shrinks to fit the new content. */
  resize: { type: 'spring', bounce: 0.2, duration: 0.6 },
  /**
   * The arrow turns first: at the click, while the old content fades out. It takes no longer
   * than `exit`, so the turn is over before the content swaps and the glide begins.
   */
  arrowTurn: { duration: 0.25, ease: 'easeInOut' },
  /**
   * The arrow moves second: it glides to or from the middle while the card resizes.
   * Same length as the card's spring, without the bounce, so it comes to a clean stop.
   */
  arrowGlide: { type: 'spring', bounce: 0, duration: 0.6 },
} satisfies Record<string, Transition>

/** The Projects tiles (decision 21). Moving and resizing tiles use the card's spring from `swap.resize`. */
export const projectsView = {
  /** A tile, or the headline's content, fades in or out. */
  swap: { duration: 0.2, ease: 'easeOut' },
} satisfies Record<string, Transition>

/** The home intro, played once per visit (decision 4). Same timeline as the site had before the stage. */
export const intro = {
  line: { delay: 0.5, duration: 1.5, ease: 'easeInOut' },
  content: { delay: 1, duration: 1, ease: 'easeInOut' },
  arrow: { delay: 1.5, duration: 1, ease: 'easeInOut' },
  icons: { delay: 2, duration: 2, ease: 'easeInOut' },
} satisfies Record<string, Transition>
