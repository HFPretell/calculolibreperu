import { expect, test } from '@playwright/test'
import { completarLiquidacion } from './helpers'

test('no envía el sueldo ni datos del formulario por la red', async ({ page }) => {
  const peticiones: Array<{
    url: string
    metodo: string
    cuerpo: string | null
  }> = []

  page.on('request', (peticion) => {
    peticiones.push({
      url: peticion.url(),
      metodo: peticion.method(),
      cuerpo: peticion.postData(),
    })
  })

  await completarLiquidacion(page, { sueldo: '98765.43' })

  const origen = new URL(page.url()).origin
  const externas = peticiones.filter((peticion) => {
    if (!/^https?:/i.test(peticion.url)) return false
    return new URL(peticion.url).origin !== origen
  })

  expect(externas).toEqual([])
  expect(
    peticiones.filter((peticion) => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(peticion.metodo)),
  ).toEqual([])

  for (const peticion of peticiones) {
    expect(peticion.url).not.toContain('98765')
    expect(peticion.cuerpo ?? '').not.toContain('98765')
    expect(peticion.url).not.toContain('2024-01-15')
    expect(peticion.cuerpo ?? '').not.toContain('2024-01-15')
  }
})

test('solo persiste la preferencia de tema y el aviso de sesión', async ({ page }) => {
  await completarLiquidacion(page)

  await page.getByRole('button', { name: 'Cambiar a tema claro' }).click()

  const almacenamiento = await page.evaluate(() => ({
    local: Object.fromEntries(Object.entries(localStorage)),
    sesion: Object.fromEntries(Object.entries(sessionStorage)),
  }))

  expect(Object.keys(almacenamiento.local)).toEqual(['calculolibreperu:theme'])
  expect(almacenamiento.local['calculolibreperu:theme']).toBe('light')
  expect(Object.keys(almacenamiento.sesion)).toEqual(['calculolibreperu:aviso-legal'])
  expect(almacenamiento.sesion['calculolibreperu:aviso-legal']).toBe('visto')

  const serializado = JSON.stringify(almacenamiento)
  expect(serializado).not.toContain('3000')
  expect(serializado).not.toContain('2024-01-15')
  expect(serializado).not.toContain('2026-11-10')

  const cookies = await page.context().cookies()
  expect(cookies.filter((cookie) => cookie.name !== '__cf_bm')).toEqual([])
})

test('funciona con /params.json bloqueado', async ({ page }) => {
  await page.route('**/params.json', (ruta) => ruta.abort())
  await completarLiquidacion(page)

  await expect(page.getByText(/28,569\.09/)).toBeVisible()
  await expect(page.getByText(/26,665\.56/)).toBeVisible()
})
