import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { defaultDurations } from '../game/timing'
import type { Phase } from '../game/types'
import { LakeScene } from './LakeScene'
import { fisherAnimation } from './sceneSprites'

function renderScene(phase: Phase) {
  const { container } = render(<LakeScene phase={phase} />)
  const svg = container.querySelector('svg')
  if (!svg) throw new Error('scene svg missing')
  return svg
}

describe('LakeScene', () => {
  it('is decorative', () => {
    const svg = renderScene('intro')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
  })

  it.each<[Phase, number]>([
    ['intro', 1],
    ['casting', 4],
    ['nibbling', 9],
    ['reeling', 11],
    ['revealing', 15],
    ['finale', 16],
  ])('shows the still fisherman frame for %s', (phase, frame) => {
    const fisher = renderScene(phase).querySelector('#fisherman')
    expect(fisher).toHaveAttribute('data-frame', String(frame))
  })

  it('crops the sprite sheet to the still frame of the phase', () => {
    // 4 columns of 340 × 300 px: frame 11 is column 3, row 3.
    const image = renderScene('reeling').querySelector('#fisherman image')
    expect(image).toHaveAttribute('transform', 'translate(-680 -600)')
  })

  it('animates clouds over the sky in every phase', () => {
    const svg = renderScene('intro')
    expect(svg.querySelector('#sky')).toBeInTheDocument()
  })
})

describe('fisherAnimation', () => {
  it('swings the rod through frames 1–4 while the line is cast, in the cast time', () => {
    expect(fisherAnimation('casting')).toEqual({
      frames: [1, 2, 3, 4],
      durationMs: defaultDurations.casting,
      loop: false,
    })
  })

  it.each<[Phase, number[]]>([
    ['nibbling', [5, 6, 7, 8, 9]],
    ['reeling', [10, 11, 12, 11]],
  ])('loops while %s, since that phase can last any time', (phase, frames) => {
    expect(fisherAnimation(phase)).toMatchObject({ frames, loop: true })
  })

  it.each<[Phase, number]>([
    ['revealing', 15],
    ['finale', 16],
  ])('plays the landing once and holds its last frame for %s', (phase, last) => {
    const animation = fisherAnimation(phase)
    expect(animation.loop).toBe(false)
    expect(animation.frames.at(-1)).toBe(last)
  })

  it('stands still in the intro', () => {
    expect(fisherAnimation('intro').frames).toEqual([1])
  })
})
