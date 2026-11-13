import { normas } from '@calculolibreperu/params'
import { Alert } from '../components/ui/alert'
import { ExternalLinkIcon } from '../components/ui/icons'
import { PageHeader } from '../components/ui/page-header'

export function Fuentes() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <PageHeader
        eyebrow="Transparencia"
        title="Fuentes oficiales"
        description="Consulta siempre la normativa vigente y la información oficial antes de tomar decisiones. La calculadora aplica los parámetros según la fecha de cese; la fuente primaria manda."
      />

      <div className="mt-10 divide-y divide-line border-y border-line">
        {normas.map((norma) => (
          <a
            key={norma.url}
            href={norma.url}
            target="_blank"
            rel="noreferrer noopener"
            className="source-link group flex flex-col gap-3 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <h2 className="text-sm font-medium text-ink">{norma.nombre}</h2>
              <p className="mt-1 break-all text-xs text-faint">{norma.url}</p>
            </div>
            <span className="inline-flex flex-none items-center gap-2 text-xs font-medium text-muted transition-colors group-hover:text-ink">
              Abrir fuente oficial
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </span>
          </a>
        ))}
      </div>

      <div className="mt-8 max-w-3xl">
        <Alert variant="info" title="Verifica la fuente oficial">
          Los valores de RMV, UIT, comisiones AFP, RMA y aportes pueden cambiar. Antes de usar un
          resultado en una negociación o reclamo, contrasta la información con la fuente primaria y
          con un especialista.
        </Alert>
      </div>
    </div>
  )
}
