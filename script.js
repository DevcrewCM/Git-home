// TODO: implementar traducciones reales cuando tengamos los archivos JSON
// Language Switcher - básico por ahora
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('language') || 'es'; // español por defecto

    // marcar el idioma activo al cargar
    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
            // quitar active de todos
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            localStorage.setItem('language', btn.dataset.lang);

            // TODO: aquí deberíamos cargar el archivo de traducción correspondiente
            console.log('Idioma cambiado a:', btn.dataset.lang);
        });
    });
}

// Buscador - por ahora solo muestra una alerta
const initSearch = () => {
    const searchForm = document.querySelector('.search-container form');
    const searchInput = document.querySelector('.search-container input');

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();

            if (query) {
                console.log('Buscando:', query); // debug
                // TODO: conectar con backend cuando esté listo
                alert(`Buscando: ${query}`);
            }
            else {
                console.log('búsqueda vacía'); // esto no debería pasar pero por si acaso
            }
        });
    }
};

// El carrusel funciona con Bootstrap, solo agregamos algo de feedback
const initCarousel = () => {
    const carouselElement = document.querySelector('#mainCarousel');

    if (carouselElement) {
        // Bootstrap ya maneja el auto-play
        carouselElement.addEventListener('slide.bs.carousel', (e) => {
            // console.log('Slide:', e.to); // descomentado para debug si hace falta
        });
    }
};

// Animaciones al hacer scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observar todos los bloques de contenido
    document.querySelectorAll('.content-block, .feature-card').forEach(el => {
        observer.observe(el);
    });
}

// Validación del formulario de login
function initFormValidation() {
    const loginForm = document.querySelector('#loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.querySelector('#loginEmail').value;
            const password = document.querySelector('#loginPassword').value;

            // validaciones básicas
            if (!email || !password) {
                alert('Por favor, complete todos los campos');
                return;
            }

            if (!isValidEmail(email)) {
                alert('Por favor, ingrese un email válido');
                return;
            }

            console.log('Intento de login:', email); // no loguear password obviamente
            // TODO: aquí iría la llamada al backend para autenticar
            alert('Formulario enviado correctamente');
        });
    }
}

// helper para validar emails
function isValidEmail(email) {
    // regex básico para emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll suave a las secciones
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
};

// Inicializar tooltips y popovers de Bootstrap
const initBootstrapComponents = () => {
    // tooltips
    const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(tooltipTriggerEl => {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // popovers
    const popoverTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    popoverTriggerList.map(popoverTriggerEl => {
        return new bootstrap.Popover(popoverTriggerEl);
    });
};

// Efecto del navbar al hacer scroll
const initNavbarScroll = () => {
    let lastScroll = 0;
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // bajando
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // subiendo
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }

        lastScroll = currentScroll;
    });
};

// Inicializar todo cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando scripts...'); // debug

    initLanguageSwitcher();
    initSearch();
    initCarousel();
    initScrollAnimations();
    initFormValidation();
    initSmoothScroll();
    initBootstrapComponents();
    initNavbarScroll();

    console.log('✓ Todo listo');
});

// Por si acaso necesitamos exportar esto como módulo más adelante
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initLanguageSwitcher,
        initSearch,
        initCarousel,
        initScrollAnimations,
        initFormValidation,
        isValidEmail,
        initSmoothScroll,
        initBootstrapComponents,
        initNavbarScroll
    };
}
