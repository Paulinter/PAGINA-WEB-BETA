/* Progressive enhancement: navigation, project filters, dialogs and contact. */
'use strict';
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navlinks');
const navLinks = [...nav.querySelectorAll('a')];
function closeMenu() {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menú');
}
toggle.addEventListener('click', () => {
  const opened = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(opened));
  toggle.setAttribute('aria-label', opened ? 'Cerrar menú' : 'Abrir menú');
  nav.classList.toggle('open', opened);
});
navLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!header.contains(event.target)) closeMenu();
});
const mobileQuery = window.matchMedia('(max-width: 700px)');
mobileQuery.addEventListener('change', closeMenu);
function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 16);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
  );
  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
}
const cards = [...document.querySelectorAll('.project-card')];
const filters = [...document.querySelectorAll('.filter')];
filters.forEach((filter) =>
  filter.addEventListener('click', () => {
    filters.forEach((button) => {
      const active = button === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    cards.forEach((card) => {
      const show =
        filter.dataset.filter === 'all' || card.dataset.category === filter.dataset.filter;
      card.hidden = !show;
      if (show) count++;
    });
    document.querySelector('.project-count').textContent =
      String(count).padStart(2, '0') + (count === 1 ? ' EXPLORACIÓN' : ' EXPLORACIONES');
  }),
);
const projects = {
  portfolio: {
    category: 'DESARROLLO WEB / PUBLICADO',
    title: 'Mi espacio en la web',
    description:
      'Mi portafolio personal: una forma de presentar quién soy, qué estoy aprendiendo y cómo podemos conectar.',
    details: [
      'HTML semántico, CSS responsivo y JavaScript nativo.',
      'Proyectos con filtros, detalles accesibles y navegación móvil.',
      'Contacto por correo y formulario integrado con FormSubmit.',
    ],
    repository: true,
    note: 'El código de este proyecto está disponible en mi repositorio.',
  },
  hardware: {
    category: 'C++ & ARDUINO / EN APRENDIZAJE',
    title: 'Más allá de la pantalla',
    description:
      'Un área de práctica en la que exploro cómo conectar programación y componentes físicos.',
    details: [
      'Comprender la lectura de sensores y el control de actuadores.',
      'Practicar lógica de programación con C++.',
      'Explorar conceptos de sistemas embebidos y prototipado.',
    ],
    repository: false,
    note: 'Estas son áreas de aprendizaje. Todavía no presento un producto terminado ni un repositorio público para esta práctica.',
  },
  algorithms: {
    category: 'ALGORITMOS / EN APRENDIZAJE',
    title: 'La lógica detrás de todo',
    description:
      'Ejercicios para fortalecer los fundamentos y desarrollar una manera clara de resolver problemas.',
    details: [
      'Practicar condicionales, ciclos y arreglos.',
      'Explorar estructuras de datos y programación orientada a objetos.',
      'Descomponer problemas en pasos y documentar las soluciones.',
    ],
    repository: false,
    note: 'Estas prácticas forman parte de mi formación; no se presentan como una aplicación publicada.',
  },
};
const dialog = document.querySelector('.project-dialog');
let dialogTrigger;
function showProject(key, trigger) {
  const project = projects[key];
  if (!project) return;
  document.querySelector('#dialog-category').textContent = project.category;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#dialog-note').textContent = project.note;
  const list = document.querySelector('#dialog-details');
  list.replaceChildren(
    ...project.details.map((detail) => {
      const item = document.createElement('li');
      item.textContent = detail;
      return item;
    }),
  );
  document.querySelector('#dialog-repo').hidden = !project.repository;
  dialogTrigger = trigger;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
document
  .querySelectorAll('[data-project]')
  .forEach((button) =>
    button.addEventListener('click', () => showProject(button.dataset.project, button)),
  );
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  if (
    event.target === dialog &&
    (event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom)
  )
    dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  dialogTrigger?.focus();
});
let toastTimer;
function notify(message) {
  const toast = document.querySelector('.toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4000);
}
document.querySelector('.copy-email').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('paulo.escobar.dev@gmail.com');
    notify('Correo copiado. ¡Conectemos!');
  } catch {
    notify('Puedes seleccionar el correo y copiarlo, o pulsarlo para escribirme.');
  }
});
const form = document.querySelector('.contact-form');
const submit = form.querySelector('[type="submit"]');
function resetSubmit() {
  submit.disabled = false;
  submit.removeAttribute('aria-busy');
  submit.querySelector('span').textContent = 'Enviar mensaje';
}
form.addEventListener('submit', () => {
  // Use the current public host so both GitHub Pages and Render return here.
  if (
    /^https?:$/.test(location.protocol) &&
    !['localhost', '127.0.0.1'].includes(location.hostname)
  ) {
    const returnUrl = new URL(location.pathname, location.origin);
    returnUrl.searchParams.set('enviado', '1');
    returnUrl.hash = 'contacto';
    form.elements._next.value = returnUrl.href;
  }
  submit.disabled = true;
  submit.setAttribute('aria-busy', 'true');
  submit.querySelector('span').textContent = 'Abriendo envío…';
});
window.addEventListener('pageshow', resetSubmit);
const url = new URL(location.href);
if (url.searchParams.get('enviado') === '1') {
  document.querySelector('.form-feedback').textContent =
    'Gracias por escribir. Si el servicio mostró un error, puedes contactarme directamente por correo.';
  url.searchParams.delete('enviado');
  history.replaceState({}, '', url.pathname + url.search + url.hash);
}
document.querySelector('#year').textContent = new Date().getFullYear();
