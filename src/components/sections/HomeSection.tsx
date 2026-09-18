import { site } from '@/lib/site'
import styles from '@/styles/Sections.module.scss'

/** Home: the greeting. The stage adds the icons, line and arrow around it. */
export default function HomeSection() {
  return (
    <h1 className={styles.greeting}>
      Hi! I&apos;m
      <br />
      <span className={styles.name}>{site.name}</span>
    </h1>
  )
}
