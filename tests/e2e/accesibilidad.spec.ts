import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { cerrarAvisoLegal, completarLiquidacion } from './helpers'

const etiquetas = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

async function analizar(page: Page) {
  const resultado = await new AxeBuilder({ page }).withTags(etiquetas).analyze()

  const resumen = resultado.violations.map(
    (violacion) =>
      `${violacion.id} (${violacion.impact}): ${violacion.help} [${violacion.nodes.length}] ${violacion.nodes
        .map((nodo) => nodo.target.join(' '))
        .join(' | ')}`,
  )

  expect(resumen).toEqual([])
}

for (const ruta of ['/', '/fuentes', '/aviso-legal', '/terminos', '/privacidad']) {
  test(`sin violaciones axe en ${ruta}`, async ({ page }) => {
    await page.goto(ruta)
    await analizar(page)
  })
}

test('sin violaciones axe en la calculadora con el aviso abierto', async ({ page }) => {
  await page.goto('/calculadora')
  await expect(page.getByRole('dialog', { name: 'Aviso legal' })).toBeVisible()
  await analizar(page)
})

test('sin violaciones axe en el wizard sin el aviso', async ({ page }) => {
  await page.goto('/calculadora')
  await cerrarAvisoLegal(page)
  await analizar(page)
})

test('sin violaciones axe en los resultados', async ({ page }) => {
  await completarLiquidacion(page)
  await analizar(page)
})

test('sin violaciones axe en tema claro', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Cambiar a tema claro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await analizar(page)
})
