// ========================================
// VERIFICA LA PAZ - JavaScript v8.2
// Arquitectura: 100% Frontend (Sin Backend)
// Actualizado: Octubre 2026
// Incluye: Búsqueda Rápida (Ctrl+K), 
// Inyección de Contacto Multicanal,
// Caché, Escape HTML, Lazy Loading.
// ========================================

window.VerificaLP = window.VerificaLP || {};

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Verifica La Paz - JavaScript v8.2 cargado correctamente');
    
    // Inicializadores Originales (Mantenidos)
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
    initBusquedaInteligente(); // Búsqueda del Hero
    initPrefetchEnlaces();
    initModoOscuroSistema();
    initMobileAccordion();
    
    // Nuevas Funcionalidades v8.2
    initQuickSearch();       // Búsqueda Rápida Ctrl+K
    initSmartContact();      // Inyección de botones flotantes
    cargarDestacados();      // Carga inicial de destacados
    
    console.log('✅ Todos los módulos inicializados correctamente');
});

// ========================================
// UTILIDADES Y SEGURIDAD
// ========================================

function normalizarTexto(texto) {
    if (!texto) return '';
    return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, "n")
        .replace(/\s+/g, " ")
        .trim();
}

function escaparHTML(valor) {
    if (valor === null || valor === undefined) return '';
    return String(valor).replace(/[&<>"']/g, s => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[s]));
}

function getCategoriaClass(categoria) {
    const classes = {
        'Salud y Bienestar': 'category-salud',
        'Mantenimiento del Hogar': 'category-hogar',
        'Materiales de Construcción': 'category-construccion',
        'Talleres Automotrices': 'category-auto',
        'Tecnología y Redes': 'category-tecnologia',
        'Servicios de Despedida': 'category-funeraria',
        'Servicios para Eventos': 'category-eventos',
        'Imagen y Cuidado Personal': 'category-imagen'
    };
    return classes[categoria] || '';
}

function getColorVariable(categoria) {
    const colors = {
        'Salud y Bienestar': 'var(--color-salud, #0D9488)',
        'Mantenimiento del Hogar': 'var(--color-hogar, #EA580C)',
        'Materiales de Construcción': 'var(--color-construccion, #C2410C)',
        'Talleres Automotrices': 'var(--color-auto, #1D4ED8)',
        'Tecnología y Redes': 'var(--color-tecnologia, #0891B2)',
        'Servicios de Despedida': 'var(--color-funeraria, #4338CA)',
        'Servicios para Eventos': '#8B5CF6',
        'Imagen y Cuidado Personal': 'var(--color-imagen, #7C3AED)'
    };
    return colors[categoria] || '#2563EB';
}

function getPlanBadge(tipo_plan) {
    const badges = {
        'gratuito': '',
        'premium': '<span class="badge-nivel nivel-premium"><i class="fas fa-star"></i> Premium</span>',
        'ultra_premium': '<span class="badge-nivel nivel-ultra"><i class="fas fa-crown"></i> Ultra Premium</span>'
    };
    return badges[tipo_plan] || '';
}

// ========================================
// GESTIÓN DE DATOS (CACHÉ)
// ========================================

const cacheProveedores = { datos: null, tiempo: 0 };

async function obtenerProveedores() {
    const ahora = Date.now();
    if (cacheProveedores.datos && ahora - cacheProveedores.tiempo < 300000) {
        return cacheProveedores.datos;
    }

    try {
        const response = await fetch('data/proveedores.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error('No se pudo cargar el archivo de datos');

        const raw = await response.json();
        const lista = Array.isArray(raw) ? raw : (raw.proveedores || []);

        cacheProveedores.datos = lista.map(p =>
            Object.fromEntries(
                Object.entries(p).map(([k, v]) => [k, typeof v === 'string' ? escaparHTML(v) : v])
            )
        );
        cacheProveedores.tiempo = ahora;
        return cacheProveedores.datos;
    } catch (error) {
        console.error('Error obteniendo proveedores:', error);
        return [];
    }
}

// ========================================
// RENDERIZADO DE PROVEEDORES
// ========================================

async function cargarProveedoresEnContenedor(contenedorId, categoria, palabraClave = null) {
    const container = document.getElementById(contenedorId);
    if (!container) return;
    
    try {
        const todos = await obtenerProveedores();
        
        // Ordenar por plan (Ultra > Premium > Gratuito)
        const ordenPorPlan = { 'ultra_premium': 0, 'premium': 1, 'gratuito': 2 };
        todos.sort((a, b) => (ordenPorPlan[a.tipo_plan] || 2) - (ordenPorPlan[b.tipo_plan] || 2));
        
        const catNormal = normalizarTexto(categoria);
        let filtrados = todos.filter(p => normalizarTexto(p.categoria) === catNormal);
        
        if (palabraClave) {
            const clave = normalizarTexto(palabraClave);
            
            let porSubcategoria = filtrados.filter(p =>
                normalizarTexto(p.subcategoria).includes(clave)
            );
            
            if (porSubcategoria.length > 0) {
                filtrados = porSubcategoria;
            } else {
                filtrados = filtrados.filter(p => {
                    const textoBusqueda = normalizarTexto(`${p.subcategoria} ${p.nombre} ${p.descripcion}`);
                    return textoBusqueda.includes(clave);
                });
            }
        }
        
        if (filtrados.length === 0) {
            container.innerHTML = `
                <div class="no-data fade-in visible" style="text-align:center; padding: 2rem; color: #666; grid-column: 1/-1;">
                    <i class="fas fa-info-circle" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: #cbd5e1;"></i>
                    <p>Próximamente agregaremos más proveedores de esta sección.</p>
                    <a href="https://wa.me/59176536286?text=Hola,%20estoy%20buscando%20un%20proveedor" 
                       class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener noreferrer" style="margin-top:0.5rem;">
                       <i class="fab fa-whatsapp"></i> Consultar por WhatsApp</a>
                </div>`;
            return;
        }
        
        container.innerHTML = filtrados.map(p => generarTarjetaProveedor(p)).join('');
        
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
    const planBadge = getPlanBadge(p.tipo_plan);
    
    const imagenes = [p.imagen1, p.imagen2, p.imagen3, p.imagen4].filter(img => img && img.trim() !== '');
    const totalImagenes = imagenes.length;
    const esUltraPremium = p.tipo_plan === 'ultra_premium';
    
    let htmlImagenes = '';
    if (totalImagenes === 1) {
        htmlImagenes = `<div class="galeria-proveedor galeria-1"><img src="${imagenes[0]}" alt="${p.nombre}" class="img-galeria" loading="lazy"></div>`;
    } else if (totalImagenes === 2) {
        htmlImagenes = `<div class="galeria-proveedor galeria-2"><img src="${imagenes[0]}" alt="${p.nombre} 1" class="img-galeria" loading="lazy"><img src="${imagenes[1]}" alt="${p.nombre} 2" class="img-galeria" loading="lazy"></div>`;
    } else if (totalImagenes >= 3) {
        htmlImagenes = `<div class="galeria-proveedor galeria-3"><img src="${imagenes[0]}" alt="${p.nombre} 1" class="img-galeria img-principal" loading="lazy"><div class="galeria-secundarias"><img src="${imagenes[1]}" alt="${p.nombre} 2" class="img-galeria" loading="lazy"><img src="${imagenes[2]}" alt="${p.nombre} 3" class="img-galeria" loading="lazy"></div></div>`;
    }
    
    let html24h = '';
    if (p['24horas']) {
        html24h = `<span class="badge-24horas"><i class="fas fa-moon"></i> Atención 24h</span><p class="aviso-24horas">⚠️ Te sugerimos llamar para confirmar disponibilidad en horarios nocturnos o festivos.</p>`;
    }
    
    // Determinar zona (La Paz o El Alto) basado en dirección
    let zonaBadge = '';
    if (p.direccion) {
        const dirLower = p.direccion.toLowerCase();
        if (dirLower.includes('el alto')) zonaBadge = '<span style="font-size:0.7rem; background:#e2e8f0; padding:2px 6px; border-radius:4px; margin-left:5px;">📍 El Alto</span>';
        else if (dirLower.includes('la paz')) zonaBadge = '<span style="font-size:0.7rem; background:#e2e8f0; padding:2px 6px; border-radius:4px; margin-left:5px;">📍 La Paz</span>';
    }

    return `
        <article class="category-card ${categoriaClass} ${esUltraPremium ? 'card-ultra-premium' : ''} fade-in" style="position: relative; border-left: 4px solid ${colorVar};">
            ${p.destacado == 1 ? '<div class="featured-badge" style="position:absolute; top:10px; right:10px; z-index:2;"><i class="fas fa-crown"></i> DESTACADO</div>' : ''}
            ${planBadge ? `<div style="position:absolute; top:10px; left:10px; z-index:2;">${planBadge}</div>` : ''}
            
            ${htmlImagenes}
            
            <div class="card-content-wrapper">
                <h3 style="margin-top: 0;">${p.nombre || 'Proveedor Verificado'} ${zonaBadge}</h3>
                <p class="category-subtitle" style="color: ${colorVar}; font-weight: 600;">${p.subcategoria || ''}</p>
                ${p.descripcion ? `<p style="color: #475569; font-size: 0.9rem; margin-bottom: 0.5rem; line-height: 1.4;">${p.descripcion}</p>` : ''}
                
                ${html24h}
                
                <ul class="category-services" style="list-style: none; padding: 0; margin: 0 0 1rem 0; font-size: 0.85rem; color: #64748b;">
                    ${p.direccion ? `<li style="margin-bottom: 0.3rem;"><i class="fas fa-map-marker-alt" style="width: 16px; color: #ef4444;"></i> ${p.direccion}</li>` : ''}
                    ${p.horario ? `<li style="margin-bottom: 0.3rem;"><i class="fas fa-clock" style="width: 16px; color: #3b82f6;"></i> ${p.horario}</li>` : ''}
                    ${p.precios ? `<li style="margin-bottom: 0.3rem;"><i class="fas fa-dollar-sign" style="width: 16px; color: #10b981;"></i> ${p.precios}</li>` : ''}
                </ul>
                
                ${p.audio_url ? `<div style="margin: 0.5rem 0;"><audio controls preload="metadata" style="width: 100%; height: 32px;"><source src="${p.audio_url}" type="audio/mpeg"></audio></div>` : ''}
                
                <div class="category-actions" style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                    ${whatsappNum ? `<a href="${whatsappLink}" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center;"><i class="fab fa-whatsapp"></i> Contactar</a>` : ''}
                    ${p.telefono && !whatsappNum ? `<a href="tel:${p.telefono}" class="btn btn-outline btn-sm" style="flex: 1; text-align: center; border-color: ${colorVar}; color: ${colorVar};"><i class="fas fa-phone"></i> Llamar</a>` : ''}
                </div>
            </div>
        </article>
    `;
}

async function cargarDestacados() {
    const container = document.getElementById('destacados-container');
    if (!container) return;
    
    try {
        const proveedores = await obtenerProveedores();
        const ordenPorPlan = { 'ultra_premium': 0, 'premium': 1, 'gratuito': 2 };
        const destacados = proveedores
            .filter(p => p.destacado === 1)
            .sort((a, b) => (ordenPorPlan[a.tipo_plan] || 2) - (ordenPorPlan[b.tipo_plan] || 2));
        
        if (destacados.length === 0) {
            container.innerHTML = `<div class="no-data fade-in visible" style="text-align:center; padding: 2rem; color: #666; grid-column: 1/-1;"><i class="fas fa-star" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: #cbd5e1;"></i><p>Próximamente agregaremos proveedores destacados.</p></div>`;
            return;
        }
        
        container.innerHTML = destacados.map(p => generarTarjetaDestacada(p)).join('');
        if (window.fadeObserver) container.querySelectorAll('.fade-in').forEach(el => window.fadeObserver.observe(el));
    } catch (error) { console.error('Error cargando destacados:', error); }
}

function generarTarjetaDestacada(p) {
    const whatsappNum = (p.whatsapp || p.telefono || '').replace(/\D/g, '');
    const whatsappLink = whatsappNum ? `https://wa.me/591${whatsappNum}?text=${encodeURIComponent('Hola, vi tu perfil destacado en Verifica La Paz')}` : '#';
    const colorVar = getColorVariable(p.categoria);
    const imagenes = [p.imagen1, p.imagen2, p.imagen3, p.imagen4].filter(img => img && img.trim() !== '');
    const totalImagenes = imagenes.length;
    
    let htmlImagen = '';
    if (totalImagenes === 1) htmlImagen = `<div class="galeria-proveedor galeria-1"><img src="${imagenes[0]}" alt="${p.nombre}" class="img-galeria" loading="lazy"></div>`;
    else if (totalImagenes === 2) htmlImagen = `<div class="galeria-proveedor galeria-2"><img src="${imagenes[0]}" alt="${p.nombre} 1" class="img-galeria" loading="lazy"><img src="${imagenes[1]}" alt="${p.nombre} 2" class="img-galeria" loading="lazy"></div>`;
    else if (totalImagenes >= 3) htmlImagen = `<div class="galeria-proveedor galeria-3"><img src="${imagenes[0]}" alt="${p.nombre} 1" class="img-galeria img-principal" loading="lazy"><div class="galeria-secundarias">${imagenes.slice(1, 4).map((img, idx) => `<img src="${img}" alt="${p.nombre} ${idx + 2}" class="img-galeria" loading="lazy">`).join('')}</div></div>`;
    
    return `
        <div class="destacado-card ${getCategoriaClass(p.categoria)} fade-in">
            <div class="destacado-badge"><i class="fas fa-crown"></i> DESTACADO</div>
            ${htmlImagen}
            <h4>${p.nombre}</h4>
            <p class="destacado-subtitle">${p.categoria} > ${p.subcategoria}</p>
            <p class="destacado-info"><i class="fas fa-map-marker-alt"></i> ${p.direccion || 'Sin dirección'}</p>
            <p class="destacado-info"><i class="fas fa-phone"></i> ${p.telefono || 'Sin teléfono'}</p>
            ${p.descripcion ? `<p style="font-size: 0.85rem; color: #64748b; margin: 0.5rem 0; line-height: 1.4;">${p.descripcion}</p>` : ''}
            <div style="margin-top: 0.75rem;">
                ${whatsappNum ? `<a href="${whatsappLink}" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener noreferrer" style="width: 100%; text-align: center;"><i class="fab fa-whatsapp"></i> Contactar</a>` : ''}
            </div>
        </div>
    `;
}

// ========================================
// INICIALIZADORES ORIGINALES
// ========================================

function initMobileAccordion() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.featured-section, .categories-grid').forEach(el => {
            if (el.querySelector('ul') || el.querySelectorAll('.category-card').length > 2) {
                el.style.cursor = 'pointer';
                el.addEventListener('click', function() { this.classList.toggle('expanded'); });
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
                if (target > 0) animateCounter(entry.target, target, suffix);
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
        btn.addEventListener('click', function() { console.log('WhatsApp click:', this.href); });
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
        { nombre: 'Mantenimiento del Hogar', categoria: 'hogar', icono: 'fa-tools', url: 'hogar.html', tipo: 'Categoría' },
        { nombre: 'Materiales de Construcción', categoria: 'construccion', icono: 'fa-cubes', url: 'construccion.html', tipo: 'Categoría' },
        { nombre: 'Talleres Automotrices', categoria: 'automotriz', icono: 'fa-car', url: 'automotriz.html', tipo: 'Categoría' },
        { nombre: 'Tecnología y Redes', categoria: 'tecnologia', icono: 'fa-laptop-code', url: 'tecnologia.html', tipo: 'Categoría' },
        { nombre: 'Servicios de Despedida', categoria: 'funeraria', icono: 'fa-dove', url: 'funerarias.html', tipo: 'Categoría' },
        { nombre: 'Servicios para Eventos', categoria: 'eventos', icono: 'fa-calendar-alt', url: 'eventos.html', tipo: 'Categoría' },
        { nombre: 'Imagen y Cuidado Personal', categoria: 'imagen', icono: 'fa-spa', url: 'imagen.html', tipo: 'Categoría' },
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

// ========================================
// NUEVAS FUNCIONALIDADES v8.2
// ========================================

// 1. Búsqueda Rápida (Ctrl + K)
function initQuickSearch() {
    // Crear modal dinámicamente
    const modalHTML = `
        <div id="quickSearchModal" class="quick-search-modal">
            <div class="quick-search-overlay"></div>
            <div class="quick-search-container">
                <div class="search-header">
                    <i class="fas fa-search"></i>
                    <input type="text" id="quickSearchInput" placeholder="Buscar servicios, categorías o proveedores..." autocomplete="off">
                    <kbd>ESC</kbd>
                </div>
                <div class="search-shortcuts">
                    <span class="shortcut-label">Atajos:</span>
                    <kbd>S</kbd> Salud <kbd>H</kbd> Hogar <kbd>A</kbd> Auto <kbd>T</kbd> Tecnología
                </div>
                <div id="quickSearchResults" class="quick-search-results"></div>
                <div class="search-footer">
                    <small><i class="fas fa-keyboard"></i> Usa <kbd>↑</kbd> <kbd>↓</kbd> para navegar, <kbd>Enter</kbd> para seleccionar</small>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('quickSearchModal');
    const input = document.getElementById('quickSearchInput');
    const resultsDiv = document.getElementById('quickSearchResults');
    const overlay = modal.querySelector('.quick-search-overlay');
    let currentIndex = -1;
    let currentResults = [];

    // Atajos de teclado
    document.addEventListener('keydown', (e) => {
        // Abrir con Ctrl/Cmd + K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openQuickSearch();
        }
        // Cerrar con ESC
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeQuickSearch();
        }
        // Navegación dentro del modal
        if (modal.classList.contains('active')) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % currentResults.length;
                updateActiveResult();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentIndex = (currentIndex - 1 + currentResults.length) % currentResults.length;
                updateActiveResult();
            } else if (e.key === 'Enter' && currentIndex >= 0) {
                e.preventDefault();
                window.location.href = currentResults[currentIndex].url;
            }
        }
        // Atajos directos de categoría (solo si no hay modal abierto y no se escribe en input)
        if (!modal.classList.contains('active') && !e.target.matches('input, textarea')) {
            const shortcuts = { 's': 'salud.html', 'h': 'hogar.html', 'a': 'automotriz.html', 't': 'tecnologia.html', 'c': 'construccion.html' };
            if (shortcuts[e.key.toLowerCase()]) window.location.href = shortcuts[e.key.toLowerCase()];
        }
    });

    overlay.addEventListener('click', closeQuickSearch);

    input.addEventListener('input', async (e) => {
        const query = e.target.value.trim().toLowerCase();
        currentIndex = -1;
        
        if (query.length < 2) { resultsDiv.innerHTML = ''; return; }
        
        // Buscar en categorías estáticas
        const categorias = [
            { nombre: 'Salud y Bienestar', url: 'salud.html', icono: 'fa-heartbeat', tipo: 'Categoría' },
            { nombre: 'Mantenimiento del Hogar', url: 'hogar.html', icono: 'fa-tools', tipo: 'Categoría' },
            { nombre: 'Talleres Automotrices', url: 'automotriz.html', icono: 'fa-car', tipo: 'Categoría' },
            { nombre: 'Tecnología y Redes', url: 'tecnologia.html', icono: 'fa-laptop-code', tipo: 'Categoría' }
        ];
        
        let resultados = categorias.filter(c => c.nombre.toLowerCase().includes(query));
        
        // Buscar en proveedores (asíncrono)
        try {
            const proveedores = await obtenerProveedores();
            const provFiltrados = proveedores.filter(p => 
                (p.nombre && p.nombre.toLowerCase().includes(query)) || 
                (p.subcategoria && p.subcategoria.toLowerCase().includes(query))
            ).slice(0, 5); // Máximo 5 proveedores
            
            provFiltrados.forEach(p => {
                resultados.push({
                    nombre: p.nombre,
                    url: getCategoryUrl(p.categoria) + (p.subcategoria ? '#' + normalizarTexto(p.subcategoria) : ''),
                    icono: 'fa-store',
                    tipo: p.categoria,
                    esProveedor: true
                });
            });
        } catch (err) { console.error('Error en búsqueda rápida:', err); }
        
        currentResults = resultados.slice(0, 8);
        renderQuickResults(currentResults, query);
    });

    function openQuickSearch() {
        modal.classList.add('active');
        input.value = '';
        input.focus();
        resultsDiv.innerHTML = '';
        currentResults = [];
        currentIndex = -1;
    }

    function closeQuickSearch() {
        modal.classList.remove('active');
        input.blur();
    }

    function renderQuickResults(results, query) {
        if (results.length === 0) {
            resultsDiv.innerHTML = `<div class="no-results" style="padding: 2rem; text-align: center; color: #64748b;"><i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i><p>No encontramos resultados para "${query}"</p></div>`;
            return;
        }
        
        resultsDiv.innerHTML = results.map((r, i) => `
            <a href="${r.url}" class="quick-result-item" data-index="${i}">
                <i class="fas ${r.icono}"></i>
                <div class="result-info">
                    <strong>${r.nombre.replace(new RegExp(`(${query})`, 'gi'), '<mark style="background: #fcd34d; padding: 0 2px; border-radius: 2px;">$1</mark>')}</strong>
                    <span>${r.tipo}</span>
                </div>
                ${r.esProveedor ? '<i class="fas fa-chevron-right" style="color: #cbd5e1;"></i>' : ''}
            </a>
        `).join('');
    }

    function updateActiveResult() {
        document.querySelectorAll('.quick-result-item').forEach((el, i) => {
            if (i === currentIndex) el.classList.add('active');
            else el.classList.remove('active');
        });
    }

    function getCategoryUrl(categoria) {
        const urls = {
            'Salud y Bienestar': 'salud.html', 'Mantenimiento del Hogar': 'hogar.html',
            'Talleres Automotrices': 'automotriz.html', 'Tecnología y Redes': 'tecnologia.html',
            'Materiales de Construcción': 'construccion.html', 'Servicios de Despedida': 'funerarias.html',
            'Servicios para Eventos': 'eventos.html', 'Imagen y Cuidado Personal': 'imagen.html'
        };
        return urls[categoria] || 'index.html';
    }
}

