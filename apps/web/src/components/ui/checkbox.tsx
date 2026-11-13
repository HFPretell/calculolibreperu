import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

export function Checkbox({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type="checkbox"
      className={cn(
        'mt-0.5 h-4 w-4 flex-none rounded border-line bg-surface-sunken accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        className,
      )}
      {...props}
    />
  )
}
