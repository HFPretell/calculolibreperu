import type { ComponentProps } from 'react'
import { Checkbox } from '../../../components/ui/checkbox'

type CheckboxCardProps = Omit<ComponentProps<'input'>, 'type'> & {
  id: string
  label: string
  description?: string
}

export function CheckboxCard({ id, label, description, ...props }: CheckboxCardProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-md border border-line bg-surface-sunken p-3.5 transition hover:border-line-strong"
    >
      <Checkbox id={id} {...props} />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs leading-relaxed text-faint">{description}</span>
        ) : null}
      </span>
    </label>
  )
}
