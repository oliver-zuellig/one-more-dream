import type { GameAction, GameState } from './types'

export const DREAM_TICKET_ID = 'dream-ticket'
export const NORMAL_CATCHES_PER_PLAYTHROUGH = 3

export const REEL_FULL = 100
/** Meter gain per click, tap or key press. */
export const REEL_STEP = 10
/** Meter gain per auto-fill tick. */
export const REEL_TICK_STEP = 2

export function createInitialState(playthrough: readonly string[]): GameState {
  const distinct = new Set(playthrough)
  if (
    playthrough.length !== NORMAL_CATCHES_PER_PLAYTHROUGH ||
    distinct.size !== playthrough.length ||
    distinct.has(DREAM_TICKET_ID)
  ) {
    throw new Error(
      `A playthrough needs ${NORMAL_CATCHES_PER_PLAYTHROUGH} distinct normal catches, got: ${playthrough.join(', ')}`,
    )
  }
  return {
    phase: 'intro',
    playthrough,
    collectedCatchIds: [],
    currentCatchId: null,
    reelProgress: 0,
  }
}

function landCatch(state: GameState): GameState {
  const next = state.playthrough[state.collectedCatchIds.length] ?? DREAM_TICKET_ID
  return {
    ...state,
    phase: next === DREAM_TICKET_ID ? 'finale' : 'revealing',
    collectedCatchIds: [...state.collectedCatchIds, next],
    currentCatchId: next,
    reelProgress: 0,
  }
}

function fillMeter(state: GameState, amount: number): GameState {
  const reelProgress = state.reelProgress + amount
  return reelProgress >= REEL_FULL ? landCatch(state) : { ...state, reelProgress }
}

/**
 * Pure state machine for one playthrough. Actions that do not fit the current phase return the
 * same state object, which guards against double clicks and late animation callbacks.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'CAST':
      return state.phase === 'intro' || state.phase === 'revealing'
        ? { ...state, phase: 'casting', reelProgress: 0 }
        : state
    case 'BOBBER_LANDED':
      return state.phase === 'casting' ? { ...state, phase: 'nibbling' } : state
    case 'REEL':
      if (state.phase === 'nibbling') return { ...state, phase: 'reeling', reelProgress: REEL_STEP }
      return state.phase === 'reeling' ? fillMeter(state, REEL_STEP) : state
    case 'BOOST':
      return state.phase === 'reeling' ? landCatch(state) : state
    case 'REEL_TICK':
      return state.phase === 'reeling' ? fillMeter(state, REEL_TICK_STEP) : state
    case 'REPLAY':
      return state.phase === 'finale' ? createInitialState(state.playthrough) : state
  }
}
