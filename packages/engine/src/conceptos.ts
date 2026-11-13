import type { EntradaLiquidacion } from '@calculolibreperu/shared'
import { Decimal, cero, d } from './dinero'
import type { RemuneracionComputable } from './remuneracion'
import {
  calcularPeriodosVacacionales,
  computarTiempo,
  diasTotales,
  formatearFecha,
  inicioMes,
  inicioSemestreCts,
  inicioSemestreGratificacion,
  mesesCalendarioCompletos,
  parseFecha,
  sumarDias,
  sumarMeses,
  type PeriodoVacacionalCalculado,
  type Tiempo,
} from './tiempo'

function fechaMayor(a: string, b: string): string {
  return a >= b ? a : b
}

export type ResultadoCts = {
  monto: Decimal
  desde: string
  tiempo: Tiempo
}

export function calcularCts(
  entrada: EntradaLiquidacion,
  remuneracion: RemuneracionComputable,
): ResultadoCts {
  const desde = fechaMayor(inicioSemestreCts(entrada.fechaCese), entrada.fechaIngreso)

  if (desde > entrada.fechaCese) {
    return { monto: cero(), desde, tiempo: { meses: 0, dias: 0 } }
  }

  const tiempo = computarTiempo(desde, entrada.fechaCese)
  const monto = remuneracion.rcCts.mul(d(tiempo.meses).div(12).plus(d(tiempo.dias).div(360)))

  return { monto, desde, tiempo }
}

export type ResultadoGratificacion = {
  monto: Decimal
  desde: string
  mesesCompletos: number
}

export function calcularGratificacion(
  entrada: EntradaLiquidacion,
  remuneracion: RemuneracionComputable,
): ResultadoGratificacion {
  const desde = fechaMayor(inicioSemestreGratificacion(entrada.fechaCese), entrada.fechaIngreso)

  if (desde > entrada.fechaCese) {
    return { monto: cero(), desde, mesesCompletos: 0 }
  }

  const mesesCompletos = mesesCalendarioCompletos(desde, entrada.fechaCese)
  const monto = remuneracion.rcGrati.mul(d(mesesCompletos).div(6))

  return { monto, desde, mesesCompletos }
}

export function calcularBonificacionExtraordinaria(
  gratificacion: Decimal,
  afiliadoEps: boolean,
): { monto: Decimal; tasa: number } {
  const tasa = afiliadoEps ? 0.0675 : 0.09
  return { monto: gratificacion.mul(tasa), tasa }
}

export type ResultadoVacaciones = {
  periodos: PeriodoVacacionalCalculado[]
  diasAdelantados: number
  ultimoAniversario: string
  diasTruncos: number
  diasNoGozados: number
  diasVencidos: number
  montoTruncas: Decimal
  montoNoGozadas: Decimal
  montoVencidas: Decimal
  montoIndemnizacion: Decimal
}

export function calcularVacaciones(
  entrada: EntradaLiquidacion,
  remuneracion: RemuneracionComputable,
): ResultadoVacaciones {
  const { periodos, diasAdelantados, ultimoAniversario, diasTruncos } =
    calcularPeriodosVacacionales(
      entrada.fechaIngreso,
      entrada.fechaCese,
      entrada.diasVacacionesGozadas,
    )

  const diasNoGozados = periodos
    .filter((periodo) => periodo.estado === 'no_gozado')
    .reduce((total, periodo) => total + periodo.diasPendientes, 0)

  const diasVencidos = periodos
    .filter((periodo) => periodo.estado === 'vencido')
    .reduce((total, periodo) => total + periodo.diasPendientes, 0)

  const montoTruncas = diasTruncos >= 30 ? remuneracion.rcVac.mul(d(diasTruncos).div(360)) : cero()
  const montoNoGozadas = remuneracion.rcVac.mul(d(diasNoGozados).div(30))
  const montoVencidas = remuneracion.rcVac.mul(d(diasVencidos).div(30))
  const montoIndemnizacion = remuneracion.rcVac.mul(d(diasVencidos).div(30))

  return {
    periodos,
    diasAdelantados,
    ultimoAniversario,
    diasTruncos,
    diasNoGozados,
    diasVencidos,
    montoTruncas,
    montoNoGozadas,
    montoVencidas,
    montoIndemnizacion,
  }
}

