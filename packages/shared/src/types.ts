export type Moneda = 'PEN'

export type TipoContrato = 'indeterminado' | 'modal'

export type MotivoCese =
  | 'renuncia'
  | 'mutuo_disenso'
  | 'despido_arbitrario'
  | 'despido_indirecto'
  | 'despido_causa_justa'
  | 'vencimiento_contrato'
  | 'otro'

export type SistemaPensionario = 'afp' | 'onp'

export type AfpNombre = 'Habitat' | 'Integra' | 'Prima' | 'Profuturo'

export type TipoComisionAfp = 'flujo' | 'mixta'

export type Concepto =
  | 'cts_trunca'
  | 'gratificacion_trunca'
  | 'bonificacion_extraordinaria'
  | 'vacaciones_truncas'
  | 'vacaciones_no_gozadas'
  | 'vacaciones_vencidas'
  | 'indemnizacion_vacacional'
  | 'indemnizacion_despido'
  | 'remuneracion_mes_cese'

export type EstadoAfectacion = 'confirmado' | 'provisional'

export type Afectacion = {
  concepto: Concepto
  afectoPension: boolean
  gravadoRenta5ta: boolean
  estado: EstadoAfectacion
  nota: string
  revisadoEl: string
}

export type EntradaLiquidacion = {
  fechaIngreso: string
  fechaCese: string
  tipoContrato: TipoContrato
  fechaVencimientoContrato?: string
  duracionPeriodoPrueba: number
  motivoCese: MotivoCese
  sueldoBasico: number
  asignacionFamiliar: boolean
  variablesMensuales: number[]
  variablesDevengadasMesCese: number
  ultimaGratificacion?: number
  sistemaPensionario: SistemaPensionario
  afp?: AfpNombre
  tipoComisionAfp?: TipoComisionAfp
  afiliadoEps: boolean
  diasVacacionesGozadas: number
  mesesTrabajadosAnio: number
  remuneracionesPercibidasAnio?: number
  gratificacionesPercibidasAnio?: number
  ingresosEmpleadoresAnteriores: number
  retencionesEmpleadoresAnteriores: number
  retencionesEmpleadorActual: number
}

export type ComisionAfp = {
  afp: AfpNombre
  flujo: number
  mixta: boolean
}

export type RentaTramo = {
  hastaUit: number | null
  tasa: number
}

export type RentaParametros = {
  deduccionUit: number
  tramos: RentaTramo[]
  revisadoEl: string
}

export type ParametrosLegales = {
  rmv: number
  uit: number
  asignacionFamiliar: number
  rma: number
  afp: {
    aporteObligatorio: number
    primaSeguro: number
    comisiones: ComisionAfp[]
  }
  onp: number
  renta: RentaParametros
  afectaciones: Afectacion[]
  revisadoEl: string
}

export type ContextoCalculo = {
  parametros: ParametrosLegales
  fechaActual: string
}

export type ConceptoResultado = {
  concepto: Concepto
  etiqueta: string
  base: number
  formula: string
  monto: number
  sustento: string
  afectoPension: boolean
  gravadoRenta5ta: boolean
  estado: EstadoAfectacion
  nota: string
  detalle?: string
}

export type SeveridadAdvertencia = 'info' | 'warning' | 'danger'

export type Advertencia = {
  codigo: string
  titulo: string
  mensaje: string
  severidad: SeveridadAdvertencia
}

export type EstadoPeriodoVacacional = 'no_gozado' | 'vencido'

export type PeriodoVacacional = {
  indice: number
  desde: string
  hasta: string
  fechaGeneracion: string
  estado: EstadoPeriodoVacacional
  diasPendientes: number
}

export type ResultadoAFP = {
  fondo: number
  prima: number
  comision: number
  total: number
}

export type ResultadoPension = {
  base: number
  afp?: ResultadoAFP
  onp?: number
  total: number
}

export type ResultadoRenta5ta = {
  remuneracionesAnio: number
  gratificacionesAnio: number
  ingresosEmpleadoresAnteriores: number
  conceptosGravadosLiquidacion: number
  rentaBruta: number
  deduccion: number
  rentaNeta: number
  impuesto: number
  retenciones: number
  retencionFinal: number
  atribuibleLiquidacion: number
  estimado: boolean
}

export type ResultadoLiquidacion = {
  conceptos: ConceptoResultado[]
  totalBruto: number
  pension: ResultadoPension
  renta5ta: ResultadoRenta5ta
  totalDescuentos: number
  neto: number
  periodosVacacionales: PeriodoVacacional[]
  advertencias: Advertencia[]
  supuestosProvisionales: ConceptoResultado[]
  parametros: {
    rmv: number
    uit: number
    rma: number
    revisadoEl: string
  }
  tiempoServicio: {
    meses: number
    dias: number
    anios: number
    mesesRestantes: number
  }
  versionMotor: string
}
