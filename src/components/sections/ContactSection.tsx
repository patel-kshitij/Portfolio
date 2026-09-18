import { GitHubIcon, LinkedInIcon } from '@/components/icons'
import { site } from '@/lib/site'
import styles from '@/styles/Sections.module.scss'

/** Contact: how to reach Kshitij, plus his profiles. */
export default function ContactSection() {
  return (
    <div className={styles.contact}>
      <p>
        The fastest way to reach me is through{' '}
        <a href={`mailto:${site.email}`} className={styles.textLink}>
          mail
        </a>
        .
      </p>
      <p>Thanks for visiting.</p>
      <p>
        New updates will come for the portfolio and all the suggestions are welcome. The source for the
        portfolio is{' '}
        <a href={site.repo} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
          here
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
