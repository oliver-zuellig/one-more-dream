import { useCallback, useEffect, useReducer } from 'react'
import { REEL_FULL, REEL_TICK_STEP, createInitialState, gameReducer } from './reducer'
import type { GameAction, GameState, Phase } from './types'

/** How long each timed phase lasts, in milliseconds. */
export type PhaseDurations = {
  /** Line in the air until the bobber lands. */
  readonly casting: number
  /** Nibble before the game reels in on its own. */
  readonly nibbling: number
  /** Time the reel meter needs to fill on its own, from empty to full. */
  readonly reeling: number
}

export const defaultDurations: PhaseDurations = {
  casting: 1200,
  nibbling: 3000,
  reeling: 4000,
}

/**
 * For `prefers-reduced-motion`: the cast is pure decoration and resolves at once. The nibble and
 * the reel meter are play, not decoration, so they keep their length.
 */
export const reducedMotionDurations: PhaseDurations = {
  ...defaultDurations,
  casting: 0,
}

type TimedPhase = 'casting' | 'nibbling'

const timedActions: Partial<Record<Phase, [TimedPhase, GameAction]>> = {
  casting: ['casting', { type: 'BOBBER_LANDED' }],
  nibbling: ['nibbling', { type: 'REEL' }],
}

/** Auto fill while reeling: one tick per interval, or straight to full with a zero duration. */
function useReelTicks(reeling: boolean, fillMs: number, dispatch: (action: GameAction) => void) {
  useEffect(() => {
    if (!reeling) return
    if (fillMs === 0) {
      const id = setTimeout(() => dispatch({ type: 'BOOST' }), 0)
      return () => clearTimeout(id)
    }
    const id = setInterval(
      () => dispatch({ type: 'REEL_TICK' }),
      (fillMs * REEL_TICK_STEP) / REEL_FULL,
    )
    return () => clearInterval(id)
  }, [reeling, fillMs, dispatch])
}

export type Playthrough = {
  readonly state: GameState
  readonly cast: () => void
  readonly reel: () => void
  readonly boost: () => void
  readonly replay: () => void
}

/**
 * Owns the game state for one visit and the timers that move it through the timed phases and fill
 * the reel meter.
 * Timers only dispatch actions; the reducer decides what happens. Pass zero durations to skip
 * decorative delays.
 */
export function usePlaythrough(
  playthrough: readonly string[],
  durations: PhaseDurations = defaultDurations,
): Playthrough {
  const [state, dispatch] = useReducer(gameReducer, playthrough, createInitialState)
  const { phase } = state
  const { casting, nibbling, reeling } = durations

  useEffect(() => {
    const timed = timedActions[phase]
    if (!timed) return
    const [key, action] = timed
    const ms = { casting, nibbling }[key]
    const id = setTimeout(() => dispatch(action), ms)
    return () => clearTimeout(id)
  }, [phase, casting, nibbling])

  useReelTicks(phase === 'reeling', reeling, dispatch)

  const cast = useCallback(() => dispatch({ type: 'CAST' }), [])
  const reel = useCallback(() => dispatch({ type: 'REEL' }), [])
  const boost = useCallback(() => dispatch({ type: 'BOOST' }), [])
  const replay = useCallback(() => dispatch({ type: 'REPLAY' }), [])

  return { state, cast, reel, boost, replay }
}
