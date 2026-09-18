import { projects } from '@/content/projects'
import styles from '@/styles/Sections.module.scss'

/** Projects: one card per entry in src/content/projects.ts. */
export default function ProjectsSection() {
  return (
    <ul className={styles.projectList}>
      {projects.map((project) => (
        <li key={project.title} className={styles.project}>
          <h2 className={styles.projectTitle}>
            {project.link ? (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h2>
          <p className={styles.projectDescription}>{project.description}</p>
        </li>
      ))}
    </ul>
  )
}
