import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { REEL_STEP } from './reducer'
import { usePlaythrough } from './timing'

const playthrough = ['a', 'b', 'c'] as const
// Auto fill: 500 ms from empty to full, so one tick (2 of 100) every 10 ms.
const durations = { casting: 100, nibbling: 200, reeling: 500 }

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

function advance(ms: number) {
  act(() => void vi.advanceTimersByTime(ms))
}

describe('usePlaythrough', () => {
  it('lands the bobber, starts reeling and fills the meter on its own', () => {
    const { result } = renderHook(() => usePlaythrough(playthrough, durations))
    act(() => result.current.cast())
    expect(result.current.state.phase).toBe('casting')

    advance(99)
    expect(result.current.state.phase).toBe('casting')
    advance(1)
    expect(result.current.state.phase).toBe('nibbling')
    advance(200)
    expect(result.current.state.phase).toBe('reeling')
    expect(result.current.state.reelProgress).toBe(REEL_STEP)

    // The remaining 90 % of the meter take 90 % of the auto-fill time.
    advance(449)
    expect(result.current.state.phase).toBe('reeling')
    advance(1)
    expect(result.current.state.phase).toBe('revealing')
    expect(result.current.state.currentCatchId).toBe('a')
  })

  it('lets the visitor reel and boost before the timers do', () => {
    const { result } = renderHook(() => usePlaythrough(playthrough, durations))
    act(() => result.current.cast())
    advance(100)
    act(() => result.current.reel())
    act(() => result.current.reel())
    expect(result.current.state.reelProgress).toBe(2 * REEL_STEP)
    act(() => result.current.boost())
    expect(result.current.state.phase).toBe('revealing')
    advance(1000)
    expect(result.current.state.phase).toBe('revealing')
    expect(result.current.state.collectedCatchIds).toEqual(['a'])
  })

  it('stops ticking once the catch has landed', () => {
    const { result } = renderHook(() => usePlaythrough(playthrough, durations))
    act(() => result.current.cast())
    advance(100)
    act(() => result.current.reel())
    act(() => result.current.boost())
    expect(vi.getTimerCount()).toBe(0)
  })

  it('advances immediately with zero durations', () => {
    const zero = { casting: 0, nibbling: 0, reeling: 0 }
    const { result } = renderHook(() => usePlaythrough(playthrough, zero))
    act(() => result.current.cast())
    for (let i = 0; i < 3; i++) advance(0)
    expect(result.current.state.phase).toBe('revealing')
  })

  it('clears pending timers on unmount', () => {
    const { result, unmount } = renderHook(() => usePlaythrough(playthrough, durations))
    act(() => result.current.cast())
    advance(100)
    advance(200)
    expect(result.current.state.phase).toBe('reeling')
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
