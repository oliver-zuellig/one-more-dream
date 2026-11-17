import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { dreamTicket, getCatch, playthrough } from './content/catches'
import { copy } from './content/copy'
import { dream } from './content/dream'
import { codeUrl, profile } from './content/profile'
import { defaultDurations } from './game/timing'

type User = ReturnType<typeof userEvent.setup>

function setup(): User {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  render(<App />)
  return user
}

function wait(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

function button(name: string) {
  return screen.getByRole('button', { name })
}

async function catchOne(user: User, castLabel: string) {
  await user.click(button(castLabel))
  wait(defaultDurations.casting)
  await user.click(button(copy.actions.reel))
  wait(defaultDurations.reeling)
}

function meetOliverInHeader() {
  return within(screen.getByRole('banner')).getByRole('button', { name: copy.actions.meetOliver })
}

beforeEach(() => {
  // Testing Library waits on a real setTimeout(0) after each user event, so let the fake clock tick.
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function prefersReducedMotion() {
  const original = window.matchMedia.bind(window)
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    ...original(query),
    matches: query.includes('prefers-reduced-motion: reduce'),
  }))
}

describe('App', () => {
  it('shows the landing with title, subtitle, intro, cast button and footer', () => {
    setup()
    expect(screen.getByRole('heading', { level: 1, name: copy.title })).toBeInTheDocument()
    expect(screen.getByText(copy.subtitle)).toBeInTheDocument()
    expect(screen.getByText(copy.intro)).toBeInTheDocument()
    expect(button(copy.actions.cast)).toBeInTheDocument()
    expect(screen.getByText(copy.footer)).toBeInTheDocument()
  })

  it('plays through three catches to the finale and replays', async () => {
    const user = setup()

    for (const [i, id] of playthrough.entries()) {
      await catchOne(user, i === 0 ? copy.actions.cast : copy.actions.castAgain)
      const card = screen.getByRole('article')
      const caught = getCatch(id)
      expect(within(card).getByRole('heading', { name: caught.headline })).toBeInTheDocument()
      expect(within(card).getByText(caught.story)).toBeInTheDocument()
      expect(within(card).getByText(caught.name)).toBeInTheDocument()
    }

    await catchOne(user, copy.actions.castAgain)
    for (const line of dream.finaleLines) expect(screen.getByText(line)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: copy.actions.viewCode })).toHaveAttribute(
      'href',
      codeUrl,
    )
    expect(screen.queryByRole('button', { name: copy.actions.castAgain })).not.toBeInTheDocument()

    await user.click(button(copy.actions.replay))
    expect(button(copy.actions.cast)).toBeInTheDocument()
    expect(screen.getByText(copy.intro)).toBeInTheDocument()
  })

  it('reels in automatically when the visitor does not click', async () => {
    const user = setup()
    await user.click(button(copy.actions.cast))
    wait(defaultDurations.casting)
    expect(button(copy.actions.reel)).toBeInTheDocument()

    wait(defaultDurations.nibbling)
    wait(defaultDurations.reeling)
    const first = getCatch(playthrough[0])
    expect(screen.getByRole('heading', { name: first.headline })).toBeInTheDocument()
  })

  it('announces each catch in a polite live region', async () => {
    const user = setup()
    await catchOne(user, copy.actions.cast)
    const first = getCatch(playthrough[0])
    expect(screen.getByRole('status')).toHaveTextContent(
      copy.announcements.caught(first.name, first.headline),
    )
  })

  it('keeps Meet Oliver visible in every phase', async () => {
    const user = setup()
    expect(meetOliverInHeader()).toBeVisible() // intro

    await user.click(button(copy.actions.cast))
    expect(meetOliverInHeader()).toBeVisible() // casting
    wait(defaultDurations.casting)
    expect(meetOliverInHeader()).toBeVisible() // nibbling
    await user.click(button(copy.actions.reel))
    expect(meetOliverInHeader()).toBeVisible() // reeling
    wait(defaultDurations.reeling)
    expect(meetOliverInHeader()).toBeVisible() // revealing

    for (let i = 0; i < 3; i++) await catchOne(user, copy.actions.castAgain)
    expect(meetOliverInHeader()).toBeVisible() // finale
  })

  it('plays through by keyboard with reduced motion, focus following each step', async () => {
    prefersReducedMotion()
    const user = setup()

    await user.tab()
    expect(meetOliverInHeader()).toHaveFocus()
    await user.tab()
    expect(button(copy.actions.cast)).toHaveFocus()

    for (const [i, id] of playthrough.entries()) {
      await user.keyboard(i % 2 === 0 ? '{Enter}' : ' ')
      wait(0)
      expect(button(copy.actions.reel)).toHaveFocus()
      await user.keyboard(i % 2 === 0 ? ' ' : '{Enter}')
      wait(0)
      // No decorative delay: the catch is there without advancing the clock.
      expect(screen.getByRole('heading', { name: getCatch(id).headline })).toBeInTheDocument()
      expect(button(copy.actions.castAgain)).toHaveFocus()
    }

    await user.keyboard('{Enter}')
    wait(0)
    await user.keyboard('{Enter}')
    wait(0)
    const finale = screen.getByRole('region', { name: dreamTicket.headline })
    expect(within(finale).getByRole('heading', { level: 2 })).toHaveFocus()

    await user.tab()
    expect(within(finale).getByRole('button', { name: copy.actions.meetOliver })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', { name: profile.heading })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(within(finale).getByRole('button', { name: copy.actions.meetOliver })).toHaveFocus()

    await user.tab()
    if (codeUrl) await user.tab()
    expect(button(copy.actions.replay)).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(button(copy.actions.cast)).toHaveFocus()
  })

  it('does not steal focus from the profile while the game moves on', async () => {
    const user = setup()
    await user.click(button(copy.actions.cast))
    await user.click(meetOliverInHeader())
    wait(defaultDurations.casting)
    expect(button(copy.actions.reel)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: profile.close })).toHaveFocus()
  })

  it('opens the profile without playing and closes it again', async () => {
    const user = setup()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(meetOliverInHeader())
    expect(screen.getByRole('dialog', { name: profile.heading })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(meetOliverInHeader()).toHaveFocus()
  })
})
