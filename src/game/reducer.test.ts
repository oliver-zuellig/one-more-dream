import { describe, expect, it } from 'vitest'
import { DREAM_TICKET_ID, createInitialState, gameReducer } from './reducer'
import type { GameAction, GameState } from './types'

const playthrough = ['fish', 'container', 'bug'] as const

function run(state: GameState, ...actions: GameAction['type'][]): GameState {
  return actions.reduce((s, type) => gameReducer(s, { type }), state)
}

const oneCatch: GameAction['type'][] = ['CAST', 'BOBBER_LANDED', 'REEL', 'CATCH_LANDED']

describe('gameReducer', () => {
  it('starts in the intro phase with nothing caught', () => {
    const state = createInitialState(playthrough)
    expect(state.phase).toBe('intro')
    expect(state.collectedCatchIds).toEqual([])
    expect(state.currentCatchId).toBeNull()
  })

  it('walks one cast through casting, nibbling, reeling and revealing', () => {
    let state = createInitialState(playthrough)
    state = run(state, 'CAST')
    expect(state.phase).toBe('casting')
    state = run(state, 'BOBBER_LANDED')
    expect(state.phase).toBe('nibbling')
    state = run(state, 'REEL')
    expect(state.phase).toBe('reeling')
    state = run(state, 'CATCH_LANDED')
    expect(state.phase).toBe('revealing')
    expect(state.currentCatchId).toBe('fish')
  })

  it('catches the three normal catches in order, then the dream ticket', () => {
    let state = createInitialState(playthrough)
    const caught: (string | null)[] = []
    for (let i = 0; i < 4; i++) {
      state = run(state, ...oneCatch)
      caught.push(state.currentCatchId)
    }
    expect(caught).toEqual(['fish', 'container', 'bug', DREAM_TICKET_ID])
    expect(state.phase).toBe('finale')
    expect(state.collectedCatchIds).toEqual(['fish', 'container', 'bug', DREAM_TICKET_ID])
  })

  it('ignores a second cast while a cast is in progress', () => {
    const casting = run(createInitialState(playthrough), 'CAST')
    expect(run(casting, 'CAST')).toBe(casting)
    const nibbling = run(casting, 'BOBBER_LANDED')
    expect(run(nibbling, 'CAST')).toBe(nibbling)
  })

  it('ignores actions that do not fit the current phase', () => {
    const intro = createInitialState(playthrough)
    expect(run(intro, 'REEL')).toBe(intro)
    expect(run(intro, 'CATCH_LANDED')).toBe(intro)
    expect(run(intro, 'REPLAY')).toBe(intro)
  })

  it('does not cast again after the finale', () => {
    let state = createInitialState(playthrough)
    for (let i = 0; i < 4; i++) state = run(state, ...oneCatch)
    expect(run(state, 'CAST')).toBe(state)
  })

  it('replays from the finale with a fresh playthrough', () => {
    let state = createInitialState(playthrough)
    for (let i = 0; i < 4; i++) state = run(state, ...oneCatch)
    state = run(state, 'REPLAY')
    expect(state).toEqual(createInitialState(playthrough))
    expect(run(state, ...oneCatch).currentCatchId).toBe('fish')
  })
})

describe('createInitialState', () => {
  it('rejects a playthrough without exactly three distinct catches', () => {
    expect(() => createInitialState(['a', 'b'])).toThrow()
    expect(() => createInitialState(['a', 'a', 'b'])).toThrow()
    expect(() => createInitialState(['a', 'b', DREAM_TICKET_ID])).toThrow()
  })
})
