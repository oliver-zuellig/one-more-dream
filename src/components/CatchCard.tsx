import type { Catch } from '../content/types'

type Props = {
  readonly caught: Catch
}

/** Compact card showing what came out of the lake. */
export function CatchCard({ caught }: Props) {
  const headingId = `catch-${caught.id}-headline`
  return (
    <article className="catch-card" aria-labelledby={headingId}>
      <img className="catch-illustration" src={caught.illustration} alt="" />
      <p className="catch-card__name">{caught.name}</p>
      <h2 id={headingId} className="catch-card__headline">
        {caught.headline}
      </h2>
      <p className="catch-card__story">{caught.story}</p>
    </article>
  )
}
