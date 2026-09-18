/** Entries shown in the Projects section, in display order. */
export interface Project {
  title: string
  description: string
  /** Link to the source code. Projects without one show their title as plain text. */
  link?: string
}

export const projects: readonly Project[] = [
  {
    title: 'SkillSwap',
    description: "A Java-Spring, Next.js based web application for connecting local communities' skills.",
    link: 'https://github.com/patel-kshitij/Skillswap',
  },
  {
    title: 'Ecomart Backend',
    description: 'A Django based set of REST APIs for a second-hand marketplace.',
    link: 'https://github.com/patel-kshitij/Ecomart-be',
  },
  {
    title: 'Serverless Image Processor',
    description:
      'A simple yet efficient image processing API that is completely serverless with Infrastructure as Code.',
    link: 'https://github.com/patel-kshitij/Serverless-Image-Processing',
  },
  {
    title: 'Player Performance Prediction',
    description: 'A data science project to predict player performance in upcoming matches for FIFA.',
  },
]
