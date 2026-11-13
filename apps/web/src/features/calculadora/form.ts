import type { UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'
import type {
  AfpNombre,
  EntradaLiquidacion,
  MotivoCese,
  ResultadoLiquidacion,
  SistemaPensionario,
  TipoComisionAfp,
  TipoContrato,
} from '@calculolibreperu/shared'
import { entradaLiquidacionSchema } from '@calculolibreperu/shared'
import { formatearMoneda } from '../../lib/format'

export type EntradaFormulario = z.input<typeof entradaLiquidacionSchema>
export type FormularioLiquidacion = UseFormReturn<EntradaFormulario, unknown, EntradaLiquidacion>

export const pasos = [
  { numero: 1, titulo: 'Datos del cese', resumen: 'Fechas y contrato' },
  { numero: 2, titulo: 'Remuneración', resumen: 'Sueldo y variables' },
  { numero: 3, titulo: 'Vacaciones y descuentos', resumen: 'AFP, ONP y renta' },
  { numero: 4, titulo: 'Resultados', resumen: 'Tu estimación' },
] as const

export const camposPaso: Record<number, Array<keyof EntradaLiquidacion>> = {
  1: [
    'fechaIngreso',
    'fechaCese',
    'tipoContrato',
    'fechaVencimientoContrato',
    'duracionPeriodoPrueba',
    'motivoCese',
  ],
  2: [
    'sueldoBasico',
    'asignacionFamiliar',
    'variablesMensuales',
    'variablesDevengadasMesCese',
    'ultimaGratificacion',
  ],
  3: [
    'diasVacacionesGozadas',
    'sistemaPensionario',
    'afp',
    'tipoComisionAfp',
    'afiliadoEps',
    'mesesTrabajadosAnio',
    'remuneracionesPercibidasAnio',
    'gratificacionesPercibidasAnio',
    'ingresosEmpleadoresAnteriores',
    'retencionesEmpleadoresAnteriores',
    'retencionesEmpleadorActual',
  ],
}

export const valoresIniciales: EntradaLiquidacion = {
  fechaIngreso: '',
  fechaCese: '',
  tipoContrato: 'indeterminado',
  duracionPeriodoPrueba: 3,
  motivoCese: 'renuncia',
  sueldoBasico: 0,
  asignacionFamiliar: false,
  variablesMensuales: [0, 0, 0, 0, 0, 0],
  variablesDevengadasMesCese: 0,
  sistemaPensionario: 'afp',
  afp: 'Habitat',
  tipoComisionAfp: 'flujo',
  afiliadoEps: false,
  diasVacacionesGozadas: 0,
  mesesTrabajadosAnio: 0,
  ingresosEmpleadoresAnteriores: 0,
  retencionesEmpleadoresAnteriores: 0,
  retencionesEmpleadorActual: 0,
}

export const tiposContrato: Array<{ value: TipoContrato; label: string }> = [
  { value: 'indeterminado', label: 'Plazo indeterminado' },
  { value: 'modal', label: 'Sujeto a modalidad' },
]

export const motivosCese: Array<{ value: MotivoCese; label: string }> = [
  { value: 'renuncia', label: 'Renuncia' },
  { value: 'mutuo_disenso', label: 'Mutuo disenso' },
  { value: 'despido_arbitrario', label: 'Despido arbitrario' },
  { value: 'despido_indirecto', label: 'Despido indirecto (hostilidad)' },
  { value: 'despido_causa_justa', label: 'Despido por causa justa' },
  { value: 'vencimiento_contrato', label: 'Vencimiento de contrato' },
  { value: 'otro', label: 'Otro' },
]

export const sistemasPensionarios: Array<{ value: SistemaPensionario; label: string }> = [
  { value: 'afp', label: 'AFP' },
  { value: 'onp', label: 'ONP' },
]

export const afps: Array<{ value: AfpNombre; label: string }> = [
  { value: 'Habitat', label: 'Habitat' },
  { value: 'Integra', label: 'Integra' },
  { value: 'Prima', label: 'Prima' },
  { value: 'Profuturo', label: 'Profuturo' },
]

export const tiposComision: Array<{ value: TipoComisionAfp; label: string }> = [
  { value: 'flujo', label: 'Por flujo' },
  { value: 'mixta', label: 'Mixta' },
]

const formatoFechaCorta = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

const formatoFechaHora = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'long',
  timeStyle: 'short',
})

export function hoyISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatearFechaCorta(fecha: string): string {
  if (!fecha) return 'Sin fecha'
  const valor = new Date(`${fecha}T00:00:00Z`)
  if (Number.isNaN(valor.getTime())) return fecha
  return formatoFechaCorta.format(valor)
}

export function formatearFechaHora(fecha = new Date()): string {
  return formatoFechaHora.format(fecha)
}

export function sugerirMesesTrabajadosAnio(fechaIngreso: string, fechaCese: string): number {
  if (!fechaIngreso || !fechaCese) return 0

  const ingreso = new Date(`${fechaIngreso}T00:00:00Z`)
  const cese = new Date(`${fechaCese}T00:00:00Z`)

  if (Number.isNaN(ingreso.getTime()) || Number.isNaN(cese.getTime())) return 0
  if (ingreso.getTime() > cese.getTime()) return 0

  const anio = cese.getUTCFullYear()
  let meses = 0

  for (let mes = 0; mes < cese.getUTCMonth(); mes += 1) {
    const inicioMes = new Date(Date.UTC(anio, mes, 1))

    if (ingreso.getTime() <= inicioMes.getTime()) {
      meses += 1
    }
  }

  return meses
}

export function anosDesde(fecha: string, hoy = hoyISO()): number {
  if (!fecha) return 0

  const desde = new Date(`${fecha}T00:00:00Z`)
  const hasta = new Date(`${hoy}T00:00:00Z`)

  if (Number.isNaN(desde.getTime()) || Number.isNaN(hasta.getTime())) return 0

  let anios = hasta.getUTCFullYear() - desde.getUTCFullYear()
  const antesDelAniversario =
    hasta.getUTCMonth() < desde.getUTCMonth() ||
    (hasta.getUTCMonth() === desde.getUTCMonth() && hasta.getUTCDate() < desde.getUTCDate())

  if (antesDelAniversario) anios -= 1

  return Math.max(0, anios)
}

export function construirResumen(
  entrada: EntradaLiquidacion,
  resultado: ResultadoLiquidacion,
): string {
  const conceptos = resultado.conceptos
    .map((concepto) => `- ${concepto.etiqueta}: ${formatearMoneda(concepto.monto)}`)
    .join('\n')

  return [
    'Calculadora de Liquidación Laboral Perú',
    'Estimación referencial',
    '',
    `Ingreso: ${formatearFechaCorta(entrada.fechaIngreso)}`,
    `Cese: ${formatearFechaCorta(entrada.fechaCese)}`,
    '',
    `Total bruto: ${formatearMoneda(resultado.totalBruto)}`,
    `Descuentos: ${formatearMoneda(resultado.totalDescuentos)}`,
    `Neto estimado: ${formatearMoneda(resultado.neto)}`,
    '',
    'Conceptos:',
    conceptos,
    '',
    'Resultado referencial. No incluye intereses legales laborales.',
    'Verifica el caso con un especialista o con SUNAFIL.',
  ].join('\n')
}
