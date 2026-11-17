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

  it.each<Phase>(['casting', 'nibbling', 'reeling'])('shows line and bobber while %s', (phase) => {
    const svg = renderScene(phase)
    expect(svg.querySelector('#fishing-line')).not.toBeNull()
    expect(svg.querySelector('#bobber')).not.toBeNull()
    expect(svg.querySelector('#catch')).toBeNull()
  })

  it.each<Phase>(['intro', 'revealing', 'finale'])('keeps the line in while %s', (phase) => {
    const svg = renderScene(phase)
    expect(svg.querySelector('#fishing-line')).toBeNull()
    expect(svg.querySelector('#bobber')).toBeNull()
  })

  it.each<Phase>(['revealing', 'finale'])('shows the catch splash while %s', (phase) => {
    expect(renderScene(phase).querySelector('#catch')).not.toBeNull()
  })

  it('marks the bobber while a fish nibbles', () => {
    const svg = renderScene('nibbling')
    expect(svg.querySelector('#bobber')).toHaveClass('bobber--nibbling')
    expect(renderScene('casting').querySelector('#bobber')).not.toHaveClass('bobber--nibbling')
  })
})
