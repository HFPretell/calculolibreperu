const formatoMoneda = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formatoNumero = new Intl.NumberFormat('es-PE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatearMoneda(valor: number): string {
  return formatoMoneda.format(valor)
}

export function formatearNumero(valor: number): string {
  return formatoNumero.format(valor)
}
