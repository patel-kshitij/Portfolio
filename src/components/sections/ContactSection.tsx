import { GitHubIcon, LinkedInIcon } from '@/components/icons'
import { site } from '@/lib/site'
import styles from '@/styles/Sections.module.scss'

/** Contact: what Kshitij is open to, how to reach him, his resume, and his profiles. */
export default function ContactSection() {
  return (
    <div className={styles.contact}>
      <p>{site.availability.full}</p>
      <p>
        The fastest way to reach me is by{' '}
        <a href={`mailto:${site.email}`} className={styles.textLink}>
          email
        </a>
        . My{' '}
        <a href={site.resume} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
          resume
        </a>{' '}
        is one page, as a PDF.
      </p>
      <p>
        This site is open source; the code is{' '}
        <a href={site.repo} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
          on GitHub
        </a>
        .
      </p>
      <ul className={styles.socials}>
        <li>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            title="LinkedIn"
            className={styles.socialLink}
          >
            <LinkedInIcon className={styles.socialIcon} />
          </a>
        </li>
        <li>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            title="GitHub"
            className={styles.socialLink}
          >
            <GitHubIcon className={styles.socialIcon} />
          </a>
        </li>
      </ul>
    </div>
  )
}
