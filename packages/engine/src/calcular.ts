import type {
  Afectacion,
  Advertencia,
  Concepto,
  ConceptoResultado,
  ContextoCalculo,
  EntradaLiquidacion,
  ParametrosLegales,
  PeriodoVacacional,
  ResultadoLiquidacion,
  ResultadoRenta5ta,
  SeveridadAdvertencia,
} from '@calculolibreperu/shared'
import {
  calcularBonificacionExtraordinaria,
  calcularCts,
  calcularGratificacion,
  calcularIndemnizacion,
  calcularRemuneracionMesCese,
  calcularVacaciones,
} from './conceptos'
import { calcularPension, calcularRenta5ta } from './descuentos'
import { Decimal, d, redondear, sumar } from './dinero'
import { calcularRemuneracionComputable, type RemuneracionComputable } from './remuneracion'
import { computarTiempo, descomponerTiempo } from './tiempo'
import { ENGINE_VERSION } from './version'

const ETIQUETAS: Record<Concepto, string> = {
  cts_trunca: 'CTS trunca',
  gratificacion_trunca: 'Gratificación trunca',
  bonificacion_extraordinaria: 'Bonificación extraordinaria',
  vacaciones_truncas: 'Vacaciones truncas',
  vacaciones_no_gozadas: 'Vacaciones no gozadas',
  vacaciones_vencidas: 'Vacaciones vencidas',
  indemnizacion_vacacional: 'Indemnización vacacional',
  indemnizacion_despido: 'Indemnización por despido',
  remuneracion_mes_cese: 'Remuneración del mes de cese',
}

type DatosConcepto = {
  concepto: Concepto
  base: Decimal
  monto: Decimal
  formula: string
  sustento: string
  detalle?: string
}

type DatosAdvertencias = {
  entrada: EntradaLiquidacion
  parametros: ParametrosLegales
  remuneracion: RemuneracionComputable
  vacaciones: ReturnType<typeof calcularVacaciones>
  indemnizacion: ReturnType<typeof calcularIndemnizacion>
  renta5ta: ResultadoRenta5ta
  conceptos: ConceptoResultado[]
  netoSinClamp: number
}

function buscarAfectacion(parametros: ParametrosLegales, concepto: Concepto): Afectacion {
  return (
    parametros.afectaciones.find((afectacion) => afectacion.concepto === concepto) ?? {
      concepto,
      afectoPension: false,
      gravadoRenta5ta: false,
      estado: 'provisional',
      nota: 'Sin afectación configurada; revisar antes de usar el resultado.',
      revisadoEl: parametros.revisadoEl,
    }
  )
}

function crearConcepto(datos: DatosConcepto, parametros: ParametrosLegales): ConceptoResultado {
  const afectacion = buscarAfectacion(parametros, datos.concepto)

  return {
    concepto: datos.concepto,
    etiqueta: ETIQUETAS[datos.concepto],
    base: redondear(datos.base),
    formula: datos.formula,
    monto: redondear(datos.monto),
    sustento: datos.sustento,
    afectoPension: afectacion.afectoPension,
    gravadoRenta5ta: afectacion.gravadoRenta5ta,
    estado: afectacion.estado,
    nota: afectacion.nota,
    detalle: datos.detalle,
  }
}

