import { describe, expect, it } from 'vitest'
import { Decimal, d, redondear, sumar } from '@calculolibreperu/engine'

describe('dinero', () => {
  it('redondea half-up a dos decimales', () => {
    expect(redondear(d('10.005'))).toBe(10.01)
    expect(redondear(d('10.004'))).toBe(10)
    expect(redondear(d('2.675'))).toBe(2.68)
  })

  it('suma Decimal sin perder precisión', () => {
    expect(sumar([d('0.1'), d('0.2')]).toNumber()).toBe(0.3)
  })

  it('mantiene el tipo Decimal', () => {
    expect(d('5')).toBeInstanceOf(Decimal)
  })
})
