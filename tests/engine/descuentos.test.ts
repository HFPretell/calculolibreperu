import { describe, expect, it } from 'vitest'
import {
  calcularImpuestoRenta,
  calcularPension,
  calcularRemuneracionComputable,
  calcularRenta5ta,
  d,
} from '@calculolibreperu/engine'
import { contextoBase, crearEntrada } from './fixtures'

describe('calcularImpuestoRenta', () => {
  it('aplica el primer tramo de 8%', () => {
    const impuesto = calcularImpuestoRenta(
      d('11100.18'),
      d('5500'),
      contextoBase.parametros.renta.tramos,
    )

    expect(impuesto.toNumber()).toBeCloseTo(888.0144, 4)
  })

  it('aplica dos tramos', () => {
    const impuesto = calcularImpuestoRenta(
      d('30000'),
      d('5500'),
      contextoBase.parametros.renta.tramos,
    )

    expect(impuesto.toNumber()).toBe(2550)
  })

  it('no cobra impuesto sin renta neta', () => {
    const impuesto = calcularImpuestoRenta(d('0'), d('5500'), contextoBase.parametros.renta.tramos)

    expect(impuesto.toNumber()).toBe(0)
  })
})

describe('calcularPension', () => {
  it('calcula AFP flujo con fondo, prima y comisión', () => {
    const pension = calcularPension(d('9854.8'), crearEntrada(), contextoBase.parametros)

    expect(pension.base).toBe(9854.8)
    expect(pension.afp).toEqual({
      fondo: 985.48,
      prima: 135.01,
      comision: 144.87,
      total: 1265.36,
    })
    expect(pension.total).toBe(1265.36)
  })

  it('no descuenta comisión en AFP mixta', () => {
    const pension = calcularPension(
      d('9854.8'),
      crearEntrada({ tipoComisionAfp: 'mixta' }),
      contextoBase.parametros,
    )

    expect(pension.afp?.comision).toBe(0)
    expect(pension.total).toBe(1120.49)
  })

  it('calcula ONP al 13%', () => {
    const pension = calcularPension(
      d('9854.8'),
      crearEntrada({ sistemaPensionario: 'onp' }),
      contextoBase.parametros,
    )

    expect(pension.onp).toBe(1281.12)
    expect(pension.afp).toBeUndefined()
    expect(pension.total).toBe(1281.12)
  })
})

describe('calcularRenta5ta', () => {
  it('estima la renta anual y atribuye la retención a la liquidación', () => {
    const entrada = crearEntrada()
    const remuneracion = calcularRemuneracionComputable(entrada, contextoBase.parametros)
    const renta = calcularRenta5ta(entrada, contextoBase.parametros, d('12124.18'), remuneracion)

    expect(renta.remuneracionesAnio).toBe(31230)
    expect(renta.gratificacionesAnio).toBe(3123)
    expect(renta.rentaBruta).toBe(46477.18)
    expect(renta.deduccion).toBe(38500)
    expect(renta.rentaNeta).toBe(7977.18)
    expect(renta.impuesto).toBe(638.17)
    expect(renta.atribuibleLiquidacion).toBe(638.17)
    expect(renta.estimado).toBe(true)
  })

  it('usa los datos anuales cuando se informan', () => {
    const entrada = crearEntrada({
      remuneracionesPercibidasAnio: 40000,
      gratificacionesPercibidasAnio: 6000,
      mesesTrabajadosAnio: 12,
    })
    const remuneracion = calcularRemuneracionComputable(entrada, contextoBase.parametros)
    const renta = calcularRenta5ta(entrada, contextoBase.parametros, d('0'), remuneracion)

    expect(renta.remuneracionesAnio).toBe(40000)
    expect(renta.gratificacionesAnio).toBe(6000)
    expect(renta.rentaBruta).toBe(46000)
    expect(renta.rentaNeta).toBe(7500)
    expect(renta.impuesto).toBe(600)
    expect(renta.estimado).toBe(false)
  })

  it('limita la atribución a la retención final pendiente', () => {
    const entrada = crearEntrada({ retencionesEmpleadorActual: 1000 })
    const remuneracion = calcularRemuneracionComputable(entrada, contextoBase.parametros)
    const renta = calcularRenta5ta(entrada, contextoBase.parametros, d('12124.18'), remuneracion)

    expect(renta.retenciones).toBe(1000)
    expect(renta.retencionFinal).toBe(0)
    expect(renta.atribuibleLiquidacion).toBe(0)
  })
})
