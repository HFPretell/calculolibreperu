// @vitest-environment jsdom
import './setup'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LegalNoticeDialog } from '../../apps/web/src/components/legal/LegalNoticeDialog'
import { Footer } from '../../apps/web/src/components/layout/Footer'
import { Header } from '../../apps/web/src/components/layout/Header'
import { ThemeToggle } from '../../apps/web/src/components/layout/ThemeToggle'
import { Dialog } from '../../apps/web/src/components/ui/dialog'
import { Hero } from '../../apps/web/src/features/landing/Hero'
import { Calculadora } from '../../apps/web/src/pages/Calculadora'
import { Fuentes } from '../../apps/web/src/pages/Fuentes'
import { Privacidad } from '../../apps/web/src/pages/Privacidad'
import { Terminos } from '../../apps/web/src/pages/Terminos'

describe('Header', () => {
  it('mantiene un solo CTA y no expone claims técnicos', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    const ctas = screen.getAllByRole('link', { name: 'Calcular' })
    expect(ctas).toHaveLength(1)
    expect(ctas[0]).toHaveAttribute('href', '/calculadora')
    expect(
      screen.queryByText(/100% local|sin registro|sin cookies|sin backend/i),
    ).not.toBeInTheDocument()
  })
})

describe('ThemeToggle', () => {
  it('alterna entre tema oscuro y claro y lo persiste', async () => {
    const user = userEvent.setup()

    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: 'Cambiar a tema claro' }))
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('calculolibreperu:theme')).toBe('light')
    expect(screen.getByRole('button', { name: 'Cambiar a tema oscuro' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cambiar a tema oscuro' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})

describe('Hero', () => {
  it('usa el mensaje aprobado y no promete tiempos', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /Tu liquidación/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Calcular mi liquidación/i })).toHaveAttribute(
      'href',
      '/calculadora',
    )
    expect(screen.queryByText(/menos de tres minutos|menos de 3 minutos/i)).not.toBeInTheDocument()
  })
})

describe('Footer', () => {
  it('muestra la marca y todos los derechos reservados', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    )

    expect(screen.getAllByText(/CalculoLibrePeru/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Todos los derechos reservados/)).toBeInTheDocument()
    expect(screen.queryByText(/Cálculos referenciales/i)).not.toBeInTheDocument()
  })
})

describe('Legales', () => {
  it('resume los términos sin fecha de actualización ni licencia', () => {
    render(
      <MemoryRouter>
        <Terminos />
      </MemoryRouter>,
    )

    expect(screen.getByText(/responsabilidad exclusiva del usuario/i)).toBeInTheDocument()
    expect(screen.getByText(/lucro cesante/i)).toBeInTheDocument()
    expect(screen.queryByText(/Actualizado/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/licencia/i)).not.toBeInTheDocument()
  })

  it('prioriza que no se almacenan datos ni se usan con fines comerciales', () => {
    render(
      <MemoryRouter>
        <Privacidad />
      </MemoryRouter>,
    )

    expect(screen.getByText(/No almacenamos tus datos/i)).toBeInTheDocument()
    expect(screen.getAllByText(/fines comerciales/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/No mostramos anuncios/i)).toBeInTheDocument()
    expect(screen.queryByText(/Datos técnicos/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/dirección IP/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Actualizado/i)).not.toBeInTheDocument()
  })
})

describe('Fuentes', () => {
  it('no muestra fechas internas ni el proveedor de infraestructura', () => {
    render(<Fuentes />)

    expect(screen.getByRole('heading', { name: 'Fuentes oficiales' })).toBeInTheDocument()
    expect(screen.queryByText(/Revisión nov\. 2026/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Cloudflare/i)).not.toBeInTheDocument()
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
  })
})

describe('Dialog', () => {
  it('abre y cierra según la prop open', () => {
    const onClose = vi.fn()
    const { container, rerender } = render(
      <Dialog open={false} onClose={onClose} title="Prueba">
        <p>Contenido</p>
      </Dialog>,
    )
    const dialog = container.querySelector('dialog')

    expect(dialog).not.toBeNull()
    expect(dialog?.open).toBe(false)

    rerender(
      <Dialog open onClose={onClose} title="Prueba">
        <p>Contenido</p>
      </Dialog>,
    )
    expect(dialog?.open).toBe(true)

    rerender(
      <Dialog open={false} onClose={onClose} title="Prueba">
        <p>Contenido</p>
      </Dialog>,
    )
    expect(dialog?.open).toBe(false)
  })

  it('cierra al pulsar el backdrop', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Dialog open onClose={onClose} title="Prueba">
        <p>Contenido</p>
      </Dialog>,
    )
    const dialog = container.querySelector('dialog')

    fireEvent.click(dialog as HTMLDialogElement)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('Calculadora', () => {
  it('muestra el aviso legal al entrar a la calculadora', () => {
    render(
      <MemoryRouter>
        <Calculadora />
      </MemoryRouter>,
    )

    expect(screen.getByRole('dialog', { name: 'Aviso legal' })).toBeInTheDocument()
  })
})

describe('LegalNoticeDialog', () => {
  it('se anuncia como diálogo y cierra con el botón Entendido', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LegalNoticeDialog open onClose={onClose} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('dialog', { name: 'Aviso legal' })).toBeInTheDocument()
    expect(screen.getByText(/estimación referencial/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Entendido' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('permite cerrar con el botón de la cabecera', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LegalNoticeDialog open onClose={onClose} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Cerrar aviso legal' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
