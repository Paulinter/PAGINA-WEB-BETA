# Paulo César · Portafolio personal

Portafolio de **Paulo César (Paulinter)**, estudiante de Ingeniería de Software. Sitio estático en español, sin compilación y preparado para GitHub Pages, Render o cualquier alojamiento estático.

## Diseño y funciones

- Identidad en tonos carbón, crema y verde; tipografía editorial y una ilustración de editor de código.
- Diseño adaptable, navegación móvil, enlace de salto al contenido, estados de foco y respeto por `prefers-reduced-motion`.
- Filtros de proyectos, detalles de prácticas con diálogo accesible y copia del correo con alternativa manual.
- Formulario nativo con validación del navegador, CAPTCHA del proveedor y campo antispam.
- Contenido disponible sin JavaScript; las funciones interactivas se habilitan cuando el script carga.
- Un proyecto con repositorio enlazado; las otras dos tarjetas se identifican como prácticas en aprendizaje.

## Archivos

- `index.html`: contenido, metadatos, proyectos y formulario.
- `css/style.css`: estilos, componentes y adaptación a pantallas pequeñas.
- `js/main.js`: menú, navegación activa, filtros, diálogo y copia de correo.
- `favicon.ico` y `favicon-512.png`: iconos originales del repositorio.
- `googleb95a28179002c101.html`: verificación original de Google, conservada.
- `.nojekyll`: publicación estática sin procesamiento de Jekyll.
- `SUBIR-A-GITHUB.txt`: instrucciones completas para CMD en Windows.

## Ver la página

Abre `index.html` con tu navegador. También puedes servirla con Live Server en VS Code o, si tienes Python, ejecutar:

```sh
python -m http.server 8000
```

Después visita http://localhost:8000. No se necesita Node.js ni instalar paquetes para publicar. El sitio mantiene fuentes de respaldo si Google Fonts no carga. Las imágenes de proyectos son ilustraciones hechas con HTML/CSS/SVG, sin solicitudes externas.

## Contacto

Se conservó `paulo.escobar.dev@gmail.com`, el correo que ya estaba configurado en el repositorio. Revisa que puedas acceder a esa cuenta antes de publicar.

El formulario envía mediante [FormSubmit](https://formsubmit.co/). Si el destinatario todavía no está activado, el primer envío genera un correo de confirmación: abre ese correo y activa el formulario. No se ha enviado ningún mensaje durante las pruebas.

El envío termina en la página de confirmación del proveedor; se eliminó la redirección fija al dominio de Render. Así funciona desde cualquier dominio sin cambiar la dirección de retorno. No se muestra un aviso de entrega basado en un parámetro de URL.

Para cambiar el destinatario, actualiza el correo en `index.html` (enlace y atributo `action`) y en `js/main.js` (botón de copiar). El envío real requiere conexión a internet y la activación del proveedor. La copia automática requiere un contexto permitido por el navegador; si se bloquea, se explica cómo copiar manualmente.

## Publicar en GitHub Pages

1. Sube los archivos a la raíz de `Paulinter/PAGINA-WEB-BETA`, rama `main`, siguiendo `SUBIR-A-GITHUB.txt`.
2. En el repositorio, entra a **Settings → Pages**.
3. En **Build and deployment → Source**, selecciona **Deploy from a branch**.
4. Elige la rama **main** y la carpeta **/(root)**; pulsa **Save**.
5. Una vez finalizada la publicación, la dirección habitual será `https://paulinter.github.io/PAGINA-WEB-BETA/` (salvo que configures un dominio personalizado).

No se incluye un flujo de despliegue que cambie tu configuración existente ni se requieren credenciales dentro del código.

Documentación: [Git para Windows](https://git-scm.com/install/windows) · [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
