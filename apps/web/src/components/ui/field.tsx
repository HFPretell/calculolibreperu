import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type FieldProps = ComponentProps<'div'> & {
  label: string
  htmlFor: string
  hint?: ReactNode
  error?: ReactNode
  optional?: boolean
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  optional,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)} {...props}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
        </label>
        {optional ? (
          <span className="text-[11px] uppercase tracking-[0.12em] text-faint">Opcional</span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p className="text-xs leading-relaxed text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs leading-relaxed text-faint">{hint}</p>
      ) : null}
    </div>
  )
}
