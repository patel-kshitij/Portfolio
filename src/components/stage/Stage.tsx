'use client'

import { AnimatePresence, LazyMotion, MotionConfig, domMax, type Transition } from 'motion/react'
import * as m from 'motion/react-m'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import { KeyboardIcon, MouseIcon } from '@/components/icons'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'
import HomeSection from '@/components/sections/HomeSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import { getNextSection, getSectionByPath, isLastSection, type SectionId } from '@/content/sections'
import styles from '@/styles/Stage.module.scss'
import NextLink from './NextLink'
import StageTitle from './StageTitle'
import { intro, swap } from './timing'

/** Which component draws each section's content. */
const sectionContent: Record<SectionId, ComponentType> = {
  home: HomeSection,
  about: AboutSection,
  projects: ProjectsSection,
  contact: ContactSection,
}

/** Motion corrects these while the card resizes, but only when they are set inline. */
const cardStyle = { borderRadius: 12, boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)' }

/**
 * The purple card that never leaves the screen. It reads the address, shows the
 * matching section and animates every change. How it works:
 * docs/reference/architecture.md
 */
export default function Stage({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const section = getSectionByPath(pathname)

  // Intro rule (decision 4): the intro plays until the visit first leaves a known section.
  // The state is adjusted during render when the address changes, as React recommends:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [lastPath, setLastPath] = useState(pathname)
  const [navigated, setNavigated] = useState(false)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    if (getSectionByPath(lastPath)) setNavigated(true)
  }
  const playIntro = section?.id === 'home' && !navigated

  // The section whose content is on screen. It catches up with `section` in the same render
  // as the content swap, so the card re-renders and Motion animates its size.
  // See docs/rules/frontend.md, "Keep the shownId state".
  const [shownId, setShownId] = useState(section?.id)

  // Wrong address: the server has already answered 404, so send the visitor home (decision 5).
  useEffect(() => {
    if (!section) router.replace('/')
  }, [section, router])

  if (!section) return children

  const Content = sectionContent[section.id]
  // The link target follows the address at once; the arrow's place follows the content on screen,
  // so it moves together with the card instead of jumping at the click.
  const pointsBack = isLastSection(section.id)
  const centered = isLastSection(shownId)

  // Elements that only animate in during the intro. Everywhere else they render already visible.
  const reveal = (timing: Transition) =>
    playIntro
      ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: timing } }
      : { initial: false as const, animate: { opacity: 1 } }

  return (
    // Every layout animation (card, header, line, content, arrow) shares one spring, so they stay in step.
    <MotionConfig reducedMotion="user" transition={{ layout: swap.resize }}>
      <LazyMotion features={domMax} strict>
        <div className={styles.viewport}>
          <m.main
            layout
            className={styles.card}
            style={cardStyle}
            data-intro={playIntro ? 'on' : 'off'}
            data-shown={shownId}
          >
            {playIntro && (
              // Without JavaScript the intro never runs, so show its elements straight away.
              <noscript>
                <style>{`[data-intro='on'] *{opacity:1!important}[data-intro='on'] .${styles.divider}{width:100%!important}`}</style>
              </noscript>
            )}

            <m.header layout="position" className={styles.header}>
              <m.div className={styles.icons} {...reveal(intro.icons)}>
                <KeyboardIcon className={styles.icon} />
                <MouseIcon className={styles.icon} />
              </m.div>
              <StageTitle words={section.titleWords} />
            </m.header>

            <m.div
              layout
              className={styles.divider}
              initial={playIntro ? { width: '0%' } : false}
              animate={{ width: '100%', transition: playIntro ? intro.line : undefined }}
            />

            <AnimatePresence mode="wait" initial={playIntro} onExitComplete={() => setShownId(section.id)}>
              <m.section
                key={section.id}
                layout
                className={styles.content}
                data-section={section.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: playIntro ? intro.content : swap.enter }}
                exit={{ opacity: 0, y: -8, transition: swap.exit }}
              >
                <Content />
              </m.section>
            </AnimatePresence>

            <NextLink
              next={getNextSection(section)}
              pointsBack={pointsBack}
              centered={centered}
              playIntro={playIntro}
            />
          </m.main>
        </div>
      </LazyMotion>
      {children}
    </MotionConfig>
  )
}
