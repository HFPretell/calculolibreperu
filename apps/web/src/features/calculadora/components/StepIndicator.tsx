import { cn } from '../../../lib/cn'
import { CheckIcon } from '../../../components/ui/icons'
import { pasos } from '../form'

export function StepIndicator({ paso }: { paso: number }) {
  return (
    <nav aria-label="Progreso del formulario" className="no-print">
      <ol className="grid grid-cols-4 gap-2">
        {pasos.map((item) => {
          const completado = item.numero < paso
          const actual = item.numero === paso

          return (
            <li key={item.numero} aria-current={actual ? 'step' : undefined} className="min-w-0">
              <div
                className={cn(
                  'card-3d flex items-center gap-2 rounded-md border px-2.5 py-2 sm:px-3',
                  actual ? 'border-accent/40 bg-accent-soft' : 'border-line bg-surface',
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 flex-none items-center justify-center rounded-full border text-[11px] font-semibold',
                    completado
                      ? 'border-success/40 bg-success-soft text-success'
                      : actual
                        ? 'border-accent/50 bg-accent text-on-accent'
                        : 'border-line-strong text-faint',
                  )}
                >
                  {completado ? <CheckIcon className="h-3.5 w-3.5" /> : item.numero}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      'block truncate text-xs font-medium sm:text-sm',
                      actual ? 'text-ink' : 'text-muted',
                    )}
                  >
                    {item.titulo}
                  </span>
                  <span className="hidden truncate text-[11px] text-faint sm:block">
                    {item.resumen}
                  </span>
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
