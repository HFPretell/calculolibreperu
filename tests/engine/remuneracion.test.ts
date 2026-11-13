import { describe, expect, it } from 'vitest'
import { calcularPromedioVariables, calcularRemuneracionComputable } from '@calculolibreperu/engine'
import { contextoBase, crearEntrada } from './fixtures'

describe('calcularPromedioVariables', () => {
  it('considera regular una variable con 3 de 6 meses', () => {
    const resultado = calcularPromedioVariables([0, 0, 0, 300, 400, 500])

    expect(resultado.regular).toBe(true)
    expect(resultado.mesesPercibidos).toBe(3)
    expect(resultado.promedio.toNumber()).toBe(200)
  })

  it('no considera regular una variable con 2 de 6 meses', () => {
    const resultado = calcularPromedioVariables([0, 0, 0, 0, 300, 400])

    expect(resultado.regular).toBe(false)
    expect(resultado.mesesPercibidos).toBe(2)
    expect(resultado.promedio.toNumber()).toBe(0)
  })

  it('promedia seis meses completos', () => {
    const resultado = calcularPromedioVariables([100, 200, 300, 400, 500, 600])

    expect(resultado.regular).toBe(true)
    expect(resultado.mesesPercibidos).toBe(6)
    expect(resultado.promedio.toNumber()).toBe(350)
  })
})

describe('calcularRemuneracionComputable', () => {
  it('calcula la RC base con asignación familiar', () => {
    const resultado = calcularRemuneracionComputable(crearEntrada(), contextoBase.parametros)

    expect(resultado.asignacionFamiliar.toNumber()).toBe(123)
    expect(resultado.rcGrati.toNumber()).toBe(3123)
    expect(resultado.rcCts.toNumber()).toBe(3643.5)
    expect(resultado.rcVac.toNumber()).toBe(3123)
    expect(resultado.gratificacionEstimada).toBe(true)
  })

  it('usa la última gratificación cuando se informa', () => {
    const resultado = calcularRemuneracionComputable(
      crearEntrada({ ultimaGratificacion: 3000 }),
      contextoBase.parametros,
    )

    expect(resultado.ultimaGratificacion.toNumber()).toBe(3000)
    expect(resultado.rcCts.toNumber()).toBe(3623)
    expect(resultado.gratificacionEstimada).toBe(false)
  })

  it('excluye la asignación familiar cuando no corresponde', () => {
    const resultado = calcularRemuneracionComputable(
      crearEntrada({ asignacionFamiliar: false }),
      contextoBase.parametros,
    )

    expect(resultado.asignacionFamiliar.toNumber()).toBe(0)
    expect(resultado.rcGrati.toNumber()).toBe(3000)
    expect(resultado.rcCts.toNumber()).toBe(3500)
    expect(resultado.rcVac.toNumber()).toBe(3000)
  })

  it('incluye variables regulares en las tres bases', () => {
    const resultado = calcularRemuneracionComputable(
      crearEntrada({
        variablesMensuales: [100, 200, 300, 400, 500, 600],
      }),
      contextoBase.parametros,
    )

    expect(resultado.promedioVariables.toNumber()).toBe(350)
    expect(resultado.rcGrati.toNumber()).toBe(3473)
    expect(resultado.rcCts.toNumber()).toBeCloseTo(4051.83, 2)
    expect(resultado.rcVac.toNumber()).toBe(3473)
  })
})
