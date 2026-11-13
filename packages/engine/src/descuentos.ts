import type {
  EntradaLiquidacion,
  ParametrosLegales,
  RentaTramo,
  ResultadoPension,
  ResultadoRenta5ta,
} from '@calculolibreperu/shared'
import { Decimal, cero, d, redondear } from './dinero'
import type { RemuneracionComputable } from './remuneracion'
import { parseFecha } from './tiempo'

export function calcularImpuestoRenta(
  rentaNeta: Decimal,
  uit: Decimal,
  tramos: RentaTramo[],
): Decimal {
  if (rentaNeta.lte(0)) return cero()

  let restante = rentaNeta
  let limiteAnterior = cero()
  let impuesto = cero()

  for (const tramo of tramos) {
    const limite = tramo.hastaUit === null ? null : d(tramo.hastaUit).mul(uit)
    const ancho = limite === null ? restante : Decimal.min(restante, limite.minus(limiteAnterior))

    if (ancho.gt(0)) {
      impuesto = impuesto.plus(ancho.mul(tramo.tasa))
      restante = restante.minus(ancho)
    }

    if (restante.lte(0)) break
    if (limite !== null) limiteAnterior = limite
  }

  return impuesto
}

export function calcularPension(
  base: Decimal,
  entrada: EntradaLiquidacion,
  parametros: ParametrosLegales,
): ResultadoPension {
  const baseRedondeada = redondear(base)

  if (entrada.sistemaPensionario === 'onp') {
    const onp = redondear(base.mul(parametros.onp))
    return { base: baseRedondeada, onp, total: onp }
  }

  const comision = parametros.afp.comisiones.find((item) => item.afp === entrada.afp)

  if (!comision) {
    throw new Error(`No hay comisión configurada para la AFP ${entrada.afp ?? 'sin AFP'}`)
  }

  const fondo = redondear(base.mul(parametros.afp.aporteObligatorio))
  const prima = redondear(Decimal.min(base, d(parametros.rma)).mul(parametros.afp.primaSeguro))
  const comisionFlujo =
    entrada.tipoComisionAfp === 'flujo' ? redondear(base.mul(comision.flujo)) : 0
  const total = redondear(d(fondo).plus(prima).plus(comisionFlujo))

  return {
    base: baseRedondeada,
    afp: { fondo, prima, comision: comisionFlujo, total },
    total,
  }
}

function estimarGratificaciones(entrada: EntradaLiquidacion, rcGrati: Decimal): Decimal {
  if (entrada.gratificacionesPercibidasAnio !== undefined) {
    return d(entrada.gratificacionesPercibidasAnio)
  }

  const ingreso = parseFecha(entrada.fechaIngreso)
  const cese = parseFecha(entrada.fechaCese)
  const anio = cese.getUTCFullYear()
  const finJunio = new Date(Date.UTC(anio, 5, 30))
  const julio = new Date(Date.UTC(anio, 6, 15))
  const finNoviembre = new Date(Date.UTC(anio, 10, 30))
  const diciembre = new Date(Date.UTC(anio, 11, 15))

  let gratificaciones = 0

  if (ingreso.getTime() <= finJunio.getTime() && cese.getTime() >= julio.getTime()) {
    gratificaciones += 1
  }

  if (ingreso.getTime() <= finNoviembre.getTime() && cese.getTime() >= diciembre.getTime()) {
    gratificaciones += 1
  }

  return rcGrati.mul(gratificaciones)
}

export function calcularRenta5ta(
  entrada: EntradaLiquidacion,
  parametros: ParametrosLegales,
  conceptosGravados: Decimal,
  remuneracion: RemuneracionComputable,
): ResultadoRenta5ta {
  const remuneracionesEstimadas = entrada.remuneracionesPercibidasAnio === undefined
  const gratificacionesEstimadas = entrada.gratificacionesPercibidasAnio === undefined

  const remuneracionesAnio = remuneracionesEstimadas
    ? remuneracion.rcGrati.mul(entrada.mesesTrabajadosAnio)
    : d(entrada.remuneracionesPercibidasAnio ?? 0)

  const gratificacionesAnio = estimarGratificaciones(entrada, remuneracion.rcGrati)
  const ingresosAnteriores = d(entrada.ingresosEmpleadoresAnteriores)
  const rentaBruta = remuneracionesAnio
    .plus(gratificacionesAnio)
    .plus(ingresosAnteriores)
    .plus(conceptosGravados)

  const deduccion = d(parametros.renta.deduccionUit).mul(parametros.uit)
  const rentaNeta = Decimal.max(0, rentaBruta.minus(deduccion))
  const impuesto = calcularImpuestoRenta(rentaNeta, d(parametros.uit), parametros.renta.tramos)
  const retenciones = d(entrada.retencionesEmpleadorActual).plus(
    entrada.retencionesEmpleadoresAnteriores,
  )
  const retencionFinal = Decimal.max(0, impuesto.minus(retenciones))

  const rentaSinLiquidacion = rentaBruta.minus(conceptosGravados)
  const rentaNetaSinLiquidacion = Decimal.max(0, rentaSinLiquidacion.minus(deduccion))
  const impuestoSinLiquidacion = calcularImpuestoRenta(
    rentaNetaSinLiquidacion,
    d(parametros.uit),
    parametros.renta.tramos,
  )
  const atribuible = Decimal.max(0, impuesto.minus(impuestoSinLiquidacion))
  const atribuibleFinal = Decimal.min(atribuible, retencionFinal)

  return {
    remuneracionesAnio: redondear(remuneracionesAnio),
    gratificacionesAnio: redondear(gratificacionesAnio),
    ingresosEmpleadoresAnteriores: redondear(ingresosAnteriores),
    conceptosGravadosLiquidacion: redondear(conceptosGravados),
    rentaBruta: redondear(rentaBruta),
    deduccion: redondear(deduccion),
    rentaNeta: redondear(rentaNeta),
    impuesto: redondear(impuesto),
    retenciones: redondear(retenciones),
    retencionFinal: redondear(retencionFinal),
    atribuibleLiquidacion: redondear(atribuibleFinal),
    estimado: remuneracionesEstimadas || gratificacionesEstimadas,
  }
}
