import type { ReactNode } from 'react'
import { PageHeader } from '../ui/page-header'

export type LegalSection = {
  id: string
  title: string
  content: ReactNode
}

type LegalPageProps = {
  eyebrow?: string
  title: string
  description: ReactNode
  sections: LegalSection[]
}

export function LegalPage({ eyebrow = 'Legal', title, description, sections }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
        <article className="prose-legal">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="legal-section scroll-mt-28">
              <h2>{section.title}</h2>
              {section.content}
            </section>
          ))}
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-card border border-line bg-surface p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
              En esta página
            </p>
            <nav aria-label="Secciones de esta página" className="mt-4 space-y-2 text-sm">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="side-link block text-muted">
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  )
}
