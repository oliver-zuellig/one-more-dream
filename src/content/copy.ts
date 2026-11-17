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
  footer: `An independent personal project by Oliver Züllig. Not affiliated with or endorsed by ${dream.company}.`,
} as const
