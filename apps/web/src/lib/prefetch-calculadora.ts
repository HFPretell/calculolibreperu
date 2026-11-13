let calculadoraPromise: Promise<unknown> | null = null

export function prefetchCalculadora() {
  calculadoraPromise ??= import('../features/calculadora/CalculadoraWizard')
  return calculadoraPromise
}
