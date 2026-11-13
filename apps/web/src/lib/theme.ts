export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'calculolibreperu:theme'
const COLORES: Record<Theme, string> = {
  dark: '#0a0a0a',
  light: '#f5f5f5',
}

function esTema(valor: string | null | undefined): valor is Theme {
  return valor === 'light' || valor === 'dark'
}

export function temaInicial(): Theme {
  if (typeof document === 'undefined') return 'dark'

  const actual = document.documentElement.dataset.theme
  if (esTema(actual)) return actual

  try {
    const guardado = localStorage.getItem(STORAGE_KEY)
    if (esTema(guardado)) return guardado
  } catch {
    // El navegador puede bloquear el almacenamiento local.
  }

  return 'dark'
}

export function aplicarTema(tema: Theme) {
  document.documentElement.dataset.theme = tema

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = COLORES[tema]
}

export function guardarTema(tema: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, tema)
  } catch {
    // El tema sigue funcionando durante la sesión.
  }
}

export function inicializarTema() {
  const tema = temaInicial()
  aplicarTema(tema)
  return tema
}
