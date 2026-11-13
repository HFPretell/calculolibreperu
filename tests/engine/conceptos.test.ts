import { describe, expect, it } from 'vitest'
import {
  calcularBonificacionExtraordinaria,
  calcularCts,
  calcularGratificacion,
  calcularIndemnizacion,
  calcularRemuneracionComputable,
  calcularRemuneracionMesCese,
  calcularVacaciones,
} from '@calculolibreperu/engine'
import { contextoBase, crearEntrada } from './fixtures'

function remuneracionBase() {
  return calcularRemuneracionComputable(crearEntrada(), contextoBase.parametros)
}

describe('calcularCts', () => {
  it('calcula la CTS del semestre en curso', () => {
    const resultado = calcularCts(crearEntrada(), remuneracionBase())

    expect(resultado.desde).toBe('2026-11-01')
    expect(resultado.tiempo).toEqual({ meses: 0, dias: 10 })
    expect(resultado.monto.toNumber()).toBeCloseTo(101.21, 2)
  })
})

describe('calcularGratificacion', () => {
  it('calcula la gratificación con meses calendario completos', () => {
    const resultado = calcularGratificacion(crearEntrada(), remuneracionBase())

    expect(resultado.desde).toBe('2026-07-01')
    expect(resultado.mesesCompletos).toBe(4)
    expect(resultado.monto.toNumber()).toBe(2082)
  })

  it('calcula la bonificación extraordinaria sin EPS', () => {
    const resultado = calcularBonificacionExtraordinaria(
      calcularGratificacion(crearEntrada(), remuneracionBase()).monto,
      false,
    )

    expect(resultado.tasa).toBe(0.09)
    expect(resultado.monto.toNumber()).toBeCloseTo(187.38, 2)
  })

  it('calcula la bonificación extraordinaria con EPS', () => {
    const resultado = calcularBonificacionExtraordinaria(
      calcularGratificacion(crearEntrada(), remuneracionBase()).monto,
      true,
    )

    expect(resultado.tasa).toBe(0.0675)
    expect(resultado.monto.toNumber()).toBeCloseTo(140.535, 6)
  })
})

describe('calcularVacaciones', () => {
  it('separa truncas, no gozadas, vencidas e indemnización', () => {
    const resultado = calcularVacaciones(crearEntrada(), remuneracionBase())

    expect(resultado.diasTruncos).toBe(296)
    expect(resultado.diasNoGozados).toBe(30)
    expect(resultado.diasVencidos).toBe(30)
    expect(resultado.montoTruncas.toNumber()).toBeCloseTo(2567.8, 2)
    expect(resultado.montoNoGozadas.toNumber()).toBe(3123)
    expect(resultado.montoVencidas.toNumber()).toBe(3123)
    expect(resultado.montoIndemnizacion.toNumber()).toBe(3123)
  })

  it('descuenta días gozados del período más antiguo', () => {
    const entrada = crearEntrada({ diasVacacionesGozadas: 45 })
    const resultado = calcularVacaciones(
      entrada,
      calcularRemuneracionComputable(entrada, contextoBase.parametros),
    )

    expect(resultado.diasNoGozados).toBe(15)
    expect(resultado.diasVencidos).toBe(0)
    expect(resultado.montoNoGozadas.toNumber()).toBe(1561.5)
    expect(resultado.montoVencidas.toNumber()).toBe(0)
    expect(resultado.montoIndemnizacion.toNumber()).toBe(0)
  })

  it('reporta días adelantados sin reducir la trunca', () => {
    const entrada = crearEntrada({ diasVacacionesGozadas: 70 })
    const resultado = calcularVacaciones(
      entrada,
      calcularRemuneracionComputable(entrada, contextoBase.parametros),
    )

    expect(resultado.diasAdelantados).toBe(10)
    expect(resultado.diasTruncos).toBe(296)
    expect(resultado.montoTruncas.toNumber()).toBeCloseTo(2567.8, 2)
  })
})

describe('calcularIndemnizacion', () => {
  it('calcula la indemnización por despido arbitrario', () => {
    const resultado = calcularIndemnizacion(crearEntrada(), remuneracionBase())

    expect(resultado.aplica).toBe(true)
    expect(resultado.dentroPrueba).toBe(false)
    expect(resultado.monto.toNumber()).toBeCloseTo(13220.7, 2)
    expect(resultado.detalle).toContain('2 años, 9 meses y 26 días')
  })

  it('no calcula indemnización dentro del período de prueba', () => {
    const entrada = crearEntrada({ fechaCese: '2024-03-01' })
    const resultado = calcularIndemnizacion(
      entrada,
      calcularRemuneracionComputable(entrada, contextoBase.parametros),
    )

    expect(resultado.aplica).toBe(false)
    expect(resultado.dentroPrueba).toBe(true)
    expect(resultado.monto.toNumber()).toBe(0)
  })

  it('no calcula indemnización por renuncia', () => {
    const entrada = crearEntrada({ motivoCese: 'renuncia' })
    const resultado = calcularIndemnizacion(
      entrada,
      calcularRemuneracionComputable(entrada, contextoBase.parametros),
    )

    expect(resultado.aplica).toBe(false)
    expect(resultado.monto.toNumber()).toBe(0)
  })

  it('calcula indemnización modal por meses restantes', () => {
    const entrada = crearEntrada({
      tipoContrato: 'modal',
      fechaVencimientoContrato: '2027-03-10',
    })
    const resultado = calcularIndemnizacion(
      entrada,
      calcularRemuneracionComputable(entrada, contextoBase.parametros),
    )

    expect(resultado.aplica).toBe(true)
    expect(resultado.mesesRestantes?.toNumber()).toBe(4)
    expect(resultado.monto.toNumber()).toBe(18738)
  })
})

describe('calcularRemuneracionMesCese', () => {
  it('paga los días laborados del mes de cese', () => {
    const resultado = calcularRemuneracionMesCese(crearEntrada(), remuneracionBase())

    expect(resultado.diasLaborados).toBe(10)
    expect(resultado.monto.toNumber()).toBe(1041)
  })

  it('suma las variables devengadas del mes de cese', () => {
    const entrada = crearEntrada({ variablesDevengadasMesCese: 500 })
    const resultado = calcularRemuneracionMesCese(
      entrada,
      calcularRemuneracionComputable(entrada, contextoBase.parametros),
    )

    expect(resultado.variables.toNumber()).toBe(500)
    expect(resultado.monto.toNumber()).toBe(1541)
  })
})
