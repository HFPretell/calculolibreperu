import { describe, expect, it } from 'vitest'
import { calcularLiquidacion } from '@calculolibreperu/engine'
import { contextoBase, crearEntrada } from './fixtures'

function buscarConcepto(resultado: ReturnType<typeof calcularLiquidacion>, concepto: string) {
  return resultado.conceptos.find((item) => item.concepto === concepto)
}

describe('calcularLiquidacion', () => {
  it('expone tiempo de servicio y periodos vacacionales', () => {
    const resultado = calcularLiquidacion(crearEntrada(), contextoBase)

    expect(resultado.tiempoServicio).toEqual({
      meses: 33,
      dias: 26,
      anios: 2,
      mesesRestantes: 9,
    })
    expect(resultado.periodosVacacionales).toHaveLength(2)
    expect(resultado.periodosVacacionales[0].estado).toBe('vencido')
    expect(resultado.periodosVacacionales[1].estado).toBe('no_gozado')
  })

  it('marca los supuestos provisionales y las advertencias', () => {
    const resultado = calcularLiquidacion(crearEntrada(), contextoBase)
    const codigos = resultado.advertencias.map((advertencia) => advertencia.codigo)

    expect(resultado.supuestosProvisionales).toHaveLength(5)
    expect(codigos).toContain('afectacion-provisional')
    expect(codigos).toContain('gratificacion-estimada')
    expect(codigos).toContain('renta-estimada')
    expect(codigos).toContain('vacaciones-vencidas')
  })

  it('cambia el descuento cuando el régimen es ONP', () => {
    const resultado = calcularLiquidacion(crearEntrada({ sistemaPensionario: 'onp' }), contextoBase)

    expect(resultado.pension.onp).toBe(1281.12)
    expect(resultado.pension.afp).toBeUndefined()
    expect(resultado.totalDescuentos).toBe(1919.29)
    expect(resultado.neto).toBe(26649.8)
  })

  it('advierte variables no regulares y vacaciones adelantadas', () => {
    const resultado = calcularLiquidacion(
      crearEntrada({
        variablesMensuales: [0, 0, 0, 0, 300, 400],
        diasVacacionesGozadas: 70,
      }),
      contextoBase,
    )
    const codigos = resultado.advertencias.map((advertencia) => advertencia.codigo)

    expect(codigos).toContain('variables-no-regulares')
    expect(codigos).toContain('vacaciones-adelantadas')
    expect(buscarConcepto(resultado, 'vacaciones_truncas')?.monto).toBe(2567.8)
  })
})
