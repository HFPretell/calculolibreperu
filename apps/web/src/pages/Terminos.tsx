import { LegalPage } from '../components/layout/LegalPage'

const contacto = 'mailto:calculolegalperu@gmail.com'

export function Terminos() {
  return (
    <LegalPage
      title="Términos de uso"
      description="Condiciones aplicables al uso de la calculadora."
      sections={[
        {
          id: 'referencial',
          title: 'Cálculo referencial',
          content: (
            <>
              <p>
                CalculoLibrePeru ofrece una estimación de carácter referencial. Los resultados no
                constituyen una liquidación oficial ni sustituyen una asesoría legal, contable o
                tributaria.
              </p>
              <p>
                Los montos pueden variar según los parámetros vigentes, los datos introducidos y las
                circunstancias de cada caso. La verificación previa y la consulta a un profesional
                competente corresponden al usuario.
              </p>
            </>
          ),
        },
        {
          id: 'responsabilidad',
          title: 'Responsabilidad del usuario',
          content: (
            <>
              <p>
                El uso de la herramienta y de sus resultados es responsabilidad exclusiva del
                usuario. CalculoLibrePeru y sus responsables no asumen responsabilidad por daños
                directos o indirectos, lucro cesante, pérdida de oportunidad, decisiones adoptadas,
                reclamos o cualquier consecuencia derivada del uso o de la imposibilidad de uso de
                la calculadora.
              </p>
              <p>
                La interpretación de los resultados y la decisión final corresponden al usuario y,
                en su caso, a sus asesores.
              </p>
            </>
          ),
        },
        {
          id: 'datos',
          title: 'Datos y contacto',
          content: (
            <p>
              No se almacenan los datos introducidos. El cálculo se ejecuta en el navegador y la
              información se elimina al cerrar o recargar la página. Para consultas o incidencias,
              escríbenos a <a href={contacto}>calculolegalperu@gmail.com</a>.
            </p>
          ),
        },
      ]}
    />
  )
}
