import { expect, test } from '@playwright/test'
import { cerrarAvisoLegal, completarLiquidacion } from './helpers'

test('completa el wizard y muestra los totales del caso dorado', async ({ page }) => {
  await completarLiquidacion(page)

  await expect(page.getByText(/28,569\.09/)).toBeVisible()
  await expect(page.getByText(/26,665\.56/)).toBeVisible()
  await expect(page.getByText('Intereses no incluidos')).toBeVisible()
  await expect(page.getByText('Resultado referencial. Verifica la normativa vigente')).toBeVisible()
})

test('valida fechas obligatorias y el orden cronológico', async ({ page }) => {
  await page.goto('/calculadora')
  await cerrarAvisoLegal(page)

  await page.getByRole('button', { name: 'Continuar' }).click()
  await expect(page.getByText('La fecha es obligatoria')).toHaveCount(2)
  await expect(page.getByRole('heading', { name: 'Datos del cese' })).toBeVisible()

  await page.getByLabel('Fecha de ingreso').fill('2026-01-01')
  await page.getByLabel('Fecha de cese').fill('2025-01-01')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await expect(
    page.getByText('La fecha de cese no puede ser anterior a la fecha de ingreso'),
  ).toBeVisible()
})

test('muestra el vencimiento solo para contrato modal', async ({ page }) => {
  await page.goto('/calculadora')
  await cerrarAvisoLegal(page)

  await expect(page.getByLabel('Vencimiento del contrato')).toHaveCount(0)

  await page.getByLabel('Tipo de contrato').selectOption('modal')
  await expect(page.getByLabel('Vencimiento del contrato')).toBeVisible()
})

test('copia el resumen al portapapeles', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await completarLiquidacion(page)

  await page.getByRole('button', { name: 'Copiar resumen' }).click()
  await expect(page.getByRole('button', { name: 'Resumen copiado' })).toBeVisible()

  const resumen = await page.evaluate(() => navigator.clipboard.readText())
  expect(resumen).toContain('Calculadora de Liquidación Laboral Perú')
  expect(resumen).toContain('Neto estimado')
  expect(resumen).toContain('26,665.56')
})

test('oculta navegación y botones al imprimir', async ({ page }) => {
  await completarLiquidacion(page)
  await page.emulateMedia({ media: 'print' })

  await expect(page.getByRole('banner')).toBeHidden()
  await expect(page.getByRole('contentinfo')).toBeHidden()
  await expect(page.getByRole('button', { name: 'Imprimir o guardar PDF' })).toBeHidden()

  await page.emulateMedia({ media: 'screen' })
})
