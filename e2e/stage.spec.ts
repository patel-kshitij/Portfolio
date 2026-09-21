import { expect, test, type Page } from '@playwright/test'

/**
 * The single page stage, as a visitor sees it (docs/product/site.md).
 * Rules for this file: docs/rules/frontend.md, section "Testing".
 */

const GREETING = /Kshitij Patel/

/** Waits until only the given section is on the stage and fully faded in, so no transition is running. */
async function expectSection(page: Page, id: string) {
  const sections = page.locator('[data-section]')
  await expect(sections).toHaveCount(1)
  await expect(sections).toHaveAttribute('data-section', id)
  await expect(sections).toHaveCSS('opacity', '1')
}

/** Marks the current document, so a later check can prove the page never reloaded. */
async function markDocument(page: Page) {
  await page.evaluate(() => {
    document.documentElement.dataset.e2eDocument = 'original'
  })
}

async function expectSameDocument(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('data-e2e-document', 'original')
}

/** The arrow's rotation in whole degrees, ignoring the sign (180 and -180 are the same turn). */
async function arrowAngle(page: Page) {
  return page.locator('[data-turned]').evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
    return Math.abs(Math.round((Math.atan2(matrix.b, matrix.a) * 180) / Math.PI))
  })
}

/** How far the arrow's centre is from the card's left edge and from the card's centre, in pixels. */
async function arrowPlacement(page: Page) {
  const [arrow, card] = await Promise.all([
    page.locator('[data-turned]').boundingBox(),
    page.getByRole('main').boundingBox(),
  ])
  if (!arrow || !card) throw new Error('arrow or card not found')
  const arrowCentre = arrow.x + arrow.width / 2
  return { fromLeft: arrowCentre - card.x, fromCentre: Math.abs(arrowCentre - (card.x + card.width / 2)) }
}

test('the arrow walks through every section without reloading the page', async ({ page }) => {
  await page.goto('/')
  await expectSection(page, 'home')
  await expect(page.getByRole('heading', { level: 1, name: GREETING })).toBeVisible()
  await markDocument(page)

  const steps = [
    { link: 'Go to About', path: '/about', id: 'about', heading: 'About Me' },
    { link: 'Go to Projects', path: '/projects', id: 'projects', heading: 'My Projects' },
    { link: 'Go to Contact', path: '/contact', id: 'contact', heading: 'Contact Me' },
    { link: 'Back to Home', path: '/', id: 'home', heading: GREETING },
  ]

  for (const step of steps) {
    await page.getByRole('link', { name: step.link }).click()
    await expect(page).toHaveURL(step.path)
    await expectSection(page, step.id)
    await expect(page.getByRole('heading', { level: 1, name: step.heading })).toBeVisible()
    await expectSameDocument(page)
  }
})

test('Back and Forward move between sections', async ({ page }) => {
  await page.goto('/about')
  await expectSection(page, 'about')
  await markDocument(page)

  await page.getByRole('link', { name: 'Go to Projects' }).click()
  await expectSection(page, 'projects')

  await page.goBack()
  await expect(page).toHaveURL('/about')
  await expectSection(page, 'about')
  await expect(page.getByRole('heading', { level: 1, name: 'About Me' })).toBeVisible()

  await page.goForward()
  await expect(page).toHaveURL('/projects')
  await expectSection(page, 'projects')
  await expectSameDocument(page)
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  const pages = [
    { path: '/', title: 'Kshitij Patel', text: GREETING },
    { path: '/about', title: 'About | Kshitij Patel', text: /Problem-solving/ },
    { path: '/projects', title: 'Projects | Kshitij Patel', text: /Serverless Image Pipeline/ },
    { path: '/contact', title: 'Contact | Kshitij Patel', text: /The fastest way to reach me/ },
  ]

  for (const expected of pages) {
    test(`${expected.path} arrives as finished HTML with its own title`, async ({ page }) => {
      const response = await page.goto(expected.path)
      expect(response?.status()).toBe(200)
      await expect(page).toHaveTitle(expected.title)
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', expected.title)
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/)
      await expect(page.getByText(expected.text).first()).toBeVisible()
      // Playwright counts opacity 0 as visible, so check the section really shows.
      await expect(page.locator('[data-section]')).toHaveCSS('opacity', '1')
    })
  }
})

test('a wrong address answers 404, then lands on Home', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page).toHaveURL('/')
  await expectSection(page, 'home')
  await expect(page.getByRole('heading', { level: 1, name: GREETING })).toBeVisible()
})

test('the intro plays only when a visit starts on Home', async ({ page }) => {
  const stage = page.getByRole('main')

  await page.goto('/')
  await expect(stage).toHaveAttribute('data-intro', 'on')
  await page.getByRole('link', { name: 'Go to About' }).click()
  await expectSection(page, 'about')
  await page.goBack()
  await expectSection(page, 'home')
  await expect(stage).toHaveAttribute('data-intro', 'off')

  // A new visit that starts somewhere else never plays it.
  await page.goto('/contact')
  await expect(stage).toHaveAttribute('data-intro', 'off')
  await page.getByRole('link', { name: 'Back to Home' }).click()
  await expectSection(page, 'home')
  await expect(stage).toHaveAttribute('data-intro', 'off')
})

