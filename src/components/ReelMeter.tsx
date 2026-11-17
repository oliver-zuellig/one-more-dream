import { REEL_FULL } from '../game/reducer'

type Props = {
  readonly label: string
  readonly progress: number
}

/** How far the line is reeled in. Fills by clicks, BOOST and a slow auto fill. */
export function ReelMeter({ label, progress }: Props) {
  const percent = Math.min(100, (progress / REEL_FULL) * 100)
  return (
    <div
      className="reel-meter"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={REEL_FULL}
      aria-valuenow={progress}
    >
      <div className="reel-meter__fill" style={{ width: `${percent}%` }} />
    </div>
  )
}
