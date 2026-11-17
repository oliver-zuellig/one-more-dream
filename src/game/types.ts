export type Phase = 'intro' | 'casting' | 'nibbling' | 'reeling' | 'revealing' | 'finale'

export type GameState = {
  readonly phase: Phase
  /** The three normal catches of this playthrough, in order. The dream ticket always follows. */
  readonly playthrough: readonly string[]
  readonly collectedCatchIds: readonly string[]
  readonly currentCatchId: string | null
}

export type GameAction =
  | { type: 'CAST' }
  | { type: 'BOBBER_LANDED' }
  | { type: 'REEL' }
  | { type: 'CATCH_LANDED' }
  | { type: 'REPLAY' }
