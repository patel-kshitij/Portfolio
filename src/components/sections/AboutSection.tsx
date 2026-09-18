import styles from '@/styles/Sections.module.scss'

/** About: a few paragraphs, with key words highlighted. */
export default function AboutSection() {
  return (
    <div className={styles.prose}>
      <p>
        I&apos;m 23 years old and a passionate newbie software developer. Sometimes I think I spend more time
        with my code than with actual people, but hey, code never talks back.
      </p>
      <p>
        I&apos;ve worked with several programming languages, including{' '}
        <span className={styles.highlight}>Python, Java, and Go</span>. Python is my comfort zone, Java makes me
        feel like a grown-up, and Go? Well, it keeps me on my toes.
      </p>
      <p>
        <span className={styles.highlight}>Problem-solving</span> is where I truly shine. I enjoy tackling
        complex challenges and breaking them down into elegant, efficient solutions. Whether it&apos;s
        debugging an issue or architecting a new feature, I love the thrill of solving problems. Plus,
        there&apos;s nothing like the rush of fixing a bug that has been haunting me for hours—it&apos;s like
        slaying a dragon, but nerdier.
      </p>
      <p>
        When I&apos;m not coding, you&apos;ll find me exploring the world—
        <span className={styles.highlight}>traveling</span> to new places, experiencing different cultures,
        and finding inspiration beyond the screen. I&apos;m also a massive{' '}
        <span className={styles.highlight}>foodie</span>; if there&apos;s good food around, you can bet
        I&apos;m first in line. I also firmly believe that every journey needs a good snack, a questionable
        playlist and great company.
      </p>
    </div>
  )
}
