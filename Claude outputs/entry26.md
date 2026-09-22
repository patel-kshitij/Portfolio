## 26. Two arrows between the same boxes are drawn side by side (2026-09-22)

**Context:** Workboard's drawing has an arrow from the Claude planner to the database and one back. Both were drawn on the same line, so the first arrow and its step badge were hidden under the second.

**Options:** draw a pair of opposite arrows as two parallel lines; merge the two steps into one arrow; leave it. **Chosen: two parallel lines.**

**Decision:** When two boxes have an arrow each way, `ArchitectureDiagram` moves each line a few units to its own right-hand side (`PAIR_GAP`), and moves each step badge further out on the same side (`PAIR_BADGE`), so both lines and both numbers show. A single arrow is drawn exactly as before.

**Why:** The owner's case study has one sentence per step, and a request that goes out and comes back is a real part of how a system works. Changing the words to suit the drawing would hide that.

**Costs accepted:** A few more lines in the drawing code. The small tile drawing is unchanged; it has no arrow heads, so a pair still shows as one line there.
