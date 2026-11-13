import { describe, expect, it } from 'vitest'
import {
  anosDesde,
  formatearFechaCorta,
  sugerirMesesTrabajadosAnio,
} from '../../apps/web/src/features/calculadora/form'

describe('sugerirMesesTrabajadosAnio', () => {
  it('cuenta meses completos antes del cese en el año de cese', () => {
    expect(sugerirMesesTrabajadosAnio('2024-01-15', '2026-11-10')).toBe(10)
  })

  it('omite el mes parcial de ingreso y cuenta los meses completos siguientes', () => {
    expect(sugerirMesesTrabajadosAnio('2024-01-15', '2024-07-01')).toBe(5)
  })

  it('devuelve 0 si el cese ocurre en el mismo mes del ingreso', () => {
    expect(sugerirMesesTrabajadosAnio('2024-01-15', '2024-01-31')).toBe(0)
  })

  it('devuelve 0 con fechas incompletas o invertidas', () => {
    expect(sugerirMesesTrabajadosAnio('', '2024-01-31')).toBe(0)
    expect(sugerirMesesTrabajadosAnio('2024-12-31', '2024-01-01')).toBe(0)
  })
})

describe('anosDesde', () => {
  it('calcula años completos sin adelantar el aniversario', () => {
    expect(anosDesde('2020-06-15', '2024-06-15')).toBe(4)
    expect(anosDesde('2020-06-15', '2024-06-14')).toBe(3)
  })
})

describe('formatearFechaCorta', () => {
  it('formatea fechas ISO sin desplazar el día', () => {
    expect(formatearFechaCorta('2026-11-10')).toBe('10/11/2026')
  })
})
