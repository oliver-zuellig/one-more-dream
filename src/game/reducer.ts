import type { GameAction, GameState } from './types'

export const DREAM_TICKET_ID = 'dream-ticket'
export const NORMAL_CATCHES_PER_PLAYTHROUGH = 3

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
  return { phase: 'intro', playthrough, collectedCatchIds: [], currentCatchId: null }
}

/**
 * Pure state machine for one playthrough. Actions that do not fit the current phase return the
 * same state object, which guards against double clicks and late animation callbacks.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'CAST':
      return state.phase === 'intro' || state.phase === 'revealing'
        ? { ...state, phase: 'casting' }
        : state
    case 'BOBBER_LANDED':
      return state.phase === 'casting' ? { ...state, phase: 'nibbling' } : state
    case 'REEL':
      return state.phase === 'nibbling' ? { ...state, phase: 'reeling' } : state
    case 'CATCH_LANDED': {
      if (state.phase !== 'reeling') return state
      const next = state.playthrough[state.collectedCatchIds.length] ?? DREAM_TICKET_ID
      return {
        ...state,
        phase: next === DREAM_TICKET_ID ? 'finale' : 'revealing',
        collectedCatchIds: [...state.collectedCatchIds, next],
        currentCatchId: next,
      }
    }
    case 'REPLAY':
      return state.phase === 'finale' ? createInitialState(state.playthrough) : state
  }
}
