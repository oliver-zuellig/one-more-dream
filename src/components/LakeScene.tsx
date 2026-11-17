import sceneArt from '../art/lake-scene.svg'
import type { Phase } from '../game/types'

type Props = {
  readonly phase: Phase
}

/**
 * Lake scene. Decorative only: everything it shows is also in the text. The static layers come
 * from the Inkscape source `src/art/lake-scene.svg`; the phase-driven layers (rod, cast, catch)
 * are hidden there and drawn here at the same coordinates.
 */
export function LakeScene({ phase }: Props) {
  const lineOut = phase === 'casting' || phase === 'nibbling' || phase === 'reeling'
  const caughtSomething = phase === 'revealing' || phase === 'finale'
  return (
    <svg
      className={`lake-scene lake-scene--${phase}`}
      data-phase={phase}
      viewBox="0 0 400 240"
      aria-hidden="true"
      focusable="false"
    >
      <image href={sceneArt} width="400" height="240" />
      <line
        id="rod"
        className="rod"
        x1="76"
        y1="142"
        x2={lineOut ? '140' : '120'}
        y2={lineOut ? '104' : '96'}
      />
      {lineOut && (
        <g id="cast">
          <path id="fishing-line" className="fishing-line" d="M140,104 Q200,110 230,176" />
          <g id="bobber" className={`bobber${phase === 'nibbling' ? ' bobber--nibbling' : ''}`}>
            <ellipse className="bobber__ripple" cx="230" cy="181" rx="9" ry="2.2" />
            <circle className="bobber__body" cx="230" cy="178" r="4.5" />
            <path className="bobber__cap" d="M225.5,178 a4.5,4.5 0 0 1 9,0 Z" />
          </g>
        </g>
      )}
      {caughtSomething && (
        <g id="catch" className="catch-splash">
          <ellipse cx="200" cy="178" rx="18" ry="5" />
          <path d="M190,170 l-4,-8 M200,166 v-10 M210,170 l4,-8" />
        </g>
      )}
    </svg>
  )
}
