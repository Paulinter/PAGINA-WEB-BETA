/* ==========================================================================
   PORTAFOLIO WEB MEJORADO - JAVASCRIPT INTERACTIVO
   Developer: Paulo César (Paulinter)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. AMBIENT CURSOR GLOW EFFECT
       ---------------------------------------------------------------------- */
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    window.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    /* ----------------------------------------------------------------------
       2. NAVBAR SCROLL & MOBILE TOGGLE
       ---------------------------------------------------------------------- */
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        highlightActiveNavLink();
        handleBackToTopVisibility();
    });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (menuToggle.querySelector('i')) {
                    menuToggle.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        });
    }

    function highlightActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navItem = document.querySelector(`.nav-links a[href*="#${sectionId}"]`);

            if (navItem) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navItem.classList.add('active');
                } else {
                    navItem.classList.remove('active');
                }
            }
        });
    }

    /* ----------------------------------------------------------------------
       3. TERMINAL CLI INTERACTIVA EN HERO
       ---------------------------------------------------------------------- */
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');

    if (terminalInput && terminalBody) {
        const commands = {
            'help': 'Comandos disponibles: <span class="highlight">skills</span>, <span class="highlight">projects</span>, <span class="highlight">contact</span>, <span class="highlight">about</span>, <span class="highlight">repo</span>, <span class="highlight">sudo hire</span>, <span class="highlight">clear</span>',
            'about': 'Paulo César — Estudiante de Ingeniería de Software apasionado por Web Dev, C++ y Arduino Robótica.',
            'skills': 'Habilidades: HTML5, CSS3, JavaScript, C++, Arduino, Git & GitHub, Algoritmos & PSeInt.',
            'projects': 'Destacados: 1) GitHub Page Test, 2) Control de Sistema Arduino, 3) Simulador Algorítmico.',
            'contact': 'WhatsApp: +51 944 662 808 | Email: paulo.dev@example.com | YouTube: @paulinter0909',
            'repo': 'GitHub Oficial: https://github.com/Paulinter',
            'sudo hire': '🚀 ¡Acceso concedido! Paulo está listo para colaborar en tus proyectos.',
            'clear': 'CLEAR'
        };

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const rawCmd = terminalInput.value.trim();
                const cmd = rawCmd.toLowerCase();
                terminalInput.value = '';

                // Add entered command line
                appendTerminalLine(`guest@paulinter:~$ ${rawCmd}`, 'terminal-prompt');

                if (cmd === 'clear') {
                    // Remove previous lines, keep welcome
                    terminalBody.querySelectorAll('.terminal-line:not(.welcome-msg)').forEach(el => el.remove());
                    return;
                }

                if (commands[cmd]) {
                    appendTerminalLine(commands[cmd], 'terminal-output');
                } else if (cmd !== '') {
                    appendTerminalLine(`Comando no reconocido: '${rawCmd}'. Escribe <span class="highlight">help</span> para ver la lista.`, 'terminal-output');
                }

                // Scroll terminal to bottom
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });

        function appendTerminalLine(text, className) {
            const line = document.createElement('div');
            line.className = `terminal-line ${className}`;
            line.innerHTML = text;
            terminalBody.appendChild(line);
        }
    }

    /* ----------------------------------------------------------------------
       4. SKILL PROGRESS ANIMATION ON SCROLL
       ---------------------------------------------------------------------- */
    const skillCards = document.querySelectorAll('.skill-card');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fillBar = entry.target.querySelector('.skill-progress-fill');
                if (fillBar) {
                    const level = fillBar.getAttribute('data-level') || '85%';
                    fillBar.style.width = level;
                }
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    skillCards.forEach(card => skillObserver.observe(card));

    /* ----------------------------------------------------------------------
       5. PROJECT CATEGORY FILTERING
       ---------------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    card.style.animation = 'toast-in 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ----------------------------------------------------------------------
       6. PROJECT DETAILS MODAL
       ---------------------------------------------------------------------- */
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalBodyText = document.getElementById('modal-body-text');
    const modalFeaturesList = document.getElementById('modal-features-list');
    const modalGithubLink = document.getElementById('modal-github-link');

    const projectData = {
        'github-page-test': {
            title: 'GitHub Page Test (Portafolio Web)',
            description: 'Sitio web personal y portafolio desarrollado con estándares modernos de HTML5 semántico, CSS3 modular y JS nativo. Optimizado para despliegue automatizado en GitHub Pages.',
            features: [
                'Diseño Cyberpunk Glassmorphic totalmente responsive.',
                'Terminal CLI interactiva embebida en el Hero.',
                'Filtro dinámico de proyectos y modal de detalles.',
                'Carga ultra rápida sin dependencias pesadas.'
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
        }
    };

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Ignore if user clicked directly on repo icon link
            if (e.target.closest('.project-links')) return;

            const projectId = card.getAttribute('data-id');
            const data = projectData[projectId];

            if (data && projectModal) {
                modalTitle.textContent = data.title;
                modalBodyText.textContent = data.description;
                modalGithubLink.href = data.github;

                // Render features list
                modalFeaturesList.innerHTML = '';
                data.features.forEach(feat => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${feat}`;
                    modalFeaturesList.appendChild(li);
                });

                projectModal.classList.add('active');
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            projectModal.classList.remove('active');
        });

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
            }
        });
    }

    /* ----------------------------------------------------------------------
       7. CONTACT FORM & EMAIL COPY TOAST
       ---------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const copyEmailBtn = document.getElementById('copy-email-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('¡Mensaje enviado con éxito! Te responderé pronto.');
            contactForm.reset();
        });
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const emailText = 'paulo.dev@example.com';
            navigator.clipboard.writeText(emailText).then(() => {
                showToast('📋 Correo copiado al portapapeles: paulo.dev@example.com');
            }).catch(() => {
                showToast('Email: paulo.dev@example.com');
            });
        });
    }

    function showToast(message) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    /* ----------------------------------------------------------------------
       8. BACK TO TOP BUTTON
       ---------------------------------------------------------------------- */
    const backToTopBtn = document.getElementById('back-to-top');

    function handleBackToTopVisibility() {
        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
