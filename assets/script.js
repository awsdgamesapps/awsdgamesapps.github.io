document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
                // Actualizar historial sin recargar
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // Resaltar enlace activo en navegación al hacer scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');

    function updateActiveLink() {
        let current = '';
        const headerHeight = (document.querySelector('header')?.offsetHeight || 0) + 40;
        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
            if (window.pageYOffset >= sectionTop - headerHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        // Si estamos al principio de la página y no hay sección activa, resaltar Home
        if (!current && window.pageYOffset < 200) {
            navLinks.forEach((link) => {
                if (link.getAttribute('href') === '#') {
                    link.classList.add('active');
                }
            });
        }
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(updateActiveLink);
    }, { passive: true });

    // Ejecutar al cargar
    updateActiveLink();

    // Animación de aparición al hacer scroll (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.app-card, .policies-container').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});