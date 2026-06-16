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
  function buildSidebar() {
    var hotels = getDynamicHotels();

    var dynamicItems = hotels.map(function (h) {
      var slug = h.slug || makeSlug(h.nombre || '');
      var initials = makeInitials(h.nombre);
      var href = '/hoteles/' + slug + '/';
      return '<a href="' + href + '" class="j-nav-item' + (isActive(href) ? ' j-nav-active' : '') + '">' +
        '<span class="j-hotel-badge">' + escHtml(initials) + '</span>' +
        '<span class="j-nav-label" style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(h.nombre || 'Hotel') + '</span>' +
        '</a>';
    }).join('');

    return '<aside id="j-sidebar" class="j-sidebar">' +

      // ── Logo ──
      '<div class="j-sidebar-logo">' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
          '<div style="width:36px;height:36px;background:#D97706;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
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
            '<span class="material-symbols-outlined j-nav-icon">home</span>Inicio' +
          '</a>' +
          '<a href="/extractor/" class="j-nav-item' + (isActive('/extractor/') ? ' j-nav-active' : '') + '">' +
            '<span class="material-symbols-outlined j-nav-icon">auto_awesome</span>Extractor IA' +
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
            '<span class="material-symbols-outlined j-nav-icon">assignment</span>Formulario Onboarding' +
          '</a>' +
          '<a href="/plantillas/PLANTILLA_FORMULARIO_CONVENIO.html" class="j-nav-item' + (isActive('/plantillas/PLANTILLA_FORMULARIO_CONVENIO') ? ' j-nav-active' : '') + '">' +
            '<span class="material-symbols-outlined j-nav-icon">handshake</span>Formulario Convenio' +
          '</a>' +
        '</div>' +

        '<div class="j-nav-group">' +
          '<p class="j-nav-section-label">Hoteles Implementados</p>' +
          '<a href="/hoteles/BEWOW_QUERETARO/" class="j-nav-item' + (isActive('/hoteles/BEWOW_QUERETARO/') ? ' j-nav-active' : '') + '">' +
            '<span class="j-hotel-badge">BW</span>' +
            '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">BeWow Querétaro</span>' +
            '<span style="width:6px;height:6px;border-radius:50%;background:#F59E0B;flex-shrink:0;"></span>' +
          '</a>' +
          dynamicItems +
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
             'onmouseover="this.style.color=\'#D97706\'" onmouseout="this.style.color=\'rgba(255,255,255,.3)\'">442 131 4203</a>' +
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
      ':root{--j-sidebar-w:260px;--j-slate:#0F172A;--j-navy:#1E3A5F;--j-gold:#D97706;--j-amber:#F59E0B;}',

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
      '.j-nav-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;color:rgba(255,255,255,.55);font-size:13px;font-family:Inter,sans-serif;font-weight:500;text-decoration:none;transition:background .15s,color .15s,border-left-color .15s;cursor:pointer;background:none;border:none;width:100%;text-align:left;border-left:2px solid transparent;}',
      '.j-nav-item:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.9);}',
      '.j-nav-active{background:rgba(30,58,95,.55)!important;color:white!important;border-left-color:var(--j-gold)!important;padding-left:8px;}',
      '.j-nav-icon{font-size:17px;flex-shrink:0;font-variation-settings:\'FILL\' 0,\'wght\' 300,\'GRAD\' 0,\'opsz\' 24;}',
      '.j-hotel-badge{width:22px;height:22px;border-radius:5px;background:rgba(30,58,95,.8);color:var(--j-gold);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;letter-spacing:0;}',
      '.j-add-hotel-btn{opacity:.45;}.j-add-hotel-btn:hover{opacity:1;}',

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

  // ── DOM injection ─────────────────────────────────────────────────────────
  function inject() {
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

  // ── Public API ────────────────────────────────────────────────────────────
  window.jaimeSidebar = {
    open: open,
    close: close,
    toggle: toggle,
    getDynamicHotels: getDynamicHotels,
    saveDynamicHotel: saveDynamicHotel,
    makeInitials: makeInitials,
    makeSlug: makeSlug,
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
