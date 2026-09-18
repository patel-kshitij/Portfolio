import type { SVGProps } from 'react'

/**
 * Every icon on the site. Icons are decorative by default (aria-hidden),
 * so a link that shows only an icon must carry its own aria-label.
 */
type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, strokeWidth = 2, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function KeyboardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
      <line x1="6" y1="10" x2="6" y2="10" />
      <line x1="10" y1="10" x2="10" y2="10" />
      <line x1="14" y1="10" x2="14" y2="10" />
      <line x1="18" y1="10" x2="18" y2="10" />
    </Icon>
  )
}

export function MouseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="7" y="4" width="10" height="16" rx="5" ry="5" />
      <line x1="12" y1="8" x2="12" y2="8" />
    </Icon>
  )
}

export function ArrowIcon(props: IconProps) {
  return (
    <Icon strokeWidth={4} {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Icon>
  )
}

export function LinkedInIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </Icon>
  )
}

export function GitHubIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3 8.52c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8.5 18.13V22" />
    </Icon>
  )
}
