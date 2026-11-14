import { Link } from 'react-router-dom'
import { ButtonLink } from '../../components/ui/button'
import { prefetchCalculadora } from '../../lib/prefetch-calculadora'
import { HeroPreview } from './HeroPreview'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
        <div className="animate-fade-up">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
            Liquidación laboral · Perú
          </p>
          <h1 className="mt-5 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl lg:text-6xl">
            Calcula tu liquidación <span className="text-muted">sin exponer tu sueldo.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            CTS, gratificación, vacaciones, indemnización y descuentos. El detalle de cada cifra,
            con la tranquilidad de que tus datos no se guardan.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink
              to="/calculadora"
              size="lg"
              onMouseEnter={() => {
                void prefetchCalculadora()
              }}
              onFocus={() => {
                void prefetchCalculadora()
              }}
            >
              Calcular mi liquidación
            </ButtonLink>
            <Link
              to="/fuentes"
              className="text-sm font-medium text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
            >
              Ver fuentes oficiales
            </Link>
          </div>
          <p className="mt-8 border-t border-line pt-5 text-xs text-faint">
            Cálculo referencial · Sin cuentas · Sin historial · Fuentes oficiales
          </p>
        </div>
        <HeroPreview />
      </div>
    </section>
  )
}
