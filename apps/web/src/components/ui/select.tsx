import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'
import { ChevronDownIcon } from './icons'

const base =
  'h-11 w-full appearance-none rounded-md border border-line bg-surface-sunken pl-3.5 pr-10 text-sm text-ink transition hover:border-line-strong focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger/60'

export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select className={cn(base, className)} {...props}>
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
    </div>
  )
}
