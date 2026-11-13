export type Tiempo = {
  meses: number
  dias: number
}

export type TiempoDescompuesto = {
  anios: number
  meses: number
  dias: number
}

export type PeriodoVacacionalCalculado = {
  indice: number
  desde: string
  hasta: string
  fechaGeneracion: string
  estado: 'no_gozado' | 'vencido'
  diasPendientes: number
}

export type CalculoPeriodosVacacionales = {
  periodos: PeriodoVacacionalCalculado[]
  diasAdelantados: number
  ultimoAniversario: string
  diasTruncos: number
}

export function parseFecha(fecha: string): Date {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  return new Date(Date.UTC(anio, mes - 1, dia))
}

export function formatearFecha(fecha: Date): string {
  return fecha.toISOString().slice(0, 10)
}

export function sumarDias(fecha: Date, dias: number): Date {
  return new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate() + dias))
}

export function sumarMeses(fecha: Date, meses: number): Date {
  const anio = fecha.getUTCFullYear()
  const mes = fecha.getUTCMonth() + meses
  const dia = fecha.getUTCDate()
  const ultimoDia = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate()
  return new Date(Date.UTC(anio, mes, Math.min(dia, ultimoDia)))
}

export function sumarAnios(fecha: Date, anios: number): Date {
  return sumarMeses(fecha, anios * 12)
}

export function inicioMes(fecha: Date): Date {
  return new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), 1))
}

export function finMes(fecha: Date): Date {
  return new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth() + 1, 0))
}

export function computarTiempo(inicio: string, cese: string): Tiempo {
  const inicioDate = parseFecha(inicio)
  const fin = sumarDias(parseFecha(cese), 1)

  let meses =
    (fin.getUTCFullYear() - inicioDate.getUTCFullYear()) * 12 +
    (fin.getUTCMonth() - inicioDate.getUTCMonth())
  let dias = fin.getUTCDate() - inicioDate.getUTCDate()

  if (dias < 0) {
    meses -= 1
    dias += 30
  }

  if (dias >= 30) {
    meses += 1
    dias -= 30
  }

  return { meses, dias }
}

export function diasTotales(tiempo: Tiempo): number {
  return tiempo.meses * 30 + tiempo.dias
}

export function descomponerTiempo(tiempo: Tiempo): TiempoDescompuesto {
  return {
    anios: Math.floor(tiempo.meses / 12),
    meses: tiempo.meses % 12,
    dias: tiempo.dias,
  }
}

export function mesesCalendarioCompletos(desde: string, hasta: string): number {
  const desdeDate = parseFecha(desde)
  const hastaDate = parseFecha(hasta)
  if (desdeDate.getTime() > hastaDate.getTime()) return 0

  let cursor = new Date(Date.UTC(desdeDate.getUTCFullYear(), desdeDate.getUTCMonth(), 1))
  let completos = 0

  while (cursor.getTime() <= hastaDate.getTime()) {
    const ultimoDia = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0))

    if (cursor.getTime() >= desdeDate.getTime() && ultimoDia.getTime() <= hastaDate.getTime()) {
      completos += 1
    }

    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1))
  }

  return completos
}

export function inicioSemestreCts(cese: string): string {
  const fecha = parseFecha(cese)
  const mes = fecha.getUTCMonth() + 1
  const anio = fecha.getUTCFullYear()

  if (mes >= 11 || mes <= 4) {
    const anioInicio = mes >= 11 ? anio : anio - 1
    return `${anioInicio}-11-01`
  }

  return `${anio}-05-01`
}

export function inicioSemestreGratificacion(cese: string): string {
  const fecha = parseFecha(cese)
  const mes = fecha.getUTCMonth() + 1
  const anio = fecha.getUTCFullYear()
  return mes <= 6 ? `${anio}-01-01` : `${anio}-07-01`
}

export function calcularPeriodosVacacionales(
  fechaIngreso: string,
  fechaCese: string,
  diasGozados: number,
): CalculoPeriodosVacacionales {
  const ingreso = parseFecha(fechaIngreso)
  const cese = parseFecha(fechaCese)
  const periodos: PeriodoVacacionalCalculado[] = []

  let indice = 1
  let aniversario = sumarAnios(ingreso, 1)

  while (aniversario.getTime() <= cese.getTime()) {
    const desde = sumarAnios(ingreso, indice - 1)
    const hasta = sumarDias(aniversario, -1)
    const fechaLimite = sumarAnios(aniversario, 1)
    const estado = cese.getTime() > fechaLimite.getTime() ? 'vencido' : 'no_gozado'

    periodos.push({
      indice,
      desde: formatearFecha(desde),
      hasta: formatearFecha(hasta),
      fechaGeneracion: formatearFecha(aniversario),
      estado,
      diasPendientes: 30,
    })

    indice += 1
    aniversario = sumarAnios(ingreso, indice)
  }

  let restante = Math.max(0, Math.floor(diasGozados))

  for (const periodo of periodos) {
    const descuento = Math.min(restante, periodo.diasPendientes)
    periodo.diasPendientes -= descuento
    restante -= descuento
    if (restante === 0) break
  }

  const ultimoAniversario =
    periodos.length > 0 ? periodos[periodos.length - 1].fechaGeneracion : fechaIngreso
  const tiempoTrunco = computarTiempo(ultimoAniversario, fechaCese)
  const diasTruncos = Math.max(0, diasTotales(tiempoTrunco))

  return {
    periodos,
    diasAdelantados: restante,
    ultimoAniversario,
    diasTruncos,
  }
}
