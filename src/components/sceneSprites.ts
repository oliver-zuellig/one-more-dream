import fisherSheet from '../art/fisher-16f.webp'
import skySheet from '../art/sky-overlay-8f.png'
import waterSheet from '../art/water-highlights-8f.png'
import { defaultDurations } from '../game/timing'
import type { Phase } from '../game/types'

/** Sprite sheets of the lake scene, where they sit and how they move per phase. */

/** A sprite sheet of equal frames, numbered from 1 row by row. */
export type Sheet = {
  readonly href: string
  readonly columns: number
  readonly rows: number
  readonly frameWidth: number
  readonly frameHeight: number
}

export type Box = {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

/** Frames in order, played evenly over `durationMs`, then held on the last one or repeated. */
export type SpriteAnimation = {
  readonly frames: readonly number[]
  readonly durationMs: number
  readonly loop: boolean
}

/** Every frame has the boots at the same spot (x 100, y 285), so switching frames never moves him. */
export const FISHER_SHEET: Sheet = {
  href: fisherSheet,
  columns: 4,
  rows: 4,
  frameWidth: 340,
  frameHeight: 300,
}
export const SKY_SHEET: Sheet = {
  href: skySheet,
  columns: 4,
  rows: 2,
  frameWidth: 480,
  frameHeight: 270,
}
export const WATER_SHEET: Sheet = {
  href: waterSheet,
  columns: 4,
  rows: 2,
  frameWidth: 393,
  frameHeight: 220,
}

/** Where the fisherman stands: on the end of the dock. */
export const FISHER_BOX: Box = { x: 633, y: 240, width: 238, height: 210 }
/** Clouds drift over the sunset sky; only the right part of each frame has pixels. */
export const SKY_BOX: Box = { x: 1000, y: 0, width: 480, height: 270 }
/** Highlights on the open lake right of the dock, clear of dock, fisherman and far shore. */
export const WATER_BOX: Box = { x: 790, y: 260, width: 590, height: 330 }

export const SKY_ANIMATION: SpriteAnimation = {
  frames: [1, 2, 3, 4, 5, 6, 7, 8],
  durationMs: 3600,
  loop: true,
}
export const WATER_ANIMATION: SpriteAnimation = {
  frames: [1, 2, 3, 4, 5, 6, 7, 8],
  durationMs: 1600,
  loop: true,
}

/** Frames 1–4 cast, 5–8 wait, 9–12 bite and reel in, 13–16 land the catch and celebrate. */
export const FISHER_ANIMATIONS: Record<Phase, SpriteAnimation & { readonly still: number }> = {
  intro: { frames: [1], durationMs: 0, loop: false, still: 1 },
  casting: { frames: [1, 2, 3, 4], durationMs: defaultDurations.casting, loop: false, still: 4 },
  nibbling: { frames: [5, 6, 7, 8, 9], durationMs: 1000, loop: true, still: 9 },
  reeling: { frames: [10, 11, 12, 11], durationMs: 480, loop: true, still: 11 },
  revealing: { frames: [13, 14, 15], durationMs: 600, loop: false, still: 15 },
  finale: { frames: [15, 16], durationMs: 400, loop: false, still: 16 },
}

/** How the fisherman moves in a phase. Animations follow the phase; they never decide anything. */
export function fisherAnimation(phase: Phase): SpriteAnimation {
  const { frames, durationMs, loop } = FISHER_ANIMATIONS[phase]
  return { frames, durationMs, loop }
}

export function frameOffset(sheet: Sheet, frame: number) {
  const index = frame - 1
  return {
    x: (index % sheet.columns) * sheet.frameWidth,
    y: Math.floor(index / sheet.columns) * sheet.frameHeight,
  }
}

/** CSS keyframes that step the sheet through the frames, one even slice of time each. */
function keyframes(name: string, sheet: Sheet, { frames }: SpriteAnimation) {
  const step = (percent: number, frame: number) => {
    const { x, y } = frameOffset(sheet, frame)
    return `${percent}%{transform:translate(${-x}px,${-y}px)}`
  }
  const steps = frames.map((frame, i) => step((i / frames.length) * 100, frame))
  return `@keyframes ${name}{${steps.join('')}${step(100, frames.at(-1) ?? 1)}}`
}

const fisherKeyframes = (phase: Phase) =>
  keyframes(`fisher-${phase}`, FISHER_SHEET, FISHER_ANIMATIONS[phase])

/** All keyframes of the scene, built once from the frame tables above. */
export const SCENE_KEYFRAMES = [
  keyframes('sky', SKY_SHEET, SKY_ANIMATION),
  keyframes('water', WATER_SHEET, WATER_ANIMATION),
  ...(Object.keys(FISHER_ANIMATIONS) as Phase[]).map(fisherKeyframes),
].join('')
