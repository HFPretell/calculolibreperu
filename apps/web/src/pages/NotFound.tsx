import { ButtonLink } from '../components/ui/button'
import { ArrowLeftIcon } from '../components/ui/icons'
import { PageHeader } from '../components/ui/page-header'

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col px-4 py-16 sm:px-6 lg:py-24">
      <p className="font-mono text-7xl font-semibold tracking-[-0.06em] text-faint/60">404</p>
      <PageHeader
        className="mt-4"
        eyebrow="Ruta no encontrada"
        title="Esta página no existe o cambió de lugar."
        description="Revisa la dirección o vuelve al inicio para seguir con tu cálculo."
      >
        <ButtonLink to="/" size="lg">
          <ArrowLeftIcon className="h-4 w-4" />
          Volver al inicio
        </ButtonLink>
      </PageHeader>
    </div>
  )
}
