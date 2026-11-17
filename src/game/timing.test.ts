import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePlaythrough } from './timing'

const playthrough = ['a', 'b', 'c'] as const
const durations = { casting: 100, nibbling: 200, reeling: 50 }

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('usePlaythrough', () => {
  it('lands the bobber, reels in and lands the catch after the given durations', () => {
    const { result } = renderHook(() => usePlaythrough(playthrough, durations))
    act(() => result.current.cast())
    expect(result.current.state.phase).toBe('casting')

    act(() => void vi.advanceTimersByTime(99))
    expect(result.current.state.phase).toBe('casting')
    act(() => void vi.advanceTimersByTime(1))
    expect(result.current.state.phase).toBe('nibbling')
    act(() => void vi.advanceTimersByTime(200))
    expect(result.current.state.phase).toBe('reeling')
    act(() => void vi.advanceTimersByTime(50))
    expect(result.current.state.phase).toBe('revealing')
    expect(result.current.state.currentCatchId).toBe('a')
  })

  it('cancels the auto reel when the visitor reels in first', () => {
    const { result } = renderHook(() => usePlaythrough(playthrough, durations))
    act(() => result.current.cast())
    act(() => void vi.advanceTimersByTime(100))
    act(() => result.current.reel())
    act(() => void vi.advanceTimersByTime(50))
    expect(result.current.state.phase).toBe('revealing')
    act(() => void vi.advanceTimersByTime(1000))
    expect(result.current.state.phase).toBe('revealing')
  })

  it('advances immediately with zero durations', () => {
    const zero = { casting: 0, nibbling: 0, reeling: 0 }
    const { result } = renderHook(() => usePlaythrough(playthrough, zero))
    act(() => result.current.cast())
    for (let i = 0; i < 3; i++) act(() => void vi.advanceTimersByTime(0))
    expect(result.current.state.phase).toBe('revealing')
  })

  it('clears pending timers on unmount', () => {
    const { result, unmount } = renderHook(() => usePlaythrough(playthrough, durations))
    act(() => result.current.cast())
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