function construirAdvertencias(datos: DatosAdvertencias): Advertencia[] {
  const advertencias: Advertencia[] = []

  const agregar = (
    codigo: string,
    titulo: string,
    mensaje: string,
    severidad: SeveridadAdvertencia = 'info',
  ) => {
    advertencias.push({ codigo, titulo, mensaje, severidad })
  }

  if (datos.conceptos.some((concepto) => concepto.estado === 'provisional')) {
    agregar(
      'afectacion-provisional',
      'Afectación provisional',
      'Algunos conceptos tienen afectación provisional. El descuento de pensión y renta puede variar cuando se confirme el criterio legal.',
      'warning',
    )
  }

  if (datos.remuneracion.gratificacionEstimada) {
    agregar(
      'gratificacion-estimada',
      'Gratificación estimada',
      'No indicaste la última gratificación percibida; se usó la remuneración computable como estimación.',
    )
  }

  if (datos.renta5ta.estimado) {
    agregar(
      'renta-estimada',
      'Renta 5ta referencial',
      'La retención de renta 5ta se estimó con los datos anuales disponibles. Confirma los montos con tu empleador o SUNAT.',
    )
  }

  if (datos.vacaciones.diasAdelantados > 0) {
    agregar(
      'vacaciones-adelantadas',
      'Vacaciones adelantadas',
      `Registraste ${datos.vacaciones.diasAdelantados} días de vacaciones gozadas por encima de los generados. No se descuentan del cálculo.`,
      'warning',
    )
  }

  if (datos.vacaciones.diasVencidos > 0) {
    agregar(
      'vacaciones-vencidas',
      'Vacaciones vencidas',
      'Hay períodos vacacionales vencidos. Se incluye el valor de los días y la indemnización equivalente.',
      'warning',
    )
  }

  if (
    !datos.remuneracion.variablesRegulares &&
    datos.entrada.variablesMensuales.some((valor) => valor > 0)
  ) {
    agregar(
      'variables-no-regulares',
      'Variables no regulares',
      'Las variables no alcanzaron 3 de los últimos 6 meses; no se incluyeron en la remuneración computable.',
    )
  }

  if (datos.entrada.tipoComisionAfp === 'mixta') {
    agregar(
      'afp-comision-mixta',
      'Comisión mixta',
      'La comisión mixta no se descuenta en la liquidación; se descuenta del fondo de pensiones.',
    )
  }

  if (datos.entrada.sistemaPensionario === 'onp') {
    agregar(
      'onp',
      'Descuento ONP',
      'Se aplica el descuento ONP sobre los conceptos afectos a pensión.',
    )
  }

  if (datos.indemnizacion.dentroPrueba) {
    agregar(
      'periodo-prueba',
      'Período de prueba',
      'El cese ocurrió dentro del período de prueba; no corresponde indemnización por despido.',
    )
  }

  if (
    datos.entrada.motivoCese === 'despido_causa_justa' ||
    datos.entrada.motivoCese === 'renuncia' ||
    datos.entrada.motivoCese === 'mutuo_disenso'
  ) {
    agregar(
      'sin-indemnizacion',
      'Sin indemnización por despido',
      'El motivo de cese no genera indemnización por despido.',
    )
  }

  if (
    datos.entrada.tipoContrato === 'modal' &&
    datos.entrada.motivoCese === 'vencimiento_contrato'
  ) {
    agregar(
      'contrato-vencido',
      'Contrato modal vencido',
      'El contrato modal venció; no corresponde indemnización por despido.',
    )
  }

  if (datos.netoSinClamp < 0) {
    agregar(
      'neto-negativo',
      'Descuentos mayores al bruto',
      'Los descuentos superan el total bruto. Revisa los datos antes de usar el resultado.',
      'danger',
    )
  }

  return advertencias
}

