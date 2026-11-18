export type Catch = {
  readonly id: string
  /** Short name, used as image label and in announcements. */
  readonly name: string
  readonly headline: string
  readonly story: string
  /** URL of the decorative pixel-art illustration shown with the catch. */
  readonly illustration: string
}

export type ProfileLink = {
  readonly label: string
  readonly href: string
}
