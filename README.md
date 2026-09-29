# Paulo César — Portafolio de Software

Portafolio personal de **Paulo César (Paulinter)**, estudiante de Ingeniería de Software. Sitio estático en español, construido con HTML, CSS y JavaScript nativo.

## Diseño e interacciones

- Identidad editorial con fondo marfil, acentos lima y tipografía Space Grotesk, DM Sans y JetBrains Mono.
- Ilustraciones creadas con SVG y CSS, sin imágenes pesadas ni bibliotecas de interfaz.
- Diseño responsivo, menú móvil con estado accesible y navegación por secciones.
- Filtros de proyectos y detalles mediante diálogos nativos: cierre con Escape y devolución del foco.
- Diferenciación entre el portafolio publicado y las prácticas que siguen en aprendizaje.
- Contacto por correo, botón para copiar la dirección y formulario con validación nativa.
- Enlace para saltar al contenido, foco visible y respeto a la preferencia de movimiento reducido.
- Metadatos de descripción y Open Graph.

## Archivos

- `index.html`: contenido y estructura semántica.
- `css/style.css`: identidad visual, ilustraciones y estilos responsivos.
- `js/main.js`: navegación, filtros, diálogos y contacto.
- Favicons y archivo de verificación de Google existentes.

## Vista local

No hay instalación ni compilación de la web. Abre `index.html` o sirve la carpeta con cualquier servidor estático.

Las fuentes se cargan desde Google Fonts; el sitio tiene fuentes de respaldo si ese servicio no está disponible. Los gráficos son locales.

## Publicación

El sitio es compatible con GitHub Pages y otros alojamientos estáticos, incluido Render. Publica la raíz del repositorio. No necesita un comando de construcción.

Para GitHub Pages, selecciona la rama que contiene el sitio y la carpeta raíz en la configuración de Pages. Los enlaces a CSS, JavaScript y favicon son relativos para admitir el subdirectorio del repositorio.

## Contacto

Destinatario: **paulo.escobar.dev@gmail.com**.

El formulario conserva la integración con **FormSubmit**. La entrega depende del servicio y de la activación del destinatario; la primera solicitud puede requerir confirmar un correo enviado por FormSubmit. El enlace de correo funciona de manera independiente.

En un alojamiento público, JavaScript configura el retorno al mismo dominio y ruta después del formulario. Como respaldo sin JavaScript, se conserva la dirección de Render existente. El botón se restablece al volver atrás con el navegador. Se incluye un campo señuelo contra bots.

## Validación del rediseño

Se verificaron filtros, contadores, diálogos, cierre con Escape, devolución del foco, menú móvil, copia del correo y validación del formulario sin enviar mensajes reales. También se revisaron anchos de 320 a 1920 px y accesibilidad automática con axe.

La auditoría automática complementa la revisión visual; no equivale a una certificación de accesibilidad.
