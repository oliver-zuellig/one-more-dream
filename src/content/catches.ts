import { DREAM_TICKET_ID } from '../game/reducer'
import { dream } from './dream'
import type { Catch } from './types'

export const normalCatches: readonly Catch[] = [
  {
    id: 'javascript-fish',
    name: 'JavaScript fish',
    headline: 'A familiar fish',
    story:
      'JavaScript and Node.js have been part of my daily work for years. I still enjoy discovering what else I can build with them.',
  },
  {
    id: 'docker-container',
    name: 'Docker container',
    headline: 'A container at sea',
    story:
      'I moved our building management control system onto Docker and built the pipeline to deliver and update it.',
  },
  {
    id: 'curious-bug',
    name: 'Curious bug',
    headline: 'A bug? Of course.',
    story:
      "Sometimes the interesting part starts when something doesn't work. I like understanding why.",
  },
  {
    id: 'ai-duck',
    name: 'AI duck',
    headline: 'An experimental catch',
    story:
      'I experiment with AI agents and development workflows. Some ideas work; others teach me something.',
  },
  {
    id: 'swedish-cabin',
    name: 'Swedish cabin',
    headline: 'The first dream',
    story: 'Five years ago, living in Sweden felt far away. Now my family and I call Sweden home.',
  },
]

export const dreamTicket: Catch = {
  id: DREAM_TICKET_ID,
  name: 'Message in a bottle',
  headline: 'One more dream',
  story: dream.finaleLines.join(' '),
}

/** The three normal catches of a playthrough, in order. */
export const playthrough: readonly string[] = ['javascript-fish', 'docker-container', 'curious-bug']

export function getCatch(id: string): Catch {
  const found = id === DREAM_TICKET_ID ? dreamTicket : normalCatches.find((c) => c.id === id)
  if (!found) throw new Error(`Unknown catch: ${id}`)
  return found
}
