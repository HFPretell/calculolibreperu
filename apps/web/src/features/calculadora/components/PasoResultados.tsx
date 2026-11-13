import { useEffect } from 'react'
import type {
  Advertencia,
  EntradaLiquidacion,
  ResultadoLiquidacion,
  SeveridadAdvertencia,
} from '@calculolibreperu/shared'
import { Alert } from '../../../components/ui/alert'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  CopyIcon,
  PrinterIcon,
  RotateCcwIcon,
} from '../../../components/ui/icons'
import { formatearMoneda } from '../../../lib/format'
import { anosDesde, formatearFechaCorta, formatearFechaHora } from '../form'

type PasoResultadosProps = {
  entrada: EntradaLiquidacion
  resultado: ResultadoLiquidacion
  copiado: boolean
  onCopiar: () => void
  onVolver: () => void
  onReiniciar: () => void
  onAbrirAvisoLegal: () => void
}

const variantesAdvertencia: Record<SeveridadAdvertencia, 'info' | 'warning' | 'danger'> = {
  info: 'info',
  warning: 'warning',
  danger: 'danger',
}

export function PasoResultados({
  entrada,
  resultado,
  copiado,
  onCopiar,
  onVolver,
  onReiniciar,
  onAbrirAvisoLegal,
}: PasoResultadosProps) {
  const pensionAfp = resultado.pension.afp
  const renta = resultado.renta5ta
  const advertencias: Advertencia[] = [...resultado.advertencias]

  useEffect(() => {
    const abrirDetalles = () => {
      document.querySelectorAll<HTMLDetailsElement>('details').forEach((detalle) => {
        detalle.open = true
      })
    }

    window.addEventListener('beforeprint', abrirDetalles)
    return () => window.removeEventListener('beforeprint', abrirDetalles)
  }, [])

  function imprimir() {
    document.querySelectorAll<HTMLDetailsElement>('details').forEach((detalle) => {
      detalle.open = true
    })
    window.print()
  }

  if (anosDesde(entrada.fechaCese) > 4) {
    advertencias.unshift({
      codigo: 'prescripcion',
      titulo: 'Posible prescripción',
      mensaje:
        'El cese ocurrió hace más de 4 años. Verifica el plazo de prescripción antes de reclamar.',
      severidad: 'warning',
    })
  }

  advertencias.push({
    codigo: 'intereses',
    titulo: 'Intereses no incluidos',
    mensaje: 'Esta estimación no incluye intereses legales laborales por pago tardío.',
    severidad: 'info',
  })

  return (
    <div className="animate-fade-in space-y-8">
      <div className="hidden print:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Calculadora de Liquidación Laboral Perú
        </p>
        <h2 className="mt-1 text-xl font-semibold text-ink">Liquidación estimada</h2>
        <p className="mt-1 text-xs text-muted">
          Cese: {formatearFechaCorta(entrada.fechaCese)} · Generado: {formatearFechaHora()}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
              Total bruto
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
              {formatearMoneda(resultado.totalBruto)}
            </p>
            <p className="mt-1 text-xs text-muted">Suma de conceptos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
              Descuentos
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
              {formatearMoneda(resultado.totalDescuentos)}
            </p>
            <p className="mt-1 text-xs text-muted">Pensión y renta 5ta</p>
          </CardContent>
        </Card>

        <Card className="border-line-strong bg-surface-raised">
          <CardContent className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
              Neto estimado
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
              {formatearMoneda(resultado.neto)}
            </p>
            <p className="mt-1 text-xs text-muted">Monto referencial a recibir</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Descuentos aplicados</CardTitle>
            <CardDescription>
              Tiempo de servicio: {resultado.tiempoServicio.anios} años,{' '}
              {resultado.tiempoServicio.mesesRestantes} meses y {resultado.tiempoServicio.dias}{' '}
              días.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted">Pensión {pensionAfp ? 'AFP' : 'ONP'}</span>
              <span className="font-medium text-ink">
                {formatearMoneda(resultado.pension.total)}
              </span>
            </div>

            {pensionAfp ? (
              <div className="space-y-2 rounded-md border border-line bg-surface-sunken p-3 text-xs text-muted">
                <div className="flex justify-between gap-3">
                  <span>Fondo 10%</span>
                  <span>{formatearMoneda(pensionAfp.fondo)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Prima 1.37%</span>
                  <span>{formatearMoneda(pensionAfp.prima)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Comisión por flujo</span>
                  <span>{formatearMoneda(pensionAfp.comision)}</span>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-muted">
                Renta 5ta atribuible
                {renta.estimado ? <Badge variant="outline">Estimada</Badge> : null}
              </span>
              <span className="font-medium text-ink">
                {formatearMoneda(renta.atribuibleLiquidacion)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-line pt-3 text-sm font-semibold">
              <span className="text-ink">Total descuentos</span>
              <span className="text-ink">{formatearMoneda(resultado.totalDescuentos)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advertencias</CardTitle>
            <CardDescription>Revisa estos puntos antes de usar la estimación.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {advertencias.map((advertencia) => (
              <Alert
                key={advertencia.codigo}
                variant={variantesAdvertencia[advertencia.severidad]}
                title={advertencia.titulo}
              >
                {advertencia.mensaje}
              </Alert>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desglose por concepto</CardTitle>
          <CardDescription>
            Toca cada concepto para ver la fórmula, el sustento y la afectación aplicada.
          </CardDescription>
        </CardHeader>
        <div className="border-t border-line">
          {resultado.conceptos.map((concepto) => (
            <details key={concepto.concepto} className="group border-b border-line last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{concepto.etiqueta}</p>
                  <p className="mt-0.5 text-xs text-faint">Base {formatearMoneda(concepto.base)}</p>
                </div>
                <div className="flex flex-none items-center gap-3">
                  {concepto.estado === 'provisional' ? (
                    <Badge variant="warning">Referencial</Badge>
                  ) : null}
                  <span className="font-mono text-sm font-semibold text-ink">
                    {formatearMoneda(concepto.monto)}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 text-faint transition-transform group-open:rotate-180" />
                </div>
              </summary>
              <div className="concept-detail space-y-3 px-5 pb-5 text-sm sm:px-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                    Fórmula
                  </p>
                  <p className="formula mt-1">{concepto.formula}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                    Sustento
                  </p>
                  <p className="mt-1 text-muted">{concepto.sustento}</p>
                </div>
                {concepto.detalle ? (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                      Detalle
                    </p>
                    <p className="mt-1 text-muted">{concepto.detalle}</p>
                  </div>
                ) : null}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                    Afectación
                  </p>
                  <p className="mt-1 text-muted">
                    Pensión: {concepto.afectoPension ? 'afecto' : 'inafecto'} · Renta 5ta:{' '}
                    {concepto.gravadoRenta5ta ? 'gravado' : 'inafecto'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-faint">{concepto.nota}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </Card>

      <p className="border-t border-line pt-5 text-xs leading-relaxed text-faint">
        Resultado referencial. Verifica la normativa vigente y consulta a un especialista antes de
        usarlo en una negociación o reclamo. El uso del resultado es responsabilidad exclusiva del
        usuario.
      </p>

      <div className="no-print flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={onCopiar}>
          <CopyIcon className="h-4 w-4" />
          {copiado ? 'Resumen copiado' : 'Copiar resumen'}
        </Button>
        <Button type="button" variant="secondary" onClick={imprimir}>
          <PrinterIcon className="h-4 w-4" />
          Imprimir o guardar PDF
        </Button>
        <Button type="button" variant="ghost" onClick={onVolver}>
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a editar
        </Button>
        <Button type="button" variant="ghost" onClick={onReiniciar}>
          <RotateCcwIcon className="h-4 w-4" />
          Empezar de nuevo
        </Button>
        <Button type="button" variant="ghost" onClick={onAbrirAvisoLegal}>
          Aviso legal
        </Button>
      </div>
    </div>
  )
}
