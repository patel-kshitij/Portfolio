/**
 * Entries shown in the Projects section, in display order (decisions 18 and 19).
 * Each project is a star in the constellation, with a title, one line, and the tools.
 * Keep `summary` to one sentence.
 */
export interface Project {
  title: string
  /**
   * Where the star sits in the constellation, on a 100 wide by 60 tall sky,
   * and how big it is: 3 for the main work, 1 for the smallest.
   */
  star: { x: number; y: number; size: 1 | 2 | 3; labelSide: 'left' | 'right' }
  /** One sentence. It has to fit a tile, so keep it under about 110 characters. */
  summary: string
  /** Tools and services, shown as one dim line. */
  tags: readonly string[]
  /** The running product or site, when there is one. The title links here first. */
  live?: string
  /** The public source code, when there is some. The title links here when there is no live site. */
  code?: string
}

export const projects: readonly Project[] = [
  {
    title: 'Qrakr',
    star: { x: 56, y: 24, size: 3, labelSide: 'right' },
    summary: 'QR tags that let whoever finds your things reach you, without ever seeing your number. My startup.',
    tags: ['Next.js', 'Supabase', 'Telnyx', 'Stripe', 'Python'],
    live: 'https://qrakr.com',
  },
  {
    title: 'Work Board',
    star: { x: 80, y: 51, size: 2, labelSide: 'left' },
    summary: 'An AI work board for ADHD users: short time slots, and tasks that plan themselves from what got done.',
    tags: ['Next.js', 'Supabase', 'TypeScript'],
    live: 'https://board.patelkshitij.com',
  },
  {
    title: 'Serverless Image Pipeline',
    star: { x: 34, y: 38, size: 2, labelSide: 'right' },
    summary: 'Upload through API Gateway, process in Lambda and Step Functions, rebuild it all from CloudFormation.',
    tags: ['AWS Lambda', 'S3', 'Step Functions', 'CloudFormation'],
    code: 'https://github.com/patel-kshitij/Serverless-Image-Processing',
  },
  {
    title: 'SkillSwap',
    star: { x: 17, y: 15, size: 1, labelSide: 'right' },
    summary: 'A neighbourhood app for offering and asking for skills.',
    tags: ['Java', 'Spring', 'Next.js'],
    code: 'https://github.com/patel-kshitij/Skillswap',
  },
  {
    title: 'Ecomart Backend',
    star: { x: 24, y: 52, size: 1, labelSide: 'right' },
    summary: 'REST APIs for a second-hand marketplace: listings, users and orders.',
    tags: ['Python', 'Django', 'REST'],
    code: 'https://github.com/patel-kshitij/Ecomart-be',
  },
  {
    title: 'Player Performance Prediction',
    star: { x: 84, y: 11, size: 1, labelSide: 'left' },
    summary: 'Predicting how FIFA players will perform in their next matches from past match data.',
    tags: ['Python', 'Data science'],
    // The owner is adding the code link (STATUS entry 23).
  },
]

/** Which stars the faint lines join, by title. Every project appears at least once. */
export const constellationLines: readonly (readonly [string, string])[] = [
  ['SkillSwap', 'Serverless Image Pipeline'],
  ['Serverless Image Pipeline', 'Qrakr'],
  ['Serverless Image Pipeline', 'Ecomart Backend'],
  ['Qrakr', 'Player Performance Prediction'],
  ['Qrakr', 'Work Board'],
]
