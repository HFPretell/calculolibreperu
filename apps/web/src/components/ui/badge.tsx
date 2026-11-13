import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

type BadgeVariant = 'default' | 'accent' | 'warning' | 'danger' | 'outline'

const variants: Record<BadgeVariant, string> = {
  default: 'border-line bg-surface-raised text-muted',
  accent: 'border-accent/25 bg-accent-soft text-accent',
  warning: 'border-warning/25 bg-warning-soft text-warning',
  danger: 'border-danger/25 bg-danger-soft text-danger',
  outline: 'border-line-strong bg-transparent text-muted',
}

export function Badge({
  variant = 'default',
  className,
  ...props
}: ComponentProps<'span'> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
