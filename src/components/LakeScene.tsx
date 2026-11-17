import fisherSheet from '../art/fisher-16f.webp'
import background from '../art/lakeside-cabin.webp'
import type { Phase } from '../game/types'

type Props = {
  readonly phase: Phase
}

/** Size of the background image; the scene uses its pixels as coordinates. */
const SCENE = { width: 1672, height: 941 }

/** The fisherman sprite sheet: 4 × 4 frames, numbered 1–16 row by row. */
const SHEET = { columns: 4, frameWidth: 316, frameHeight: 312, width: 1264, height: 1248 }

/** Where the fisherman stands: on the end of the dock. */
const FISHER_BOX = { x: 640, y: 260, width: 221, height: 218 }

/** Still frame per phase. Frames 5–8 (waiting) only appear in the animation. */
const FRAME_BY_PHASE: Record<Phase, number> = {
  intro: 1,
  casting: 3,
  nibbling: 9,
  reeling: 11,
  revealing: 15,
  finale: 16,
}

function frameViewBox(frame: number) {
  const index = frame - 1
  const x = (index % SHEET.columns) * SHEET.frameWidth
  const y = Math.floor(index / SHEET.columns) * SHEET.frameHeight
  return `${x} ${y} ${SHEET.frameWidth} ${SHEET.frameHeight}`
}

/** Lake scene with the owner's pixel art. Decorative only: everything it shows is also in the text. */
export function LakeScene({ phase }: Props) {
  const frame = FRAME_BY_PHASE[phase]
  return (
    <svg
      className={`lake-scene lake-scene--${phase}`}
      data-phase={phase}
      viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
      aria-hidden="true"
      focusable="false"
    >
      <image href={background} width={SCENE.width} height={SCENE.height} />
      <svg
        id="fisherman"
        data-frame={frame}
        {...FISHER_BOX}
        viewBox={frameViewBox(frame)}
        preserveAspectRatio="none"
      >
        <image href={fisherSheet} width={SHEET.width} height={SHEET.height} />
      </svg>
    </svg>
  )
}
