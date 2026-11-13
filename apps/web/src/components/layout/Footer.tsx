import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'

const producto = [
  { to: '/calculadora', texto: 'Calculadora' },
  { to: '/fuentes', texto: 'Fuentes oficiales' },
]

const legal = [
  { to: '/aviso-legal', texto: 'Aviso legal' },
  { to: '/terminos', texto: 'Términos de uso' },
  { to: '/privacidad', texto: 'Privacidad' },
]

export function Footer() {
  return (
    <footer className="footer-metal relative z-10 border-t border-line bg-surface-sunken/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Estimación referencial de liquidación laboral para el régimen general privado del Perú.
            Cada cifra muestra su base, fórmula y sustento.
          </p>
        </div>
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
            Producto
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {producto.map((enlace) => (
              <li key={enlace.to}>
                <Link className="footer-link text-muted" to={enlace.to}>
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
            Legal
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {legal.map((enlace) => (
              <li key={enlace.to}>
                <Link className="footer-link text-muted" to={enlace.to}>
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 CalculoLibrePeru. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
