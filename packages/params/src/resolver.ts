import type {
  Afectacion,
  AfpNombre,
  ContextoCalculo,
  ParametrosLegales,
  RentaParametros,
} from '@calculolibreperu/shared'
import afectacionesJson from '../data/afectaciones.json'
import afpJson from '../data/afp.json'
import normasJson from '../data/normas.json'
import rentaJson from '../data/renta.json'
import rmvJson from '../data/rmv.json'
import uitJson from '../data/uit.json'

export type Parametro = {
  nombre: string
  valor: number
  moneda: string
  vigenteDesde: string
  vigenteHasta: string | null
  fuente: string
  url: string
  revisadoEl: string
  nota: string
}

export type ComisionAfp = {
  afp: AfpNombre
  flujo: number
  mixta: boolean
}

export type Rma = {
  vigenteDesde: string
  vigenteHasta: string
  valor: number
}

export type AfpData = {
  aporteObligatorio: number
  primaSeguro: number
  comisiones: ComisionAfp[]
  rma: Rma[]
  revisadoEl: string
}

const parametros: Parametro[] = [...rmvJson, ...uitJson]
const afp: AfpData = {
  ...afpJson,
  comisiones: afpJson.comisiones.map((comision) => ({
    ...comision,
    afp: comision.afp as AfpNombre,
  })),
}

export const normas = normasJson

export function resolverParametro(nombre: string, fechaCese: string): Parametro {
  const encontrado = parametros.find(
    (parametro) =>
      parametro.nombre === nombre &&
      parametro.vigenteDesde <= fechaCese &&
      (parametro.vigenteHasta === null || fechaCese <= parametro.vigenteHasta),
  )

  if (!encontrado) {
    throw new Error(`No hay parámetro vigente "${nombre}" para la fecha ${fechaCese}`)
  }

  return encontrado
}

export function resolverRma(fechaCese: string): Rma {
  const encontrado = afp.rma.find(
    (rma) => rma.vigenteDesde <= fechaCese && fechaCese <= rma.vigenteHasta,
  )

  if (!encontrado) {
    throw new Error(`No hay RMA vigente para la fecha ${fechaCese}`)
  }

  return encontrado
}

export function obtenerAfp(): AfpData {
  return afp
}

export function obtenerAfectaciones(): Afectacion[] {
  return afectacionesJson as unknown as Afectacion[]
}

export function obtenerRenta(): RentaParametros {
  return rentaJson
}

export function crearContextoCalculo(
  fechaCese: string,
  fechaActual = new Date().toISOString().slice(0, 10),
): ContextoCalculo {
  const rmv = resolverParametro('rmv', fechaCese)
  const uit = resolverParametro('uit', fechaCese)
  const rma = resolverRma(fechaCese)
  const renta = obtenerRenta()
  const revisadoEl = [rmv.revisadoEl, uit.revisadoEl, afp.revisadoEl, renta.revisadoEl]
    .sort()
    .slice(-1)[0]

  const parametrosLegales: ParametrosLegales = {
    rmv: rmv.valor,
    uit: uit.valor,
    asignacionFamiliar: Number((rmv.valor * 0.1).toFixed(2)),
    rma: rma.valor,
    afp: {
      aporteObligatorio: afp.aporteObligatorio,
      primaSeguro: afp.primaSeguro,
      comisiones: afp.comisiones,
    },
    onp: 0.13,
    renta,
    afectaciones: obtenerAfectaciones(),
    revisadoEl,
  }

  return { parametros: parametrosLegales, fechaActual }
}
