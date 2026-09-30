// ========================================
// VERIFICA LA PAZ - JavaScript Moderno v3.1
// Proyecto Final - Arquitectura Robusta
// Última actualización: Septiembre 2026
// ========================================

// Namespace global para evitar colisiones
window.VerificaLP = window.VerificaLP || {};

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Verifica La Paz - JavaScript v3.1 cargado correctamente');
    console.log('📅 Fecha: ' + new Date().toLocaleDateString('es-BO'));
    
    // Inicializar todos los módulos
    initHeader();
    initMenuHamburguesa();
    initFadeInAnimations();
    initContadoresAnimados();
    initSmoothScroll();
    initHoverCards();
    initMobileDetection();
    initLazyLoading();
    initWhatsAppTracking();
    initPrevencionClicksDobles();
    initConexionLenta();
    initServiceWorker();
    initBackToTop();
    initBusquedaInteligente();
    initPrefetchEnlaces();
    initModoOscuroSistema();
    
    console.log('🚀 Todos los módulos inicializados correctamente');
});

// ========================================
// 1. HEADER STICKY CON EFECTO INTELIGENTE
// ========================================
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Ocultar header al hacer scroll hacia abajo, mostrar al subir
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// ========================================
// 2. MENÚ HAMBURGUESA
// ========================================
function initMenuHamburguesa() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if (!menuToggle || !nav) return;
    
    menuToggle.addEventListener('click', () => {
        const isActive = nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            menuToggle.focus();
        }
    });
}

// ========================================
// 3. ANIMACIONES FADE-IN CON INTERSECTION OBSERVER
// ========================================
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => fadeObserver.observe(el));
    
    // Exponer observer globalmente para elementos dinámicos
    window.fadeObserver = fadeObserver;
}

// ========================================
// 4. CONTADOR ANIMADO MEJORADO
// ========================================
function initContadoresAnimados() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const suffix = entry.target.getAttribute('data-suffix') || '';
                animateCounter(entry.target, target, suffix);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(el => counterObserver.observe(el));
}

function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString() + suffix;
    }, stepTime);
}

// ========================================
// 5. SMOOTH SCROLL PARA ENLACES INTERNOS
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, href);
            }
        });
    });
}

// ========================================
// 6. EFECTO HOVER EN TARJETAS (Z-Index dinámico)
// ========================================
function initHoverCards() {
    const cards = document.querySelectorAll('.category-card, .why-card, .stat-card, .testimonial-card, .destacado-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// ========================================
// 7. DETECCIÓN DE DISPOSITIVO MÓVIL
// ========================================
function initMobileDetection() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile');
    }
}

// ========================================
// 8. LAZY LOADING PARA IMÁGENES, VIDEOS Y AUDIOS
// ========================================
function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    const lazyMedia = document.querySelectorAll('video[data-src], audio[data-src]');
    
    const mediaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const media = entry.target;
                if (media.dataset.src) {
                    media.src = media.dataset.src;
                    media.removeAttribute('data-src');
                }
                mediaObserver.unobserve(media);
            }
        });
    }, {
        rootMargin: '100px'
    });
    
    lazyMedia.forEach(media => mediaObserver.observe(media));
}

// ========================================
// 9. TRACKING DE CLICS EN WHATSAPP
// ========================================
function initWhatsAppTracking() {
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const href = this.href;
            const context = this.closest('.category-card, .destacado-card, .sidebar-section, .hero, .footer')?.classList[0] || 'general';
            
            console.log('WhatsApp click:', { href, context, timestamp: new Date().toISOString() });
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'Contact',
                    'event_label': context,
                    'value': 1
                });
            }
            
            try {
                const clicks = JSON.parse(localStorage.getItem('vlap_whatsapp_clicks') || '[]');
                clicks.push({
                    url: href,
                    context: context,
                    timestamp: new Date().toISOString()
                });
                if (clicks.length > 100) clicks.shift();
                localStorage.setItem('vlap_whatsapp_clicks', JSON.stringify(clicks));
            } catch (e) {
                console.warn('No se pudo guardar el click:', e);
            }
        });
    });
}

