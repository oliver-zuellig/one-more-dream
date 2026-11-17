import type { Phase } from '../game/types'

type Props = {
  readonly phase: Phase
}

/**
 * Placeholder lake scene. Decorative only: everything it shows is also in the text. Part ids and
 * class names match the layers of the later Inkscape art so it can replace this file piece by piece.
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
      <g id="sky">
        <rect className="sky" width="400" height="140" />
        <circle className="sun" cx="320" cy="44" r="18" />
      </g>
      <g id="forest">
        <polygon className="pine" points="40,120 58,62 76,120" />
        <polygon className="pine" points="70,124 92,50 114,124" />
        <polygon className="pine" points="250,122 268,70 286,122" />
        <polygon className="pine" points="350,124 370,58 390,124" />
      </g>
      <g id="cabin">
        <rect className="cabin__wall" x="292" y="100" width="40" height="24" />
        <polygon className="cabin__roof" points="288,102 312,84 336,102" />
      </g>
      <rect id="lake" className="lake" y="120" width="400" height="120" />
      <path id="shore" className="shore" d="M0,170 Q60,150 120,168 L120,240 L0,240 Z" />
      <g id="fisherman" className="fisherman">
        <circle className="fisherman__head" cx="70" cy="128" r="8" />
        <rect className="fisherman__body" x="63" y="136" width="14" height="24" rx="4" />
      </g>
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
          <circle
            id="bobber"
            className={`bobber${phase === 'nibbling' ? ' bobber--nibbling' : ''}`}
            cx="230"
            cy="178"
            r="5"
          />
        </g>
      )}
      {caughtSomething && <circle id="catch" className="catch-splash" cx="200" cy="176" r="14" />}
    </svg>
  )
}
