import { z } from 'zod'

function esFechaValida(valor: string): boolean {
  const [anio, mes, dia] = valor.split('-').map(Number)
  const fecha = new Date(Date.UTC(anio, mes - 1, dia))
  return (
    fecha.getUTCFullYear() === anio && fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia
  )
}

export const fechaISO = z
  .string('La fecha es obligatoria')
  .min(1, 'La fecha es obligatoria')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD')
  .refine(esFechaValida, 'La fecha no existe en el calendario')

export const monto = z.number('Ingresa un monto válido').min(0, 'El monto no puede ser negativo')

export const esquemaEntradaBasica = z
  .object({
    fechaIngreso: fechaISO,
    fechaCese: fechaISO,
    sueldoBasico: monto,
  })
  .refine((datos) => datos.fechaCese >= datos.fechaIngreso, {
    message: 'La fecha de cese no puede ser anterior a la fecha de ingreso',
    path: ['fechaCese'],
  })

export type EntradaBasica = z.infer<typeof esquemaEntradaBasica>

export const tipoContratoSchema = z.enum(
  ['indeterminado', 'modal'],
  'Selecciona el tipo de contrato',
)

export const motivoCeseSchema = z.enum(
  [
    'renuncia',
    'mutuo_disenso',
    'despido_arbitrario',
    'despido_indirecto',
    'despido_causa_justa',
    'vencimiento_contrato',
    'otro',
  ],
  'Selecciona el motivo de cese',
)

export const sistemaPensionarioSchema = z.enum(['afp', 'onp'], 'Selecciona el sistema pensionario')

export const afpSchema = z.enum(['Habitat', 'Integra', 'Prima', 'Profuturo'], 'Selecciona tu AFP')

export const tipoComisionAfpSchema = z.enum(['flujo', 'mixta'], 'Selecciona el tipo de comisión')

export const entradaLiquidacionSchema = z
  .object({
    fechaIngreso: fechaISO,
    fechaCese: fechaISO,
    tipoContrato: tipoContratoSchema,
    fechaVencimientoContrato: fechaISO.optional(),
    duracionPeriodoPrueba: z
      .number('Ingresa un número de meses')
      .int('Usa un número entero')
      .min(0, 'No puede ser negativo')
      .max(12, 'Máximo 12 meses')
      .default(3),
    motivoCese: motivoCeseSchema,
    sueldoBasico: z
      .number('Ingresa un monto válido')
      .positive('El sueldo básico debe ser mayor a 0'),
    asignacionFamiliar: z.boolean().default(false),
    variablesMensuales: z.array(monto).max(6, 'Máximo 6 meses de variables').default([]),
    variablesDevengadasMesCese: monto.default(0),
    ultimaGratificacion: monto.optional(),
    sistemaPensionario: sistemaPensionarioSchema,
    afp: afpSchema.optional(),
    tipoComisionAfp: tipoComisionAfpSchema.optional(),
    afiliadoEps: z.boolean().default(false),
    diasVacacionesGozadas: z
      .number('Ingresa un número de días')
      .int('Usa un número entero')
      .min(0, 'No puede ser negativo')
      .default(0),
    mesesTrabajadosAnio: z
      .number('Ingresa un número de meses')
      .int('Usa un número entero')
      .min(0, 'No puede ser negativo')
      .max(12, 'Máximo 12 meses'),
    remuneracionesPercibidasAnio: monto.optional(),
    gratificacionesPercibidasAnio: monto.optional(),
    ingresosEmpleadoresAnteriores: monto.default(0),
    retencionesEmpleadoresAnteriores: monto.default(0),
    retencionesEmpleadorActual: monto.default(0),
  })
  .superRefine((datos, ctx) => {
    if (datos.fechaCese < datos.fechaIngreso) {
      ctx.addIssue({
        code: 'custom',
        message: 'La fecha de cese no puede ser anterior a la fecha de ingreso',
        path: ['fechaCese'],
      })
    }

    if (datos.tipoContrato === 'modal') {
      if (!datos.fechaVencimientoContrato) {
        ctx.addIssue({
          code: 'custom',
          message: 'Indica la fecha de vencimiento del contrato modal',
          path: ['fechaVencimientoContrato'],
        })
      } else if (datos.fechaVencimientoContrato < datos.fechaCese) {
        ctx.addIssue({
          code: 'custom',
          message: 'El vencimiento pactado no puede ser anterior al cese',
          path: ['fechaVencimientoContrato'],
        })
      }
    }

    if (datos.sistemaPensionario === 'afp') {
      if (!datos.afp) {
        ctx.addIssue({
          code: 'custom',
          message: 'Selecciona tu AFP',
          path: ['afp'],
        })
      }
      if (!datos.tipoComisionAfp) {
        ctx.addIssue({
          code: 'custom',
          message: 'Selecciona el tipo de comisión',
          path: ['tipoComisionAfp'],
        })
      }
    }
  })
