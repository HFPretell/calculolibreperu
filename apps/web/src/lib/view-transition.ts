type DocumentoConTransicion = Document & {
  startViewTransition?: (actualizar: () => void) => unknown
}

export function conTransicionVisual(actualizar: () => void) {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    actualizar()
    return
  }

  const documento = document as DocumentoConTransicion
  const reducido = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

  if (!documento.startViewTransition || reducido) {
    actualizar()
    return
  }

  try {
    documento.startViewTransition(actualizar)
  } catch {
    actualizar()
  }
}