export type ResultadoIndemnizacion = {
  monto: Decimal
  aplica: boolean
  dentroPrueba: boolean
  detalle: string
  tiempo?: Tiempo
  mesesRestantes?: Decimal
}

export function calcularIndemnizacion(
  entrada: EntradaLiquidacion,
  remuneracion: RemuneracionComputable,
): ResultadoIndemnizacion {
  const cese = parseFecha(entrada.fechaCese)
  const finPrueba = sumarMeses(parseFecha(entrada.fechaIngreso), entrada.duracionPeriodoPrueba)
  const dentroPrueba = cese.getTime() < finPrueba.getTime()
  const motivoAplica =
    entrada.motivoCese === 'despido_arbitrario' || entrada.motivoCese === 'despido_indirecto'

  if (!motivoAplica) {
    return {
      monto: cero(),
      aplica: false,
      dentroPrueba,
      detalle: 'No procede por el motivo de cese.',
    }
  }

  if (dentroPrueba) {
    return {
      monto: cero(),
      aplica: false,
      dentroPrueba,
      detalle: 'No procede dentro del período de prueba.',
    }
  }

  if (entrada.tipoContrato === 'indeterminado') {
    const tiempo = computarTiempo(entrada.fechaIngreso, entrada.fechaCese)
    const anios = Math.floor(tiempo.meses / 12)
    const meses = tiempo.meses % 12
    const tiempoAnios = d(anios).plus(d(meses).div(12)).plus(d(tiempo.dias).div(360))
    const monto = d(1.5).mul(remuneracion.rcGrati).mul(tiempoAnios)
    const tope = remuneracion.rcGrati.mul(12)

    return {
      monto: Decimal.min(monto, tope),
      aplica: true,
      dentroPrueba,
      detalle: `${anios} años, ${meses} meses y ${tiempo.dias} días de servicio`,
      tiempo,
    }
  }

  if (!entrada.fechaVencimientoContrato) {
    return {
      monto: cero(),
      aplica: false,
      dentroPrueba,
      detalle: 'Falta la fecha de vencimiento del contrato modal.',
    }
  }

  if (entrada.fechaVencimientoContrato <= entrada.fechaCese) {
    return {
      monto: cero(),
      aplica: true,
      dentroPrueba,
      detalle: 'El contrato vence el mismo día del cese.',
      mesesRestantes: cero(),
    }
  }

  const inicioRestante = formatearFecha(sumarDias(parseFecha(entrada.fechaCese), 1))
  const tiempo = computarTiempo(inicioRestante, entrada.fechaVencimientoContrato)
  const mesesRestantes = d(tiempo.meses).plus(d(tiempo.dias).div(30))
  const monto = d(1.5).mul(remuneracion.rcGrati).mul(mesesRestantes)
  const tope = remuneracion.rcGrati.mul(12)

  return {
    monto: Decimal.min(monto, tope),
    aplica: true,
    dentroPrueba,
    detalle: `${tiempo.meses} meses y ${tiempo.dias} días restantes`,
    tiempo,
    mesesRestantes,
  }
}

export type ResultadoRemuneracionMesCese = {
  monto: Decimal
  base: Decimal
  diasLaborados: number
  variables: Decimal
}

export function calcularRemuneracionMesCese(
  entrada: EntradaLiquidacion,
  remuneracion: RemuneracionComputable,
): ResultadoRemuneracionMesCese {
  const cese = parseFecha(entrada.fechaCese)
  const tiempo = computarTiempo(formatearFecha(inicioMes(cese)), entrada.fechaCese)
  const diasLaborados = Math.min(30, diasTotales(tiempo))
  const base = d(entrada.sueldoBasico).plus(remuneracion.asignacionFamiliar)
  const variables = d(entrada.variablesDevengadasMesCese)
  const monto = base.mul(d(diasLaborados).div(30)).plus(variables)

  return { monto, base, diasLaborados, variables }
}
