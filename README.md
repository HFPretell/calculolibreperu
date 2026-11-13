# CalculoLibrePeru

> Calculadora referencial de liquidación laboral en Perú. Una experiencia directa para estimar tus conceptos pendientes sin crear una cuenta ni dejar tus datos en un historial.

[Demo](https://calculolibreperu.pages.dev) · [Repositorio](https://github.com/HFPretell/calculolibreperu) · [CI](https://github.com/HFPretell/calculolibreperu/actions/workflows/ci.yml)

[![CI](https://github.com/HFPretell/calculolibreperu/actions/workflows/ci.yml/badge.svg)](https://github.com/HFPretell/calculolibreperu/actions/workflows/ci.yml)

## Qué es

CalculoLibrePeru estima una liquidación laboral referencial: CTS, gratificación, vacaciones, indemnización, remuneración del mes de cese y descuentos. El resultado se presenta con el detalle de cada concepto para que puedas revisar de dónde sale cada monto.

Es una herramienta de orientación, no una liquidación oficial. No sustituye la asesoría de un abogado, contador o especialista tributario.

## Aviso importante

Los resultados son referenciales y dependen de los datos ingresados, de los parámetros vigentes y de las circunstancias de cada caso. La interpretación de los resultados y la decisión final corresponden al usuario.

## Sobre este proyecto

Este es mi primer proyecto frontend. Lo construí para aprender React, TypeScript y despliegue de producto mientras resolvía un problema concreto: entender una liquidación laboral sin tener que entregar datos personales a una plataforma.

Usé IA como copiloto, no como piloto automático. Yo definí el alcance, las reglas de negocio, la experiencia, los criterios de aceptación y las decisiones de privacidad. La IA aceleró el trabajo repetitivo: estructura inicial, componentes, tipados, pruebas y documentación. Cada cambio pasó por revisión de diff, verificación de tipos, lint, pruebas y revisión en el navegador.

Este proyecto también fue mi espacio para aprender a supervisar a la IA: dar contexto, dividir el trabajo en pasos pequeños, exigir pruebas y no aceptar código sin entenderlo.

## Funcionalidades

- Formulario guiado en cuatro pasos.
- Cálculo de CTS, gratificación, bonificación extraordinaria, vacaciones, indemnización y remuneración del mes de cese.
- Descuentos de AFP u ONP y renta de quinta categoría.
- Resultado con totales, descuentos y desglose por concepto.
- Advertencias cuando faltan datos o hay supuestos por revisar.
- Impresión y guardado como PDF.
- Copia del resumen y reinicio del formulario.
- Tema claro y oscuro.
- Diseño adaptable a móvil y escritorio.
- Navegación por teclado y foco visible.

## Diseño y principios

- **Claridad antes que decoración.** La interfaz prioriza entender el cálculo, no impresionar.
- **Privacidad desde el diseño.** La información se usa para calcular y no se conserva.
- **Accesibilidad como parte del producto.** Contraste, foco, teclado y respeto a las preferencias de movimiento.
- **Consistencia visual.** Un sistema de componentes, espaciado y tipografía mantenido en toda la experiencia.
- **Rendimiento percibido.** La calculadora se carga cuando se necesita y el sitio evita distracciones innecesarias.
- **Mantenibilidad.** Componentes pequeños, responsabilidades claras y pruebas como red de seguridad.

## Privacidad

La información que ingresas se usa solo para generar la estimación y no se conserva. No hay cuentas, historial ni perfiles.

- No se usan cookies de marketing, píxeles de seguimiento ni anuncios.
- No se venden, alquilan ni comparten datos con fines comerciales.
- No se usa la información para segmentación ni elaboración de perfiles publicitarios.
- En entornos compartidos, cierra la pestaña al terminar para evitar que la información quede visible en pantalla.

El cálculo se resuelve en tu dispositivo. Los datos del formulario no se guardan al cerrar o recargar la página.

## Accesibilidad

La experiencia busca cumplir con WCAG 2.2 AA:

- estructura semántica y jerarquía de encabezados;
- navegación completa por teclado;
- foco visible y manejo de diálogos;
- mensajes de error comprensibles;
- contraste adecuado en tema claro y oscuro;
- respeto a `prefers-reduced-motion`.

La accesibilidad se revisa con pruebas automatizadas y revisión manual.

## Tecnologías

| Área        | Herramientas                                        |
| ----------- | --------------------------------------------------- |
| Interfaz    | React, TypeScript, Vite, Tailwind CSS, React Router |
| Formularios | React Hook Form, Zod                                |
| Cálculo     | TypeScript y precisión decimal                      |
| Pruebas     | Vitest, Playwright, axe                             |
| Calidad     | ESLint, Prettier, TypeScript                        |
| Publicación | Integración continua y despliegue automático        |

TypeScript permite tipar entradas y salidas y detectar errores antes de ejecutar. Los montos se calculan con precisión decimal para evitar errores de redondeo; las fechas se tratan con utilidades específicas para no mezclar zonas horarias.

## Calidad

El proyecto combina varias capas de verificación:

- pruebas unitarias para reglas de cálculo y validaciones;
- casos dorados para proteger resultados conocidos;
- pruebas de flujo completo en navegador;
- pruebas de accesibilidad automatizadas;
- revisión manual en escritorio y móvil;
- verificación de tipos, lint y build antes de publicar.

## Desarrollo local

Requisitos: Node.js 22.12 o superior y npm 10 o superior.

```bash
npm install
npm run dev
```

Para verificar antes de publicar:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

La primera vez que se ejecutan las pruebas de navegador:

```bash
npx playwright install chromium
```

## Cómo trabajé con IA

El flujo fue deliberadamente humano:

1. Definir el problema, el alcance y las reglas antes de pedir código.
2. Escribir criterios de aceptación verificables.
3. Trabajar en incrementos pequeños y revisar cada diff.
4. Exigir tipos, lint, pruebas y build antes de dar un cambio por terminado.
5. Revisar manualmente fórmulas, textos legales, accesibilidad y privacidad.
6. Probar el resultado en el navegador, no solo en la terminal.

La IA no decidió las fórmulas, los parámetros legales ni las reglas de privacidad. Esas decisiones se revisaron a mano. Lo que sí aceleró fue el trabajo repetitivo: estructura, componentes, tipados, pruebas y documentación.

## Aprendizajes

- React se disfruta cuando los componentes tienen una responsabilidad clara.
- TypeScript ayuda más cuando los tipos describen el dominio, no solo la forma de un objeto.
- Los formularios complejos necesitan validación y mensajes pensados desde el inicio.
- Las pruebas son lo que permite iterar rápido sin miedo a romper el cálculo.
- La accesibilidad no se agrega al final; se diseña desde la estructura.
- La privacidad también es una decisión de producto.
- La IA acelera la escritura, pero no reemplaza el criterio.

## Limitaciones

- Los resultados son referenciales y no constituyen una liquidación oficial.
- Los parámetros legales pueden cambiar y requieren revisión periódica.
- La herramienta no reemplaza la revisión de un profesional.
- La cobertura de casos y la compatibilidad entre navegadores siguen mejorando.

## Contacto

Para consultas, correcciones o comentarios: [calculolegalperu@gmail.com](mailto:calculolegalperu@gmail.com).

---

© 2026 CalculoLibrePeru. Todos los derechos reservados.
