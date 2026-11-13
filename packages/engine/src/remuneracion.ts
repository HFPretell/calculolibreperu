import type { EntradaLiquidacion, ParametrosLegales } from '@calculolibreperu/shared'
import { Decimal, cero, d, sumar } from './dinero'

export type RemuneracionComputable = {
  asignacionFamiliar: Decimal
  promedioVariables: Decimal
  variablesRegulares: boolean
  mesesVariables: number
  rcGrati: Decimal
  rcCts: Decimal
  rcVac: Decimal
  ultimaGratificacion: Decimal
  gratificacionEstimada: boolean
}

export function calcularPromedioVariables(variables: number[]): {
  promedio: Decimal
  regular: boolean
  mesesPercibidos: number
} {
  const valores = variables.map((valor) => d(Math.max(0, valor)))
  const relleno = Math.max(0, 6 - valores.length)
  const ultimosSeis = [...new Array(relleno).fill(cero()), ...valores].slice(-6)
  const mesesPercibidos = ultimosSeis.filter((valor) => valor.gt(0)).length
  const regular = mesesPercibidos >= 3
  const promedio = regular ? sumar(ultimosSeis).div(6) : cero()

  return { promedio, regular, mesesPercibidos }
}

export function calcularRemuneracionComputable(
  entrada: EntradaLiquidacion,
  parametros: ParametrosLegales,
): RemuneracionComputable {
  const asignacionFamiliar = entrada.asignacionFamiliar ? d(parametros.asignacionFamiliar) : cero()
  const { promedio, regular, mesesPercibidos } = calcularPromedioVariables(
    entrada.variablesMensuales,
  )

  const rcGrati = d(entrada.sueldoBasico).plus(asignacionFamiliar).plus(promedio)
  const gratificacionEstimada = entrada.ultimaGratificacion === undefined
  const ultimaGratificacion = gratificacionEstimada ? rcGrati : d(entrada.ultimaGratificacion ?? 0)
  const rcCts = rcGrati.plus(ultimaGratificacion.div(6))
  const rcVac = rcGrati

  return {
    asignacionFamiliar,
    promedioVariables: promedio,
    variablesRegulares: regular,
    mesesVariables: mesesPercibidos,
    rcGrati,
    rcCts,
    rcVac,
    ultimaGratificacion,
    gratificacionEstimada,
  }
}
