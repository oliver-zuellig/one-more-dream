import background from '../art/lakeside-cabin.webp'
import type { Phase } from '../game/types'
import {
  FISHER_ANIMATIONS,
  FISHER_BOX,
  FISHER_SHEET,
  SCENE_KEYFRAMES,
  SKY_ANIMATION,
  SKY_BOX,
  SKY_SHEET,
  frameOffset,
  type Box,
  type Sheet,
  type SpriteAnimation,
} from './sceneSprites'

type Props = {
  readonly phase: Phase
}

/** Size of the background image; the scene uses its pixels as coordinates. */
const SCENE = { width: 1672, height: 941 }

type SpriteProps = {
  readonly id: string
  readonly sheet: Sheet
  readonly box: Box
  readonly still: number
  readonly animationName: string
  readonly animation: SpriteAnimation
}

/**
 * One sprite: a window of one frame onto the sheet. Without animation (or with reduced motion,
 * see `.sprite` in the CSS) it shows the still frame.
 */
function Sprite({ id, sheet, box, still, animationName, animation }: SpriteProps) {
  const { x, y } = frameOffset(sheet, still)
  const animated = animation.frames.length > 1 && animation.durationMs > 0
  return (
    <svg
      id={id}
      className="sprite"
      data-frame={still}
      {...box}
      viewBox={`0 0 ${sheet.frameWidth} ${sheet.frameHeight}`}
      preserveAspectRatio="none"
    >
      <image
        href={sheet.href}
        width={sheet.columns * sheet.frameWidth}
        height={sheet.rows * sheet.frameHeight}
        transform={`translate(${-x} ${-y})`}
        style={
          animated
            ? {
                animation: `${animationName} ${animation.durationMs}ms step-end ${
                  animation.loop ? 'infinite' : '1 forwards'
                }`,
              }
            : undefined
        }
      />
    </svg>
  )
}

/** Lake scene with the owner's pixel art. Decorative only: everything it shows is also in the text. */
export function LakeScene({ phase }: Props) {
  const fisher = FISHER_ANIMATIONS[phase]
  return (
    <svg
      className={`lake-scene lake-scene--${phase}`}
      data-phase={phase}
      viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
      aria-hidden="true"
      focusable="false"
    >
      <style>{SCENE_KEYFRAMES}</style>
      <image href={background} width={SCENE.width} height={SCENE.height} />
      <Sprite
        id="sky"
        sheet={SKY_SHEET}
        box={SKY_BOX}
        still={1}
        animationName="sky"
        animation={SKY_ANIMATION}
      />
      <Sprite
        id="fisherman"
        sheet={FISHER_SHEET}
        box={FISHER_BOX}
        still={fisher.still}
        animationName={`fisher-${phase}`}
        animation={fisher}
      />
    </svg>
  )
}
