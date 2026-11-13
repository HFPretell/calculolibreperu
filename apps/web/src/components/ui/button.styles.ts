import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-[-0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'button-3d border border-line-strong bg-strong text-on-strong hover:bg-ink',
  secondary:
    'button-3d-soft border border-line-strong bg-transparent text-ink hover:border-ink hover:bg-surface-raised',
  ghost: 'text-muted hover:bg-surface-raised hover:text-ink',
  danger: 'border border-danger/30 bg-danger-soft text-danger hover:bg-danger/15',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-10 px-5 text-sm',
  lg: 'h-11 px-6 text-base',
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}): string {
  return cn(base, variants[variant], sizes[size], className)
}