// ========================================
// 10. PREVENCIÓN DE CLICS DOBLES EN BOTONES
// ========================================
function initPrevencionClicksDobles() {
    const buttons = document.querySelectorAll('.btn, button[type="submit"]');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.classList.contains('clicked') || this.disabled) {
                e.preventDefault();
                return;
            }
            
            this.classList.add('clicked');
            
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 1000);
        });
    });
}

// ========================================
// 11. DETECCIÓN DE CONEXIÓN LENTA
// ========================================
function initConexionLenta() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        
        if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
            console.log('Conexión lenta detectada');
            document.body.classList.add('slow-connection');
            showToast('Conexión lenta', 'Algunas funciones pueden tardar más en cargar', 'warning', 6000);
        }
        
        connection.addEventListener('change', () => {
            if (connection.effectiveType === '4g' || connection.effectiveType === '3g') {
                document.body.classList.remove('slow-connection');
            }
        });
    }
}

// ========================================
// 12. SERVICE WORKER (PWA)
// ========================================
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registrado:', registration.scope);
                })
                .catch(err => {
                    console.log('Service Worker no registrado:', err);
                });
        });
    }
}

// ========================================
// 13. BOTÓN VOLVER ARRIBA
// ========================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// 14. BÚSQUEDA INTELIGENTE EN VIVO (ACTUALIZADA v3.1)
// ========================================
function initBusquedaInteligente() {
    const searchInput = document.getElementById('busquedaGlobal');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    // ============================================
    // BASE DE DATOS DE BÚSQUEDA LOCAL (v3.1)
    // Actualizada con Pintura (Hogar) y Lavado (Automotriz)
    // ============================================
    const datosBusqueda = [
        // ===== CATEGORÍAS PRINCIPALES =====
        { nombre: 'Salud y Bienestar', categoria: 'salud', icono: 'fa-heartbeat', url: 'salud.html', tipo: 'Categoría' },
        { nombre: 'Mi Hogar Seguro', categoria: 'hogar', icono: 'fa-home', url: 'hogar.html', tipo: 'Categoría' },
        { nombre: 'Auto y Movilidad', categoria: 'automotriz', icono: 'fa-car', url: 'automotriz.html', tipo: 'Categoría' },
        { nombre: 'Tecnología y Reparaciones', categoria: 'tecnologia', icono: 'fa-laptop-code', url: 'tecnologia.html', tipo: 'Categoría' },
        { nombre: 'Despedida y Homenaje', categoria: 'funeraria', icono: 'fa-dove', url: 'funerarias.html', tipo: 'Categoría' },
        
        // ===== SALUD =====
        { nombre: 'Clínicas y Postas', categoria: 'salud', icono: 'fa-hospital', url: 'salud.html#clinicas', tipo: 'Servicio' },
        { nombre: 'Veterinaria 24h', categoria: 'salud', icono: 'fa-paw', url: 'salud.html#veterinarias', tipo: 'Servicio' },
        { nombre: 'Laboratorios', categoria: 'salud', icono: 'fa-flask', url: 'salud.html#laboratorios', tipo: 'Servicio' },
        { nombre: 'Farmacias con Delivery', categoria: 'salud', icono: 'fa-pills', url: 'salud.html#farmacias', tipo: 'Servicio' },
        { nombre: 'Chequeo médico', categoria: 'salud', icono: 'fa-stethoscope', url: 'salud.html#clinicas', tipo: 'Servicio' },
        { nombre: 'Análisis de sangre', categoria: 'salud', icono: 'fa-vial', url: 'salud.html#laboratorios', tipo: 'Servicio' },
        { nombre: 'Pediatra', categoria: 'salud', icono: 'fa-baby', url: 'salud.html#clinicas', tipo: 'Servicio' },
        { nombre: 'Ginecología', categoria: 'salud', icono: 'fa-female', url: 'salud.html#clinicas', tipo: 'Servicio' },
        
        // ===== HOGAR =====
        { nombre: 'Plomero verificado', categoria: 'hogar', icono: 'fa-wrench', url: 'hogar.html#plomeria', tipo: 'Servicio' },
        { nombre: 'Fuga de agua', categoria: 'hogar', icono: 'fa-tint', url: 'hogar.html#plomeria', tipo: 'Servicio' },
        { nombre: 'Destape de cañería', categoria: 'hogar', icono: 'fa-wrench', url: 'hogar.html#plomeria', tipo: 'Servicio' },
        { nombre: 'Electricista 24h', categoria: 'hogar', icono: 'fa-bolt', url: 'hogar.html#electricidad', tipo: 'Servicio' },
        { nombre: 'Cortocircuito', categoria: 'hogar', icono: 'fa-bolt', url: 'hogar.html#electricidad', tipo: 'Servicio' },
        { nombre: 'Instalación eléctrica', categoria: 'hogar', icono: 'fa-bolt', url: 'hogar.html#electricidad', tipo: 'Servicio' },
        { nombre: 'Pintor', categoria: 'hogar', icono: 'fa-paint-roller', url: 'hogar.html#pintura', tipo: 'Servicio' },
        { nombre: 'Pintura', categoria: 'hogar', icono: 'fa-paint-roller', url: 'hogar.html#pintura', tipo: 'Servicio' },
        { nombre: 'Repintado', categoria: 'hogar', icono: 'fa-paint-roller', url: 'hogar.html#pintura', tipo: 'Servicio' },
        { nombre: 'Tratamiento de humedad', categoria: 'hogar', icono: 'fa-paint-roller', url: 'hogar.html#pintura', tipo: 'Servicio' },
        { nombre: 'Albañil', categoria: 'hogar', icono: 'fa-hammer', url: 'hogar.html#albanileria', tipo: 'Servicio' },
        { nombre: 'Grietas en pared', categoria: 'hogar', icono: 'fa-hammer', url: 'hogar.html#albanileria', tipo: 'Servicio' },
        { nombre: 'Filtración en techo', categoria: 'hogar', icono: 'fa-hammer', url: 'hogar.html#albanileria', tipo: 'Servicio' },
        { nombre: 'Carpintero', categoria: 'hogar', icono: 'fa-tools', url: 'hogar.html#otros', tipo: 'Servicio' },
        { nombre: 'Cerrajero 24h', categoria: 'hogar', icono: 'fa-key', url: 'hogar.html#otros', tipo: 'Servicio' },
        { nombre: 'Gasfitero', categoria: 'hogar', icono: 'fa-tools', url: 'hogar.html#otros', tipo: 'Servicio' },
        
        // ===== AUTOMOTRIZ =====
        { nombre: 'Talleres Mecánicos', categoria: 'automotriz', icono: 'fa-wrench', url: 'automotriz.html#talleres', tipo: 'Servicio' },
        { nombre: 'Mecánico', categoria: 'automotriz', icono: 'fa-wrench', url: 'automotriz.html#talleres', tipo: 'Servicio' },
        { nombre: 'Afinación', categoria: 'automotriz', icono: 'fa-wrench', url: 'automotriz.html#talleres', tipo: 'Servicio' },
        { nombre: 'Cambio de aceite', categoria: 'automotriz', icono: 'fa-oil-can', url: 'automotriz.html#talleres', tipo: 'Servicio' },
        { nombre: 'Frenos', categoria: 'automotriz', icono: 'fa-circle-notch', url: 'automotriz.html#frenos', tipo: 'Servicio' },
        { nombre: 'Pastillas de freno', categoria: 'automotriz', icono: 'fa-circle-notch', url: 'automotriz.html#frenos', tipo: 'Servicio' },
        { nombre: 'Muñonería', categoria: 'automotriz', icono: 'fa-sync-alt', url: 'automotriz.html#munoneria', tipo: 'Servicio' },
        { nombre: 'Alineación y balanceo', categoria: 'automotriz', icono: 'fa-sync-alt', url: 'automotriz.html#munoneria', tipo: 'Servicio' },
        { nombre: 'Chapista', categoria: 'automotriz', icono: 'fa-spray-can', url: 'automotriz.html#chapista', tipo: 'Servicio' },
        { nombre: 'Pintura de auto', categoria: 'automotriz', icono: 'fa-spray-can', url: 'automotriz.html#chapista', tipo: 'Servicio' },
        { nombre: 'Enderezado', categoria: 'automotriz', icono: 'fa-spray-can', url: 'automotriz.html#chapista', tipo: 'Servicio' },
        { nombre: 'Eléctrico automotriz', categoria: 'automotriz', icono: 'fa-bolt', url: 'automotriz.html#electrico', tipo: 'Servicio' },
        { nombre: 'Batería de auto', categoria: 'automotriz', icono: 'fa-car-battery', url: 'automotriz.html#electrico', tipo: 'Servicio' },
        { nombre: 'Alternador', categoria: 'automotriz', icono: 'fa-bolt', url: 'automotriz.html#electrico', tipo: 'Servicio' },
        { nombre: 'Electromecánico', categoria: 'automotriz', icono: 'fa-cogs', url: 'automotriz.html#electromecanico', tipo: 'Servicio' },
        { nombre: 'Scanner automotriz', categoria: 'automotriz', icono: 'fa-microchip', url: 'automotriz.html#electromecanico', tipo: 'Servicio' },
        { nombre: 'Inyección electrónica', categoria: 'automotriz', icono: 'fa-cogs', url: 'automotriz.html#electromecanico', tipo: 'Servicio' },
        { nombre: 'Grúas 24h', categoria: 'automotriz', icono: 'fa-truck-pickup', url: 'automotriz.html#gruas', tipo: 'Servicio' },
        { nombre: 'Auxilio vial', categoria: 'automotriz', icono: 'fa-truck-pickup', url: 'automotriz.html#gruas', tipo: 'Servicio' },
        { nombre: 'Lavado de auto', categoria: 'automotriz', icono: 'fa-shower', url: 'automotriz.html#lavado', tipo: 'Servicio' },
        { nombre: 'Lavado y detallado', categoria: 'automotriz', icono: 'fa-shower', url: 'automotriz.html#lavado', tipo: 'Servicio' },
        { nombre: 'Encerado de auto', categoria: 'automotriz', icono: 'fa-shower', url: 'automotriz.html#lavado', tipo: 'Servicio' },
        { nombre: 'Limpieza de motor', categoria: 'automotriz', icono: 'fa-shower', url: 'automotriz.html#lavado', tipo: 'Servicio' },
        { nombre: 'Limpieza de tapicería', categoria: 'automotriz', icono: 'fa-shower', url: 'automotriz.html#lavado', tipo: 'Servicio' },
        { nombre: 'Pulido de auto', categoria: 'automotriz', icono: 'fa-shower', url: 'automotriz.html#lavado', tipo: 'Servicio' },
        
        // ===== TECNOLOGÍA =====
        { nombre: 'Reparación de Celulares', categoria: 'tecnologia', icono: 'fa-mobile-alt', url: 'tecnologia.html#celulares', tipo: 'Servicio' },
        { nombre: 'Cambio de pantalla iPhone', categoria: 'tecnologia', icono: 'fa-mobile-alt', url: 'tecnologia.html#celulares', tipo: 'Servicio' },
        { nombre: 'Cambio de pantalla Samsung', categoria: 'tecnologia', icono: 'fa-mobile-alt', url: 'tecnologia.html#celulares', tipo: 'Servicio' },
        { nombre: 'Reparación de Laptops', categoria: 'tecnologia', icono: 'fa-laptop', url: 'tecnologia.html#pc-laptops', tipo: 'Servicio' },
        { nombre: 'Formateo de laptop', categoria: 'tecnologia', icono: 'fa-laptop', url: 'tecnologia.html#pc-laptops', tipo: 'Servicio' },
        { nombre: 'Cambio a SSD', categoria: 'tecnologia', icono: 'fa-hdd', url: 'tecnologia.html#pc-laptops', tipo: 'Servicio' },
        { nombre: 'Soporte Técnico a Domicilio', categoria: 'tecnologia', icono: 'fa-home', url: 'tecnologia.html#pc-laptops', tipo: 'Servicio' },
        { nombre: 'Instalación de Cámaras de Seguridad', categoria: 'tecnologia', icono: 'fa-video', url: 'tecnologia.html#camaras', tipo: 'Servicio' },
        { nombre: 'CCTV', categoria: 'tecnologia', icono: 'fa-video', url: 'tecnologia.html#camaras', tipo: 'Servicio' },
        { nombre: 'Instalación de WiFi', categoria: 'tecnologia', icono: 'fa-wifi', url: 'tecnologia.html#redes', tipo: 'Servicio' },
        { nombre: 'WiFi Mesh', categoria: 'tecnologia', icono: 'fa-wifi', url: 'tecnologia.html#redes', tipo: 'Servicio' },
        { nombre: 'Cableado de red', categoria: 'tecnologia', icono: 'fa-network-wired', url: 'tecnologia.html#redes', tipo: 'Servicio' },
        { nombre: 'Recuperación de datos', categoria: 'tecnologia', icono: 'fa-database', url: 'tecnologia.html#celulares', tipo: 'Servicio' },
        
        // ===== FUNERARIAS =====
        { nombre: 'Funerarias 24h', categoria: 'funeraria', icono: 'fa-dove', url: 'funerarias.html#funerarias', tipo: 'Servicio' },
        { nombre: 'Velatorio', categoria: 'funeraria', icono: 'fa-dove', url: 'funerarias.html#funerarias', tipo: 'Servicio' },
        { nombre: 'Cremación', categoria: 'funeraria', icono: 'fa-fire', url: 'funerarias.html#cremacion', tipo: 'Servicio' },
        { nombre: 'Crematorio', categoria: 'funeraria', icono: 'fa-fire', url: 'funerarias.html#cremacion', tipo: 'Servicio' },
        { nombre: 'Corona fúnebre', categoria: 'funeraria', icono: 'fa-spa', url: 'funerarias.html#floristerias', tipo: 'Servicio' },
        { nombre: 'Floristería fúnebre', categoria: 'funeraria', icono: 'fa-spa', url: 'funerarias.html#floristerias', tipo: 'Servicio' },
        { nombre: 'Obituario', categoria: 'funeraria', icono: 'fa-newspaper', url: 'funerarias.html#floristerias', tipo: 'Servicio' },
        
        // ===== PÁGINAS =====
        { nombre: 'Contacto', categoria: 'contacto', icono: 'fa-envelope', url: 'contacto.html', tipo: 'Página' },
        { nombre: 'Inicio', categoria: 'inicio', icono: 'fa-home', url: 'index.html', tipo: 'Página' },
        { nombre: 'Soy Proveedor', categoria: 'proveedor', icono: 'fa-store', url: 'https://wa.me/59178835306?text=Hola,%20soy%20proveedor', tipo: 'Página' }
    ];
    
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }
        
        // Debounce para mejorar performance
        debounceTimer = setTimeout(() => {
            realizarBusqueda(query, datosBusqueda, searchResults);
        }, 200);
    });
    
    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
    
    // Navegación con teclado
    searchInput.addEventListener('keydown', (e) => {
        const items = searchResults.querySelectorAll('.search-result-item');
        const activeItem = searchResults.querySelector('.search-result-item:focus');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeItem && activeItem.nextElementSibling) {
                activeItem.nextElementSibling.focus();
            } else if (items.length > 0) {
                items[0].focus();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeItem && activeItem.previousElementSibling) {
                activeItem.previousElementSibling.focus();
            }
        } else if (e.key === 'Escape') {
            searchResults.classList.remove('active');
            searchInput.blur();
        }
    });
}

