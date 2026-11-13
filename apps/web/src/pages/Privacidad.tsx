import { LegalPage } from '../components/layout/LegalPage'

export function Privacidad() {
  return (
    <LegalPage
      title="Privacidad"
      description="Tus datos no se almacenan ni se destinan a fines comerciales."
      sections={[
        {
          id: 'privacidad-por-diseno',
          title: 'Privacidad desde el diseño',
          content: (
            <>
              <p>
                La presente política describe el tratamiento de los datos que introduces en
                CalculoLibrePeru. El servicio ha sido diseñado para que esa información se procese
                exclusivamente en tu dispositivo, sin almacenamiento, transmisión ni comunicación a
                terceros.
              </p>
              <p>
                <strong>No almacenamos tus datos.</strong> La información se utiliza únicamente para
                generar la estimación y se elimina al cerrar o recargar la página.
              </p>
              <ul>
                <li>No se crean cuentas, historiales ni perfiles de usuario.</li>
                <li>
                  Los datos del formulario no se transmiten a servidores propios ni de terceros.
                </li>
                <li>
                  No se venden, alquilan, ceden ni comunican a terceros para fines comerciales o
                  publicitarios.
                </li>
                <li>
                  No se emplean cookies de marketing, píxeles de seguimiento ni tecnologías de
                  retargeting.
                </li>
                <li>
                  No mostramos anuncios ni utilizamos la información para segmentación o elaboración
                  de perfiles publicitarios.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'que-datos',
          title: 'Datos que introduces',
          content: (
            <>
              <p>
                La calculadora recaba datos laborales y remunerativos necesarios para la estimación:
                fechas de ingreso y cese, tipo de contrato, motivo de cese, sueldo, asignación
                familiar, conceptos variables, gratificación, vacaciones y sistema pensionario.
              </p>
              <p>
                Dichos datos se procesan localmente en tu dispositivo. No se conservan, transmiten
                ni comunican a terceros.
              </p>
              <p>
                En entornos compartidos, cierra la pestaña al finalizar para evitar que la
                información quede visible en pantalla.
              </p>
            </>
          ),
        },
        {
          id: 'conservacion',
          title: 'Conservación y contacto',
          content: (
            <p>
              No conservamos los datos que introduces. La información se utiliza únicamente para
              generar la estimación y se elimina al cerrar o recargar la página. Para consultas,
              escríbenos a{' '}
              <a href="mailto:calculolegalperu@gmail.com">calculolegalperu@gmail.com</a>.
            </p>
          ),
        },
      ]}
    />
  )
}
