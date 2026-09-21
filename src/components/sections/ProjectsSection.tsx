'use client'

import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useState } from 'react'
import { constellationLines, projects, type Project } from '@/content/projects'
import { constellation } from '@/components/stage/timing'
import styles from '@/styles/Constellation.module.scss'

/** The sky panel's drawing space. Positions in projects.ts are in these units. */
const SKY = { width: 100, height: 60 }

/** Faint background dots, fixed so the server and the browser draw the same sky. */
const dust = (() => {
  let seed = 20260918
  const next = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648
    return seed / 2147483648
  }
  return Array.from({ length: 70 }, () => ({
    x: next() * SKY.width,
    y: next() * SKY.height,
    r: 0.15 + next() * 0.25,
    o: 0.25 + next() * 0.5,
  }))
})()

const byTitle = new Map(projects.map((project) => [project.title, project]))

/** Where a star's link leads and what to call it. */
function destination(project: Project) {
  if (project.live) return { href: project.live, label: 'Live site' }
  if (project.code) return { href: project.code, label: 'Code on GitHub' }
  return undefined
}

/**
 * Projects as a constellation (decision 19): a window onto the sky inside the card, one
 * star per project, faint lines between them, and a panel for the selected project.
 * Every project's details are in the HTML; only the selected one is shown, and a
 * <noscript> style shows them all when JavaScript is off.
 */
export default function ProjectsSection() {
  const [selected, setSelected] = useState(0)
  const reduceMotion = useReducedMotion()

  return (
    <div className={styles.constellation}>
      <noscript>
        <style>{`.${styles.details}{display:block}.${styles.detail}{visibility:visible!important}`}</style>
      </noscript>

      <div className={styles.sky} aria-label="The projects, drawn as a constellation" role="group">
        <svg
          className={styles.lines}
          viewBox={`0 0 ${SKY.width} ${SKY.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {dust.map((dot, index) => (
            <circle key={index} cx={dot.x} cy={dot.y} r={dot.r} className={styles.dust} opacity={dot.o} />
          ))}
          {constellationLines.map(([fromTitle, toTitle]) => {
            const from = byTitle.get(fromTitle)?.star
            const to = byTitle.get(toTitle)?.star
            if (!from || !to) return null
            return (
              <m.line
                key={`${fromTitle}-${toTitle}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={styles.line}
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1, transition: constellation.draw }}
              />
            )
          })}
        </svg>

        {projects.map((project, index) => (
          <button
            key={project.title}
            type="button"
            className={styles.star}
            style={{ left: `${(project.star.x / SKY.width) * 100}%`, top: `${(project.star.y / SKY.height) * 100}%` }}
            data-size={project.star.size}
            data-label={project.star.labelSide}
            aria-pressed={index === selected}
            aria-label={`${project.title}, project ${index + 1} of ${projects.length}`}
            onClick={() => setSelected(index)}
            onFocus={() => setSelected(index)}
            onMouseEnter={() => setSelected(index)}
          >
            <span className={styles.point} aria-hidden="true" />
            <span className={styles.label} aria-hidden="true">
              {project.title}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.details}>
        {projects.map((project, index) => {
          const to = destination(project)
          return (
            <m.article
              key={project.title}
              className={styles.detail}
              data-selected={index === selected}
              initial={false}
              animate={{ opacity: index === selected ? 1 : 0, transition: constellation.swap }}
            >
              <h2 className={styles.detailTitle}>{project.title}</h2>
              <p className={styles.detailSummary}>{project.summary}</p>
              <ul className={styles.detailTags} aria-label={`Built with, ${project.title}`}>
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              {to && (
                <a href={to.href} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                  {to.label}
                </a>
              )}
            </m.article>
          )
        })}
      </div>
    </div>
  )
}