function realizarBusqueda(query, datos, container) {
    const resultados = datos.filter(item => 
        item.nombre.toLowerCase().includes(query) ||
        item.categoria.toLowerCase().includes(query) ||
        item.tipo.toLowerCase().includes(query)
    ).slice(0, 8);
    
    if (resultados.length === 0) {
        container.innerHTML = `
            <div class="search-result-item" style="cursor: default;">
                <i class="fas fa-search"></i>
                <div class="search-result-info">
                    <strong>No se encontraron resultados</strong>
                    <span>Intenta con otros términos</span>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = resultados.map(item => `
            <a href="${item.url}" class="search-result-item" tabindex="0">
                <i class="fas ${item.icono}"></i>
                <div class="search-result-info">
                    <strong>${resaltarCoincidencia(item.nombre, query)}</strong>
                    <span>${item.tipo} • ${item.categoria}</span>
                </div>
            </a>
        `).join('');
    }
    
    container.classList.add('active');
}

function resaltarCoincidencia(texto, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return texto.replace(regex, '<mark style="background: var(--dorado-claro); padding: 0 2px; border-radius: 2px;">$1</mark>');
}

// ========================================
// 15. PREFETCH DE ENLACES INTERNOS
// ========================================
function initPrefetchEnlaces() {
    const enlacesInternos = document.querySelectorAll('a[href^="/"]:not([target="_blank"]), a[href$=".html"]:not([target="_blank"])');
    const prefetchCache = new Set();
    
    enlacesInternos.forEach(enlace => {
        enlace.addEventListener('mouseenter', () => {
            const url = enlace.href;
            if (!prefetchCache.has(url)) {
                prefetchCache.add(url);
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = url;
                document.head.appendChild(link);
            }
        }, { passive: true });
    });
}

// ========================================
// 16. DETECCIÓN DE MODO OSCURO DEL SISTEMA
// ========================================
function initModoOscuroSistema() {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const aplicarModoOscuro = (isDark) => {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    };
    
    aplicarModoOscuro(darkModeQuery.matches);
    darkModeQuery.addEventListener('change', (e) => aplicarModoOscuro(e.matches));
}

// ========================================
// 17. SISTEMA DE NOTIFICACIONES TOAST
// ========================================
function showToast(title, message, type = 'info', duration = 5000) {
    // Soporte para ambos IDs (público y admin)
    const container = document.getElementById('toast-container') || document.getElementById('toastContainer');
    if (!container) {
        console.warn('Toast container no encontrado');
        return;
    }
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Cerrar">
            <i class="fas fa-times"></i>
        </button>
        <div class="toast-progress"></div>
    `;
    
    container.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));
    
    setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
    if (!toast || toast.classList.contains('hiding')) return;
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
}

