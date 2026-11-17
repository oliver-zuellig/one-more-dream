import links from './links.json'
import type { ProfileLink } from './types'

export const profile = {
  heading: "Hi, I'm Oliver.",
  bio: "I'm a self-taught full-stack developer with around ten years of experience building web applications. I enjoy figuring out how things work, solving problems and building tools that make life a little easier for others. JavaScript, Node.js and Linux are my comfort zone. I've also worked across frontend, backend, Docker and build pipelines, and I enjoy experimenting with AI-assisted development.",
  career:
    'At Comsys Bärtsch AG, I helped build and maintain a building management platform, moved our control system to Docker, and worked on build and delivery pipelines, automated updates and tools for customer installations. I learned that the work does not end when software is released.',
  personal:
    'My family and I moved from Switzerland to Sweden in summer 2026. Music, curiosity and the occasional fishing trip are part of the story.',
} as const

type LinkConfig = Partial<Record<'github' | 'linkedin', string>>

const LABELS = { github: 'GitHub', linkedin: 'LinkedIn' } as const

/** Profile links the owner has filled in. Empty or non-https values are left out. */
export function toProfileLinks(config: LinkConfig): ProfileLink[] {
  return (Object.keys(LABELS) as (keyof typeof LABELS)[]).flatMap((key) => {
    const href = config[key]?.trim() ?? ''
    return href.startsWith('https://') ? [{ label: LABELS[key], href }] : []
  })
}

export const profileLinks = toProfileLinks(links)

/** Link to the public source code of this game. */
export const codeUrl = links.code
