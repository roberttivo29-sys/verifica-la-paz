// ========================================
// VERIFICA LA PAZ - JavaScript Estático v5.0
// Arquitectura: 100% Frontend (Sin Backend)
// ========================================

window.VerificaLP = window.VerificaLP || {};

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Verifica La Paz - JavaScript v5.0 (Estático) cargado correctamente');
    
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
    initMobileAccordion();
    
    // Nota: actualizarEstadisticasReales() se ha eliminado porque ya no hay API.
    // Los contadores animarán los valores que ya están en el HTML (data-target).
    
    console.log('🚀 Todos los módulos inicializados correctamente');
});

// ========================================
// FUNCIONES GLOBALES DE UTILIDAD
// ========================================
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

function getColorVariable(categoria) {
    const colors = {
        'Salud': 'var(--color-salud, #0D9488)',
        'Hogar': 'var(--color-hogar, #EA580C)',
        'Automotriz': 'var(--color-auto, #1D4ED8)',
        'Tecnologia': 'var(--color-tecnologia, #0891B2)',
        'Funeraria': 'var(--color-funeraria, #4338CA)'
    };
    return colors[categoria] || '#2563EB';
}

// ========================================
// CARGA DE PROVEEDORES DESDE JSON (NUEVO)
// ========================================
async function cargarProveedoresEnContenedor(contenedorId, categoria, palabraClave = null) {
    const container = document.getElementById(contenedorId);
    if (!container) return;
    
    try {
        const response = await fetch('data/proveedores.json');
        if (!response.ok) throw new Error('No se pudo cargar el archivo de datos');
        const proveedores = await response.json();
        
        // Filtrar por categoría
        let filtrados = proveedores.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
        
        // Si hay palabra clave, filtrar además por subcategoría, nombre o descripción
        if (palabraClave) {
            filtrados = filtrados.filter(p => {
                const textoBusqueda = `${p.subcategoria} ${p.nombre} ${p.descripcion}`.toLowerCase();
                return textoBusqueda.includes(palabraClave.toLowerCase());
            });
        }
        
        if (filtrados.length === 0) {
            container.innerHTML = `
                <div class="no-data fade-in visible" style="text-align:center; padding: 2rem; color: #666; grid-column: 1/-1;">
                    <i class="fas fa-info-circle" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: #cbd5e1;"></i>
                    <p>Próximamente agregaremos más proveedores de esta categoría.</p>
                </div>`;
            return;
        }
        
        container.innerHTML = filtrados.map(p => generarTarjetaProveedor(p)).join('');
        
        // Reiniciar animaciones de fade-in
        if (window.fadeObserver) {
            container.querySelectorAll('.fade-in').forEach(el => window.fadeObserver.observe(el));
        }
    } catch (error) {
        console.error(`Error cargando proveedores en ${contenedorId}:`, error);
        container.innerHTML = `
            <div class="no-data fade-in visible" style="text-align:center; padding: 2rem; color: #ef4444; grid-column: 1/-1;">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error al cargar los proveedores. <button onclick="location.reload()" class="btn btn-outline btn-sm" style="margin-top:0.5rem;">Reintentar</button></p>
            </div>`;
    }
}

