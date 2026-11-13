import { useState } from 'react'
import { get } from 'react-hook-form'
import { Alert } from '../../../components/ui/alert'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { Field } from '../../../components/ui/field'
import { Input } from '../../../components/ui/input'
import { CheckboxCard } from './CheckboxCard'
import { FormSection } from './FormSection'
import type { FormularioLiquidacion } from '../form'

type PasoRemuneracionProps = {
  form: FormularioLiquidacion
}

const etiquetasVariables = [
  'Hace 6 meses',
  'Hace 5 meses',
  'Hace 4 meses',
  'Hace 3 meses',
  'Hace 2 meses',
  'Mes anterior',
]

export function PasoRemuneracion({ form }: PasoRemuneracionProps) {
  const {
    register,
    formState: { errors },
    setValue,
  } = form

  const [promedioRapido, setPromedioRapido] = useState('')
  const [mesesRapido, setMesesRapido] = useState('3')

  const promedioNumero = Number(promedioRapido)
  const mesesNumero = Number(mesesRapido)
  const puedeAplicar =
    promedioRapido !== '' &&
    Number.isFinite(promedioNumero) &&
    promedioNumero >= 0 &&
    Number.isInteger(mesesNumero) &&
    mesesNumero >= 1 &&
    mesesNumero <= 6

  function aplicarPromedio() {
    if (!puedeAplicar) return

    const valores = Array.from({ length: 6 }, (_, indice) =>
      indice >= 6 - mesesNumero ? promedioNumero : 0,
    )

    setValue('variablesMensuales', valores, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (
    <FormSection
      title="Remuneración"
      description="Ingresa montos mensuales brutos, sin descuentos de AFP, ONP ni renta. La remuneración computable incluye sueldo, asignación familiar y variables regulares."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Sueldo básico mensual"
          htmlFor="sueldoBasico"
          hint="Sueldo bruto pactado, sin asignación familiar."
          error={errors.sueldoBasico?.message}
        >
          <Input
            id="sueldoBasico"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            placeholder="3000.00"
            aria-invalid={Boolean(errors.sueldoBasico)}
            {...register('sueldoBasico', { valueAsNumber: true })}
          />
        </Field>

        <Field
          label="Variables devengadas en el mes de cese"
          htmlFor="variablesDevengadasMesCese"
          hint="Comisiones, horas extras u otros montos del último mes."
          error={errors.variablesDevengadasMesCese?.message}
        >
          <Input
            id="variablesDevengadasMesCese"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            aria-invalid={Boolean(errors.variablesDevengadasMesCese)}
            {...register('variablesDevengadasMesCese', {
              setValueAs: (valor: string) => (valor === '' ? 0 : Number(valor)),
            })}
          />
        </Field>

        <Field
          label="Última gratificación percibida"
          htmlFor="ultimaGratificacion"
          hint="Opcional. Si no la indicas, se estima con la remuneración computable."
          error={errors.ultimaGratificacion?.message}
          optional
        >
          <Input
            id="ultimaGratificacion"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            aria-invalid={Boolean(errors.ultimaGratificacion)}
            {...register('ultimaGratificacion', {
              setValueAs: (valor: string) => (valor === '' ? undefined : Number(valor)),
            })}
          />
        </Field>
      </div>

      <CheckboxCard
        id="asignacionFamiliar"
        label="Recibí asignación familiar"
        description="Equivale al 10% de la RMV y se suma a la remuneración computable."
        {...register('asignacionFamiliar')}
      />

      <Card className="bg-surface-sunken">
        <CardContent className="p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-ink">Ingreso rápido de variables</h3>
          <p className="mt-1 text-xs leading-relaxed text-faint">
            Si no tienes los seis montos, indica un promedio y en cuántos meses lo percibiste. La
            app completará los últimos meses con ese valor.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <Field label="Promedio mensual" htmlFor="promedioRapido">
              <Input
                id="promedioRapido"
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                value={promedioRapido}
                onChange={(evento) => setPromedioRapido(evento.target.value)}
              />
            </Field>
            <Field label="Meses percibidos" htmlFor="mesesRapido">
              <Input
                id="mesesRapido"
                type="number"
                min={1}
                max={6}
                step={1}
                inputMode="numeric"
                value={mesesRapido}
                onChange={(evento) => setMesesRapido(evento.target.value)}
              />
            </Field>
            <Button
              type="button"
              variant="secondary"
              onClick={aplicarPromedio}
              disabled={!puedeAplicar}
            >
              Aplicar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink">Variables de los últimos 6 meses</h3>
          <p className="text-xs text-faint">Meses completos anteriores al cese</p>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {etiquetasVariables.map((etiqueta, indice) => {
            const error = get(errors, `variablesMensuales.${indice}.message`) as string | undefined

            return (
              <Field
                key={etiqueta}
                label={etiqueta}
                htmlFor={`variablesMensuales.${indice}`}
                error={error}
              >
                <Input
                  id={`variablesMensuales.${indice}`}
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  aria-invalid={Boolean(error)}
                  {...register(`variablesMensuales.${indice}`, {
                    setValueAs: (valor: string) => (valor === '' ? 0 : Number(valor)),
                  })}
                />
              </Field>
            )
          })}
        </div>
      </div>

      <Alert variant="info" title="Variables regulares">
        Para CTS, gratificación y vacaciones, una variable se considera regular si se percibió en al
        menos 3 de los últimos 6 meses. Si no, se muestra una advertencia y no se incluye en la
        remuneración computable.
      </Alert>
    </FormSection>
  )
}
