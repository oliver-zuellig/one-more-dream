import { dream } from './dream'

export const copy = {
  title: 'One More Dream',
  subtitle: 'A little fishing game about big dreams.',
  intro:
    "Five years ago, I had a dream: move to Sweden. This summer, we did. Now I'm casting my line a little further.",
  actions: {
    cast: 'Cast the line',
    castAgain: 'Cast again',
    reel: 'Reel in',
    meetOliver: 'Meet Oliver',
    viewCode: 'View the code',
    replay: 'Replay',
  },
  /** Short status line under the scene while a cast is in progress. */
  phaseHints: {
    casting: 'The line flies out over the lake…',
    nibbling: 'Something is nibbling!',
    reeling: 'Reeling in…',
  },
  /** Texts for the polite live region. */
  announcements: {
    caught: (name: string, headline: string) => `You caught: ${name}. ${headline}`,
    finale: (name: string, headline: string) =>
      `You caught: ${name}. ${headline}. ${dream.finaleLines.join(' ')}`,
  },
  footer: `An independent personal project by Oliver Züllig. Not affiliated with or endorsed by ${dream.company}.`,
} as const
