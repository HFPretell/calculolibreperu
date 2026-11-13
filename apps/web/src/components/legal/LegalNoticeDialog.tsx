import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'

type LegalNoticeDialogProps = {
  open: boolean
  onClose: () => void
}

export function LegalNoticeDialog({ open, onClose }: LegalNoticeDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Aviso legal"
      footer={
        <Button type="button" onClick={onClose}>
          Entendido
        </Button>
      }
    >
      <p>
        <strong className="text-ink">CalculoLibrePeru</strong> ofrece una estimación referencial e
        informativa. No constituye una liquidación oficial ni sustituye la determinación de derechos
        que corresponda al empleador o a la autoridad competente.
      </p>
      <p>
        La herramienta no genera una relación de asesoría legal, contable o tributaria. Los
        resultados no comprenden las particularidades que el formulario no recoge y deben ser objeto
        de verificación previa.
      </p>
      <p>
        El usuario asume de manera exclusiva la responsabilidad por el uso, la interpretación y la
        aplicación de los resultados. CalculoLibrePeru no asume responsabilidad por daños, pérdidas,
        decisiones, reclamos o consecuencias derivadas del uso o de la imposibilidad de uso de la
        calculadora.
      </p>
      <p>
        Antes de adoptar una decisión, se recomienda contrastar el resultado con un profesional
        competente y con la información oficial disponible.
      </p>
      <p>
        <Link
          to="/aviso-legal"
          onClick={onClose}
          className="font-medium text-ink underline decoration-line-strong underline-offset-4"
        >
          Leer el aviso legal completo
        </Link>
      </p>
    </Dialog>
  )
}
