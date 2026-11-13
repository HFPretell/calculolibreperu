import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Badge } from './badge'

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description?: ReactNode
  badge?: string
  children?: ReactNode
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('max-w-3xl', className)}>
      <div className="flex flex-wrap items-center gap-3">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </p>
        ) : null}
        {badge ? <Badge variant="outline">{badge}</Badge> : null}
      </div>
      <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  )
}
