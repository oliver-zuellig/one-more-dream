import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { profile } from '../content/profile'
import type { ProfileLink } from '../content/types'
import { ProfilePanel } from './ProfilePanel'

const links: ProfileLink[] = [
  { label: 'GitHub', href: 'https://github.com/example' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/example' },
]

function Harness() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open profile
      </button>
      <ProfilePanel open={open} onClose={() => setOpen(false)} links={links} />
    </>
  )
}

describe('ProfilePanel', () => {
  it('shows no dialog while closed', () => {
    render(<ProfilePanel open={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows a labelled dialog with the profile texts when open', () => {
    render(<ProfilePanel open onClose={() => {}} />)
    const dialog = screen.getByRole('dialog', { name: "Hi, I'm Oliver." })
    expect(within(dialog).getByText(profile.bio)).toBeInTheDocument()
    expect(within(dialog).getByText(profile.career)).toBeInTheDocument()
    expect(within(dialog).getByText(profile.personal)).toBeInTheDocument()
  })

  it('shows the photo with its alt text and fixed dimensions', () => {
    render(<ProfilePanel open onClose={() => {}} />)
    const photo = within(screen.getByRole('dialog')).getByRole('img', { name: profile.photoAlt })
    expect(photo).toHaveAttribute('width')
    expect(photo).toHaveAttribute('height')
  })

  it('calls onClose from the close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ProfilePanel open onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: profile.close }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ProfilePanel open onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes and returns focus to the opener', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const opener = screen.getByRole('button', { name: 'Open profile' })

    await user.click(opener)
    expect(screen.getByRole('dialog', { name: profile.heading })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: profile.close }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()

    await user.click(opener)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('renders the given links, opening in a new tab', () => {
    render(<ProfilePanel open onClose={() => {}} links={links} />)
    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('link')
    expect(items).toHaveLength(2)
    const github = within(list).getByRole('link', { name: 'GitHub' })
    expect(github).toHaveAttribute('href', 'https://github.com/example')
    expect(github).toHaveAttribute('target', '_blank')
    expect(github).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders no link list when there are no links', () => {
    render(<ProfilePanel open onClose={() => {}} links={[]} />)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('shows no email address or phone number', () => {
    render(<ProfilePanel open onClose={() => {}} links={links} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).not.toMatch(/@|\+\d|mailto:|tel:/)
    expect(dialog.innerHTML).not.toMatch(/mailto:|tel:/)
  })
})
