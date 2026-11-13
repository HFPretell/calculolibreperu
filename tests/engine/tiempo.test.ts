import { describe, expect, it } from 'vitest'
import {
  calcularPeriodosVacacionales,
  computarTiempo,
  inicioSemestreCts,
  inicioSemestreGratificacion,
  mesesCalendarioCompletos,
} from '@calculolibreperu/engine'

describe('computarTiempo', () => {
  it('aplica 30/360 e incluye el día de cese', () => {
    expect(computarTiempo('2024-01-15', '2026-11-10')).toEqual({
      meses: 33,
      dias: 26,
    })
  })

  it('reconoce un mes calendario completo', () => {
    expect(computarTiempo('2026-01-01', '2026-01-31')).toEqual({
      meses: 1,
      dias: 0,
    })
  })

  it('cuenta un solo día cuando ingreso y cese coinciden', () => {
    expect(computarTiempo('2026-11-10', '2026-11-10')).toEqual({
      meses: 0,
      dias: 1,
    })
  })
})

describe('mesesCalendarioCompletos', () => {
  it('solo cuenta meses cerrados', () => {
    expect(mesesCalendarioCompletos('2026-07-01', '2026-11-10')).toBe(4)
    expect(mesesCalendarioCompletos('2026-07-01', '2026-11-30')).toBe(5)
  })

  it('no cuenta meses parciales al inicio', () => {
    expect(mesesCalendarioCompletos('2026-07-15', '2026-10-31')).toBe(3)
  })
})

describe('semestres', () => {
  it('resuelve el semestre CTS de noviembre a abril', () => {
    expect(inicioSemestreCts('2026-11-10')).toBe('2026-11-01')
    expect(inicioSemestreCts('2026-04-30')).toBe('2025-11-01')
  })

  it('resuelve el semestre CTS de mayo a octubre', () => {
    expect(inicioSemestreCts('2026-05-01')).toBe('2026-05-01')
    expect(inicioSemestreCts('2026-10-31')).toBe('2026-05-01')
  })

  it('resuelve el semestre de gratificación', () => {
    expect(inicioSemestreGratificacion('2026-06-30')).toBe('2026-01-01')
    expect(inicioSemestreGratificacion('2026-07-01')).toBe('2026-07-01')
    expect(inicioSemestreGratificacion('2026-11-10')).toBe('2026-07-01')
  })
})

describe('calcularPeriodosVacacionales', () => {
  it('genera períodos por aniversario y marca vencidos', () => {
    const resultado = calcularPeriodosVacacionales('2024-01-15', '2026-11-10', 0)

    expect(resultado.periodos).toHaveLength(2)
    expect(resultado.periodos[0]).toMatchObject({
      desde: '2024-01-15',
      hasta: '2025-01-14',
      estado: 'vencido',
      diasPendientes: 30,
    })
    expect(resultado.periodos[1]).toMatchObject({
      desde: '2025-01-15',
      hasta: '2026-01-14',
      estado: 'no_gozado',
      diasPendientes: 30,
    })
    expect(resultado.diasAdelantados).toBe(0)
    expect(resultado.diasTruncos).toBe(296)
  })

  it('imputa días gozados al período más antiguo', () => {
    const resultado = calcularPeriodosVacacionales('2024-01-15', '2026-11-10', 45)

    expect(resultado.periodos[0].diasPendientes).toBe(0)
    expect(resultado.periodos[1].diasPendientes).toBe(15)
    expect(resultado.diasAdelantados).toBe(0)
  })

  it('registra días adelantados sin reducir la trunca', () => {
    const resultado = calcularPeriodosVacacionales('2024-01-15', '2026-11-10', 70)

    expect(resultado.periodos[0].diasPendientes).toBe(0)
    expect(resultado.periodos[1].diasPendientes).toBe(0)
    expect(resultado.diasAdelantados).toBe(10)
    expect(resultado.diasTruncos).toBe(296)
  })
})
