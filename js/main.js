/* ==========================================================================
   PORTAFOLIO WEB — PAULO CÉSAR (PAULINTER)
   JavaScript interactivo · v4.0
   Temas dinámicos, partículas, typing, reveal, terminal, playground, modales.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------------
     0. HELPERS
     ---------------------------------------------------------------------- */
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const showToast = (message, icon = 'fa-circle-check') => {
    const container = $('#toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity .3s ease, transform .3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => toast.remove(), 320);
    }, 3800);
  };

  /* ----------------------------------------------------------------------
     1. TEMA DINÁMICO (Indigo → Neon → Matrix → Sunset)
     ---------------------------------------------------------------------- */
  const THEMES = [
    { key: 'indigo', label: 'Indigo' },
    { key: 'neon', label: 'Neon' },
    { key: 'matrix', label: 'Matrix' },
    { key: 'sunset', label: 'Sunset' },
  ];
  const rootEl = document.documentElement;
  const themeBtn = $('#theme-toggle-btn');
  const themeBadge = $('#theme-name');

  const themeLabel = (key) => THEMES.find((t) => t.key === key)?.label || key;

  const applyTheme = (key, notify = false) => {
    rootEl.dataset.theme = key;
    if (themeBadge) themeBadge.textContent = themeLabel(key);
    try { localStorage.setItem('paulo-theme', key); } catch (_) {}
    if (notify) showToast(`Tema aplicado: <strong>${themeLabel(key)}</strong> 🎨`);
  };

  let currentTheme = THEMES.some((t) => t.key === (rootEl.dataset.theme || '')) ? rootEl.dataset.theme : 'indigo';
  try {
    const stored = localStorage.getItem('paulo-theme');
    if (stored && THEMES.some((t) => t.key === stored)) currentTheme = stored;
  } catch (_) {}
  applyTheme(currentTheme);

  themeBtn?.addEventListener('click', () => {
    const idx = THEMES.findIndex((t) => t.key === currentTheme);
    const next = THEMES[(idx + 1) % THEMES.length].key;
    currentTheme = next;
    applyTheme(next, true);
  });

  /* ----------------------------------------------------------------------
     2. RESPLANDOR DEL CURSOR
     ---------------------------------------------------------------------- */
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  if (!reducedMotion) {
    window.addEventListener('pointermove', (e) => {
      glow.style.translate = `${e.clientX}px ${e.clientY}px`;
    });
  }

  /* ----------------------------------------------------------------------
     3. NAVBAR: SCROLL + MENÚ MÓVIL
     ---------------------------------------------------------------------- */
  const navbar = $('.navbar');
  const menuToggle = $('#menu-toggle');
  const navLinks = $('#nav-links');

  const closeMenu = () => {
    navLinks?.classList.remove('active');
    const icon = menuToggle?.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-bars';
  };

  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
    handleBackToTopVisibility();
    highlightActiveNavLink();
  });

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });

  navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  function highlightActiveNavLink() {
    const scrollY = window.scrollY;
    $$('section[id]').forEach((section) => {
      const top = section.offsetTop - 130;
      const bottom = top + section.offsetHeight;
      const link = $(`.nav-links a[href*="#${section.id}"]`);
      if (!link) return;
      link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    });
  }

  /* ----------------------------------------------------------------------
     4. REVEAL AL HACER SCROLL
     ---------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  $$('.reveal').forEach((el) => revealObserver.observe(el));

  $$('[data-stagger]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.transitionDelay = `${Math.min(i * 70, 420)}ms`;
    });
  });

  /* ----------------------------------------------------------------------
     5. TYPING DE HERO
     ---------------------------------------------------------------------- */
  const typingEl = $('#typing-text');
  const WORDS = ['Ingeniero de Software', 'Web Developer', 'C++ & Arduino Developer', 'Frontend Freelancer'];

  if (typingEl) {
    if (reducedMotion) {
      typingEl.textContent = WORDS[0];
    } else {
      let wordIdx = 0;
      let charIdx = 0;
      let deleting = false;
      (function type() {
        const word = WORDS[wordIdx];
        if (!deleting) {
          charIdx += 1;
          typingEl.textContent = word.slice(0, charIdx);
          if (charIdx === word.length) {
            deleting = true;
            setTimeout(type, 1800);
            return;
          }
          setTimeout(type, 70);
        } else {
          charIdx -= 1;
          typingEl.textContent = word.slice(0, charIdx);
          if (charIdx === 0) {
            deleting = false;
            wordIdx = (wordIdx + 1) % WORDS.length;
          }
          setTimeout(type, 40);
        }
      })();
    }
  }

  /* ----------------------------------------------------------------------
     6. PARTÍCULAS INTERACTIVAS DEL HERO
     ---------------------------------------------------------------------- */
  const canvas = $('#hero-particles');

  if (canvas && !reducedMotion) {
    const ctx = canvas.getContext('2d');
    let W = 0;
    let H = 0;
    let particles = [];
    let rafId = 0;
    const mouse = { x: -9999, y: -9999 };
    const density = Math.min(Math.floor(window.innerWidth / 26), 80);
    const linkDist = 110;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = Math.max(rect.width, 1);
      H = canvas.height = Math.max(rect.height, 1);
    };

    const init = () => {
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: Math.random() * 1.7 + 0.8,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const color = getComputedStyle(rootEl).getPropertyValue('--primary').trim() || '#6366f1';

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        const near = Math.hypot(p.x - mouse.x, p.y - mouse.y) < 140;
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? p.r + 1.4 : p.r, 0, Math.PI * 2);
        ctx.fillStyle = near ? '#ffffff' : color;
        ctx.globalAlpha = near ? 0.95 : 0.45;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dist / linkDist) * 0.18;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => cancelAnimationFrame(rafId);

    resize();
    init();
    tick();

    window.addEventListener('resize', () => { resize(); init(); });
    window.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (!reducedMotion) tick();
    });
  }

  /* ----------------------------------------------------------------------
     7. TERMINAL CLI INTERACTIVA
     ---------------------------------------------------------------------- */
  const terminalBody = $('#terminal-body');
  const terminalInput = $('#terminal-input');

  if (terminalInput && terminalBody) {
    const commands = {
      'help': `Comandos: <span class="highlight">skills</span> · <span class="highlight">projects</span> · <span class="highlight">contact</span> · <span class="highlight">about</span> · <span class="highlight">repo</span> · <span class="highlight">theme</span> · <span class="highlight">sudo hire</span> · <span class="highlight">clear</span>`,
      'about': 'Paulo César — Estudiante de Ingeniería de Software apasionado por Web Dev, C++ y Arduino Robótica.',
      'skills': 'Habilidades: HTML5, CSS3, JavaScript, C++, Arduino, Git & GitHub, Algoritmos & PSeInt.',
      'projects': 'Proyectos destacados: Portafolio Web · Control Arduino · Simulador Algorítmico · Smart Home IoT.',
      'contact': 'WhatsApp: +51 944 662 808 | YouTube: @paulinter0909 | GitHub: /Paulinter',
      'repo': 'GitHub oficial: https://github.com/Paulinter',
      'theme': 'Usa el selector de temas en la barra superior (Indigo, Neon, Matrix, Sunset). 🎨',
      'sudo hire': '🚀 ¡Acceso concedido! Paulo está listo para colaborar en tus proyectos.',
      'clear': 'CLEAR',
    };

    const themes = { neon: 'neon', matrix: 'matrix', sunset: 'sunset', indigo: 'indigo' };

    const appendTerminalLine = (text, className) => {
      const line = document.createElement('div');
      line.className = `terminal-line ${className}`;
      line.innerHTML = text;
      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;

      const rawCmd = terminalInput.value.trim();
      const cmd = rawCmd.toLowerCase();
      terminalInput.value = '';
      appendTerminalLine(`guest@paulinter:~$ ${rawCmd}`, 'terminal-prompt');

      if (cmd === 'clear') {
        terminalBody.querySelectorAll('.terminal-line:not(.welcome-msg)').forEach((el) => el.remove());
        return;
      }

      if (cmd.startsWith('theme ')) {
        const picked = cmd.split(' ')[1];
        if (themes[picked]) {
          currentTheme = themes[picked];
          applyTheme(currentTheme, true);
          appendTerminalLine(`Tema cambiado a <span class="highlight">${themes[picked]}</span> 🎨`, 'terminal-output');
        } else {
          appendTerminalLine('Tema no válido. Opciones: indigo, neon, matrix, sunset.', 'terminal-output');
        }
        return;
      }

      if (commands[cmd]) {
        appendTerminalLine(commands[cmd], 'terminal-output');
      } else if (cmd !== '') {
        appendTerminalLine(`Comando no reconocido: '${rawCmd}'. Escribe <span class="highlight">help</span>.`, 'terminal-output');
      }
    });

    }

  /* ----------------------------------------------------------------------
     8. BARRAS DE HABILIDADES ANIMADAS
     ---------------------------------------------------------------------- */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const fillBar = entry.target.querySelector('.skill-progress-fill');
      if (fillBar) fillBar.style.width = fillBar.dataset.level || '85%';
      skillObserver.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  $$('.skill-card').forEach((card) => skillObserver.observe(card));

  /* ----------------------------------------------------------------------
     8b. CONTADORES ANIMADOS (ESTADÍSTICAS)
     ---------------------------------------------------------------------- */
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);

      const el = entry.target;
      const target = parseInt(el.dataset.target || '0', 10);

      if (reducedMotion) {
        el.textContent = `${target}+`;
        return;
      }

      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(eased * target)}+`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  $$('.counter').forEach((el) => counterObserver.observe(el));

  /* ----------------------------------------------------------------------
     9. FILTRO DE PROYECTOS
     ---------------------------------------------------------------------- */
  const projectCards = $$('.project-card');

  $$('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const show = filter === 'all' || (card.dataset.category || '').includes(filter);
        card.style.display = show ? 'flex' : 'none';
        if (show) {
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = 'fade-in-up 0.5s var(--ease) both';
        }
      });
    });
  });

  /* ----------------------------------------------------------------------
     10. MODALES (PROYECTOS + CV)
     ---------------------------------------------------------------------- */
  const projectModal = $('#project-modal');
  const cvModal = $('#cv-modal');

  let lastFocused = null;

  const openModal = (modal) => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    lastFocused?.focus?.();
  };

  const bindClose = (modal) => {
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
  };

  if (projectModal) bindClose(projectModal);
  if (cvModal) bindClose(cvModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(projectModal);
      closeModal(cvModal);
    }
  });

  const projectData = {
    'github-page-test': {
      title: 'GitHub Page Test (Portafolio Web)',
      description: 'Sitio web personal y portafolio desarrollado con estándares modernos de HTML5 semántico, CSS3 modular y JS nativo. Optimizado para despliegue automatizado en GitHub Pages.',
      features: [
        'Diseño glassmorphic responsivo con 4 temas dinámicos.',
        'Terminal CLI interactiva embebida en el Hero.',
        'Filtro dinámico de proyectos y modales de detalles.',
        'Carga ultra rápida, cero dependencias pesadas.'
      ],
      github: 'https://github.com/Paulinter/PAGINA-WEB-BETA'
    },
    'arduino-control': {
      title: 'Control de Sistema con Arduino & C++',
      description: 'Sistema interactivo robótico que combina lectura en tiempo real de sensores ultrasónicos y de temperatura con actuadores como servos y motores paso a paso.',
      features: [
        'Programación en C++ con estructura modular.',
        'Control de pantalla LCD I2C para telemetría.',
        'Optimización de interrupciones para respuesta en ms.',
        'Esquemas de circuito prototipados en Tinkercad/Proteus.'
      ],
      github: 'https://github.com/Paulinter'
    },
    'algoritmo-simulador': {
      title: 'Simulador Algorítmico & Estructuras',
      description: 'Módulo educativo interactivo diseñado para simular lógica de programación, ordenamiento de arreglos y flujo de datos utilizando diagramas y pseudocódigo PSeInt.',
      features: [
        'Visualización paso a paso de bucles y condicionales.',
        'Conversión directa de pseudocódigo a sintaxis C++.',
        'Pruebas de escritorio automatizadas.'
      ],
      github: 'https://github.com/Paulinter'
    },
    'smart-home-dashboard': {
      title: 'Smart Home IoT Dashboard',
      description: 'Prototipo de panel de control web para monitorear estados de sensores telemétricos, conmutadores digitales y telemetría en tiempo real.',
      features: [
        'Dashboard responsive basado en CSS Grid.',
        'Integración con APIs de sensores y WebSocket.',
        'Visualización de telemetría con Charts.',
        'Persistencia de historial de lecturas.'
      ],
      github: 'https://github.com/Paulinter'
    },
    'motor-logico-cpp': {
      title: 'Motor Lógico en C++ (Buscador de Rutas)',
      description: 'Implementación en C++ puro utilizando estructuras de grafos y algoritmos de búsqueda para resolver rutas óptimas en mapas modulares.',
      features: [
        'Grafos representados con listas de adyacencia.',
        'BFS, DFS y algoritmo de Dijkstra implementados.',
        'Soporte de pesos y heurísticas.',
        'Salida de rutas en consola formateada.'
      ],
      github: 'https://github.com/Paulinter'
    },
    'bot-automation': {
      title: 'Scripts de Automatización & CLI Tools',
      description: 'Colección de herramientas en línea de comandos para automatizar tareas repetitivas, parseo de datos y validaciones de código.',
      features: [
        'Scripts modulares en JavaScript/Node.js.',
        'Parseo de archivos y reportes generados.',
        'Validaciones de estructura de código.',
        'Documentación de uso por herramienta.'
      ],
      github: 'https://github.com/Paulinter'
    },
  };

  projectCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.project-links')) return;
      const data = projectData[card.dataset.id];
      if (!data || !projectModal) return;

      $('#modal-title').textContent = data.title;
      $('#modal-body-text').textContent = data.description;
      $('#modal-github-link').href = data.github;

      const list = $('#modal-features-list');
      list.innerHTML = '';
      data.features.forEach((feat) => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${feat}</span>`;
        list.appendChild(li);
      });

      openModal(projectModal);
    });
  });

  $('#cv-modal-open-btn')?.addEventListener('click', () => openModal(cvModal));

  /* ----------------------------------------------------------------------
     11. PLAYGROUND / SIMULADOR DE CÓDIGO
     ---------------------------------------------------------------------- */
  const snippets = {
    'cpp-sensor': `// Lectura de sensor ultrasónico HC-SR04 (Arduino)
int trig = 9;
int echo = 10;

void setup() {
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  long duration = pulseIn(echo, HIGH);
  float distance = (duration * 0.034) / 2;

  Serial.print("Distancia: ");
  Serial.print(distance);
  Serial.println(" cm");

  delay(400);
}`,

    'js-sort': `// Ordenamiento Burbuja visual (JavaScript)
const entrada = [64, 25, 12, 22, 11];

function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        console.log(\`Paso: [\${a.join(', ')}]\`);
      }
    }
  }
  return a;
}

const ordenado = bubbleSort(entrada);
console.log(\`Final: [\${ordenado.join(', ')}]\`);`,

    'cpp-poo': `// Clases en C++ (Programación Orientada a Objetos)
#include <iostream>
#include <string>
using namespace std;

class Auto {
private:
  string marca;
  int anio;
public:
  Auto(string m, int a) {
    marca = m;
    anio = a;
  }

  void mostrarInfo() {
    cout << "Auto: " << marca << " (" << anio << ")" << endl;
  }
};

int main() {
  Auto auto1("Tesla", 2025);
  auto1.mostrarInfo();
  return 0;
}`,
  };

  const defaultOutputs = {
    'cpp-sensor': [
      'Distancia: 28.40 cm',
      'Distancia: 29.15 cm',
      'Distancia: 27.80 cm',
      'Simulación: bucle de lectura HC-SR04 ejecutado ✔',
    ],
    'js-sort': [
      'Paso: [25, 64, 12, 22, 11]',
      'Paso: [12, 22, 25, 11, 64]',
      'Final: [11, 12, 22, 25, 64]',
      'Ordenamiento completado en 10 comparaciones ✔',
    ],
    'cpp-poo': [
      'Auto: Tesla (2025)',
      'Objeto creado correctamente ✔',
      'Compilación simulada exitosa ✔',
    ],
  };

  const codeDisplay = $('#code-display');
  const codeOutput = $('#code-output');

  const highlight = (src) => {
    let out = src
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    out = out.replace(/#\w+/g, (m) => `<span class="syn-pragma">${m}</span>`);
    out = out.replace(/\/\/[^\n]*/g, (m) => `<span class="syn-comment">${m}</span>`);
    out = out.replace(/"[^"\n]*"/g, (m) => `<span class="syn-string">${m}</span>`);
    out = out.replace(/\b(?:include|using|namespace|class|public|private|void|int|string|float|long|return|for|if|else|new|const|let|console|function|log|cout|endl|std)\b/g,
      (m) => `<span class="syn-keyword">${m}</span>`);
    return out;
  };

  const renderSnippet = (key) => {
    if (!snippets[key]) return;
    if (codeDisplay) codeDisplay.innerHTML = highlight(snippets[key]);
    if (codeOutput) codeOutput.textContent = `// Selecciona "Ejecutar Lógica" para simular este código…`;
    $$('.pg-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.snippet === key));
  };

  let activeSnippet = 'cpp-sensor';

  $$('.pg-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      activeSnippet = tab.dataset.snippet;
      renderSnippet(activeSnippet);
    });
  });

  $('#run-code-btn')?.addEventListener('click', () => {
    const lines = defaultOutputs[activeSnippet] || ['Simulación completada ✔'];
    const html = lines.map((l) => `<div class="out-line">› ${l}</div>`).join('');
    if (codeOutput) codeOutput.innerHTML = html;
    showToast('Lógica simulada con éxito 🎯');
  });

  renderSnippet(activeSnippet);

  /* ----------------------------------------------------------------------
     12. FORMULARIO DE CONTACTO & COPIAR CORREO
     ---------------------------------------------------------------------- */
  const contactForm = $('#contact-form');
  const copyEmailBtn = $('#copy-email-btn');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('¡Mensaje enviado con éxito! Te responderé pronto. ✉️');
    contactForm.reset();
  });

  copyEmailBtn?.addEventListener('click', () => {
    const emailText = 'paulo.escobar.dev@gmail.com';
    const done = () => showToast(`Correo copiado: <strong>${emailText}</strong> 📋`);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(emailText).then(done).catch(() => done());
    } else {
      done();
    }
  });

  /* ----------------------------------------------------------------------
     13. GENERADOR DE MENSAJE RÁPIDO WHATSAPP
     ---------------------------------------------------------------------- */
  const sendWaBtn = $('#send-wa-btn');
  const waTopic = $('#wa-topic-select');

  sendWaBtn?.addEventListener('click', () => {
    const message = waTopic?.value || 'Hola Paulo, vi tu portafolio y me gustaría proponerte una colaboración.';
    window.open(`https://wa.me/51944662808?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  /* ----------------------------------------------------------------------
     14. BOTÓN VOLVER ARRIBA
     ---------------------------------------------------------------------- */
  const backToTopBtn = $('#back-to-top');

  function handleBackToTopVisibility() {
    backToTopBtn?.classList.toggle('visible', window.scrollY > 420);
  }

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
});