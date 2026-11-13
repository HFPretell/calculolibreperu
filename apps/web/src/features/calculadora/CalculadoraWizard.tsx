import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import type { EntradaLiquidacion, ResultadoLiquidacion } from '@calculolibreperu/shared'
import { entradaLiquidacionSchema } from '@calculolibreperu/shared'
import { calcularLiquidacion } from '@calculolibreperu/engine'
import { crearContextoCalculo } from '@calculolibreperu/params'
import { Alert } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { PageHeader } from '../../components/ui/page-header'
import { ArrowLeftIcon, ArrowRightIcon } from '../../components/ui/icons'
import { PasoDatosCese } from './components/PasoDatosCese'
import { PasoRemuneracion } from './components/PasoRemuneracion'
import { PasoResultados } from './components/PasoResultados'
import { PasoVacacionesDescuentos } from './components/PasoVacacionesDescuentos'
import { StepIndicator } from './components/StepIndicator'
import {
  camposPaso,
  construirResumen,
  pasos,
  sugerirMesesTrabajadosAnio,
  valoresIniciales,
  type EntradaFormulario,
} from './form'

function desplazarArriba() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

type CalculadoraWizardProps = {
  onAbrirAvisoLegal: () => void
}

export function CalculadoraWizard({ onAbrirAvisoLegal }: CalculadoraWizardProps) {
  const [paso, setPaso] = useState(1)
  const [resultado, setResultado] = useState<ResultadoLiquidacion | null>(null)
  const [entradaCalculada, setEntradaCalculada] = useState<EntradaLiquidacion | null>(null)
  const [mensajeError, setMensajeError] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const mesesEditado = useRef(false)

  const form = useForm<EntradaFormulario, unknown, EntradaLiquidacion>({
    resolver: zodResolver(entradaLiquidacionSchema),
    defaultValues: valoresIniciales,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
    setValue,
    trigger,
  } = form

  const fechaIngreso = useWatch({ control, name: 'fechaIngreso' }) ?? ''
  const fechaCese = useWatch({ control, name: 'fechaCese' }) ?? ''
  const mesesSugeridos = sugerirMesesTrabajadosAnio(fechaIngreso, fechaCese)

  useEffect(() => {
    if (mesesEditado.current) return
    setValue('mesesTrabajadosAnio', mesesSugeridos)
  }, [mesesSugeridos, setValue])

  useEffect(() => {
    if (!copiado) return
    const temporizador = window.setTimeout(() => setCopiado(false), 2200)
    return () => window.clearTimeout(temporizador)
  }, [copiado])

  const onCalcular: SubmitHandler<EntradaLiquidacion> = (datos) => {
    try {
      const contexto = crearContextoCalculo(datos.fechaCese)
      const calculo = calcularLiquidacion(datos, contexto)
      setResultado(calculo)
      setEntradaCalculada(datos)
      setMensajeError(null)
      setPaso(4)
      desplazarArriba()
    } catch (error) {
      setMensajeError(
        error instanceof Error
          ? error.message
          : 'No se pudo calcular la liquidación. Revisa los datos e inténtalo de nuevo.',
      )
    }
  }

  async function avanzar() {
    if (paso === 4) return

    const campos = camposPaso[paso]
    if (!campos) return

    const valido = await trigger(campos, { shouldFocus: true })
    if (!valido) return

    if (paso < 3) {
      setPaso(paso + 1)
      desplazarArriba()
      return
    }

    await handleSubmit(onCalcular)()
  }

  function irAtras() {
    if (paso <= 1) return
    setPaso(paso - 1)
    desplazarArriba()
  }

  function volverAEditar() {
    setPaso(3)
    setResultado(null)
    setEntradaCalculada(null)
    setMensajeError(null)
    desplazarArriba()
  }

  function reiniciar() {
    reset(valoresIniciales)
    mesesEditado.current = false
    setPaso(1)
    setResultado(null)
    setEntradaCalculada(null)
    setMensajeError(null)
    setCopiado(false)
    desplazarArriba()
  }

  function marcarMesesEditados() {
    mesesEditado.current = true
  }

  function usarMesesSugeridos() {
    mesesEditado.current = false
    setValue('mesesTrabajadosAnio', mesesSugeridos, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  async function copiarResumen() {
    if (!resultado || !entradaCalculada) return

    try {
      if (!navigator.clipboard) {
        throw new Error('Tu navegador no permite copiar automáticamente.')
      }

      await navigator.clipboard.writeText(construirResumen(entradaCalculada, resultado))
      setCopiado(true)
      setMensajeError(null)
    } catch (error) {
      setMensajeError(
        error instanceof Error
          ? error.message
          : 'No se pudo copiar el resumen. Selecciona el texto manualmente.',
      )
    }
  }

  return (
    <div className="animate-fade-in mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <PageHeader
        eyebrow="Calculadora"
        title="Tu liquidación, paso a paso."
        description="Completa tus datos y revisa el detalle de cada concepto."
        className="no-print"
      />

      <div className="mt-8">
        <StepIndicator paso={paso} />
      </div>

      {mensajeError ? (
        <Alert variant="danger" title="No pudimos completar la acción" className="mt-6 no-print">
          {mensajeError}
        </Alert>
      ) : null}

      <form
        noValidate
        onSubmit={(evento) => {
          evento.preventDefault()
          void avanzar()
        }}
        className="mt-6"
      >
        <Card className="print:border-0 print:shadow-none">
          <CardContent className="p-5 sm:p-7 print:p-0">
            <p className="sr-only" aria-live="polite">
              Paso {paso} de 4: {pasos[paso - 1]?.titulo}
            </p>

            {paso === 1 ? <PasoDatosCese form={form} /> : null}
            {paso === 2 ? <PasoRemuneracion form={form} /> : null}
            {paso === 3 ? (
              <PasoVacacionesDescuentos
                form={form}
                mesesSugeridos={mesesSugeridos}
                onMesesChange={marcarMesesEditados}
                onUsarSugerido={usarMesesSugeridos}
              />
            ) : null}
            {paso === 4 && resultado && entradaCalculada ? (
              <PasoResultados
                entrada={entradaCalculada}
                resultado={resultado}
                copiado={copiado}
                onCopiar={() => {
                  void copiarResumen()
                }}
                onVolver={volverAEditar}
                onReiniciar={reiniciar}
                onAbrirAvisoLegal={onAbrirAvisoLegal}
              />
            ) : null}
          </CardContent>

          {paso < 4 ? (
            <CardFooter className="no-print justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={irAtras}
                disabled={paso === 1 || isSubmitting}
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Atrás
              </Button>
              <div className="flex items-center gap-3">
                <p className="hidden text-xs text-faint sm:block">Paso {paso} de 3</p>
                <Button type="submit" disabled={isSubmitting}>
                  {paso === 3 ? 'Calcular liquidación' : 'Continuar'}
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          ) : null}
        </Card>
      </form>
    </div>
  )
}
