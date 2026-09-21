'use client'

import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import ArchitectureDiagram from '@/components/ArchitectureDiagram'
import { projects, projectGroups, projectLink, projectStatus, type Project, type ProjectGroup } from '@/content/projects'
import { caseStudyPath } from '@/content/sections'
import { projectsView } from '@/components/stage/timing'
import styles from '@/styles/Projects.module.scss'

const STATUS_LABEL = { live: 'Live', code: 'Code', soon: 'Soon' } as const

type Filter = 'all' | ProjectGroup

function StatusLabel({ project }: { project: Project }) {
  const status = projectStatus(project)
  return (
    <span className={styles.status} data-status={status}>
      {STATUS_LABEL[status]}
    </span>
  )
}

/**
 * Projects as tiles (decision 21): filter buttons for the groups, one headline tile with the
 * full architecture drawing, and a small tile for every other project. Clicking a small tile
 * makes it the headline. The headline links to the project's case study when one is written.
 * Changes in height reach the card through the LayoutGroup in Stage, so the card animates.
 */
export default function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>('all')
  const [headlineSlug, setHeadlineSlug] = useState(projects[0].slug)
  // Set when a visitor picks a tile, so focus can follow the project into the headline.
  const focusHeadline = useRef(false)
  const headlineTitle = useRef<HTMLHeadingElement>(null)

  const visible = projects.filter((project) => filter === 'all' || project.group === filter)
  const headline = visible.find((project) => project.slug === headlineSlug) ?? visible[0]
  const others = visible.filter((project) => project !== headline)

  // The tile a visitor clicked disappears into the headline, so focus would fall to the page.
  useEffect(() => {
    if (!focusHeadline.current) return
    focusHeadline.current = false
    headlineTitle.current?.focus()
  }, [headlineSlug])

  const link = headline ? projectLink(headline) : undefined

  return (
    <div className={styles.projects}>
      <div className={styles.filters} role="group" aria-label="Show projects by group">
        {[{ id: 'all' as const, label: 'All' }, ...projectGroups].map((group) => (
          <button
            key={group.id}
            type="button"
            className={styles.filter}
            aria-pressed={filter === group.id}
            onClick={() => setFilter(group.id)}
          >
            {group.label}
          </button>
        ))}
      </div>

      <m.div layout className={styles.grid}>
        {headline && (
          <m.article
            key={headline.slug}
            layout
            className={styles.headline}
            data-project={headline.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: projectsView.swap }}
          >
            <div className={styles.headlineTop}>
              <h2 ref={headlineTitle} tabIndex={-1} className={styles.headlineTitle}>
                {headline.title}
              </h2>
              <StatusLabel project={headline} />
            </div>
            <p className={styles.summary}>{headline.summary}</p>

            <div className={styles.drawing}>
              <ArchitectureDiagram architecture={headline.architecture} size="full" title={headline.title} />
            </div>

            {headline.facts && headline.facts.length > 0 && (
              <ul className={styles.facts}>
                {headline.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            )}

            <div className={styles.headlineFoot}>
              {headline.caseStudy && (
                <Link href={caseStudyPath(headline)} scroll={false} className={styles.caseStudyLink}>
                  Read the case study
                </Link>
              )}
              {link && (
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
                  {link.label}
                </a>
              )}
              <span className={styles.tags}>{headline.tags.join(' · ')}</span>
            </div>
          </m.article>
        )}

        <AnimatePresence initial={false} mode="popLayout">
          {others.map((project) => (
            <m.button
              key={project.slug}
              layout
              type="button"
              className={styles.tile}
              data-project={project.slug}
              aria-label={`Show ${project.title}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: projectsView.swap }}
              exit={{ opacity: 0, transition: projectsView.swap }}
              onClick={() => {
                focusHeadline.current = true
                setHeadlineSlug(project.slug)
              }}
            >
              <span className={styles.tileDrawing}>
                <ArchitectureDiagram architecture={project.architecture} size="mini" title={project.title} />
              </span>
              <span className={styles.tileTop}>
                <span className={styles.tileTitle}>{project.title}</span>
                <StatusLabel project={project} />
              </span>
              <span className={styles.tileSummary}>{project.summary}</span>
              <span className={styles.tileFoot}>
                <span className={styles.tags}>{project.tags.join(' · ')}</span>
                {project.caseStudy && <span className={styles.caseStudyMark}>Case study</span>}
              </span>
            </m.button>
          ))}
        </AnimatePresence>
      </m.div>
    </div>
  )
}
