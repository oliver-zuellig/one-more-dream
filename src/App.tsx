import { useState } from 'react'
import { CatchCard } from './components/CatchCard'
import { LakeScene } from './components/LakeScene'
import { ProfilePanel } from './components/ProfilePanel'
import { dreamTicket, getCatch, playthrough } from './content/catches'
import { copy } from './content/copy'
import { dream } from './content/dream'
import { codeUrl } from './content/profile'
import { usePlaythrough } from './game/timing'
import type { GameState } from './game/types'

function announcementFor(state: GameState): string {
  if (state.phase === 'finale')
    return copy.announcements.finale(dreamTicket.name, dreamTicket.headline)
  if (state.phase === 'revealing' && state.currentCatchId) {
    const caught = getCatch(state.currentCatchId)
    return copy.announcements.caught(caught.name, caught.headline)
  }
  return ''
}

export function App() {
  const { state, cast, reel, replay } = usePlaythrough(playthrough)
  const [profileOpen, setProfileOpen] = useState(false)
  const openProfile = () => setProfileOpen(true)
  const { phase } = state

  return (
    <div className="app">
      <header className="site-header">
        <div>
          <h1 className="site-header__title">{copy.title}</h1>
          <p className="site-header__subtitle">{copy.subtitle}</p>
        </div>
        <button type="button" className="button button--secondary" onClick={openProfile}>
          {copy.actions.meetOliver}
        </button>
      </header>

      <main className="game">
        <LakeScene phase={phase} />

        <p role="status" className="visually-hidden">
          {announcementFor(state)}
        </p>

        <div className="game__panel">
          {phase === 'intro' && (
            <>
              <p className="game__intro">{copy.intro}</p>
              <button type="button" className="button" onClick={cast}>
                {copy.actions.cast}
              </button>
            </>
          )}

          {(phase === 'casting' || phase === 'nibbling' || phase === 'reeling') && (
            <>
              <p className="game__hint">{copy.phaseHints[phase]}</p>
              {phase === 'nibbling' && (
                <button type="button" className="button" onClick={reel}>
                  {copy.actions.reel}
                </button>
              )}
            </>
          )}

          {phase === 'revealing' && state.currentCatchId && (
            <>
              <CatchCard caught={getCatch(state.currentCatchId)} />
              <button type="button" className="button" onClick={cast}>
                {copy.actions.castAgain}
              </button>
            </>
          )}

          {phase === 'finale' && (
            <section className="finale" aria-labelledby="finale-headline">
              <p className="finale__name">{dreamTicket.name}</p>
              <h2 id="finale-headline" className="finale__headline">
                {dreamTicket.headline}
              </h2>
              <div className="finale__message">
                {dream.finaleLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="finale__actions">
                <button type="button" className="button" onClick={openProfile}>
                  {copy.actions.meetOliver}
                </button>
                {codeUrl && (
                  <a className="button button--secondary" href={codeUrl}>
                    {copy.actions.viewCode}
                  </a>
                )}
                <button type="button" className="button button--secondary" onClick={replay}>
                  {copy.actions.replay}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="site-footer">
        <p>{copy.footer}</p>
      </footer>

      <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  )
}
