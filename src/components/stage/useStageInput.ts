'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { getNextSection, getPreviousSection, type StageView } from '@/content/sections'

/**
 * A finger must travel at least this far sideways, and further sideways than up or down,
 * for a touch to count as a swipe. This is a distance, not a timing, so it does not live
 * in timing.ts.
 */
const SWIPE_MIN_PX = 50

/** Where Right, or a swipe to the left, leads: the next section, as the arrow does. */
function nextPath(view: StageView): string {
  return getNextSection(view.section).path
}

/** Where Left, or a swipe to the right, leads. A case study goes up to its section; Home goes nowhere. */
function previousPath(view: StageView): string | undefined {
  if (view.project) return view.section.path
  return getPreviousSection(view.section)?.path
}

/** What to tell visitors. Shown as the icons' tooltip and read out to screen readers. */
export const INPUT_HINT = 'Use the Left and Right arrow keys, or swipe, to move between sections.'

/**
 * Keyboard and touch input for the stage (decision 17):
 * - Right arrow key, or a swipe to the left, follows the arrow to the next section.
 *   After the last section that is Home, like the arrow.
 * - Left arrow key, or a swipe to the right, goes to the previous section. On Home it does nothing.
 * Up and Down are left alone, because they scroll a tall section inside the card.
 *
 * On a case study (decision 21) the next section is still Contact, and going back means
 * going up to the Projects tiles.
 *
 * These are not clicks, so they move with the router instead of a link
 * (docs/rules/frontend.md, rule 6). With no view (a wrong address) nothing is wired up.
 */
export function useStageInput(view: StageView | undefined) {
  const router = useRouter()
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!view) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      const target = event.target
      if (target instanceof HTMLElement) {
        if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        router.push(nextPath(view), { scroll: false })
      } else if (event.key === 'ArrowLeft') {
        const previous = previousPath(view)
        if (!previous) return
        event.preventDefault()
        router.push(previous, { scroll: false })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [view, router])

  const onPointerDown = (event: ReactPointerEvent) => {
    // Only fingers swipe. A mouse drag selects text and must keep doing so.
    touchStart.current = event.pointerType === 'touch' ? { x: event.clientX, y: event.clientY } : null
  }

  const onPointerUp = (event: ReactPointerEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start || !view || event.pointerType !== 'touch') return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) <= Math.abs(dy)) return
    const target = dx < 0 ? nextPath(view) : previousPath(view)
    if (target) router.push(target, { scroll: false })
  }

  const onPointerCancel = () => {
    touchStart.current = null
  }

  /** Spread these onto the card. */
  return { onPointerDown, onPointerUp, onPointerCancel }
}