function generarTarjetaProveedor(p) {
    const whatsappNum = (p.whatsapp || p.telefono || '').replace(/\D/g, '');
    const whatsappLink = whatsappNum ? `https://wa.me/591${whatsappNum}?text=${encodeURIComponent('Hola, vi tu perfil en Verifica La Paz y me interesa tu servicio')}` : '#';
    const categoriaClass = getCategoriaClass(p.categoria);
    const colorVar = getColorVariable(p.categoria);
    
    return `
        <article class="category-card ${categoriaClass} fade-in" style="position: relative; border-left: 4px solid ${colorVar};">
            ${p.destacado == 1 ? `<div class="featured-badge" style="position:absolute; top:10px; right:10px; z-index:2;"><i class="fas fa-crown"></i> DESTACADO</div>` : ''}
            <h3 style="margin-top: 0;">${p.nombre || 'Proveedor Verificado'}</h3>
            <p class="category-subtitle" style="color: ${colorVar}; font-weight: 600;">${p.subcategoria || ''}</p>
            ${p.descripcion ? `<p style="color: #475569; font-size: 0.95rem; margin-bottom: 1rem;">${p.descripcion}</p>` : ''}
            <ul class="category-services" style="list-style: none; padding: 0; margin: 0 0 1rem 0; font-size: 0.9rem; color: #64748b;">
                ${p.direccion ? `<li style="margin-bottom: 0.5rem;"><i class="fas fa-map-marker-alt" style="width: 20px; color: #ef4444;"></i> ${p.direccion}</li>` : ''}
                ${p.horario ? `<li style="margin-bottom: 0.5rem;"><i class="fas fa-clock" style="width: 20px; color: #3b82f6;"></i> ${p.horario}</li>` : ''}
                ${p.precios ? `<li style="margin-bottom: 0.5rem;"><i class="fas fa-dollar-sign" style="width: 20px; color: #10b981;"></i> ${p.precios}</li>` : ''}
            </ul>
            ${p.video_url ? `
                <div style="margin: 1rem 0; border-radius: 8px; overflow: hidden; background: #000;">
                    <iframe width="100%" height="200" src="${p.video_url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px;"></iframe>
                </div>
            ` : ''}
            ${p.audio_url ? `
                <div style="margin: 1rem 0; background: #f1f5f9; padding: 0.5rem; border-radius: 8px;">
                    <audio controls preload="metadata" style="width: 100%;">
                        <source src="${p.audio_url}" type="audio/mpeg">
                        Tu navegador no soporta audio.
                    </audio>
                </div>
            ` : ''}
            <div class="category-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                ${whatsappNum ? `<a href="${whatsappLink}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center;"><i class="fab fa-whatsapp"></i> Contactar</a>` : ''}
                ${p.telefono && !whatsappNum ? `<a href="tel:${p.telefono}" class="btn btn-outline" style="flex: 1; text-align: center; border-color: ${colorVar}; color: ${colorVar};"><i class="fas fa-phone"></i> Llamar</a>` : ''}
            </div>
        </article>
    `;
}

// ========================================
// MÓDULOS DE INICIALIZACIÓN (UI/UX)
// ========================================
function initMobileAccordion() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.featured-section, .categories-grid').forEach(el => {
            if (el.querySelector('ul') || el.querySelectorAll('.category-card').length > 2) {
                el.style.cursor = 'pointer';
                el.addEventListener('click', function() {
                    this.classList.toggle('expanded');
                });
            }
        });
    }
}

function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
        if (currentScroll > lastScroll && currentScroll > 200) header.classList.add('hidden');
        else header.classList.remove('hidden');
        lastScroll = currentScroll;
    }, { passive: true });
}

function initMenuHamburguesa() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    if (!menuToggle || !nav) return;
    
    const toggleMenu = () => {
        const isActive = nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', toggleMenu));
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) toggleMenu();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) toggleMenu();
    });
}

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
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    fadeElements.forEach(el => fadeObserver.observe(el));
    window.fadeObserver = fadeObserver;
}

function initContadoresAnimados() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target')) || 0;
                const suffix = entry.target.getAttribute('data-suffix') || '';
                animateCounter(entry.target, target, suffix);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => counterObserver.observe(el));
}

function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        element.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 2000 / 60);
}

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
                window.scrollTo({ top: target.offsetTop - headerHeight - 20, behavior: 'smooth' });
                history.pushState(null, null, href);
            }
        });
    });
}

function initHoverCards() {
    document.querySelectorAll('.category-card, .why-card, .stat-card, .testimonial-card, .destacado-card').forEach(card => {
        card.addEventListener('mouseenter', function() { this.style.zIndex = '10'; });
        card.addEventListener('mouseleave', function() { this.style.zIndex = '1'; });
    });
}

