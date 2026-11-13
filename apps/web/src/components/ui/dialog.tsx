import { useEffect, useId, useRef, type ReactNode } from 'react'
import { XIcon } from './icons'

type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function Dialog({ open, onClose, title, children, footer }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="dialog"
      onClose={onClose}
      onClick={(evento) => {
        if (evento.target === dialogRef.current) onClose()
      }}
    >
      <div className="dialog-panel">
        <div className="dialog-header">
          <h2 id={titleId} className="dialog-title">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar aviso legal"
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-raised hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="dialog-body">{children}</div>
        {footer ? <div className="dialog-footer">{footer}</div> : null}
      </div>
    </dialog>
  )
}
