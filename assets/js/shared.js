/**
 * shared.js — Chatbot Jaime · JAIME_HMV2
 * Injects the dark sidebar and manages dynamic hotel data (localStorage).
 * Include this file in every page: <script src="/assets/js/shared.js"></script>
 */

(function () {
  'use strict';

  // ── Hotel data helpers ────────────────────────────────────────────────────
  var HOTELS_KEY = 'jaime_hoteles_dynamic';

  function getDynamicHotels() {
    try { return JSON.parse(localStorage.getItem(HOTELS_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function saveDynamicHotel(hotel) {
    var list = getDynamicHotels();
    var idx = list.findIndex(function (h) { return h.id === hotel.id; });
    if (idx > -1) list[idx] = hotel;
    else list.push(hotel);
    localStorage.setItem(HOTELS_KEY, JSON.stringify(list));
  }

  function makeInitials(name) {
    return (name || 'H').split(/\s+/).filter(Boolean).slice(0, 2)
      .map(function (w) { return w[0].toUpperCase(); }).join('');
  }

  function makeSlug(name) {
    return (name || 'hotel').toUpperCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  }

  // ── Active page detection ─────────────────────────────────────────────────
  function isActive(href) {
    var path = window.location.pathname;
    if (href === '/') return path === '/' || path === '/index.html';
    return path.startsWith(href);
  }

  // ── Sidebar HTML builder ──────────────────────────────────────────────────
  function buildHotelGroup(h) {
    var slug = h.slug || makeSlug(h.nombre || '');
    var initials = makeInitials(h.nombre);
    var idQ = encodeURIComponent(h.id);
    var tieneContexto = !!h.contexto;
    var formHref = '/plantillas/FORMULARIO_ONBOARDING_HOTEL.html?hotel_id=' + idQ;
    var ctxHref  = '/constructor-contexto/?hotel_id=' + idQ;
    var isOpenAttr = (isActive(formHref) || isActive('/constructor-contexto/')) ? ' open' : '';

    return '<details class="j-hotel-group"' + isOpenAttr + '>' +
      '<summary class="j-hotel-summary">' +
        '<span class="j-hotel-badge">' + escHtml(initials) + '</span>' +
        '<span class="j-nav-label" style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(h.nombre || 'Hotel') + '</span>' +
        '<span class="material-symbols-outlined j-hotel-chevron" style="font-size:18px;">expand_more</span>' +
      '</summary>' +
      '<div class="j-hotel-submenu">' +
        '<p class="j-submenu-cat">Formulario Onboarding</p>' +
        '<a class="j-submenu-item" href="' + formHref + '">Ver / Editar</a>' +
        '<button class="j-submenu-item" onclick="window.jaimeSidebar.descargarFichaPDF(\'' + h.id.replace(/'/g, "\\\\'") + '\')">Descargar .PDF</button>' +
        '<p class="j-submenu-cat">Contexto ManyChat</p>' +
        '<a class="j-submenu-item" href="' + ctxHref + '">Ver / Editar</a>' +
        '<button class="j-submenu-item' + (tieneContexto ? '' : ' j-submenu-disabled') + '" onclick="window.jaimeSidebar.descargarContextoPDF(\'' + h.id.replace(/'/g, "\\\\'") + '\')">Descargar .PDF</button>' +
      '</div>' +
    '</details>';
  }

  function buildSidebar() {
    var hotels = getDynamicHotels();
    var hotelGroups = hotels.map(buildHotelGroup).join('');

    return '<aside id="j-sidebar" class="j-sidebar">' +

      // ── Logo ──
      '<div class="j-sidebar-logo">' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
          '<div style="width:36px;height:36px;background:#F97316;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
            '<span class="material-symbols-outlined" style="color:white;font-size:20px;font-variation-settings:\'FILL\' 1,\'wght\' 500,\'GRAD\' 0,\'opsz\' 24;">smart_toy</span>' +
          '</div>' +
          '<div style="line-height:1;">' +
            '<div style="font-size:10px;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase;letter-spacing:.1em;">Chatbot</div>' +
            '<div style="font-size:15px;color:white;font-weight:700;font-family:\'Plus Jakarta Sans\',sans-serif;">Jaime</div>' +
          '</div>' +
        '</div>' +
        '<button id="j-sidebar-close" class="j-close-btn" onclick="window.jaimeSidebar.toggle()" aria-label="Cerrar menú">' +
          '<span class="material-symbols-outlined" style="font-size:20px;">close</span>' +
        '</button>' +
      '</div>' +

      // ── Nav ──
      '<nav class="j-sidebar-nav">' +

        '<div class="j-nav-group">' +
          '<p class="j-nav-section-label">General</p>' +
          '<a href="/" class="j-nav-item' + (isActive('/') ? ' j-nav-active' : '') + '">' +
            '<span class="material-symbols-outlined j-nav-icon">space_dashboard</span>Dashboard' +
          '</a>' +
          '<a href="/extractor/" class="j-nav-item' + (isActive('/extractor/') ? ' j-nav-active' : '') + '">' +
            '<span class="material-symbols-outlined j-nav-icon">auto_awesome</span>Extractor de Información' +
          '</a>' +
          '<a href="/plantillas/PLANTILLA_FLUJOS_JAIME.html" class="j-nav-item' + (isActive('/plantillas/PLANTILLA_FLUJOS_JAIME') ? ' j-nav-active' : '') + '">' +
            '<span class="material-symbols-outlined j-nav-icon">account_tree</span>Flujos de Conversación' +
          '</a>' +
          '<a href="/plantillas/PLANTILLA_FICHA_HOTEL.html" class="j-nav-item' + (isActive('/plantillas/PLANTILLA_FICHA_HOTEL') ? ' j-nav-active' : '') + '">' +
            '<span class="material-symbols-outlined j-nav-icon">description</span>Ficha de Configuración' +
          '</a>' +
        '</div>' +

        '<div class="j-nav-group">' +
          '<p class="j-nav-section-label">Herramientas</p>' +
          '<a href="/plantillas/FORMULARIO_ONBOARDING_HOTEL.html" class="j-nav-item' + (isActive('/plantillas/FORMULARIO_ONBOARDING_HOTEL') ? ' j-nav-active' : '') + '">' +
            '<span class="material-symbols-outlined j-nav-icon">assignment</span>Data Onboarding' +
          '</a>' +
          '<a href="/constructor-contexto/" class="j-nav-item' + (isActive('/constructor-contexto/') ? ' j-nav-active' : '') + '">' +
            '<span class="material-symbols-outlined j-nav-icon">construction</span>Constructor de Contexto' +
          '</a>' +
        '</div>' +

        '<div class="j-nav-group">' +
          '<p class="j-nav-section-label">Hoteles Implementados</p>' +
          hotelGroups +
          '<button onclick="window.location.href=\'/plantillas/FORMULARIO_ONBOARDING_HOTEL.html?nuevo=1\'" class="j-nav-item j-add-hotel-btn">' +
            '<span class="material-symbols-outlined j-nav-icon">add_circle</span>Agregar hotel nuevo' +
          '</button>' +
        '</div>' +

      '</nav>' +

      // ── Footer ──
      '<div class="j-sidebar-footer">' +
        '<div style="font-size:10px;color:rgba(255,255,255,.2);line-height:1.6;">' +
          'JAIME_HMV2 · v2.1<br>' +
          '<a href="https://wa.me/524421314203" style="color:rgba(255,255,255,.3);text-decoration:none;transition:color .15s" ' +
             'onmouseover="this.style.color=\'#F97316\'" onmouseout="this.style.color=\'rgba(255,255,255,.3)\'">442 131 4203</a>' +
        '</div>' +
      '</div>' +

    '</aside>';
  }

  // ── CSS injection ─────────────────────────────────────────────────────────
  function injectCSS() {
    if (document.getElementById('j-sidebar-css')) return;
    var style = document.createElement('style');
    style.id = 'j-sidebar-css';
    style.textContent = [
      /* Reset / tokens */
      ':root{--j-sidebar-w:260px;--j-slate:#0F172A;--j-navy:#1E3A5F;--j-gold:#F97316;--j-amber:#F59E0B;--j-sky:#4EA8DE;--j-cream:#FFF8F2;--j-cream-container:#FDF2E4;}',

      /* Sidebar shell */
      '.j-sidebar{position:fixed;top:0;left:0;height:100%;width:var(--j-sidebar-w);background:var(--j-slate);display:flex;flex-direction:column;z-index:500;transition:transform .25s cubic-bezier(.4,0,.2,1);}',

      /* Mobile: hidden off-screen */
      '@media(max-width:767px){.j-sidebar{transform:translateX(-100%);}.j-sidebar.j-open{transform:translateX(0);}}',

      /* Logo row */
      '.j-sidebar-logo{padding:20px 16px 18px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}',
      '.j-close-btn{display:none;background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;padding:2px;}',
      '@media(max-width:767px){.j-close-btn{display:block;}}',

      /* Nav */
      '.j-sidebar-nav{flex:1;overflow-y:auto;padding:12px 10px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent;}',
      '.j-nav-group{margin-bottom:28px;}',
      '.j-nav-section-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.25);padding:0 10px 8px;display:block;}',
      '.j-nav-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;color:var(--j-gold);font-size:13px;font-family:Inter,sans-serif;font-weight:500;text-decoration:none;transition:background .15s,color .15s,border-left-color .15s;cursor:pointer;background:none;border:none;width:100%;text-align:left;border-left:2px solid transparent;}',
      '.j-nav-item:hover{background:rgba(78,168,222,.10);color:var(--j-sky);}',
      '.j-nav-active{background:rgba(78,168,222,.16)!important;color:var(--j-sky)!important;border-left-color:var(--j-sky)!important;padding-left:8px;}',
      '.j-nav-icon{font-size:17px;flex-shrink:0;font-variation-settings:\'FILL\' 0,\'wght\' 300,\'GRAD\' 0,\'opsz\' 24;}',
      '.j-hotel-badge{width:22px;height:22px;border-radius:5px;background:rgba(30,58,95,.8);color:var(--j-gold);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;letter-spacing:0;}',
      '.j-add-hotel-btn{opacity:.45;}.j-add-hotel-btn:hover{opacity:1;}',

      /* Hotel group (details/summary anidado) */
      '.j-hotel-group{margin-bottom:2px;}',
      '.j-hotel-summary{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;color:var(--j-gold);font-size:13px;font-family:Inter,sans-serif;font-weight:500;cursor:pointer;list-style:none;user-select:none;}',
      '.j-hotel-summary::-webkit-details-marker{display:none;}',
      '.j-hotel-summary:hover{background:rgba(78,168,222,.10);color:var(--j-sky);}',
      '.j-hotel-chevron{margin-left:auto;flex-shrink:0;transition:transform .2s;opacity:.6;}',
      '.j-hotel-group[open] .j-hotel-chevron{transform:rotate(180deg);}',
      '.j-hotel-group[open] .j-hotel-summary{color:var(--j-sky);}',
      '.j-hotel-submenu{padding:4px 0 6px 14px;display:flex;flex-direction:column;gap:2px;}',
      '.j-submenu-cat{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:rgba(255,255,255,.3);margin:8px 0 2px 18px;}',
      '.j-submenu-item{display:block;text-align:left;background:none;border:none;color:rgba(255,255,255,.55);font-size:12.5px;font-family:Inter,sans-serif;padding:6px 10px 6px 18px;border-radius:6px;cursor:pointer;text-decoration:none;border-left:2px solid transparent;}',
      '.j-submenu-item:hover{background:rgba(78,168,222,.10);color:var(--j-sky);}',
      '.j-submenu-disabled{opacity:.35;cursor:not-allowed;}',
      '.j-submenu-disabled:hover{background:none!important;color:rgba(255,255,255,.55)!important;}',

      /* Footer */
      '.j-sidebar-footer{padding:14px 16px;border-top:1px solid rgba(255,255,255,.07);flex-shrink:0;}',

      /* Overlay */
      '#j-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:499;backdrop-filter:blur(2px);}',
      '#j-overlay.j-open{display:block;}',

      /* Content wrapper */
      '#j-content{margin-left:var(--j-sidebar-w);min-height:100vh;display:flex;flex-direction:column;}',
      '@media(max-width:767px){#j-content{margin-left:0;}}',

      /* Mobile topbar */
      '#j-topbar{display:none;align-items:center;gap:12px;padding:12px 16px;background:var(--j-slate);position:sticky;top:0;z-index:200;flex-shrink:0;}',
      '@media(max-width:767px){#j-topbar{display:flex;}}',
      '#j-topbar button{background:none;border:none;color:rgba(255,255,255,.6);cursor:pointer;display:flex;align-items:center;}',
      '#j-topbar .j-topbar-logo{font-size:14px;font-weight:700;color:white;font-family:\'Plus Jakarta Sans\',sans-serif;}',
      '#j-topbar .j-topbar-gold{color:var(--j-gold);}',

      /* AI-filled input indicator */
      '.input-ai-filled{border-left:3px solid var(--j-gold)!important;background-color:#fffbeb!important;}',
      '.input-pending{border-color:#fef3c7!important;background-color:#fffdf5!important;}',

      /* Gold pulse animation */
      '@keyframes j-pulse-gold{0%,100%{box-shadow:0 0 0 0 rgba(217,119,6,.4);}50%{box-shadow:0 0 0 8px rgba(217,119,6,0);}}',
      '.animate-pulse-gold{animation:j-pulse-gold 2s infinite;}',

      /* Sparkle */
      '@keyframes j-sparkle{0%,100%{transform:scale(1) rotate(0);}50%{transform:scale(1.2) rotate(15deg);}}',
      '.animate-sparkle{animation:j-sparkle 1.8s ease-in-out infinite;}',

      /* Glass effect */
      '.glass{background:rgba(255,255,255,.7);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.3);}',

      /* Print overrides */
      '@media print{.j-sidebar,#j-topbar,#j-overlay{display:none!important;}#j-content{margin-left:0!important;}}',
    ].join('');
    document.head.appendChild(style);
  }


  // ── Sembrar BeWow Queretaro como hotel dinamico (una sola vez) ────────────
  var BEWOW_SEED_ID = 'static_bewow_queretaro';
  function seedBeWowIfMissing() {
    var list = getDynamicHotels();
    for (var i = 0; i < list.length; i++) { if (list[i].id === BEWOW_SEED_ID) return; }
    var formData = {"hotel_nombre": "BeWow Querétaro", "hotel_concepto": "un hotel moderno enfocado en ofrecer una experiencia práctica, cómoda y eficiente para viajeros de negocio y placer", "hotel_web": "https://bewow.mx", "hotel_direccion": "Av. Constituyentes 73B", "hotel_ciudad": "Querétaro, Qro.", "hotel_telefono": "+52 442 216 0100", "hotel_maps": "https://maps.app.goo.gl/rD5GNdCrb1BdX2e3A", "razon_social": "OPERADORA EN FRANQUICIAS HERPAGON SA DE CV", "rfc": "OFH1406136B4", "hotel_motor": "https://direct-book.com/properties/BeWowQueretaroDirect", "reserv_guion": "¡Con gusto! Consigue aquí las mejores tarifas y reserva en menos de un minuto 👇\nhttps://direct-book.com/properties/BeWowQueretaroDirect", "hotel_checkin": "15:00", "hotel_checkout": "12:00", "desayuno_tipo": "Desayuno buffet: 10 guisados, huevos al gusto, jugo, fruta, yogur, café regular y descafeinado, leche regular y deslactosada, pan, cereal", "desayuno_menu_url": "https://bewow.mx/desayunos/menu", "desayuno_guion": "Sí, contamos con desayuno tipo buffet con varias opciones. Si quieres conocer nuestra carta aquí puedes verla 👇\nhttps://bewow.mx/desayunos/menu", "cafeteria_horario": "07:00–12:00", "cafeteria_pago": "Crédito, débito, efectivo, cargo a habitación (con váucher abierto en recepción)", "cafeteria_url": "https://bewow.mx/desayunos/cafeteria", "cafe_cortesia_nota": "Café americano de cortesía en recepción, disponible diariamente hasta las 8pm", "wifi_nombre": "Bewow", "wifi_guion": "El WiFi es gratuito durante tu estancia. Accede a la red Bewow, y en la pagina de bienvenida indica tu numero de habitacion y apellido para accesar ✅", "eventos_url": "https://bewow.mx/eventos-y-banquetes", "eventos_guion": "Claro, contamos con espacios para eventos. Te dejo la informacion aqui 👇\nhttps://bewow.mx/eventos-y-banquetes", "factura_url": "https://ephyr/facturacion.com.mx", "factura_guion": "Puedes realizar tu facturacion facilmente aqui 👇\nhttps://ephyr/facturacion.com.mx\nTe pediran tus datos fiscales: RFC, Razon Social, CP, Uso de CFDI y Regimen Fiscal.", "lavanderia_url": "https://bewow.mx/lavanderia", "lavanderia_guion": "Puedes registrar tu servicio de lavanderia aqui 👇\nhttps://bewow.mx/lavanderia", "rs_menu_url": "https://bewow.mx/roomservice/menu", "rs_menu_guion": "Descubre nuestro delicioso menu de Room Service y deleitate en tu habitacion 🍽️\nhttps://bewow.mx/roomservice/menu", "rs_ordenar_url": "https://bewow.mx/roomservice/ordenar", "rs_ordenar_guion": "Si ya sabes lo que deseas ordenar, hazlo aqui y te llegaran tus alimentos 👨‍🍳\nhttps://bewow.mx/roomservice/ordenar", "alberca_url": "https://bewow.mx/alberca", "alberca_guion": "Horario 09:00-21:00, agua temperatura ambiente, 6x10 mts, profundidad maxima 100cm, planta baja. Respeta el reglamento aqui 👇\nhttps://bewow.mx/alberca", "estac_info": "Con vigilancia las 24 Hrs. Gratuito huespedes, con cargo visitantes.", "mascota_nota": "Solo se permiten animales de asistencia debidamente acreditados.", "fallas_url": "https://bewow.mx/mantenimiento", "fallas_guion": "Lamentamos el inconveniente. Vamos a ayudarte de inmediato 🙏\nPuedes reportarlo aqui 👇\nhttps://bewow.mx/mantenimiento", "quejas_url": "https://bewow.mx/quejas", "quejas_guion": "Lamentamos mucho lo ocurrido. Para dar seguimiento adecuado, por favor registralo aqui 👇\nhttps://bewow.mx/quejas", "sugerencias_url": "https://bewow.mx/sugerencias", "sugerencias_guion": "¡Muchas gracias por tu recomendacion! Puedes registrarla aqui 👇\nhttps://bewow.mx/sugerencias", "hotel_email_reservas": "recepcion@bewow.mx", "hotel_email_admin": "ventas@bewow.mx", "pol_hospedaje_url": "https://bewow.mx/politica-hospedaje", "pol_cancelacion_url": "https://bewow.mx/refund-policy", "aviso_privacidad_url": "https://bewow.mx/privacy-policy", "hotel_facebook": "https://www.facebook.com/bewowhotelqueretaro?locale=es_LA", "hotel_instagram": "https://www.instagram.com/bewowhoteles/", "serv_medico_nombre": "Dr. Juan Luis Pérez", "serv_medico_tel": "+52 442 252 3389", "serv_medico_url": "https://www.medicosonline.com", "taxi_sitio_tel": "+52 442 222 3365", "taxi_aerop_tel": "+52 442 314 2148", "bolero_nombre": "Sr. Francisco", "bolero_tel": "+52 442 589 4725", "lavado_auto_nombre": "Sr. Palafox", "lavado_auto_tel": "+52 442 204 5869"};
    list.push({
      id: BEWOW_SEED_ID,
      nombre: 'BeWow Querétaro',
      slug: 'BEWOW_QUERETARO',
      ciudad: formData.hotel_ciudad,
      categoria: '',
      habitaciones: '',
      formData: formData,
      creado: new Date().toISOString(),
    });
    localStorage.setItem(HOTELS_KEY, JSON.stringify(list));
  }

  // ── DOM injection ─────────────────────────────────────────────────────────
  function inject() {
    seedBeWowIfMissing();
    injectCSS();

    // Sidebar
    var sidebarEl = document.createElement('div');
    sidebarEl.innerHTML = buildSidebar();
    document.body.insertBefore(sidebarEl.firstElementChild, document.body.firstChild);

    // Overlay
    var overlay = document.createElement('div');
    overlay.id = 'j-overlay';
    overlay.onclick = function () { close(); };
    document.body.insertBefore(overlay, document.body.children[1]);

    // Wrap remaining content
    var content = document.createElement('div');
    content.id = 'j-content';

    // Mobile topbar
    var topbar = document.createElement('div');
    topbar.id = 'j-topbar';
    topbar.innerHTML =
      '<button onclick="window.jaimeSidebar.toggle()" aria-label="Abrir menú">' +
        '<span class="material-symbols-outlined" style="font-size:22px;">menu</span>' +
      '</button>' +
      '<span class="j-topbar-logo">Chatbot <span class="j-topbar-gold">Jaime</span></span>';
    content.appendChild(topbar);

    // Move all remaining body children into content
    while (document.body.children.length > 2) { // only sidebar, overlay left on body
      content.appendChild(document.body.children[2]);
    }
    document.body.appendChild(content);

    // Remove old fixed nav if present (pages that still have one)
    var oldNav = document.querySelector('nav[class*="fixed top-0"]');
    if (oldNav && !oldNav.id) oldNav.remove();
  }

  function open() {
    var sb = document.getElementById('j-sidebar');
    var ov = document.getElementById('j-overlay');
    if (sb) sb.classList.add('j-open');
    if (ov) ov.classList.add('j-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    var sb = document.getElementById('j-sidebar');
    var ov = document.getElementById('j-overlay');
    if (sb) sb.classList.remove('j-open');
    if (ov) ov.classList.remove('j-open');
    document.body.style.overflow = '';
  }

  function toggle() {
    var sb = document.getElementById('j-sidebar');
    if (sb && sb.classList.contains('j-open')) close();
    else open();
  }


  // ════════════════════════════════════════════════════════════════════════
  // JAIME HOTEL DATA — datos completos por hotel + generadores PDF/DOC
  // reutilizables desde cualquier pagina (sidebar, Constructor de Contexto)
  // ════════════════════════════════════════════════════════════════════════
  var FORM_URL = '/plantillas/FORMULARIO_ONBOARDING_HOTEL.html';

  function getHotelById(id) {
    var list = getDynamicHotels();
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
    return null;
  }

  function updateHotel(id, patch) {
    var list = getDynamicHotels();
    var idx = -1;
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { idx = i; break; } }
    if (idx === -1) return null;
    for (var k in patch) { if (patch.hasOwnProperty(k)) list[idx][k] = patch[k]; }
    localStorage.setItem(HOTELS_KEY, JSON.stringify(list));
    return list[idx];
  }

  function ensureJsPDF(cb) {
    if (window.jspdf) { cb(); return; }
    var existing = document.querySelector('script[src*="jspdf"]');
    if (existing) { existing.addEventListener('load', cb); return; }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  // Recopila TODOS los campos [name] de un root en un objeto plano serializable
  function recopilarFormData(root) {
    root = root || document;
    var data = {};
    root.querySelectorAll('[name]').forEach(function (el) {
      var name = el.name;
      if (!name) return;
      if (el.type === 'checkbox') {
        if (!Array.isArray(data[name])) data[name] = [];
        if (el.checked) data[name].push(el.value);
      } else if (el.type === 'radio') {
        if (el.checked) data[name] = el.value;
        else if (!(name in data)) data[name] = '';
      } else {
        data[name] = el.value;
      }
    });
    return data;
  }

  // Llena un root (document real o Document parseado) con valores desde formData plano
  function llenarFormDesdeData(root, formData) {
    if (!formData) return;
    Object.keys(formData).forEach(function (name) {
      var val = formData[name];
      var sel = '[name="' + name.replace(/"/g, '\\"') + '"]';
      var els = root.querySelectorAll(sel);
      if (!els.length) return;
      els.forEach(function (el) {
        if (el.type === 'checkbox') {
          var arr = Array.isArray(val) ? val : (val ? [val] : []);
          el.checked = arr.indexOf(el.value) !== -1;
        } else if (el.type === 'radio') {
          el.checked = (el.value === val);
        } else {
          el.value = (val === null || val === undefined) ? '' : val;
        }
      });
    });
  }

  // Descarga el HTML crudo del formulario y devuelve un Document poblado con formData
  function cargarFormularioOculto(formData) {
    return fetch(FORM_URL).then(function (r) { return r.text(); }).then(function (html) {
      var parsed = new DOMParser().parseFromString(html, 'text/html');
      if (formData) llenarFormDesdeData(parsed, formData);
      return parsed;
    });
  }

  // ── Disparar descarga de un Blob/string ya armado ──────────────────────────
  function descargarDOC(docResult) {
    var blob = new Blob(['\uFEFF', docResult.html], { type: 'application/vnd.ms-word;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = docResult.filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  }

  /* ---- recopilarDatosFormulario (root-aware) ---- */
function recopilarDatosFormulario(root) {
  root = root || document;
  var secciones = [];
  root.querySelectorAll('.sb').forEach(function(sb) {
    var sNum = (sb.querySelector('.s-num')   || {}).textContent || '';
    var sTit = (sb.querySelector('.s-title') || {}).textContent || '';
    if (!sTit.trim()) return;
    var campos = [];

    /* 1) Inputs, selects, textareas con label.lbl */
    sb.querySelectorAll('label.lbl').forEach(function(lbl) {
      var labelTxt = lbl.textContent.trim();
      if (!labelTxt) return;
      if (lbl.htmlFor) {
        var elFor = root.getElementById(lbl.htmlFor);
        if (elFor && (elFor.type === 'radio' || elFor.type === 'checkbox')) return;
      }
      var cont = lbl.parentElement;
      var valor = '';
      var inp = cont.querySelector('input:not([type=radio]):not([type=checkbox]), select, textarea');
      if (inp) {
        if (inp.tagName === 'SELECT') {
          valor = inp.options[inp.selectedIndex] ? inp.options[inp.selectedIndex].text : '';
        } else {
          valor = inp.value || '';
        }
      } else {
        var tg = cont.querySelector('.tg');
        if (tg) {
          var chk = tg.querySelector('input[type=radio]:checked');
          if (chk) {
            var lf = tg.querySelector('label[for="' + chk.id + '"]');
            valor = lf ? lf.textContent.trim() : chk.value;
          }
        }
      }
      if (valor.trim()) campos.push({ label: labelTxt, valor: valor.trim() });
    });

    /* 2) Checkboxes grupales (.cg) */
    sb.querySelectorAll('.cg').forEach(function(cg) {
      var marcados = [];
      cg.querySelectorAll('input[type=checkbox]:checked').forEach(function(cb) {
        var ci = cb.closest('.ci');
        if (ci) { var t = ci.textContent.trim(); if (t) marcados.push(t); }
      });
      if (!marcados.length) return;
      var prev = cg.previousElementSibling;
      var etiq = (prev && prev.classList && prev.classList.contains('lbl'))
                 ? prev.textContent.trim() : 'Servicios / Amenidades';
      campos.push({ label: etiq, valor: marcados.join(', ') });
    });

    /* 3) Tabla de instalaciones (.it-row) */
    var itRows = sb.querySelectorAll('.it-row');
    if (itRows.length) {
      var activos = [];
      itRows.forEach(function(row) {
        var cb = row.querySelector('input[type=checkbox]');
        if (!cb || !cb.checked) return;
        var sp = row.querySelector('span:first-child');
        var nombre = sp ? sp.textContent.trim() : '';
        var inps = row.querySelectorAll('input[type=text]');
        var partes = [nombre];
        ['Horario','Costo','Notas'].forEach(function(k,i){ if(inps[i] && inps[i].value.trim()) partes.push(k+': '+inps[i].value.trim()); });
        activos.push(partes.join(' | '));
      });
      if (activos.length) campos.push({ label: 'Instalaciones activas', valor: activos.join('\n') });
    }

    /* 4) Directorio interno (.dir-row) */
    var dirRows = sb.querySelectorAll('.dir-row');
    if (dirRows.length) {
      var lineas = [];
      dirRows.forEach(function(row) {
        var inps = row.querySelectorAll('input');
        var n = inps[0]?inps[0].value.trim():'', p = inps[1]?inps[1].value.trim():'', t = inps[2]?inps[2].value.trim():'';
        if (!n && !p && !t) return;
        var pr = []; if(n) pr.push(n); if(p) pr.push(p); if(t) pr.push('Tel: '+t);
        lineas.push(pr.join(' — '));
      });
      if (lineas.length) campos.push({ label: 'Directorio Interno', valor: lineas.join('\n') });
    }

    /* 5) Preguntas frecuentes (.faq-row o similar) */
    var faqRows = sb.querySelectorAll('.faq-row');
    if (faqRows.length) {
      var faqs = [];
      faqRows.forEach(function(row) {
        var inps = row.querySelectorAll('input, textarea');
        var q = inps[0]?inps[0].value.trim():'', a = inps[1]?inps[1].value.trim():'';
        if (!q && !a) return;
        faqs.push('P: '+(q||'—')+'\nR: '+(a||'—'));
      });
      if (faqs.length) campos.push({ label: 'Preguntas Frecuentes', valor: faqs.join('\n\n') });
    }

    secciones.push({ num: sNum.trim(), titulo: sTit.trim(), campos: campos });
  });
  return secciones;
}


  /* ---- exportarPDF (root-aware, devuelve {doc,filename}) ---- */
function exportarPDF(root) {
  root = root || document;
  if (typeof window.jspdf === 'undefined') {
    alert('La biblioteca PDF aún se está cargando. Espera un segundo e intenta de nuevo.');
    return;
  }
  var jsPDF = window.jspdf.jsPDF;
  var doc   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  var pW = 210, mg = 14, aw = pW - mg * 2, y = 0;
  var hotelNom = (root.querySelector('[name="hotel_nombre"]') || {}).value || 'Hotel';
  var fecha    = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });

  function chkPag(n) { if (y + n > 280) { doc.addPage(); y = 16; } }

  /* Encabezado */
  doc.setFillColor(30,58,95); doc.rect(0,0,pW,34,'F');
  doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(15);
  doc.text('Ficha de Configuración del Hotel', mg, 13);
  doc.setFontSize(10); doc.setFont('helvetica','normal');
  doc.setTextColor(217,179,100); doc.text(hotelNom, mg, 22);
  doc.setTextColor(200,200,200); doc.setFontSize(8);
  doc.text('Generado: '+fecha, pW-mg, 22, {align:'right'});
  doc.text('Jaime Chatbot Hotelero · Configuración ManyChat', pW-mg, 29, {align:'right'});
  y = 42;

  recopilarDatosFormulario(root).forEach(function(sec) {
    if (!sec.campos.length) return;
    chkPag(16);
    doc.setFillColor(30,58,95);
    doc.roundedRect(mg, y-5, aw, 10, 2, 2, 'F');
    doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(9.5);
    doc.text(sec.num+'  ·  '+sec.titulo, mg+4, y+2);
    y += 12;

    sec.campos.forEach(function(c) {
      var lblLines = doc.splitTextToSize(c.label, aw*0.36);
      var valLines = doc.splitTextToSize(c.valor||'—', aw*0.60);
      var lh = Math.max(lblLines.length, valLines.length) * 4.8;
      chkPag(lh+4);
      doc.setTextColor(80,80,90); doc.setFont('helvetica','bold'); doc.setFontSize(8);
      doc.text(lblLines, mg+2, y);
      var isEmpty = !c.valor||!c.valor.trim();
      doc.setTextColor(isEmpty?150:28, isEmpty?150:28, isEmpty?160:30);
      doc.setFont('helvetica','normal');
      doc.text(valLines, mg+aw*0.38, y);
      y += lh+1;
      doc.setDrawColor(220,220,225); doc.setLineWidth(0.2);
      doc.line(mg, y, mg+aw, y);
      y += 2.5;
    });
    y += 5;
  });

  /* Paginación */
  var tot = doc.internal.getNumberOfPages();
  for (var p=1; p<=tot; p++) {
    doc.setPage(p);
    doc.setFontSize(7.5); doc.setTextColor(160,160,165); doc.setFont('helvetica','normal');
    doc.text('Página '+p+' de '+tot, pW/2, 292, {align:'center'});
    doc.text('Jaime — Chatbot Hotelero', mg, 292);
  }
  return { doc: doc, filename: 'Ficha_'+hotelNom.replace(/[^a-zA-Z0-9\s]/g,'').replace(/\s+/g,'_')+'.pdf' };
}


  /* ---- exportarDOC (root-aware, devuelve {html,filename}) ---- */
function exportarDOC(root) {
  root = root || document;
  var hotelNom = (root.querySelector('[name="hotel_nombre"]') || {}).value || 'Hotel';
  var fecha    = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
  var secciones = recopilarDatosFormulario(root);
  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }

  var html = "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>Ficha "+esc(hotelNom)+"</title>" +
    "<style>" +
    "body{font-family:Calibri,Arial,sans-serif;font-size:11pt;margin:2cm;color:#1F2937;}" +
    "h1{color:#1E3A5F;font-size:20pt;border-bottom:3px solid #1E3A5F;padding-bottom:6pt;margin-bottom:4pt;}" +
    ".subtit{color:#6B7280;font-size:10pt;margin:0 0 14pt;}" +
    "h2{color:#fff;background:#1E3A5F;font-size:11pt;padding:5pt 9pt;margin:16pt 0 6pt;}" +
    ".campo{margin:0 0 7pt;}" +
    ".lbl2{font-weight:700;color:#374151;font-size:10pt;display:block;}" +
    ".val{color:#1F2937;font-size:10.5pt;padding-left:10pt;display:block;white-space:pre-wrap;}" +
    ".vacio{color:#9CA3AF;font-style:italic;}" +
    "hr{border:none;border-top:1px solid #E5E7EB;margin:4pt 0;}" +
    "</style></head><body>" +
    "<h1>Ficha de Configuración del Hotel</h1>" +
    "<p class='subtit'>"+esc(hotelNom)+" &nbsp;&middot;&nbsp; Generado: "+fecha+"</p>" +
    "<p style='font-size:9pt;color:#9CA3AF;margin-bottom:20pt;'>Jaime &mdash; Chatbot Hotelero &middot; Configuración ManyChat</p>";

  secciones.forEach(function(sec) {
    if (!sec.campos.length) return;
    html += "<h2>"+esc(sec.num)+" &nbsp;&middot;&nbsp; "+esc(sec.titulo)+"</h2>";
    sec.campos.forEach(function(c) {
      var isEmpty = !c.valor||!c.valor.trim();
      html += "<div class='campo'>" +
        "<span class='lbl2'>"+esc(c.label)+"</span>" +
        "<span class='val"+(isEmpty?" vacio":"")+"'>"+(isEmpty?"Sin rellenar":esc(c.valor))+"</span>" +
        "<hr></div>";
    });
  });

  html += "</body></html>";
  return { html: html, filename: 'Ficha_'+hotelNom.replace(/[^a-zA-Z0-9\s]/g,'').replace(/\s+/g,'_')+'.doc' };
}


  /* ---- construirContexto (root-aware, devuelve {doc,texto,filename}) ---- */
function construirContexto(root) {
  root = root || document;
  if (typeof window.jspdf === 'undefined') {
    throw new Error('jsPDF no esta cargado todavia');
  }
  var jsPDF = window.jspdf.jsPDF;
  var doc   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  var pW = 210, mg = 14, aw = pW - mg * 2, y = 0;
  var nombre = (root.querySelector('[name="hotel_nombre"]') || {}).value || 'Hotel';
  var fecha  = new Date().toLocaleDateString('es-MX', { day:'2-digit', month:'long', year:'numeric' });
  var textoPlano = [];

  // Helper: get field value
  var g = function(name) {
    var el = root.querySelector('[name="' + name + '"]');
    return el ? (el.value || '').trim() : '';
  };

  // ── Core render functions ─────────────────────────────────────────────────

  function chk(n) {
    if (y + n > 282) { doc.addPage(); y = 16; }
  }

  function txt(text, bold, size, colorR, colorG, colorB, indent) {
    if (!text) return;
    textoPlano.push(String(text));
    size   = size   || 9;
    indent = indent || 0;
    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(colorR || 30, colorG || 30, colorB || 35);
    var lines = doc.splitTextToSize(String(text), aw - indent);
    var lh    = size * 0.43;
    chk(lines.length * lh + 2);
    doc.text(lines, mg + indent, y);
    y += lines.length * lh + 1.5;
  }

  function urlTxt(href) {
    if (!href) return;
    textoPlano.push(href);
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    doc.setTextColor(14, 100, 200);
    var lines = doc.splitTextToSize(href, aw - 4);
    chk(lines.length * 3.8 + 1);
    doc.text(lines, mg + 4, y);
    y += lines.length * 3.8 + 1.5;
  }

  function blank(n) { y += (n || 3); textoPlano.push(''); }

  function sep() {
    chk(6);
    doc.setDrawColor(200, 200, 205); doc.setLineWidth(0.25);
    doc.line(mg, y, mg + aw, y); y += 5;
    textoPlano.push('---');
  }

  function secHeader(title, r, g2, b) {
    textoPlano.push('');
    textoPlano.push(title.toUpperCase());
    chk(14);
    r = r || 30; g2 = g2 || 58; b = b || 95;
    doc.setFillColor(r, g2, b);
    doc.roundedRect(mg, y - 5, aw, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text(title, mg + 5, y + 2);
    y += 13;
  }

  function scriptBox(text) {
    if (!text) return;
    textoPlano.push('Micro guion: "' + text + '"');
    doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 110);
    chk(5); doc.text('Micro guion:', mg + 2, y); y += 4;
    var lines = doc.splitTextToSize('"' + text + '"', aw - 10);
    var lh    = 9 * 0.43;
    var h     = lines.length * lh + 7;
    chk(h + 2);
    doc.setFillColor(240, 247, 255); doc.setDrawColor(147, 197, 253);
    doc.roundedRect(mg + 2, y - 2, aw - 4, h, 2, 2, 'FD');
    doc.setTextColor(30, 64, 175); doc.setFont('helvetica', 'italic'); doc.setFontSize(9);
    doc.text(lines, mg + 7, y + 3);
    y += h + 3;
  }

  function bullet(text, indent) {
    textoPlano.push('- ' + text);
    indent = indent || 4;
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 50);
    var lines = doc.splitTextToSize('- ' + text, aw - indent - 2);
    chk(lines.length * 3.9 + 1);
    doc.text(lines, mg + indent, y);
    y += lines.length * 3.9 + 1;
  }

  function rowLabel(label, value) {
    if (!value) return;
    textoPlano.push(label + ': ' + value);
    doc.setFontSize(8.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(70, 70, 80);
    chk(5); doc.text(label + ':', mg + 4, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 40);
    doc.text(value, mg + 4 + doc.getTextWidth(label + ':') + 2, y);
    y += 4.5;
  }

  // ── PAGE HEADER ───────────────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42); doc.rect(0, 0, pW, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
  doc.text('Contexto ManyChat — Jaime', mg, 13);
  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  doc.setTextColor(45, 212, 191); doc.text(nombre, mg, 22);
  doc.setTextColor(148, 163, 184); doc.setFontSize(8);
  doc.text('Generado: ' + fecha, pW - mg, 22, { align: 'right' });
  y = 38;

  // ══════════════════════════════════════════════════════════════════════════
  // BLOQUE IDENTIDAD DEL HOTEL
  // ══════════════════════════════════════════════════════════════════════════
  var concepto = g('hotel_concepto');
  if (concepto) {
    txt(nombre + ' es ' + concepto, false, 9.5);
  } else {
    txt(nombre, true, 11);
  }
  urlTxt(g('hotel_web'));
  blank(2);

  var dirParts = [g('hotel_direccion'), g('hotel_ciudad')].filter(Boolean);
  if (dirParts.length) txt('Ubicacion: ' + dirParts.join(', '));
  if (g('hotel_telefono')) txt('Tel: ' + g('hotel_telefono'));
  if (g('hotel_gmaps')) {
    txt('Mapa:', false, 9, 60, 60, 60); y -= 4;
    urlTxt(g('hotel_gmaps'));
  }

  // Razon social (campos opcionales)
  var razon = g('razon_social') || g('hotel_razon_social');
  var rfc   = g('rfc') || g('hotel_rfc');
  if (razon || rfc) {
    sep();
    txt('RAZON SOCIAL', true, 9);
    var rs = [razon, rfc ? 'RFC: ' + rfc : ''].filter(Boolean).join(' | ');
    txt(rs, false, 9, 60, 60, 65);
  }

  sep();

  // ══════════════════════════════════════════════════════════════════════════
  // HABITACIONES
  // ══════════════════════════════════════════════════════════════════════════
  secHeader('HABITACIONES');

  // Room type cards in section s4
  var roomCards = root.querySelectorAll('#s4 .card');
  if (roomCards.length) {
    txt('Tipos de habitacion:', true, 9, 55, 55, 65);
    roomCards.forEach(function(card) {
      var cTitle = (card.querySelector('.card-title') || {}).textContent || '';
      var inps   = Array.from(card.querySelectorAll('input, select, textarea'))
                       .map(function(i){ return i.value.trim(); }).filter(Boolean);
      if (cTitle || inps.length) {
        var row = cTitle + (inps.length ? ': ' + inps.join(' | ') : '');
        txt(row, false, 9, 30, 30, 40, 6);
      }
    });
    blank(2);
  }

  // Amenidades (checkboxes en s4)
  var amenList = [];
  root.querySelectorAll('#s4 input[type=checkbox]:checked').forEach(function(cb) {
    var ci = cb.closest('.ci');
    if (ci) amenList.push(ci.textContent.trim());
  });
  if (amenList.length) {
    txt('Amenidades: ' + amenList.join(', '), false, 9);
    blank(2);
  }

  // Info general habitaciones (campos sueltos s4)
  var habFields = [
    { name: 'hab_cama',    label: 'Cama' },
    { name: 'hab_ac',      label: 'Aire acondicionado' },
    { name: 'hab_tv',      label: 'TV' },
    { name: 'hab_closet',  label: 'Closet' },
    { name: 'hab_bano',    label: 'Bano' },
    { name: 'hab_trabajo', label: 'Area de trabajo' },
  ];
  var habSolos = habFields.filter(function(hf){ return g(hf.name); });
  if (habSolos.length) {
    habSolos.forEach(function(hf){ txt(hf.label + ': ' + g(hf.name), false, 9, 40, 40, 50, 4); });
    blank(2);
  }

  if (g('hotel_habitaciones')) txt('Total habitaciones: ' + g('hotel_habitaciones'));

  var habUrl = g('hotel_web') ? g('hotel_web') + '/habitaciones' : '';
  if (habUrl) { txt('Mas info:', false, 9, 60, 60, 60); y -= 4; urlTxt(habUrl); }

  sep();

  // ══════════════════════════════════════════════════════════════════════════
  // REGLAS DE CONVERSION
  // ══════════════════════════════════════════════════════════════════════════
  secHeader('REGLAS DE CONVERSION — PRIORIDAD ALTA', 185, 28, 28);

  txt('Reservaciones:', true, 9.5);
  blank(1);
  txt('Cuando el huesped quiera reservar:');
  txt('NO hacer preguntas, invitalo a hacer su reservacion.');
  txt('Enviar directo el link:');
  urlTxt(g('hotel_motor'));
  blank(1);
  scriptBox(g('reserv_guion'));

  sep();

  // ══════════════════════════════════════════════════════════════════════════
  // SERVICIOS
  // ══════════════════════════════════════════════════════════════════════════
  secHeader('SERVICIOS');

  // ── Desayuno ──────────────────────────────────────────────────────────────
  var desHor  = g('desayuno_horario');
  var desTipo = g('desayuno_tipo');
  var desUbic = g('desayuno_ubic');
  if (desTipo || desHor || g('desayuno_guion')) {
    txt('Desayuno:', true, 9.5);
    if (desTipo) txt(desTipo, false, 9, 40, 40, 50, 4);
    if (desHor)  txt('Horario: ' + desHor, false, 9, 40, 40, 50, 4);
    if (desUbic) txt('Ubicacion: ' + desUbic, false, 9, 40, 40, 50, 4);
    scriptBox(g('desayuno_guion'));
    urlTxt(g('desayuno_menu_url'));
    blank(3);
  }

  // ── Cafeteria / Restaurante ───────────────────────────────────────────────
  var restNom = g('rest_nombre');
  var restMen = g('rest_menu');
  if (restNom || restMen || g('rest_menu_guion')) {
    txt('Cafeteria' + (restNom ? ' / ' + restNom : '') + ':', true, 9.5);
    // horarios de desayuno/comida/cena del restaurante
    var horDesay = g('rest_hor_desay') || g('rest_horario_d');
    var horComi  = g('rest_hor_comi')  || g('rest_horario_c');
    var horCena  = g('rest_hor_cena')  || g('rest_horario_n');
    if (horDesay || horComi || horCena) {
      var hStr = [horDesay && 'Desayuno ' + horDesay, horComi && 'Comida ' + horComi, horCena && 'Cena ' + horCena].filter(Boolean).join(' | ');
      txt('Horario: ' + hStr, false, 9, 40, 40, 50, 4);
    }
    scriptBox(g('rest_menu_guion'));
    urlTxt(restMen);
    blank(3);
  }

  // ── Servicio de Cafeteria ────────────────────────────────────────────────
  if (g('cafeteria_horario') || g('cafeteria_url') || g('cafeteria_guion')) {
    txt('Servicio de Cafeteria:', true, 9.5);
    if (g('cafeteria_horario')) txt('Horario: ' + g('cafeteria_horario'), false, 9, 40, 40, 50, 4);
    if (g('cafeteria_pago'))    txt('Pago: ' + g('cafeteria_pago'), false, 9, 40, 40, 50, 4);
    scriptBox(g('cafeteria_guion'));
    urlTxt(g('cafeteria_url'));
    blank(3);
  }

  if (g('cafe_cortesia_nota')) {
    txt('Cafe de Cortesia:', true, 9.5);
    txt(g('cafe_cortesia_nota'), false, 9, 40, 40, 50, 4);
    blank(3);
  }

  // ── WiFi ──────────────────────────────────────────────────────────────────
  if (g('wifi_nombre') || g('wifi_guion')) {
    txt('WiFi:', true, 9.5);
    if (g('wifi_nombre')) {
      var wStr = 'Red: ' + g('wifi_nombre') + (g('wifi_password') ? '  |  Clave: ' + g('wifi_password') : '') + (g('wifi_vel') ? '  |  ' + g('wifi_vel') : '');
      txt(wStr, false, 9, 40, 40, 50, 4);
    }
    scriptBox(g('wifi_guion'));
    blank(3);
  }

  // ── Eventos y Salones ─────────────────────────────────────────────────────
  var eventosUrl = g('salon_url') || g('eventos_url');
  if (g('eventos_guion') || eventosUrl) {
    txt('Eventos y Salones:', true, 9.5);
    // Descripcion de salones (campos de s10)
    var salonDesc = g('salon_descripcion') || g('salon_info');
    if (salonDesc) txt(salonDesc, false, 9, 40, 40, 50, 4);
    scriptBox(g('eventos_guion'));
    urlTxt(eventosUrl);
    blank(3);
  }

  // ── Facturacion ───────────────────────────────────────────────────────────
  if (g('factura_guion') || g('factura_url')) {
    txt('Facturacion:', true, 9.5);
    scriptBox(g('factura_guion'));
    urlTxt(g('factura_url'));
    blank(3);
  }

  // ── Lavanderia ────────────────────────────────────────────────────────────
  if (g('lavanderia_guion') || g('lavanderia_url')) {
    txt('Lavanderia:', true, 9.5);
    scriptBox(g('lavanderia_guion'));
    urlTxt(g('lavanderia_url'));
    blank(3);
  }

  // ── Room Service ──────────────────────────────────────────────────────────
  if (g('rs_menu_guion') || g('rs_menu_url') || g('rs_ordenar_guion') || g('rs_ordenar_url')) {
    txt('Room Service:', true, 9.5);
    txt('Cuando el huesped quiera pedir Room Service:', false, 9, 50, 50, 60, 4);
    scriptBox(g('rs_menu_guion'));
    urlTxt(g('rs_menu_url'));
    blank(1);
    if (g('rs_ordenar_guion') || g('rs_ordenar_url')) {
      txt('Cuando el huesped ya sabe lo que desea ordenar:', false, 9, 50, 50, 60, 4);
      scriptBox(g('rs_ordenar_guion'));
      urlTxt(g('rs_ordenar_url'));
    }
    blank(3);
  }

  // ── Alberca ───────────────────────────────────────────────────────────────
  if (g('alberca_guion') || g('alberca_url')) {
    txt('Alberca:', true, 9.5);
    scriptBox(g('alberca_guion'));
    urlTxt(g('alberca_url'));
    blank(3);
  }

  // ── Estacionamiento ───────────────────────────────────────────────────────
  var estacInfo = g('estac_info') || g('estacionamiento_info') || g('estac_nota');
  var estacToggle = root.querySelector('[name="estac"]:checked') || root.querySelector('[name="estacionamiento"]:checked');
  if (estacInfo || estacToggle) {
    txt('Estacionamiento:', true, 9.5);
    if (estacInfo) txt(estacInfo, false, 9, 40, 40, 50, 4);
    blank(3);
  }

  // ── Mascotas ──────────────────────────────────────────────────────────────
  var mascNota = g('mascota_nota') || g('mascota_info');
  if (mascNota) {
    txt('Mascotas:', true, 9.5);
    txt(mascNota, false, 9, 40, 40, 50, 4);
    blank(3);
  }

  // ── Servicios activos de la tabla .it-row ─────────────────────────────────
  var servActivos = [];
  root.querySelectorAll('#s9 .it-row').forEach(function(row) {
    var cb = row.querySelector('input[type=checkbox]');
    if (!cb || !cb.checked) return;
    var sp = row.querySelector('span:first-child');
    if (!sp) return;
    var name = sp.textContent.trim();
    var inps = row.querySelectorAll('input[type=text]');
    var parts = [name];
    var labels = ['Horario','Costo','Notas'];
    inps.forEach(function(inp, i) { if (inp.value.trim()) parts.push(labels[i]+': '+inp.value.trim()); });
    servActivos.push(parts.join(' | '));
  });
  if (servActivos.length) {
    txt('Otros servicios disponibles:', true, 9, 55, 55, 65);
    servActivos.forEach(function(s) { txt(s, false, 9, 40, 40, 50, 4); });
    blank(3);
  }

  // ── Directorio de contactos externos (s15) ────────────────────────────────
  var servExternos = [
    { label: 'Servicio Medico',  fields: ['serv_medico_nombre','serv_medico_tel','serv_medico_url'] },
    { label: 'Taxi de sitio',    fields: ['taxi_sitio_tel'] },
    { label: 'Taxi aeropuerto',  fields: ['taxi_aerop_tel'] },
    { label: 'Bolero',           fields: ['bolero_nombre','bolero_tel'] },
    { label: 'Lavado de autos',  fields: ['lavado_auto_nombre','lavado_auto_tel'] },
  ];
  var servExtActivos = servExternos.filter(function(s){ return s.fields.some(function(f){ return g(f); }); });
  if (servExtActivos.length) {
    txt('Directorio de servicios externos:', true, 9, 55, 55, 65);
    servExtActivos.forEach(function(s) {
      var vals = s.fields.map(g).filter(Boolean).join(' — ');
      txt(s.label + ': ' + vals, false, 9, 40, 40, 50, 4);
    });
    blank(3);
  }

  var dirExt = [];
  root.querySelectorAll('#s15 .dir-row').forEach(function(row) {
    var inps = row.querySelectorAll('input');
    var n = inps[0]?inps[0].value.trim():'', p = inps[1]?inps[1].value.trim():'', t = inps[2]?inps[2].value.trim():'';
    if (!n && !t) return;
    dirExt.push([n, p, t?'Tel: '+t:''].filter(Boolean).join(' — '));
  });
  if (dirExt.length) {
    txt('Directorio de servicios externos:', true, 9, 55, 55, 65);
    dirExt.forEach(function(d) { txt(d, false, 9, 40, 40, 50, 4); });
    blank(3);
  }

  sep();

  // ══════════════════════════════════════════════════════════════════════════
  // POLITICAS
  // ══════════════════════════════════════════════════════════════════════════
  var polFields = [
    { name: 'pol_hospedaje',       label: 'Politica de hospedaje' },
    { name: 'pol_hospedaje_url',   label: 'URL Politica de hospedaje' },
    { name: 'pol_cancelacion',     label: 'Politica de cancelacion' },
    { name: 'pol_cancelacion_url', label: 'URL Politica de cancelacion' },
    { name: 'aviso_privacidad',    label: 'Aviso de privacidad' },
    { name: 'aviso_privacidad_url',label: 'URL Aviso de privacidad' },
    { name: 'politica_url',        label: 'Politicas generales' },
  ];
  var polActivas = polFields.filter(function(pf){ return g(pf.name); });
  if (polActivas.length) {
    secHeader('POLITICAS Y REGLAMENTOS', 75, 85, 99);
    polActivas.forEach(function(pf) {
      txt(pf.label + ':', true, 9);
      var val = g(pf.name);
      if (val.startsWith('http')) { urlTxt(val); } else { txt(val, false, 9, 40, 40, 50, 4); }
      blank(2);
    });
    sep();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // HORARIOS
  // ══════════════════════════════════════════════════════════════════════════
  secHeader('HORARIOS');

  var horarios = [];
  if (g('hotel_checkin') || g('hotel_checkout')) {
    horarios.push('Check-in: ' + (g('hotel_checkin')||'—') + ' | Check-out: ' + (g('hotel_checkout')||'—') + ' | Recepcion: 24hrs');
  }
  if (g('desayuno_horario'))     horarios.push('Cafeteria/Desayuno: ' + g('desayuno_horario'));
  if (g('rest_hor_desay'))       horarios.push('Room Service: ' + g('rest_hor_desay'));

  // Servicios con horario de la tabla it-row
  root.querySelectorAll('#s9 .it-row').forEach(function(row) {
    var cb = row.querySelector('input[type=checkbox]');
    if (!cb || !cb.checked) return;
    var sp = row.querySelector('span:first-child');
    var h  = row.querySelectorAll('input[type=text]')[0];
    if (sp && h && h.value.trim()) {
      horarios.push(sp.textContent.trim() + ': ' + h.value.trim());
    }
  });

  if (horarios.length) {
    horarios.forEach(function(h) { bullet(h); });
  } else {
    txt('(Horarios no ingresados)', false, 9, 150, 150, 155);
  }
  blank(2);

  sep();

  // ══════════════════════════════════════════════════════════════════════════
  // ATENCION A INCIDENTES
  // ══════════════════════════════════════════════════════════════════════════
  secHeader('ATENCION A INCIDENTES', 146, 64, 14);

  var incidentes = [
    { label: 'Fallas / Mantenimiento', guion: 'fallas_guion',   url: 'fallas_url' },
    { label: 'Quejas',                 guion: 'quejas_guion',   url: 'quejas_url' },
    { label: 'Sugerencias',            guion: 'sugerencias_guion', url: 'sugerencias_url' },
  ];
  incidentes.forEach(function(inc) {
    var gv = g(inc.guion), uv = g(inc.url);
    if (!gv && !uv) return;
    txt(inc.label + ':', true, 9.5);
    scriptBox(gv);
    urlTxt(uv);
    blank(2);
  });

  sep();

  // ══════════════════════════════════════════════════════════════════════════
  // CONTACTO
  // ══════════════════════════════════════════════════════════════════════════
  secHeader('CONTACTO');

  var contactos = [
    { label: 'Recepcion', fields: ['hotel_email_reservas','email_reservas'] },
    { label: 'Ventas / Admin', fields: ['hotel_email_admin','email_admin'] },
    { label: 'Telefono', fields: ['hotel_telefono'] },
    { label: 'WhatsApp Jaime', fields: ['jaime_whatsapp'] },
  ];
  contactos.forEach(function(c) {
    var val = c.fields.map(g).filter(Boolean)[0] || '';
    if (val) rowLabel(c.label, val);
  });
  blank(2);

  sep();

  // ══════════════════════════════════════════════════════════════════════════
  // LINEAMIENTOS
  // ══════════════════════════════════════════════════════════════════════════
  secHeader('LINEAMIENTOS');

  var lineamientos = [
    'Actuar como un concierge muy amable y profesional, saluda siempre',
    'Priorizar respuestas con link directo al servicio',
    'Responder claro y rapido',
    'Ser amable y directo',
    'No inventar informacion',
    'Escalar a recepcion cuando no se tenga la respuesta',
  ];
  lineamientos.forEach(function(l) { bullet(l); });
  blank(2);

  sep();

  // ══════════════════════════════════════════════════════════════════════════
  // RESTRICCIONES
  // ══════════════════════════════════════════════════════════════════════════
  secHeader('RESTRICCIONES', 146, 64, 14);

  var restricciones = [
    'No compartir datos internos del hotel',
    'No compartir numeros de habitacion ni pisos (solo para validar solicitudes/fallas)',
    'NO confirmar disponibilidad en tiempo real — redirigir siempre al motor de reservas',
    'Lo que no sepas — escalar a recepcion',
    'No inventar informacion',
    'NUNCA compartir nombres de huespedes ni conversaciones con otros huespedes',
    'Siempre mostrar la URL en servicios que la tengan',
    'Urgencias CRITICAS — escalar a recepcion de inmediato',
  ];
  restricciones.forEach(function(r) { bullet(r); });
  blank(2);

  sep();

  // ══════════════════════════════════════════════════════════════════════════
  // REDES SOCIALES
  // ══════════════════════════════════════════════════════════════════════════
  txt('REDES SOCIALES', true, 9.5, 30, 58, 95);
  blank(1);
  var redes = [
    { label: 'Reservaciones', field: 'hotel_motor' },
    { label: 'Facebook',      field: 'hotel_facebook' },
    { label: 'Instagram',     field: 'hotel_instagram' },
  ];
  redes.forEach(function(r) {
    var val = g(r.field);
    if (!val) return;
    textoPlano.pop(); // quita el "Label:" duplicado que push() ya hizo dentro de txt()
    textoPlano.push(r.label + ': ' + val);
    txt(r.label + ':', false, 9, 60, 60, 65);
    y -= 4.5;
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    var lw = doc.getTextWidth(r.label + ':  ');
    doc.setTextColor(14, 100, 200);
    var lns = doc.splitTextToSize(val, aw - lw - 4);
    chk(lns.length * 3.9 + 1);
    doc.text(lns, mg + 4 + lw, y);
    y += lns.length * 3.9 + 1.5;
  });

  // ── Paginacion ───────────────────────────────────────────────────────────
  var tot = doc.internal.getNumberOfPages();
  for (var p = 1; p <= tot; p++) {
    doc.setPage(p);
    doc.setFontSize(7.5); doc.setTextColor(160, 160, 165); doc.setFont('helvetica', 'normal');
    doc.text('Pagina ' + p + ' de ' + tot, pW / 2, 292, { align: 'center' });
    doc.text('Jaime — Contexto ManyChat', mg, 292);
  }

  return {
    doc: doc,
    texto: textoPlano.join('\n'),
    filename: 'Contexto_ManyChat_' + nombre.replace(/[^a-zA-Z0-9\s]/g,'').replace(/\s+/g,'_') + '.pdf'
  };
}


  // ── Render generico de texto plano -> PDF (para Contexto ya guardado/editado) ─
  function renderTextoPDF(texto, hotelNombre) {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    var pW = 210, mg = 14, aw = pW - mg * 2, y = 0;
    var fecha = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });

    function chk(n) { if (y + n > 282) { doc.addPage(); y = 16; } }

    doc.setFillColor(15, 23, 42); doc.rect(0, 0, pW, 30, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
    doc.text('Contexto ManyChat — Jaime', mg, 13);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 212, 191); doc.text(hotelNombre || 'Hotel', mg, 22);
    doc.setTextColor(148, 163, 184); doc.setFontSize(8);
    doc.text('Generado: ' + fecha, pW - mg, 22, { align: 'right' });
    y = 38;

    (texto || '').split('\n').forEach(function (line) {
      var t = line.trim();
      if (!t) { y += 3; return; }
      if (t === '---') {
        chk(6); doc.setDrawColor(200, 200, 205); doc.setLineWidth(0.25);
        doc.line(mg, y, mg + aw, y); y += 5; return;
      }
      if (/^https?:\/\//.test(t)) {
        doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(14, 100, 200);
        var lns = doc.splitTextToSize(t, aw - 4); chk(lns.length * 3.8 + 1);
        doc.text(lns, mg + 4, y); y += lns.length * 3.8 + 1.5; return;
      }
      if (/^Micro guion:/.test(t)) {
        doc.setFontSize(9); doc.setFont('helvetica', 'italic'); doc.setTextColor(30, 64, 175);
        var lns2 = doc.splitTextToSize(t, aw - 8); chk(lns2.length * 3.9 + 4);
        doc.text(lns2, mg + 4, y); y += lns2.length * 3.9 + 2; return;
      }
      if (/^- /.test(t)) {
        doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(40, 40, 50);
        var lns3 = doc.splitTextToSize(t, aw - 6); chk(lns3.length * 3.9 + 1);
        doc.text(lns3, mg + 4, y); y += lns3.length * 3.9 + 1; return;
      }
      if (t === t.toUpperCase() && t.length > 3 && !/^https?:/.test(t)) {
        chk(12);
        doc.setFillColor(30, 58, 95); doc.roundedRect(mg, y - 5, aw, 9, 2, 2, 'F');
        doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5);
        doc.text(t, mg + 4, y + 1); y += 11; return;
      }
      doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 35);
      var lns4 = doc.splitTextToSize(t, aw); chk(lns4.length * 3.9 + 1);
      doc.text(lns4, mg, y); y += lns4.length * 3.9 + 1.5;
    });

    var tot = doc.internal.getNumberOfPages();
    for (var p = 1; p <= tot; p++) {
      doc.setPage(p);
      doc.setFontSize(7.5); doc.setTextColor(160, 160, 165); doc.setFont('helvetica', 'normal');
      doc.text('Pagina ' + p + ' de ' + tot, pW / 2, 292, { align: 'center' });
      doc.text('Jaime — Contexto ManyChat', mg, 292);
    }
    return { doc: doc, filename: 'Contexto_ManyChat_' + (hotelNombre || 'Hotel').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') + '.pdf' };
  }

  // ── Acciones de alto nivel para botones del sidebar / Constructor ─────────
  function descargarFichaPDF(hotel) {
    ensureJsPDF(function () {
      cargarFormularioOculto(hotel.formData).then(function (rootDoc) {
        var r = exportarPDF(rootDoc);
        r.doc.save(r.filename);
      });
    });
  }

  // Descarga el Contexto YA GUARDADO (respeta ediciones manuales del usuario)
  function descargarContextoPDF(hotel) {
    ensureJsPDF(function () {
      var r = renderTextoPDF(hotel.contexto, hotel.nombre);
      r.doc.save(r.filename);
    });
  }

  // Construye desde cero a partir del formulario guardado, guarda y descarga
  function construirYGuardarContexto(hotelId, cb) {
    var hotel = getHotelById(hotelId);
    if (!hotel) { cb && cb(new Error('Hotel no encontrado')); return; }
    ensureJsPDF(function () {
      cargarFormularioOculto(hotel.formData).then(function (rootDoc) {
        var r = construirContexto(rootDoc);
        updateHotel(hotelId, { contexto: r.texto, contextoFecha: new Date().toISOString() });
        r.doc.save(r.filename);
        cb && cb(null, r);
      }).catch(function (err) { cb && cb(err); });
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.jaimeSidebar = {
    open: open,
    close: close,
    toggle: toggle,
    getDynamicHotels: getDynamicHotels,
    saveDynamicHotel: saveDynamicHotel,
    makeInitials: makeInitials,
    makeSlug: makeSlug,
    descargarFichaPDF: function (hotelId) {
      var hotel = getHotelById(hotelId);
      if (!hotel) { alert('No se encontro el hotel.'); return; }
      descargarFichaPDF(hotel);
    },
    descargarContextoPDF: function (hotelId) {
      var hotel = getHotelById(hotelId);
      if (!hotel) { alert('No se encontro el hotel.'); return; }
      if (!hotel.contexto) {
        alert('Este hotel aun no tiene un Contexto ManyChat construido. Usa "Constructor de Contexto" primero.');
        return;
      }
      descargarContextoPDF(hotel);
    },
  };

  window.JaimeHotelData = {
    getHotelById: getHotelById,
    updateHotel: updateHotel,
    getDynamicHotels: getDynamicHotels,
    saveDynamicHotel: saveDynamicHotel,
    ensureJsPDF: ensureJsPDF,
    recopilarFormData: recopilarFormData,
    llenarFormDesdeData: llenarFormDesdeData,
    cargarFormularioOculto: cargarFormularioOculto,
    recopilarDatosFormulario: recopilarDatosFormulario,
    exportarPDF: exportarPDF,
    exportarDOC: exportarDOC,
    descargarDOC: descargarDOC,
    construirContexto: construirContexto,
    descargarFichaPDF: descargarFichaPDF,
    descargarContextoPDF: descargarContextoPDF,
    construirYGuardarContexto: construirYGuardarContexto,
    renderTextoPDF: renderTextoPDF,
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
