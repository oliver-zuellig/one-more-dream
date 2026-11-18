import { expect, test, type Page } from '@playwright/test'
import { copy } from '../src/content/copy'
import { dream } from '../src/content/dream'

const CATCHES = 3

async function catchOne(page: Page, castLabel: string) {
  await page.getByRole('button', { name: castLabel }).click()
  await page.getByRole('button', { name: copy.actions.reel }).click()
  await page.getByRole('button', { name: copy.actions.boost }).click()
}

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
}

test('plays the full flow on desktop', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { level: 1, name: copy.title })).toBeVisible()
  await expect(page.getByText(copy.intro)).toBeVisible()

  const headlines = new Set<string>()
  for (let i = 0; i < CATCHES; i++) {
    await catchOne(page, i === 0 ? copy.actions.cast : copy.actions.castAgain)
    const card = page.getByRole('article')
    await expect(card).toBeVisible()
    await expect(card.locator('img')).toHaveJSProperty('complete', true)
    headlines.add((await card.getByRole('heading').textContent()) ?? '')
  }
  expect(headlines.size).toBe(CATCHES)

  await catchOne(page, copy.actions.castAgain)
  for (const line of dream.finaleLines)
    await expect(page.getByText(line, { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: copy.actions.viewCode })).toBeVisible()

  const header = page.getByRole('banner')
  await header.getByRole('button', { name: copy.actions.meetOliver }).click()
  const profile = page.getByRole('dialog')
  await expect(profile).toBeVisible()
  // profile.ts imports the photo, which Node cannot load: the close label is repeated here.
  // profile.ts imports the photo, which Node cannot load, so the close label is repeated here.
  await profile.getByRole('button', { name: 'Close' }).click()
  await expect(profile).toBeHidden()

  await page.getByRole('button', { name: copy.actions.replay }).click()
  await expect(page.getByRole('button', { name: copy.actions.cast })).toBeVisible()
})

test('fits a 360 px phone without horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 })
  await page.goto('./')
  await expectNoHorizontalScroll(page)

  await catchOne(page, copy.actions.cast)
  await expect(page.getByRole('article')).toBeInViewport({ ratio: 0.5 })
  await expectNoHorizontalScroll(page)

  for (let i = 1; i <= CATCHES; i++) await catchOne(page, copy.actions.castAgain)
  await expect(page.getByText(dream.finaleLines[0], { exact: true })).toBeVisible()
  await expectNoHorizontalScroll(page)

  await page.getByRole('banner').getByRole('button', { name: copy.actions.meetOliver }).click()
  const box = await page.getByRole('dialog').boundingBox()
  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(360)
})
