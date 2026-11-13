import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas text-ink">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-strong focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-on-strong focus:shadow-lift"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="relative z-10 flex-1">
        <div key={pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
