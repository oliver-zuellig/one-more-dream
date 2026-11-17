import { useEffect, useId, useRef } from 'react'
import { profile, profileLinks } from '../content/profile'
import type { ProfileLink } from '../content/types'
import './ProfilePanel.css'

type Props = {
  open: boolean
  onClose: () => void
  /** Defaults to the links the owner filled in `links.json`. */
  links?: readonly ProfileLink[]
}

/** "Meet Oliver" modal dialog. Escape and the close button ask the parent to close it. */
export function ProfilePanel({ open, onClose, links = profileLinks }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const openRef = useRef(open)
  const headingId = useId()

  useEffect(() => {
    openRef.current = open
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      openerRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
      closeRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
      openerRef.current?.focus()
      openerRef.current = null
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="profile-panel"
      aria-labelledby={headingId}
      onCancel={(event) => {
        // Keep the dialog in sync with the `open` prop: the parent decides.
        event.preventDefault()
        onClose()
      }}
      onClose={() => {
        // The browser closed it on its own (e.g. a repeated Escape).
        if (openRef.current) onClose()
      }}
    >
      <div className="profile-panel__header">
        <h2 id={headingId} className="profile-panel__heading">
          {profile.heading}
        </h2>
        <button
          ref={closeRef}
          type="button"
          className="profile-panel__close"
          aria-label={profile.close}
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <p>{profile.bio}</p>
      <p>{profile.career}</p>
      <p>{profile.personal}</p>
      {links.length > 0 && (
        <ul className="profile-panel__links" aria-label={profile.linksLabel}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </dialog>
  )
}
