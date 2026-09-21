'use client'

import ArchitectureDiagram from '@/components/ArchitectureDiagram'
import { projectLink, projectStatus } from '@/content/projects'
import type { CaseStudyProject } from '@/content/sections'
import styles from '@/styles/CaseStudy.module.scss'

const STATUS_LABEL = { live: 'Live', code: 'Code public', soon: 'In progress' } as const

/**
 * One project's case study, shown in the card at /projects/<slug> (decision 21).
 * The card's title already shows the project's name, so this starts with the intro.
 * There is no back link here: the card's arrow turns around and leads back to the tiles (decision 23).
 */
export default function CaseStudySection({ project }: { project: CaseStudyProject }) {
  const study = project.caseStudy
  const link = projectLink(project)

  return (
    <article className={styles.caseStudy}>
      <p className={styles.intro}>{study.intro}</p>

      <dl className={styles.meta}>
        <div>
          <dt>Role</dt>
          <dd>{study.role}</dd>
        </div>
        <div>
          <dt>Built</dt>
          <dd>{study.built}</dd>
        </div>
        <div>
          <dt>Tools</dt>
          <dd>{project.tags.join(', ')}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{STATUS_LABEL[projectStatus(project)]}</dd>
        </div>
      </dl>

      <section className={styles.part} aria-labelledby="case-problem">
        <h2 id="case-problem">The problem</h2>
        <div className={styles.body}>
          {study.problem.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className={styles.part} aria-labelledby="case-how">
        <h2 id="case-how">How it works</h2>
        <div className={styles.body}>
          <div className={styles.drawing}>
            <ArchitectureDiagram architecture={project.architecture} size="full" showSteps title={project.title} />
          </div>
          <ol className={styles.steps}>
            {study.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.part} aria-labelledby="case-decisions">
        <h2 id="case-decisions">Decisions</h2>
        <div className={styles.body}>
          <ul className={styles.decisions}>
            {study.decisions.map((decision) => (
              <li key={decision.chose}>
                <p className={styles.chose}>
                  Chose {decision.chose} <span className={styles.over}>over {decision.over}</span>
                </p>
                <p>{decision.because}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {study.numbers && study.numbers.length > 0 && (
        <section className={styles.part} aria-labelledby="case-numbers">
          <h2 id="case-numbers">By the numbers</h2>
          <div className={styles.body}>
            <dl className={styles.numbers}>
              {study.numbers.map((number) => (
                <div key={number.label}>
                  <dt>{number.label}</dt>
                  <dd>{number.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className={styles.part} aria-labelledby="case-now">
        <h2 id="case-now">Where it is now</h2>
        <div className={styles.body}>
          {study.now.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {link && (
            <a href={link.href} target="_blank" rel="noopener noreferrer" className={styles.external}>
              {link.label}
            </a>
          )}
        </div>
      </section>
    </article>
  )
}