// Exponer globalmente
window.showToast = showToast;

// ========================================
// ✅ 18. FUNCIONES COMPATIBLES CON CLOUDINARY Y LOCAL
// ========================================

// Función auxiliar para manejar rutas de multimedia (Local o Cloudinary)
function getMediaUrl(path) {
    if (!path) return '';
    // Si ya es una URL absoluta (ej. Cloudinary), devolverla tal cual
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // Si es ruta relativa local, asegurar que empiece con /
    return path.startsWith('/') ? path : '/' + path;
}

// Función robusta para cargar proveedores en contenedores genéricos
async function cargarProveedoresEnContenedor(contenedorId, categoria, subcategoria = null) {
    const container = document.getElementById(contenedorId);
    if (!container) {
        console.warn(`Contenedor ${contenedorId} no encontrado`);
        return;
    }
    
    try {
        let url = `/api/proveedores?categoria=${encodeURIComponent(categoria)}`;
        if (subcategoria) {
            url += `&subcategoria=${encodeURIComponent(subcategoria)}`;
        }
        
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' },
            cache: 'no-cache'
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const proveedores = await response.json();
        
        if (proveedores.length === 0) {
            container.innerHTML = `
                <div class="no-data fade-in visible">
                    <i class="fas fa-info-circle"></i>
                    <p>Próximamente agregaremos proveedores en esta categoría</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = proveedores.map(p => generarTarjetaProveedor(p)).join('');
        
        if (window.fadeObserver) {
            container.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
                window.fadeObserver.observe(el);
            });
        }
        
    } catch (error) {
        console.error(`Error cargando proveedores para ${contenedorId}:`, error);
        container.innerHTML = `
            <div class="no-data fade-in visible">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error al cargar los proveedores</p>
                <button onclick="cargarProveedoresEnContenedor('${contenedorId}', '${categoria}', ${subcategoria ? `'${subcategoria}'` : 'null'})" class="btn btn-outline">
                    <i class="fas fa-redo"></i> Reintentar
                </button>
            </div>
        `;
        showToast('Error de conexión', 'No se pudieron cargar los proveedores', 'error');
    }
}

function generarTarjetaProveedor(p) {
    const whatsappNum = (p.whatsapp || p.telefono || '').replace(/\D/g, '');
    const whatsappLink = whatsappNum ? 
        `https://wa.me/591${whatsappNum}?text=${encodeURIComponent('Hola, vi tu perfil en Verifica La Paz')}` : 
        '#';
    
    // Determinar clase de categoría
    const categoriaClass = getCategoriaClass(p.categoria);
    
    return `
        <div class="category-card ${categoriaClass} fade-in">
            ${p.destacado == 1 ? `
                <div class="featured-badge" style="position:absolute; top:10px; right:10px; z-index:2;">
                    <i class="fas fa-crown"></i> PREMIUM
                </div>
            ` : ''}
            <h3>${p.nombre || 'Proveedor Verificado'}</h3>
            <p class="category-subtitle">${p.subcategoria || ''}</p>
            ${p.descripcion ? `<p>${p.descripcion}</p>` : ''}
            <ul class="category-services">
                ${p.direccion ? `<li><i class="fas fa-map-marker-alt"></i> ${p.direccion}</li>` : ''}
                ${p.telefono ? `<li><i class="fas fa-phone"></i> ${p.telefono}</li>` : ''}
                ${p.horario ? `<li><i class="fas fa-clock"></i> ${p.horario}</li>` : ''}
                ${p.precios ? `<li><i class="fas fa-dollar-sign"></i> ${p.precios}</li>` : ''}
            </ul>
            
            ✅ RUTA DE MULTIMEDIA INTELIGENTE (Compatible con Local y Cloudinary)
            ${p.video_path ? `
                <video controls preload="metadata" style="width:100%; border-radius:8px; margin:1rem 0; max-height: 200px; object-fit: cover;">
                    <source src="${getMediaUrl(p.video_path)}" type="video/mp4">
                </video>
            ` : ''}
            ${p.audio_path ? `
                <audio controls preload="metadata" style="width:100%; margin:1rem 0;">
                    <source src="${getMediaUrl(p.audio_path)}" type="audio/mpeg">
                </audio>
            ` : ''}
            
            <div class="category-actions">
                ${whatsappNum ? `
                    <a href="${whatsappLink}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-whatsapp"></i> Contactar
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

function getCategoriaClass(categoria) {
    const classes = {
        'Salud': 'category-salud',
        'Hogar': 'category-hogar',
        'Automotriz': 'category-auto',
        'Tecnologia': 'category-tecnologia',
        'Funeraria': 'category-funeraria'
    };
    return classes[categoria] || '';
}

// Exponer funciones globalmente
window.cargarProveedoresEnContenedor = cargarProveedoresEnContenedor;
window.generarTarjetaProveedor = generarTarjetaProveedor;
window.getCategoriaClass = getCategoriaClass;
window.getMediaUrl = getMediaUrl;

// ========================================
// 19. MANEJO GLOBAL DE ERRORES
// ========================================
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesa rechazada sin manejar:', e.reason);
});

// ========================================
// 20. ATAJOS DE TECLADO
// ========================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K para enfocar búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('busquedaGlobal');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
});

console.log('✅ Todos los módulos de Verifica La Paz v3.1 cargados correctamente');