function initMobileDetection() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('mobile');
    }
}

function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
}

function initWhatsAppTracking() {
    document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('WhatsApp click:', this.href);
        });
    });
}

function initPrevencionClicksDobles() {
    document.querySelectorAll('.btn, button[type="submit"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.classList.contains('clicked') || this.disabled) { e.preventDefault(); return; }
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 1000);
        });
    });
}

function initConexionLenta() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
            document.body.classList.add('slow-connection');
        }
    }
}

function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW no registrado:', err));
        });
    }
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
    }, { passive: true });
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initBusquedaInteligente() {
    const searchInput = document.getElementById('busquedaGlobal');
    const searchResults = document.getElementById('searchResults');
    if (!searchInput || !searchResults) return;
    
    const datosBusqueda = [
        { nombre: 'Salud y Bienestar', categoria: 'salud', icono: 'fa-heartbeat', url: 'salud.html', tipo: 'Categoría' },
        { nombre: 'Mi Hogar Seguro', categoria: 'hogar', icono: 'fa-home', url: 'hogar.html', tipo: 'Categoría' },
        { nombre: 'Auto y Movilidad', categoria: 'automotriz', icono: 'fa-car', url: 'automotriz.html', tipo: 'Categoría' },
        { nombre: 'Tecnología y Reparaciones', categoria: 'tecnologia', icono: 'fa-laptop-code', url: 'tecnologia.html', tipo: 'Categoría' },
        { nombre: 'Despedida y Homenaje', categoria: 'funeraria', icono: 'fa-dove', url: 'funerarias.html', tipo: 'Categoría' },
        { nombre: 'Contacto', categoria: 'contacto', icono: 'fa-envelope', url: 'contacto.html', tipo: 'Página' }
    ];
    
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim().toLowerCase();
        if (query.length < 2) { searchResults.classList.remove('active'); searchResults.innerHTML = ''; return; }
        
        debounceTimer = setTimeout(() => {
            const resultados = datosBusqueda.filter(item => 
                item.nombre.toLowerCase().includes(query) || item.categoria.includes(query)
            ).slice(0, 8);
            
            if (resultados.length === 0) {
                searchResults.innerHTML = `<div class="search-result-item" style="cursor: default;"><i class="fas fa-search"></i><div class="search-result-info"><strong>No se encontraron resultados</strong><span>Intenta con otros términos</span></div></div>`;
            } else {
                searchResults.innerHTML = resultados.map(item => `
                    <a href="${item.url}" class="search-result-item" tabindex="0">
                        <i class="fas ${item.icono}"></i>
                        <div class="search-result-info">
                            <strong>${item.nombre.replace(new RegExp(`(${query})`, 'gi'), '<mark style="background: var(--dorado-claro); padding: 0 2px; border-radius: 2px;">$1</mark>')}</strong>
                            <span>${item.tipo}</span>
                        </div>
                    </a>
                `).join('');
            }
            searchResults.classList.add('active');
        }, 200);
    });
    
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) searchResults.classList.remove('active');
    });
}

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

function initModoOscuroSistema() {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const aplicarModoOscuro = (isDark) => {
        if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
    };
    aplicarModoOscuro(darkModeQuery.matches);
    darkModeQuery.addEventListener('change', (e) => aplicarModoOscuro(e.matches));
}

function showToast(title, message, type = 'info', duration = 5000) {
    const container = document.getElementById('toast-container') || document.getElementById('toastContainer');
    if (!container) return;
    
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Cerrar"><i class="fas fa-times"></i></button>
        <div class="toast-progress"></div>
    `;
    container.appendChild(toast);
    toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
    setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
    if (!toast || toast.classList.contains('hiding')) return;
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
}
window.showToast = showToast;

window.addEventListener('error', (e) => console.error('Error global:', e.error));
window.addEventListener('unhandledrejection', (e) => console.error('Promesa rechazada:', e.reason));

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('busquedaGlobal');
        if (searchInput) { searchInput.focus(); searchInput.select(); }
    }
});