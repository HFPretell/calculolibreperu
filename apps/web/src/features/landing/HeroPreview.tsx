const filas = [
  { concepto: 'CTS trunca', detalle: '2 meses, 15 días', monto: 'S/ 1,250.00' },
  { concepto: 'Gratificación', detalle: '2 meses completos + 9%', monto: 'S/ 1,090.00' },
  {
    concepto: 'Vacaciones truncas',
    detalle: 'Fracción posterior al aniversario',
    monto: 'S/ 875.00',
  },
  { concepto: 'Remuneración del mes', detalle: '15 días laborados', monto: 'S/ 1,500.00' },
]

export function HeroPreview() {
  return (
    <div className="hero-spotlight mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
      <div className="card-3d animate-fade-up fade-delay-2 rounded-panel border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
              Vista de resultado
            </p>
            <p className="mt-1.5 text-sm text-muted">Régimen general · D.Leg. 728</p>
          </div>
          <span className="rounded-md border border-line px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
            Ejemplo
          </span>
        </div>

        <div className="mt-6 space-y-2.5">
          {filas.map((fila) => (
            <div
              key={fila.concepto}
              className="flex items-center justify-between gap-4 border-b border-line pb-2.5 last:border-b-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{fila.concepto}</p>
                <p className="mt-0.5 truncate text-[11px] text-faint">{fila.detalle}</p>
              </div>
              <p className="flex-none text-sm font-medium tabular-nums text-ink">{fila.monto}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
          <span className="text-muted">Total bruto</span>
          <span className="font-medium tabular-nums text-ink">S/ 4,715.00</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-sm">
          <span className="text-muted">Descuentos AFP / ONP</span>
          <span className="tabular-nums text-muted">− S/ 685.20</span>
        </div>

        <div className="mt-5 border-t border-line pt-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Neto estimado</p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-ink">S/ 4,029.80</p>
        </div>

        <p className="mt-4 text-[11px] text-faint">
          Los montos dependen de tus datos y de la normativa vigente.
        </p>
      </div>
    </div>
  )
}
