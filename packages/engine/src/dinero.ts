import Decimal from 'decimal.js'

export { Decimal }

export type ValorDecimal = Decimal | number | string

export function d(valor: ValorDecimal): Decimal {
  return valor instanceof Decimal ? valor : new Decimal(valor)
}

export function cero(): Decimal {
  return new Decimal(0)
}

export function sumar(valores: Decimal[]): Decimal {
  return valores.reduce((acumulado, valor) => acumulado.plus(valor), cero())
}

export function redondear(valor: Decimal, decimales = 2): number {
  return valor.toDecimalPlaces(decimales, Decimal.ROUND_HALF_UP).toNumber()
}

export function redondearDecimal(valor: Decimal, decimales = 2): Decimal {
  return valor.toDecimalPlaces(decimales, Decimal.ROUND_HALF_UP)
}

export function maximo(valores: Decimal[]): Decimal {
  if (valores.length === 0) return cero()
  return Decimal.max(...valores)
}

export function minimo(valores: Decimal[]): Decimal {
  if (valores.length === 0) return cero()
  return Decimal.min(...valores)
}
