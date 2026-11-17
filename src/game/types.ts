export type Phase = 'intro' | 'casting' | 'nibbling' | 'reeling' | 'revealing' | 'finale'

export type GameState = {
  readonly phase: Phase
  /** The three normal catches of this playthrough, in order. The dream ticket always follows. */
  readonly playthrough: readonly string[]
  readonly collectedCatchIds: readonly string[]
  readonly currentCatchId: string | null
  /** Reel meter while reeling, from 0 to `REEL_FULL`. The catch lands when it is full. */
  readonly reelProgress: number
}

export type GameAction =
  | { type: 'CAST' }
  | { type: 'BOBBER_LANDED' }
  /** Starts reeling during the nibble; while reeling, fills the meter a step. */
  | { type: 'REEL' }
  /** Fills the meter at once. */
  | { type: 'BOOST' }
  /** Slow auto fill, dispatched by a timer while reeling. */
  | { type: 'REEL_TICK' }
  | { type: 'REPLAY' }
