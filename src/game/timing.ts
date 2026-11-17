import { useCallback, useEffect, useReducer } from 'react'
import { createInitialState, gameReducer } from './reducer'
import type { GameAction, GameState, Phase } from './types'

/** How long each timed phase lasts, in milliseconds. */
export type PhaseDurations = {
  /** Line in the air until the bobber lands. */
  readonly casting: number
  /** Nibble before the game reels in on its own. */
  readonly nibbling: number
  /** Reeling until the catch lands. */
  readonly reeling: number
}

export const defaultDurations: PhaseDurations = {
  casting: 1200,
  nibbling: 3000,
  reeling: 1000,
}

const timedActions: Partial<Record<Phase, [keyof PhaseDurations, GameAction]>> = {
  casting: ['casting', { type: 'BOBBER_LANDED' }],
  nibbling: ['nibbling', { type: 'REEL' }],
  reeling: ['reeling', { type: 'CATCH_LANDED' }],
}

export type Playthrough = {
  readonly state: GameState
  readonly cast: () => void
  readonly reel: () => void
  readonly replay: () => void
}

/**
 * Owns the game state for one visit and the timers that move it through the timed phases.
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
    const ms = { casting, nibbling, reeling }[key]
    const id = setTimeout(() => dispatch(action), ms)
    return () => clearTimeout(id)
  }, [phase, casting, nibbling, reeling])

  const cast = useCallback(() => dispatch({ type: 'CAST' }), [])
  const reel = useCallback(() => dispatch({ type: 'REEL' }), [])
  const replay = useCallback(() => dispatch({ type: 'REPLAY' }), [])

  return { state, cast, reel, replay }
}
