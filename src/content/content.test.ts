import { describe, expect, it } from 'vitest'
import { createInitialState, DREAM_TICKET_ID } from '../game/reducer'
import { dreamTicket, getCatch, normalCatches, playthrough } from './catches'
import { copy } from './copy'
import { dream } from './dream'
import { toProfileLinks } from './profile'

describe('catch catalogue', () => {
  it('has a valid playthrough of known catches', () => {
    expect(() => createInitialState(playthrough)).not.toThrow()
    for (const id of playthrough) expect(getCatch(id).id).toBe(id)
  })

  it('has unique catch ids', () => {
    const ids = normalCatches.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('ends with the dream ticket carrying the finale lines', () => {
    expect(getCatch(DREAM_TICKET_ID)).toBe(dreamTicket)
    for (const line of dream.finaleLines) expect(dreamTicket.story).toContain(line)
  })

  it('throws on an unknown catch id', () => {
    expect(() => getCatch('nope')).toThrow()
  })

  it('names the dream company in the footer disclaimer', () => {
    expect(copy.footer).toContain(`Not affiliated with or endorsed by ${dream.company}.`)
  })
})

describe('toProfileLinks', () => {
  it('keeps filled https links in a fixed order', () => {
    expect(
      toProfileLinks({ linkedin: 'https://linkedin.com/in/x', github: 'https://github.com/x' }),
    ).toEqual([
      { label: 'GitHub', href: 'https://github.com/x' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/x' },
    ])
  })

  it('leaves out empty and non-https links', () => {
    expect(toProfileLinks({ github: '', linkedin: 'javascript:alert(1)' })).toEqual([])
    expect(toProfileLinks({})).toEqual([])
  })
})
