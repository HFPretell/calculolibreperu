import { expect, test } from '@playwright/test'

test('inicia en oscuro y conserva el tema claro al recargar', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Cambiar a tema claro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.getByRole('button', { name: 'Cambiar a tema oscuro' })).toBeVisible()
})
