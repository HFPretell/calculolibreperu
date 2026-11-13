import { describe, expect, it } from 'vitest'
import { esquemaEntradaBasica } from '@calculolibreperu/shared'

describe('esquemaEntradaBasica', () => {
  it('acepta una entrada válida', () => {
    const resultado = esquemaEntradaBasica.safeParse({
      fechaIngreso: '2024-01-15',
      fechaCese: '2026-11-10',
      sueldoBasico: 3000,
    })
    expect(resultado.success).toBe(true)
  })

  it('rechaza una fecha con formato inválido', () => {
    const resultado = esquemaEntradaBasica.safeParse({
      fechaIngreso: '15/01/2024',
      fechaCese: '2026-11-10',
      sueldoBasico: 3000,
    })
    expect(resultado.success).toBe(false)
  })

  it('rechaza un sueldo negativo', () => {
    const resultado = esquemaEntradaBasica.safeParse({
      fechaIngreso: '2024-01-15',
      fechaCese: '2026-11-10',
      sueldoBasico: -1,
    })
    expect(resultado.success).toBe(false)
  })

  it('rechaza un cese anterior al ingreso', () => {
    const resultado = esquemaEntradaBasica.safeParse({
      fechaIngreso: '2026-11-10',
      fechaCese: '2024-01-15',
      sueldoBasico: 3000,
    })
    expect(resultado.success).toBe(false)
  })
})
