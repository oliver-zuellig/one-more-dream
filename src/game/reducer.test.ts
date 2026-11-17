import { describe, expect, it } from 'vitest'
import {
  DREAM_TICKET_ID,
  REEL_FULL,
  REEL_STEP,
  REEL_TICK_STEP,
  createInitialState,
  gameReducer,
} from './reducer'
import type { GameAction, GameState } from './types'

const playthrough = ['fish', 'container', 'bug'] as const

function run(state: GameState, ...actions: GameAction['type'][]): GameState {
  return actions.reduce((s, type) => gameReducer(s, { type }), state)
}

const oneCatch: GameAction['type'][] = ['CAST', 'BOBBER_LANDED', 'REEL', 'BOOST']

function times<T>(n: number, value: T): T[] {
  return Array.from({ length: n }, () => value)
}

const reeling = run(createInitialState(playthrough), 'CAST', 'BOBBER_LANDED', 'REEL')

describe('gameReducer', () => {
  it('starts in the intro phase with nothing caught', () => {
    const state = createInitialState(playthrough)
    expect(state.phase).toBe('intro')
    expect(state.collectedCatchIds).toEqual([])
    expect(state.currentCatchId).toBeNull()
    expect(state.reelProgress).toBe(0)
  })

  it('walks one cast through casting, nibbling, reeling and revealing', () => {
    let state = createInitialState(playthrough)
    state = run(state, 'CAST')
    expect(state.phase).toBe('casting')
    state = run(state, 'BOBBER_LANDED')
    expect(state.phase).toBe('nibbling')
    state = run(state, 'REEL')
    expect(state.phase).toBe('reeling')
    state = run(state, 'BOOST')
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

  it('starts the reel meter with one step when reeling begins', () => {
    expect(reeling.phase).toBe('reeling')
    expect(reeling.reelProgress).toBe(REEL_STEP)
  })

  it('fills the meter a step per reel and lands the catch when full', () => {
    const steps = REEL_FULL / REEL_STEP
    const almost = run(reeling, ...times(steps - 2, 'REEL' as const))
    expect(almost.phase).toBe('reeling')
    expect(almost.reelProgress).toBe(REEL_FULL - REEL_STEP)
    const landed = run(almost, 'REEL')
    expect(landed.phase).toBe('revealing')
    expect(landed.currentCatchId).toBe('fish')
  })

  it('lands the catch at once on BOOST', () => {
    const landed = run(reeling, 'BOOST')
    expect(landed.phase).toBe('revealing')
    expect(landed.collectedCatchIds).toEqual(['fish'])
  })

  it('fills the meter slowly on its own with ticks', () => {
    const ticked = run(reeling, 'REEL_TICK')
    expect(ticked.reelProgress).toBe(REEL_STEP + REEL_TICK_STEP)
    const ticks = (REEL_FULL - REEL_STEP) / REEL_TICK_STEP
    expect(run(reeling, ...times(ticks - 1, 'REEL_TICK' as const)).phase).toBe('reeling')
    expect(run(reeling, ...times(ticks, 'REEL_TICK' as const)).phase).toBe('revealing')
  })

  it('mixes reels and ticks without overshooting the catch', () => {
    const landed = run(reeling, ...times(20, 'REEL_TICK' as const), ...times(10, 'REEL' as const))
    expect(landed.phase).toBe('revealing')
    expect(landed.collectedCatchIds).toEqual(['fish'])
  })

  it('ignores late reels, ticks and boosts after the catch landed', () => {
    const landed = run(reeling, 'BOOST')
    expect(run(landed, 'REEL_TICK')).toBe(landed)
    expect(run(landed, 'REEL')).toBe(landed)
    expect(run(landed, 'BOOST')).toBe(landed)
  })

  it('resets the meter for the next cast', () => {
    const next = run(reeling, 'BOOST', 'CAST')
    expect(next.reelProgress).toBe(0)
    expect(run(next, 'BOBBER_LANDED', 'REEL').reelProgress).toBe(REEL_STEP)
  })

  it('ignores BOOST and ticks while the fish only nibbles', () => {
    const nibbling = run(createInitialState(playthrough), 'CAST', 'BOBBER_LANDED')
    expect(run(nibbling, 'BOOST')).toBe(nibbling)
    expect(run(nibbling, 'REEL_TICK')).toBe(nibbling)
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
    expect(run(intro, 'BOOST')).toBe(intro)
    expect(run(intro, 'REEL_TICK')).toBe(intro)
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
