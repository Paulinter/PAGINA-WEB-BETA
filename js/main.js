/* ==========================================================================
   PORTAFOLIO WEB — PAULO CÉSAR (PAULINTER)
   Interactividad & Microinteracciones
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Efecto header al hacer scroll
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Indicador de enlace activo según sección visible
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navlinks a');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  // 3. Notificación de envío exitoso (?enviado=1 desde FormSubmit)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('enviado') === '1') {
    const form = document.querySelector('form');
    if (form) {
      const banner = document.createElement('div');
      banner.className = 'form-success-banner';
      banner.setAttribute('role', 'alert');
      banner.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>¡Gracias! Tu mensaje ha sido enviado correctamente.</span>
      `;
      form.parentNode.insertBefore(banner, form);
      // Limpiar query param de la URL sin recargar
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
  }

  // 4. Feedback en el botón al enviar formulario
  const contactForm = document.querySelector('form');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'wait';
      }
    });
  }
});