import { expect, type Page } from '@playwright/test'

export async function cerrarAvisoLegal(page: Page) {
  const dialogo = page.getByRole('dialog', { name: 'Aviso legal' })

  await expect(dialogo).toBeVisible()
  await dialogo.getByRole('button', { name: 'Entendido' }).click()
  await expect(dialogo).toBeHidden()
}

export async function completarLiquidacion(page: Page, opciones: { sueldo?: string } = {}) {
  await page.goto('/calculadora')
  await cerrarAvisoLegal(page)

  await page.getByLabel('Fecha de ingreso').fill('2024-01-15')
  await page.getByLabel('Fecha de cese').fill('2026-11-10')
  await page.getByLabel('Motivo del cese').selectOption('despido_arbitrario')
  await page.getByRole('button', { name: 'Continuar' }).click()

  await expect(page.getByRole('heading', { name: 'Remuneración' })).toBeVisible()
  await page.getByLabel('Sueldo básico mensual').fill(opciones.sueldo ?? '3000')
  await page.getByRole('checkbox', { name: /Recibí asignación familiar/ }).check()
  await page.getByRole('button', { name: 'Continuar' }).click()

  await expect(page.getByRole('heading', { name: 'Vacaciones' })).toBeVisible()
  await page.getByRole('button', { name: 'Calcular liquidación' }).click()

  await expect(page.getByText('Total bruto')).toBeVisible()
}
