import { describe, expect, it } from 'vitest'
import { calcularLiquidacion } from '@calculolibreperu/engine'
import { contextoBase, crearEntrada } from '../engine/fixtures'

const resultado = calcularLiquidacion(crearEntrada(), contextoBase)

describe('caso dorado: liquidación base', () => {
  it('coincide con los totales esperados', () => {
    expect(resultado.totalBruto).toBe(28569.09)
    expect(resultado.pension.total).toBe(1265.36)
    expect(resultado.renta5ta.atribuibleLiquidacion).toBe(638.17)
    expect(resultado.totalDescuentos).toBe(1903.53)
    expect(resultado.neto).toBe(26665.56)
    expect(resultado.versionMotor).toBe('0.2.0')
  })

  it('coincide con el monto de cada concepto', () => {
    const esperados: Record<string, number> = {
      cts_trunca: 101.21,
      gratificacion_trunca: 2082,
      bonificacion_extraordinaria: 187.38,
      vacaciones_truncas: 2567.8,
      vacaciones_no_gozadas: 3123,
      vacaciones_vencidas: 3123,
      indemnizacion_vacacional: 3123,
      indemnizacion_despido: 13220.7,
      remuneracion_mes_cese: 1041,
    }

    expect(resultado.conceptos).toHaveLength(9)

    for (const [concepto, monto] of Object.entries(esperados)) {
      const encontrado = resultado.conceptos.find((item) => item.concepto === concepto)
      expect(encontrado?.monto).toBe(monto)
    }
  })
})
