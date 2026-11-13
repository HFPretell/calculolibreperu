import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

const base =
  'h-11 w-full rounded-md border border-line bg-surface-sunken px-3.5 text-sm text-ink transition placeholder:text-faint hover:border-line-strong focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger/60'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(base, className)} {...props} />
}
