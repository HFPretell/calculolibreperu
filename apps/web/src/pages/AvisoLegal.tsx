import { Link } from 'react-router-dom'
import { LegalPage } from '../components/layout/LegalPage'

export function AvisoLegal() {
  return (
    <LegalPage
      title="Aviso legal"
      description="Qué es esta calculadora, qué no es y cómo deben interpretarse sus resultados."
      sections={[
        {
          id: 'naturaleza',
          title: 'Naturaleza del servicio',
          content: (
            <p>
              <strong>CalculoLibrePeru</strong> es una herramienta de orientación que estima
              beneficios sociales y descuentos de una liquidación laboral bajo el régimen general
              privado del Perú. Los resultados son <strong>referenciales</strong> y no constituyen
              una liquidación oficial.
            </p>
          ),
        },
        {
          id: 'no-es-asesoria',
          title: 'No es asesoría profesional',
          content: (
            <>
              <p>
                El uso de la herramienta no genera ni sustituye una relación de asesoría legal,
                contable o tributaria. Cada caso puede presentar particularidades que el formulario
                no recoge: regímenes especiales, convenios colectivos, beneficios adicionales,
                contingencias judiciales o acuerdos con el empleador.
              </p>
              <p>
                Antes de adoptar una decisión, contrasta el resultado con un profesional competente
                y con la información oficial disponible.
              </p>
            </>
          ),
        },
        {
          id: 'parametros',
          title: 'Parámetros y vigencia',
          content: (
            <>
              <p>
                La calculadora considera RMV, UIT, aportes previsionales, comisiones AFP y topes de
                la prima de seguro según la fecha de cese. Los parámetros se revisan periódicamente
                y pueden variar por actualizaciones oficiales.
              </p>
              <p>
                Si detectas una diferencia, revisa siempre la fuente primaria publicada por las
                entidades competentes. Encontrarás enlaces en{' '}
                <Link to="/fuentes">Fuentes oficiales</Link>.
              </p>
            </>
          ),
        },
        {
          id: 'datos',
          title: 'Datos y privacidad',
          content: (
            <p>
              Los datos que ingresas se utilizan únicamente para generar la estimación y no se
              conservan al cerrar o recargar la página. Para el detalle, revisa la{' '}
              <Link to="/privacidad">política de privacidad</Link>.
            </p>
          ),
        },
        {
          id: 'responsabilidad',
          title: 'Limitación de responsabilidad',
          content: (
            <>
              <p>
                El servicio se proporciona en su estado actual. No se ofrece garantía expresa ni
                implícita respecto de exactitud, integridad, actualidad, continuidad, disponibilidad
                o adecuación a una finalidad determinada.
              </p>
              <p>
                Los resultados constituyen una estimación de carácter referencial y no sustituyen la
                liquidación que corresponda practicar al empleador ni la determinación que efectúe
                la autoridad competente. La interpretación y la aplicación de los resultados quedan
                bajo responsabilidad exclusiva del usuario.
              </p>
              <p>
                CalculoLibrePeru y sus responsables no asumen responsabilidad por daños directos o
                indirectos, lucro cesante, pérdida de oportunidad, decisiones adoptadas, reclamos,
                procesos o cualquier consecuencia derivada del uso, del mal uso o de la
                imposibilidad de uso de la herramienta. La verificación previa y la decisión final
                corresponden al usuario y, en su caso, a sus asesores.
              </p>
            </>
          ),
        },
        {
          id: 'enlaces',
          title: 'Enlaces oficiales',
          content: (
            <p>
              Los enlaces externos se abren en una pestaña nueva y pertenecen a sus respectivos
              titulares. No controlamos su contenido ni su disponibilidad. Consulta la sección de{' '}
              <Link to="/fuentes">fuentes oficiales</Link> para acceder a ellas.
            </p>
          ),
        },
      ]}
    />
  )
}
