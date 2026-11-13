import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

const base =
  'min-h-24 w-full rounded-xl border border-line bg-surface-sunken px-3.5 py-3 text-sm text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.03)] transition placeholder:text-faint hover:border-line-strong focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger/60'

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(base, className)} {...props} />
}
