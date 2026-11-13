import { useWatch } from 'react-hook-form'
import { Alert } from '../../../components/ui/alert'
import { Field } from '../../../components/ui/field'
import { Input } from '../../../components/ui/input'
import { Select } from '../../../components/ui/select'
import { FormSection } from './FormSection'
import { motivosCese, tiposContrato, type FormularioLiquidacion } from '../form'

type PasoDatosCeseProps = {
  form: FormularioLiquidacion
}

export function PasoDatosCese({ form }: PasoDatosCeseProps) {
  const {
    register,
    formState: { errors },
  } = form

  const tipoContrato = useWatch({ control: form.control, name: 'tipoContrato' })

  return (
    <FormSection
      title="Datos del cese"
      description="Indica cuándo empezó y terminó tu relación laboral. El cálculo cubre el régimen general privado (D. Leg. 728)."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Fecha de ingreso"
          htmlFor="fechaIngreso"
          hint="Primer día efectivo de trabajo."
          error={errors.fechaIngreso?.message}
        >
          <Input
            id="fechaIngreso"
            type="date"
            aria-invalid={Boolean(errors.fechaIngreso)}
            {...register('fechaIngreso')}
          />
        </Field>

        <Field
          label="Fecha de cese"
          htmlFor="fechaCese"
          hint="Último día trabajado."
          error={errors.fechaCese?.message}
        >
          <Input
            id="fechaCese"
            type="date"
            aria-invalid={Boolean(errors.fechaCese)}
            {...register('fechaCese')}
          />
        </Field>

        <Field
          label="Tipo de contrato"
          htmlFor="tipoContrato"
          hint="Si es modal, el vencimiento condiciona la indemnización."
          error={errors.tipoContrato?.message}
        >
          <Select
            id="tipoContrato"
            aria-invalid={Boolean(errors.tipoContrato)}
            {...register('tipoContrato')}
          >
            {tiposContrato.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Motivo del cese"
          htmlFor="motivoCese"
          hint="Solo algunos motivos generan indemnización por despido."
          error={errors.motivoCese?.message}
        >
          <Select
            id="motivoCese"
            aria-invalid={Boolean(errors.motivoCese)}
            {...register('motivoCese')}
          >
            {motivosCese.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </Select>
        </Field>

        {tipoContrato === 'modal' ? (
          <Field
            label="Vencimiento del contrato"
            htmlFor="fechaVencimientoContrato"
            hint="Fecha pactada de término del contrato modal."
            error={errors.fechaVencimientoContrato?.message}
          >
            <Input
              id="fechaVencimientoContrato"
              type="date"
              aria-invalid={Boolean(errors.fechaVencimientoContrato)}
              {...register('fechaVencimientoContrato', {
                setValueAs: (valor: string) => (valor === '' ? undefined : valor),
              })}
            />
          </Field>
        ) : null}

        <Field
          label="Periodo de prueba"
          htmlFor="duracionPeriodoPrueba"
          hint="Meses de prueba pactados. Por defecto, 3."
          error={errors.duracionPeriodoPrueba?.message}
        >
          <Input
            id="duracionPeriodoPrueba"
            type="number"
            min={0}
            max={12}
            step={1}
            inputMode="numeric"
            aria-invalid={Boolean(errors.duracionPeriodoPrueba)}
            {...register('duracionPeriodoPrueba', { valueAsNumber: true })}
          />
        </Field>
      </div>

      <Alert variant="info" title="Datos de ejemplo">
        Ingreso 15/01/2024 y cese 10/11/2026. Si tu caso es distinto, reemplaza las fechas y
        completa el resto de pasos.
      </Alert>
    </FormSection>
  )
}