// 2. Inyección de Contacto Multicanal Inteligente
function initSmartContact() {
    if (document.getElementById('smart-contact-container')) return;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const whatsappNum = '59176536286';
    const telegramUrl = 'https://t.me/verificalapaz';
    const email = 'contactoverificalapaz@gmail.com';
    
    const container = document.createElement('div');
    container.id = 'smart-contact-container';
    container.className = 'smart-contact-buttons';
    
    container.innerHTML = `
        <div class="contact-button-wrapper" id="btn-email">
            <a href="mailto:${email}" class="contact-btn email" title="Enviar Email">
                <i class="fas fa-envelope"></i>
                <span class="btn-tooltip">Email</span>
            </a>
        </div>
        <div class="contact-button-wrapper" id="btn-telegram">
            <a href="${telegramUrl}" class="contact-btn telegram" target="_blank" rel="noopener" title="Canal de Telegram">
                <i class="fab fa-telegram"></i>
                <span class="btn-tooltip">Telegram</span>
            </a>
        </div>
        <div class="contact-button-wrapper" id="btn-whatsapp">
            <a href="https://wa.me/${whatsappNum}" class="contact-btn whatsapp ${isMobile ? 'primary' : ''}" target="_blank" rel="noopener" title="WhatsApp">
                <i class="fab fa-whatsapp"></i>
                <span class="btn-tooltip">WhatsApp</span>
            </a>
        </div>
    `;
    
    document.body.appendChild(container);
    
    // Animación de entrada escalonada
    setTimeout(() => {
        document.getElementById('btn-whatsapp').classList.add('visible');
    }, 500);
    setTimeout(() => {
        if (!isMobile) document.getElementById('btn-telegram').classList.add('visible');
    }, 800);
    setTimeout(() => {
        document.getElementById('btn-email').classList.add('visible');
    }, 1100);

    // Invitación sutil a Telegram en Sidebar (Desktop)
    if (!isMobile) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !document.querySelector('.telegram-subtle-invite')) {
            const invite = document.createElement('div');
            invite.className = 'telegram-subtle-invite fade-in visible';
            invite.innerHTML = `
                <p>📢 ¿Prefieres novedades sin ruido? Únete a nuestro canal.</p>
                <a href="${telegramUrl}" target="_blank" rel="noopener">Suscribirse a Telegram <i class="fas fa-arrow-right"></i></a>
            `;
            sidebar.appendChild(invite);
        }
    }
}

// ========================================
// LISTENERS GLOBALES
// ========================================

window.addEventListener('error', (e) => console.error('Error global:', e.error));
window.addEventListener('unhandledrejection', (e) => console.error('Promesa rechazada:', e.reason));