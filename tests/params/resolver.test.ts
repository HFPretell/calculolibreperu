import { describe, expect, it } from 'vitest'
import { obtenerAfp, resolverParametro, resolverRma } from '@calculolibreperu/params'

describe('resolverParametro', () => {
  it('resuelve la RMV vigente desde octubre de 2026', () => {
    expect(resolverParametro('rmv', '2026-10-01').valor).toBe(1230)
    expect(resolverParametro('rmv', '2026-11-10').valor).toBe(1230)
  })

  it('bloquea cuando no hay RMV vigente', () => {
    expect(() => resolverParametro('rmv', '2026-09-30')).toThrow('No hay parámetro vigente')
  })

  it('resuelve la UIT 2026', () => {
    expect(resolverParametro('uit', '2026-12-31').valor).toBe(5500)
  })
})

describe('resolverRma', () => {
  it('resuelve la RMA del trimestre', () => {
    expect(resolverRma('2026-02-15').valor).toBe(12209.11)
    expect(resolverRma('2026-11-10').valor).toBe(12732.7)
  })

  it('bloquea fuera de los trimestres cargados', () => {
    expect(() => resolverRma('2027-01-01')).toThrow('No hay RMA vigente')
  })
})

describe('obtenerAfp', () => {
  it('expone el aporte, la prima y las comisiones', () => {
    const afp = obtenerAfp()
    expect(afp.aporteObligatorio).toBe(0.1)
    expect(afp.primaSeguro).toBe(0.0137)
    expect(afp.comisiones).toHaveLength(4)
  })
})
