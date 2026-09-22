import { useId } from 'react'
import type { Architecture, ArchitectureNode } from '@/content/projects'
import styles from '@/styles/Architecture.module.scss'

/** Box size and spacing of the full drawing, in drawing units. */
const BOX = { width: 118, height: 34, gapX: 30, pad: 10, rowY: [16, 94] as const }
/** Dot spacing of the tiny drawing on a small tile. */
const MINI = { stepX: 36, pad: 12, rowY: [16, 40] as const }
/** How far apart two arrows between the same boxes are drawn, one each way (decision 26). */
const PAIR_GAP = 5
/** How far a paired arrow's step badge sits from the middle of the pair, so both badges show. */
const PAIR_BADGE = 11

interface ArchitectureDiagramProps {
  architecture: Architecture
  /** `full` draws labelled boxes; `mini` draws only dots and lines, for a small tile. */
  size: 'full' | 'mini'
  /** Show each arrow's `step` number (case study pages). */
  showSteps?: boolean
  /** Used in the drawing's accessible name, for example "How Qrakr is wired". */
  title: string
}

/** A sentence a screen reader can use instead of the picture: "Finder phone to Tag page, ...". */
function describe(architecture: Architecture): string {
  const label = new Map(architecture.nodes.map((node) => [node.id, node.label]))
  return architecture.links.map((link) => `${label.get(link.from)} to ${label.get(link.to)}`).join(', ')
}

/**
 * One project's architecture, drawn from the data in src/content/projects.ts (decision 21).
 * Colours come from src/styles/Architecture.module.scss, so the drawing follows the tokens.
 */
export default function ArchitectureDiagram({ architecture, size, showSteps = false, title }: ArchitectureDiagramProps) {
  const markerId = `arrow-${useId().replace(/:/g, '')}`
  const byId = new Map(architecture.nodes.map((node) => [node.id, node]))
  const maxCol = Math.max(...architecture.nodes.map((node) => node.col))
  const twoRows = architecture.nodes.some((node) => node.row === 1)

  if (size === 'mini') {
    const at = (node: ArchitectureNode) => ({ x: MINI.pad + node.col * MINI.stepX, y: MINI.rowY[node.row] })
    const width = MINI.pad * 2 + maxCol * MINI.stepX
    return (
      <svg className={styles.mini} viewBox={`0 0 ${width} 56`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {architecture.links.map((link) => {
          const from = byId.get(link.from)
          const to = byId.get(link.to)
          if (!from || !to) return null
          const a = at(from)
          const b = at(to)
          return <line key={`${link.from}-${link.to}`} className={styles.edge} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
        })}
        {architecture.nodes.map((node, index) => {
          const p = at(node)
          return <circle key={node.id} className={styles.dot} cx={p.x} cy={p.y} r={index === 0 ? 3.2 : 2.4} />
        })}
      </svg>
    )
  }

  const at = (node: ArchitectureNode) => ({
    x: BOX.pad + node.col * (BOX.width + BOX.gapX),
    y: BOX.rowY[node.row],
  })
  const width = BOX.pad * 2 + maxCol * (BOX.width + BOX.gapX) + BOX.width
  const height = (twoRows ? BOX.rowY[1] : BOX.rowY[0]) + BOX.height + 16

  /** True when another arrow joins the same two boxes in the other direction. */
  const hasReverse = (from: ArchitectureNode, to: ArchitectureNode) =>
    architecture.links.some((link) => link.from === to.id && link.to === from.id)

  /**
   * Where an arrow is drawn. When two boxes have an arrow each way, both lines move
   * sideways by half of PAIR_GAP, each to its own right-hand side, so they sit side by side
   * instead of on top of each other (decision 26).
   */
  const route = (from: ArchitectureNode, to: ArchitectureNode) => {
    const r = baseRoute(from, to)
    if (!hasReverse(from, to)) return r
    const dx = r.x2 - r.x1
    const dy = r.y2 - r.y1
    const length = Math.hypot(dx, dy) || 1
    const ox = (-dy / length) * (PAIR_GAP / 2)
    const oy = (dx / length) * (PAIR_GAP / 2)
    return { x1: r.x1 + ox, y1: r.y1 + oy, x2: r.x2 + ox, y2: r.y2 + oy }
  }

  /** Where an arrow leaves one box and enters the next: side to side on a row, top to bottom between rows. */
  const baseRoute = (from: ArchitectureNode, to: ArchitectureNode) => {
    const a = at(from)
    const b = at(to)
    if (from.row === to.row) {
      const forward = to.col > from.col
      const y = a.y + BOX.height / 2
      return { x1: forward ? a.x + BOX.width : a.x, y1: y, x2: forward ? b.x : b.x + BOX.width, y2: y }
    }
    const down = to.row > from.row
    const x1 = a.x + BOX.width / 2
    const y1 = down ? a.y + BOX.height : a.y
    if (from.col === to.col) return { x1, y1, x2: x1, y2: down ? b.y : b.y + BOX.height }
    return { x1, y1, x2: to.col > from.col ? b.x : b.x + BOX.width, y2: b.y + BOX.height / 2 }
  }

  return (
    <svg
      className={styles.full}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`How ${title} is wired: ${describe(architecture)}.`}
    >
      <defs>
        <marker id={markerId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" className={styles.head} />
        </marker>
      </defs>
      {architecture.links.map((link) => {
        const from = byId.get(link.from)
        const to = byId.get(link.to)
        if (!from || !to) return null
        const r = route(from, to)
        return (
          <line key={`${link.from}-${link.to}`} className={styles.edge} {...r} markerEnd={`url(#${markerId})`} />
        )
      })}
      {architecture.nodes.map((node) => {
        const p = at(node)
        return (
          <g key={node.id}>
            <rect className={styles.box} x={p.x} y={p.y} width={BOX.width} height={BOX.height} rx={6} />
            <text className={styles.label} x={p.x + BOX.width / 2} y={p.y + BOX.height / 2} dominantBaseline="central" textAnchor="middle">
              {node.label}
            </text>
          </g>
        )
      })}
      {showSteps &&
        architecture.links.map((link) => {
          const from = byId.get(link.from)
          const to = byId.get(link.to)
          if (!from || !to || link.step === undefined) return null
          const r = route(from, to)
          let cx = (r.x1 + r.x2) / 2
          let cy = (r.y1 + r.y2) / 2
          if (hasReverse(from, to)) {
            const length = Math.hypot(r.x2 - r.x1, r.y2 - r.y1) || 1
            const push = PAIR_BADGE - PAIR_GAP / 2
            cx += (-(r.y2 - r.y1) / length) * push
            cy += ((r.x2 - r.x1) / length) * push
          }
          return (
            <g key={`step-${link.step}`}>
              <circle className={styles.badge} cx={cx} cy={cy} r={9} />
              <text className={styles.badgeText} x={cx} y={cy} dominantBaseline="central" textAnchor="middle">
                {link.step}
              </text>
            </g>
          )
        })}
    </svg>
  )
}