test('on the last section the arrow sits in the middle and points back', async ({ page }) => {
  const arrow = page.locator('[data-turned]')

  await page.goto('/projects')
  await expectSection(page, 'projects')
  await expect(arrow).toHaveAttribute('data-turned', 'forward')

  await page.getByRole('link', { name: 'Go to Contact' }).click()
  await expectSection(page, 'contact')
  await expect(arrow).toHaveAttribute('data-turned', 'back')
  await expect.poll(async () => (await arrowPlacement(page)).fromCentre).toBeLessThan(2)
  await expect.poll(() => arrowAngle(page)).toBe(180)

  await page.getByRole('link', { name: 'Back to Home' }).click()
  await expectSection(page, 'home')
  await expect(arrow).toHaveAttribute('data-turned', 'forward')
  await expect.poll(() => arrowAngle(page)).toBe(0)
  await expect
    .poll(async () => {
      const placement = await arrowPlacement(page)
      return placement.fromLeft < placement.fromCentre
    })
    .toBe(true)
})

test('the Left and Right arrow keys move between sections', async ({ page }) => {
  await page.goto('/about')
  await expectSection(page, 'about')
  await markDocument(page)

  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL('/projects')
  await expectSection(page, 'projects')

  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL('/about')
  await expectSection(page, 'about')

  // Left stops at Home; Right after the last section goes to Home, like the arrow.
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL('/')
  await expectSection(page, 'home')
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL('/')

  await page.goto('/contact')
  await expectSection(page, 'contact')
  await markDocument(page)
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL('/')
  await expectSection(page, 'home')
  await expectSameDocument(page)
})

/** A finger travelling `dx` pixels sideways across the card. Positive is to the right. */
async function swipe(page: Page, dx: number) {
  const card = page.getByRole('main')
  const touch = { pointerType: 'touch', isPrimary: true, pointerId: 1, clientX: 300, clientY: 300 }
  await card.dispatchEvent('pointerdown', touch)
  await card.dispatchEvent('pointerup', { ...touch, clientX: touch.clientX + dx })
}

test('a sideways swipe moves between sections, a mouse drag does not', async ({ page }) => {
  await page.goto('/about')
  await expectSection(page, 'about')

  await swipe(page, -120)
  await expect(page).toHaveURL('/projects')
  await expectSection(page, 'projects')

  await swipe(page, 120)
  await expect(page).toHaveURL('/about')
  await expectSection(page, 'about')

  // Too short to count.
  await swipe(page, -20)
  await expect(page).toHaveURL('/about')

  // A mouse selecting text must never move the stage.
  const card = page.getByRole('main')
  await card.dispatchEvent('pointerdown', { pointerType: 'mouse', isPrimary: true, clientX: 300, clientY: 300 })
  await card.dispatchEvent('pointerup', { pointerType: 'mouse', isPrimary: true, clientX: 100, clientY: 300 })
  await expect(page).toHaveURL('/about')
})

test('Home says what Kshitij is open to, and Contact links the resume', async ({ page, request }) => {
  await page.goto('/')
  await expectSection(page, 'home')
  await expect(page.getByText(/freelance work/)).toBeVisible()

  await page.goto('/contact')
  await expectSection(page, 'contact')
  const resume = page.getByRole('link', { name: 'resume' })
  await expect(resume).toHaveAttribute('href', '/resume.pdf')
  const response = await request.get('/resume.pdf')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('pdf')
})

test('the projects are stars: each one selects, and the panel shows it', async ({ page }) => {
  await page.goto('/projects')
  await expectSection(page, 'projects')

  const stars = page.getByRole('button', { name: /project \d of \d/ })
  expect(await stars.count()).toBeGreaterThan(3)

  // The first star is selected on arrival, so the panel is never empty.
  const first = page.getByRole('button', { name: 'Qrakr, project 1 of 6' })
  await expect(first).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('heading', { level: 2, name: 'Qrakr' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Live site' })).toHaveAttribute('href', 'https://qrakr.com')

  // A click selects another star; the panel follows and the card keeps its size.
  const cardBefore = await page.getByRole('main').boundingBox()
  await page.getByRole('button', { name: /^Work Board, project/ }).click()
  await expect(first).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByRole('heading', { level: 2, name: 'Work Board' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Qrakr' })).toBeHidden()
  await expect(page.getByRole('link', { name: 'Live site' })).toHaveAttribute('href', /board\.patelkshitij\.com/)
  const cardAfter = await page.getByRole('main').boundingBox()
  expect(cardAfter?.height).toBe(cardBefore?.height)

  // Keyboard: focusing a star selects it too.
  await page.getByRole('button', { name: /^SkillSwap, project/ }).focus()
  await expect(page.getByRole('heading', { level: 2, name: 'SkillSwap' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Code on GitHub' })).toHaveAttribute('href', /github\.com/)
})

test('links that leave the site open in a new tab safely', async ({ page }) => {
  for (const path of ['/projects', '/contact']) {
    await page.goto(path)
    const external = page.locator('a[target="_blank"]')
    expect(await external.count()).toBeGreaterThan(0)
    for (const link of await external.all()) {
      await expect(link).toHaveAttribute('rel', /noopener/)
    }
  }
})
