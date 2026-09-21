import { site } from '@/lib/site'
import styles from '@/styles/Sections.module.scss'

/** Home: the greeting and what Kshitij is open to. The stage adds the icons, line and arrow around it. */
export default function HomeSection() {
  return (
    <div className={styles.home}>
      <h1 className={styles.greeting}>
        Hi! I&apos;m
        <br />
        <span className={styles.name}>{site.name}</span>
      </h1>
      <p className={styles.availability}>{site.availability.short}</p>
    </div>
  )
}
