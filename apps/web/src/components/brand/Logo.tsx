import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('group inline-flex items-center gap-3', className)}>
      <span className="logo-mark">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.1}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 17.5 12 5l7 12.5" />
          <path d="M8.5 17.5h7" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink">
          CalculoLibrePeru
        </span>
        <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.16em] text-faint sm:block">
          Liquidación laboral · Perú
        </span>
      </span>
    </Link>
  )
}
