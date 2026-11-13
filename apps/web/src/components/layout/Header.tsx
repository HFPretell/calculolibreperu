import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { prefetchCalculadora } from '../../lib/prefetch-calculadora'
import { Logo } from '../brand/Logo'
import { ButtonLink } from '../ui/button'
import { ThemeToggle } from './ThemeToggle'

const enlaces = [
  { to: '/', texto: 'Inicio' },
  { to: '/fuentes', texto: 'Fuentes' },
]

function NavItem({ to, texto }: { to: string; texto: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn('nav-link pb-1 text-sm', isActive ? 'text-ink' : 'text-muted hover:text-ink')
      }
    >
      {texto}
    </NavLink>
  )
}

export function Header() {
  return (
    <header className="site-header sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-6 md:flex">
          {enlaces.map((enlace) => (
            <NavItem key={enlace.to} {...enlace} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink
            to="/calculadora"
            size="sm"
            onMouseEnter={() => {
              void prefetchCalculadora()
            }}
            onFocus={() => {
              void prefetchCalculadora()
            }}
          >
            Calcular
          </ButtonLink>
        </div>
      </div>
      <nav
        aria-label="Principal móvil"
        className="flex items-center gap-6 overflow-x-auto border-t border-line px-4 py-2 md:hidden"
      >
        {enlaces.map((enlace) => (
          <NavItem key={enlace.to} {...enlace} />
        ))}
      </nav>
    </header>
  )
}
