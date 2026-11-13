import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import { calcularPeriodosVacacionales } from '@calculolibreperu/engine'
import { Alert } from '../../../components/ui/alert'
import { Button } from '../../../components/ui/button'
import { Field } from '../../../components/ui/field'
import { Input } from '../../../components/ui/input'
import { Select } from '../../../components/ui/select'
import { CheckboxCard } from './CheckboxCard'
import { FormSection } from './FormSection'
import {
  afps,
  formatearFechaCorta,
  sistemasPensionarios,
  tiposComision,
  type FormularioLiquidacion,
} from '../form'

type PasoVacacionesDescuentosProps = {
  form: FormularioLiquidacion
  mesesSugeridos: number
  onMesesChange: () => void
  onUsarSugerido: () => void
}

export function PasoVacacionesDescuentos({
  form,
  mesesSugeridos,
  onMesesChange,
  onUsarSugerido,
}: PasoVacacionesDescuentosProps) {
  const {
    register,
    formState: { errors },
  } = form

  const fechaIngreso = useWatch({ control: form.control, name: 'fechaIngreso' }) ?? ''
  const fechaCese = useWatch({ control: form.control, name: 'fechaCese' }) ?? ''
  const diasGozados = useWatch({
    control: form.control,
    name: 'diasVacacionesGozadas',
  })
  const sistemaPensionario = useWatch({
    control: form.control,
    name: 'sistemaPensionario',
  })

  const periodos = useMemo(() => {
    if (!fechaIngreso || !fechaCese) return null

    try {
      return calcularPeriodosVacacionales(
        fechaIngreso,
        fechaCese,
        typeof diasGozados === 'number' && Number.isFinite(diasGozados) ? diasGozados : 0,
      )
    } catch {
      return null
    }
  }, [fechaIngreso, fechaCese, diasGozados])

  const noGozados = periodos?.periodos.filter(
    (periodo) => periodo.estado === 'no_gozado' && periodo.diasPendientes > 0,
  )
  const vencidos = periodos?.periodos.filter(
    (periodo) => periodo.estado === 'vencido' && periodo.diasPendientes > 0,
  )

  return (
    <div className="space-y-8">
      <FormSection
        title="Vacaciones"
        description="Indica cuántos días de vacaciones ya gozaste. La app calcula periodos pendientes, vencidos y truncas."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Días de vacaciones gozadas"
            htmlFor="diasVacacionesGozadas"
            hint="Días efectivamente tomados en toda la relación laboral."
            error={errors.diasVacacionesGozadas?.message}
          >
            <Input
              id="diasVacacionesGozadas"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              placeholder="0"
              aria-invalid={Boolean(errors.diasVacacionesGozadas)}
              {...register('diasVacacionesGozadas', {
                setValueAs: (valor: string) => (valor === '' ? 0 : Number(valor)),
              })}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface-sunken p-4">
            <p className="text-sm font-medium text-ink">Periodos no gozados</p>
            <p className="mt-1 text-xs leading-relaxed text-faint">
              Periodos completos aún dentro del plazo para gozarlos.
            </p>
            {noGozados && noGozados.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {noGozados.map((periodo) => (
                  <li key={periodo.indice}>
                    Periodo {periodo.indice}: {formatearFechaCorta(periodo.desde)} –{' '}
                    {formatearFechaCorta(periodo.hasta)} · {periodo.diasPendientes} días
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-faint">No hay periodos pendientes.</p>
            )}
          </div>

          <div className="rounded-xl border border-line bg-surface-sunken p-4">
            <p className="text-sm font-medium text-ink">Periodos vencidos</p>
            <p className="mt-1 text-xs leading-relaxed text-faint">
              Se incluye el valor de los días y la indemnización equivalente.
            </p>
            {vencidos && vencidos.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {vencidos.map((periodo) => (
                  <li key={periodo.indice}>
                    Periodo {periodo.indice}: {formatearFechaCorta(periodo.desde)} –{' '}
                    {formatearFechaCorta(periodo.hasta)} · {periodo.diasPendientes} días
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-faint">No hay periodos vencidos.</p>
            )}
          </div>
        </div>

        {periodos && periodos.diasTruncos > 0 ? (
          <Alert variant="info" title="Vacaciones truncas">
            Desde el último aniversario hasta el cese hay {periodos.diasTruncos} días de servicio
            computables. Se pagan de forma proporcional.
          </Alert>
        ) : null}

        {periodos && periodos.diasAdelantados > 0 ? (
          <Alert variant="warning" title="Días adelantados">
            Registraste {periodos.diasAdelantados} días gozados por encima de los generados. No se
            descuentan del cálculo.
          </Alert>
        ) : null}
      </FormSection>

      <FormSection
        title="Sistema pensionario"
        description="El descuento se aplica solo sobre los conceptos afectos a pensión."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Sistema"
            htmlFor="sistemaPensionario"
            error={errors.sistemaPensionario?.message}
          >
            <Select
              id="sistemaPensionario"
              aria-invalid={Boolean(errors.sistemaPensionario)}
              {...register('sistemaPensionario')}
            >
              {sistemasPensionarios.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </Select>
          </Field>

          {sistemaPensionario === 'afp' ? (
            <>
              <Field label="AFP" htmlFor="afp" error={errors.afp?.message}>
                <Select id="afp" aria-invalid={Boolean(errors.afp)} {...register('afp')}>
                  {afps.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label="Tipo de comisión"
                htmlFor="tipoComisionAfp"
                hint="La comisión mixta se descuenta del fondo, no de la liquidación."
                error={errors.tipoComisionAfp?.message}
              >
                <Select
                  id="tipoComisionAfp"
                  aria-invalid={Boolean(errors.tipoComisionAfp)}
                  {...register('tipoComisionAfp')}
                >
                  {tiposComision.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </>
          ) : (
            <Alert variant="info" title="ONP">
              Se aplicará un descuento del 13% sobre los conceptos afectos a pensión.
            </Alert>
          )}
        </div>

        <CheckboxCard
          id="afiliadoEps"
          label="Estoy afiliado a una EPS"
          description="La bonificación extraordinaria de la gratificación baja de 9% a 6.75%."
          {...register('afiliadoEps')}
        />
      </FormSection>

      <FormSection
        title="Renta de quinta categoría"
        description="La estimación anual usa los meses completos antes del cese. El mes de cese se incluye en la liquidación para evitar doble cómputo."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Meses completos antes del cese"
            htmlFor="mesesTrabajadosAnio"
            hint={`Sugerido: ${mesesSugeridos} meses. Puedes ajustarlo si tu caso es distinto.`}
            error={errors.mesesTrabajadosAnio?.message}
          >
            <div className="flex gap-2">
              <Input
                id="mesesTrabajadosAnio"
                type="number"
                min={0}
                max={12}
                step={1}
                inputMode="numeric"
                aria-invalid={Boolean(errors.mesesTrabajadosAnio)}
                {...register('mesesTrabajadosAnio', {
                  setValueAs: (valor: string) => (valor === '' ? 0 : Number(valor)),
                  onChange: onMesesChange,
                })}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-11 flex-none"
                onClick={onUsarSugerido}
              >
                Usar sugerido
              </Button>
            </div>
          </Field>

          <Field
            label="Remuneraciones percibidas en el año"
            htmlFor="remuneracionesPercibidasAnio"
            hint="Opcional. Si no la indicas, se estima con los meses completos y la remuneración computable."
            error={errors.remuneracionesPercibidasAnio?.message}
            optional
          >
            <Input
              id="remuneracionesPercibidasAnio"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              aria-invalid={Boolean(errors.remuneracionesPercibidasAnio)}
              {...register('remuneracionesPercibidasAnio', {
                setValueAs: (valor: string) => (valor === '' ? undefined : Number(valor)),
              })}
            />
          </Field>

          <Field
            label="Gratificaciones percibidas en el año"
            htmlFor="gratificacionesPercibidasAnio"
            hint="Opcional. Si no la indicas, se estima con la remuneración computable."
            error={errors.gratificacionesPercibidasAnio?.message}
            optional
          >
            <Input
              id="gratificacionesPercibidasAnio"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              aria-invalid={Boolean(errors.gratificacionesPercibidasAnio)}
              {...register('gratificacionesPercibidasAnio', {
                setValueAs: (valor: string) => (valor === '' ? undefined : Number(valor)),
              })}
            />
          </Field>

          <Field
            label="Ingresos de empleadores anteriores"
            htmlFor="ingresosEmpleadoresAnteriores"
            hint="Solo si tuviste otro empleador en el mismo año."
            error={errors.ingresosEmpleadoresAnteriores?.message}
          >
            <Input
              id="ingresosEmpleadoresAnteriores"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              aria-invalid={Boolean(errors.ingresosEmpleadoresAnteriores)}
              {...register('ingresosEmpleadoresAnteriores', {
                setValueAs: (valor: string) => (valor === '' ? 0 : Number(valor)),
              })}
            />
          </Field>

          <Field
            label="Retenciones de empleadores anteriores"
            htmlFor="retencionesEmpleadoresAnteriores"
            hint="Retención de renta 5ta ya practicada por otros empleadores."
            error={errors.retencionesEmpleadoresAnteriores?.message}
          >
            <Input
              id="retencionesEmpleadoresAnteriores"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              aria-invalid={Boolean(errors.retencionesEmpleadoresAnteriores)}
              {...register('retencionesEmpleadoresAnteriores', {
                setValueAs: (valor: string) => (valor === '' ? 0 : Number(valor)),
              })}
            />
          </Field>

          <Field
            label="Retenciones del empleador actual"
            htmlFor="retencionesEmpleadorActual"
            hint="Retención de renta 5ta ya descontada en el año."
            error={errors.retencionesEmpleadorActual?.message}
          >
            <Input
              id="retencionesEmpleadorActual"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              aria-invalid={Boolean(errors.retencionesEmpleadorActual)}
              {...register('retencionesEmpleadorActual', {
                setValueAs: (valor: string) => (valor === '' ? 0 : Number(valor)),
              })}
            />
          </Field>
        </div>

        <Alert variant="info" title="Renta 5ta referencial">
          La retención se estima con los datos anuales disponibles. Confirma los montos con tu
          empleador o con SUNAT.
        </Alert>
      </FormSection>
    </div>
  )
}
