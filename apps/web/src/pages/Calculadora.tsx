import { lazy, Suspense, useEffect, useState } from 'react'
import { LegalNoticeDialog } from '../components/legal/LegalNoticeDialog'
import { prefetchCalculadora } from '../lib/prefetch-calculadora'

const CalculadoraWizard = lazy(() =>
  import('../features/calculadora/CalculadoraWizard').then((modulo) => ({
    default: modulo.CalculadoraWizard,
  })),
)

function avisoPendiente() {
  try {
    return sessionStorage.getItem('calculolibreperu:aviso-legal') !== 'visto'
  } catch {
    return true
  }
}

function marcarAvisoVisto() {
  try {
    sessionStorage.setItem('calculolibreperu:aviso-legal', 'visto')
  } catch {
    // El aviso se sigue mostrando en la sesión actual.
  }
}

function CargandoCalculadora() {
  return (
    <div aria-busy="true" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="h-3 w-24 rounded-full bg-surface-raised" />
      <div className="mt-5 h-10 w-2/3 max-w-md rounded-lg bg-surface-raised" />
      <div className="mt-10 h-64 rounded-xl border border-line bg-surface-raised" />
      <p role="status" className="mt-6 text-sm text-muted">
        Preparando la calculadora…
      </p>
    </div>
  )
}

export function Calculadora() {
  const [avisoAbierto, setAvisoAbierto] = useState(avisoPendiente)
  const [mostrarWizard, setMostrarWizard] = useState(!avisoAbierto)

  useEffect(() => {
    if (!avisoAbierto) return

    const id = window.setTimeout(() => {
      void prefetchCalculadora()
    }, 250)

    return () => window.clearTimeout(id)
  }, [avisoAbierto])

  function cerrarAviso() {
    setAvisoAbierto(false)
    setMostrarWizard(true)
    marcarAvisoVisto()
  }

  return (
    <>
      <LegalNoticeDialog open={avisoAbierto} onClose={cerrarAviso} />
      {mostrarWizard ? (
        <Suspense fallback={<CargandoCalculadora />}>
          <CalculadoraWizard onAbrirAvisoLegal={() => setAvisoAbierto(true)} />
        </Suspense>
      ) : null}
    </>
  )
}
