import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Phase } from '../game/types'
import { LakeScene } from './LakeScene'

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
    ['casting', 3],
    ['nibbling', 9],
    ['reeling', 11],
    ['revealing', 15],
    ['finale', 16],
  ])('shows the fisherman frame for %s', (phase, frame) => {
    const fisher = renderScene(phase).querySelector('#fisherman')
    expect(fisher).toHaveAttribute('data-frame', String(frame))
  })

  it('crops the sprite sheet to the frame of the phase', () => {
    // 4 columns of 340 × 300 px: frame 11 is column 3, row 3.
    const fisher = renderScene('reeling').querySelector('#fisherman')
    expect(fisher).toHaveAttribute('viewBox', '680 600 340 300')
  })
})
