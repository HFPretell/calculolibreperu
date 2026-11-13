import type { ReactNode } from 'react'

type FormSectionProps = {
  title: string
  description?: ReactNode
  children: ReactNode
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
