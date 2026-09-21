import styles from '@/styles/Sections.module.scss'

/** About: a few paragraphs, with key words highlighted. The words are decision 17. */
export default function AboutSection() {
  return (
    <div className={styles.prose}>
      <p>
        I&apos;m a software developer in Halifax, Nova Scotia. I build the backend of things: the APIs, the
        databases and the cloud plumbing behind them, mostly on{' '}
        <span className={styles.highlight}>AWS</span>. I still spend more time with my code than with actual
        people, but hey, code never talks back.
      </p>
      <p>
        Over the last three years I&apos;ve worked on payment and reporting systems that handle thousands of
        transactions a day, moved report generation onto AWS Lambda and watched a 35 second wait drop to 3,
        taken over a CI/CD pipeline that used to eat six hours of somebody&apos;s day, and led a team of five
        across three client deployments. <span className={styles.highlight}>Python and TypeScript</span> are
        my comfort zone. Next.js, Django, Flask and FastAPI are the tools I reach for. I hold an MSc in Applied
        Computer Science from Dalhousie University.
      </p>
      <p>
        Right now I freelance, building websites and backends for clients, and I run{' '}
        <span className={styles.highlight}>Qrakr Inc.</span>, a small startup I founded. On the side I&apos;m
        teaching myself <span className={styles.highlight}>machine learning</span> the way I learn everything:
        by building something I actually use. The current one is a work board that plans my day in short
        blocks and learns from what I really got done.
      </p>
      <p>
        <span className={styles.highlight}>Problem-solving</span> is where I truly shine. I enjoy taking a
        messy production issue or a new feature, breaking it into pieces, and putting it back together in a
        way that is simple and fast. There is nothing like the rush of fixing a bug that has been haunting me
        for hours. It&apos;s like slaying a dragon, but nerdier.
      </p>
      <p>
        When I&apos;m not coding, you&apos;ll find me exploring the world:{' '}
        <span className={styles.highlight}>travelling</span> to new places, experiencing different cultures,
        and finding inspiration beyond the screen. I&apos;m also a massive{' '}
        <span className={styles.highlight}>foodie</span>; if there&apos;s good food around, you can bet
        I&apos;m first in line. I firmly believe that every journey needs a good snack, a questionable playlist
        and great company.
      </p>
    </div>
  )
}
