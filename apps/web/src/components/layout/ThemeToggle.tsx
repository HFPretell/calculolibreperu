import { useState } from 'react'
import { flushSync } from 'react-dom'
import { aplicarTema, guardarTema, temaInicial, type Theme } from '../../lib/theme'
import { conTransicionVisual } from '../../lib/view-transition'
import { MoonIcon, SunIcon } from '../ui/icons'

export function ThemeToggle() {
  const [tema, setTema] = useState<Theme>(temaInicial)
  const esOscuro = tema === 'dark'

  function alternarTema() {
    const siguiente: Theme = esOscuro ? 'light' : 'dark'

    conTransicionVisual(() => {
      aplicarTema(siguiente)
      flushSync(() => setTema(siguiente))
    })

    guardarTema(siguiente)
  }

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={esOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={esOscuro ? 'Tema claro' : 'Tema oscuro'}
      className="theme-toggle inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface-raised text-muted shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {esOscuro ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  )
}
