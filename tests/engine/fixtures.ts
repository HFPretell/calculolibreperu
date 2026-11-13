import { crearContextoCalculo } from '@calculolibreperu/params'
import { entradaLiquidacionSchema, type EntradaLiquidacion } from '@calculolibreperu/shared'

const entradaBase = {
  fechaIngreso: '2024-01-15',
  fechaCese: '2026-11-10',
  tipoContrato: 'indeterminado',
  duracionPeriodoPrueba: 3,
  motivoCese: 'despido_arbitrario',
  sueldoBasico: 3000,
  asignacionFamiliar: true,
  variablesMensuales: [],
  variablesDevengadasMesCese: 0,
  sistemaPensionario: 'afp',
  afp: 'Habitat',
  tipoComisionAfp: 'flujo',
  afiliadoEps: false,
  diasVacacionesGozadas: 0,
  mesesTrabajadosAnio: 10,
  ingresosEmpleadoresAnteriores: 0,
  retencionesEmpleadoresAnteriores: 0,
  retencionesEmpleadorActual: 0,
}

export const contextoBase = crearContextoCalculo('2026-11-10', '2026-11-10')

export function crearEntrada(overrides: Partial<EntradaLiquidacion> = {}): EntradaLiquidacion {
  return entradaLiquidacionSchema.parse({ ...entradaBase, ...overrides })
}
