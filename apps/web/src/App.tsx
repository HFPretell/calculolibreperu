import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { prefetchCalculadora } from './lib/prefetch-calculadora'
import { AvisoLegal } from './pages/AvisoLegal'
import { Calculadora } from './pages/Calculadora'
import { Fuentes } from './pages/Fuentes'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Privacidad } from './pages/Privacidad'
import { Terminos } from './pages/Terminos'

type VentanaConIdle = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

export function App() {
  useEffect(() => {
    if (window.location.pathname.startsWith('/calculadora')) return

    const ventana = window as VentanaConIdle

    if (ventana.requestIdleCallback) {
      const id = ventana.requestIdleCallback(
        () => {
          void prefetchCalculadora()
        },
        { timeout: 2500 },
      )
      return () => ventana.cancelIdleCallback?.(id)
    }

    const id = window.setTimeout(() => {
      void prefetchCalculadora()
    }, 1500)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="calculadora" element={<Calculadora />} />
        <Route path="fuentes" element={<Fuentes />} />
        <Route path="aviso-legal" element={<AvisoLegal />} />
        <Route path="terminos" element={<Terminos />} />
        <Route path="privacidad" element={<Privacidad />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
