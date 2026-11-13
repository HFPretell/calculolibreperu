import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { AlertTriangleIcon, InfoIcon, ShieldCheckIcon } from './icons'

type AlertVariant = 'info' | 'warning' | 'danger' | 'success'

const variants: Record<AlertVariant, string> = {
  info: 'border-accent/25 bg-accent-soft text-ink',
  warning: 'border-warning/25 bg-warning-soft text-ink',
  danger: 'border-danger/25 bg-danger-soft text-ink',
  success: 'border-success/25 bg-success-soft text-ink',
}

const icons: Record<AlertVariant, ReactNode> = {
  info: <InfoIcon className="h-5 w-5 text-accent" />,
  warning: <AlertTriangleIcon className="h-5 w-5 text-warning" />,
  danger: <AlertTriangleIcon className="h-5 w-5 text-danger" />,
  success: <ShieldCheckIcon className="h-5 w-5 text-success" />,
}

export function Alert({
  variant = 'info',
  title,
  children,
  className,
  ...props
}: ComponentProps<'div'> & {
  variant?: AlertVariant
  title?: string
}) {
  return (
    <div
      role={variant === 'danger' ? 'alert' : 'status'}
      className={cn(
        'flex gap-3 rounded-lg border p-4 text-sm leading-relaxed',
        variants[variant],
        className,
      )}
      {...props}
    >
      <span className="mt-0.5 flex-none">{icons[variant]}</span>
      <div>
        {title ? <p className="font-semibold text-ink">{title}</p> : null}
        <div className={cn(title ? 'mt-1' : undefined, 'text-muted')}>{children}</div>
      </div>
    </div>
  )
}