export function calcularLiquidacion(
  entrada: EntradaLiquidacion,
  contexto: ContextoCalculo,
): ResultadoLiquidacion {
  const parametros = contexto.parametros
  const remuneracion = calcularRemuneracionComputable(entrada, parametros)

  const cts = calcularCts(entrada, remuneracion)
  const gratificacion = calcularGratificacion(entrada, remuneracion)
  const bonificacion = calcularBonificacionExtraordinaria(gratificacion.monto, entrada.afiliadoEps)
  const vacaciones = calcularVacaciones(entrada, remuneracion)
  const indemnizacion = calcularIndemnizacion(entrada, remuneracion)
  const remuneracionMes = calcularRemuneracionMesCese(entrada, remuneracion)

  const conceptos: ConceptoResultado[] = []

  const agregar = (datos: DatosConcepto, incluirCero = false) => {
    if (!incluirCero && datos.monto.lte(0)) return
    conceptos.push(crearConcepto(datos, parametros))
  }

  agregar({
    concepto: 'cts_trunca',
    base: remuneracion.rcCts,
    monto: cts.monto,
    formula: 'RC CTS × (meses / 12 + días / 360)',
    sustento: 'D. Leg. 650, arts. 2 y 3',
    detalle: `${cts.desde} a ${entrada.fechaCese}: ${cts.tiempo.meses} meses y ${cts.tiempo.dias} días`,
  })

  agregar({
    concepto: 'gratificacion_trunca',
    base: remuneracion.rcGrati,
    monto: gratificacion.monto,
    formula: 'RC gratificación × meses completos / 6',
    sustento: 'Ley 27735, arts. 2 y 3; D.S. 005-2002-TR',
    detalle: `${gratificacion.desde} a ${entrada.fechaCese}: ${gratificacion.mesesCompletos} meses completos`,
  })

  agregar({
    concepto: 'bonificacion_extraordinaria',
    base: gratificacion.monto,
    monto: bonificacion.monto,
    formula: `Gratificación trunca × ${(bonificacion.tasa * 100).toFixed(2)}%`,
    sustento: 'Ley 29351; Ley 29714',
    detalle: entrada.afiliadoEps ? 'Tasa 6.75% por afiliación a EPS' : 'Tasa 9% sin EPS',
  })

  agregar({
    concepto: 'vacaciones_truncas',
    base: remuneracion.rcVac,
    monto: vacaciones.montoTruncas,
    formula: 'RC vacacional × días de servicio / 360',
    sustento: 'D. Leg. 713, arts. 10 y 15',
    detalle: `${vacaciones.diasTruncos} días de servicio desde ${vacaciones.ultimoAniversario}`,
  })

  agregar({
    concepto: 'vacaciones_no_gozadas',
    base: remuneracion.rcVac,
    monto: vacaciones.montoNoGozadas,
    formula: 'RC vacacional × días pendientes / 30',
    sustento: 'D. Leg. 713, art. 15',
    detalle: `${vacaciones.diasNoGozados} días pendientes de períodos no vencidos`,
  })

  agregar({
    concepto: 'vacaciones_vencidas',
    base: remuneracion.rcVac,
    monto: vacaciones.montoVencidas,
    formula: 'RC vacacional × días vencidos / 30',
    sustento: 'D. Leg. 713, art. 15',
    detalle: `${vacaciones.diasVencidos} días vencidos`,
  })

  agregar({
    concepto: 'indemnizacion_vacacional',
    base: remuneracion.rcVac,
    monto: vacaciones.montoIndemnizacion,
    formula: 'RC vacacional × días vencidos / 30',
    sustento: 'D. Leg. 713, art. 15',
    detalle: 'Indemnización equivalente a los días vencidos',
  })

  agregar(
    {
      concepto: 'indemnizacion_despido',
      base: remuneracion.rcGrati,
      monto: indemnizacion.monto,
      formula:
        entrada.tipoContrato === 'indeterminado'
          ? '1.5 × remuneración × tiempo de servicio (tope 12 remuneraciones)'
          : '1.5 × remuneración × meses restantes (tope 12 remuneraciones)',
      sustento: 'D. Leg. 728, art. 38',
      detalle: indemnizacion.detalle,
    },
    indemnizacion.aplica,
  )

  agregar({
    concepto: 'remuneracion_mes_cese',
    base: remuneracionMes.base,
    monto: remuneracionMes.monto,
    formula: '(sueldo + asignación familiar) × días laborados / 30 + variables devengadas',
    sustento: 'Régimen laboral común; remuneración devengada',
    detalle: `${remuneracionMes.diasLaborados} días laborados`,
  })

  const totalBruto = redondear(sumar(conceptos.map((concepto) => d(concepto.monto))))
  const basePension = sumar(
    conceptos.filter((concepto) => concepto.afectoPension).map((concepto) => d(concepto.monto)),
  )
  const conceptosGravados = sumar(
    conceptos.filter((concepto) => concepto.gravadoRenta5ta).map((concepto) => d(concepto.monto)),
  )

  const pension = calcularPension(basePension, entrada, parametros)
  const renta5ta = calcularRenta5ta(entrada, parametros, conceptosGravados, remuneracion)
  const totalDescuentos = redondear(d(pension.total).plus(renta5ta.atribuibleLiquidacion))
  const netoSinClamp = redondear(d(totalBruto).minus(totalDescuentos))
  const neto = Math.max(0, netoSinClamp)

  const advertencias = construirAdvertencias({
    entrada,
    parametros,
    remuneracion,
    vacaciones,
    indemnizacion,
    renta5ta,
    conceptos,
    netoSinClamp,
  })

  const periodosVacacionales: PeriodoVacacional[] = vacaciones.periodos.map((periodo) => ({
    ...periodo,
  }))

  const tiempo = computarTiempo(entrada.fechaIngreso, entrada.fechaCese)
  const tiempoDescompuesto = descomponerTiempo(tiempo)

  return {
    conceptos,
    totalBruto,
    pension,
    renta5ta,
    totalDescuentos,
    neto,
    periodosVacacionales,
    advertencias,
    supuestosProvisionales: conceptos.filter((concepto) => concepto.estado === 'provisional'),
    parametros: {
      rmv: parametros.rmv,
      uit: parametros.uit,
      rma: parametros.rma,
      revisadoEl: parametros.revisadoEl,
    },
    tiempoServicio: {
      meses: tiempo.meses,
      dias: tiempo.dias,
      anios: tiempoDescompuesto.anios,
      mesesRestantes: tiempoDescompuesto.meses,
    },
    versionMotor: ENGINE_VERSION,
  }
}
