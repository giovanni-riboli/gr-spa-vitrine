/* ============================================
   GR SPA — nav.js — Composant Navigation
   Injecte le header dans <div id="gr-nav"></div>
   Paramètre optionnel : window.GR_NAV_TRANSPARENT = true
   ============================================ */
(function () {
  var el = document.getElementById('gr-nav');
  if (!el) return;

  var transparent = window.GR_NAV_TRANSPARENT === true;
  var navClass = 'nav' + (transparent ? ' nav--transparent' : ' nav--solid');

  el.innerHTML =
    '<header class="' + navClass + '" id="nav">' +
    '<div class="nav__inner">' +

      '<a class="nav__logo" href="/">' +
        '<img src="/assets/logo-noir.svg" alt="Giovanni Riboli" class="nav__logo-img nav__logo-dark">' +
        '<img src="/assets/logo-blanc.svg" alt="Giovanni Riboli" class="nav__logo-img nav__logo-light">' +
      '</a>' +

      '<ul class="nav__menu">' +
        '<li>' +
          '<a href="#">Nos spas</a>' +
          '<div class="mega-menu">' +
            '<div class="mega-menu__inner">' +
              '<div class="mega-menu__col">' +
                '<div class="mega-menu__col-title">Nos gammes</div>' +
                '<ul>' +
                  '<li><a href="/gammes/relax">Gamme Relax</a></li>' +
                  '<li><a href="/gammes/energy">Gamme Energy</a></li>' +
                  '<li><a href="/gammes/luxury">Gamme Luxury</a></li>' +
                  '<li><a href="/gammes/spa-de-nage">Spa de nage</a></li>' +
                '</ul>' +
              '</div>' +
              '<div class="mega-menu__col">' +
                '<div class="mega-menu__col-title">Nos modèles</div>' +
                '<ul>' +
                  '<li><a href="/produits/amalfi">Amalfi</a></li>' +
                  '<li><a href="/produits/bari">Bari</a></li>' +
                  '<li><a href="/produits/capri">Capri</a></li>' +
                  '<li><a href="/produits/roma">Roma</a></li>' +
                  '<li><a href="/produits/napoli">Napoli</a></li>' +
                  '<li><a href="/produits/torino">Torino</a></li>' +
                  '<li><a href="/produits/napoli-luxe">Napoli Luxe</a></li>' +
                  '<li><a href="/produits/roma-luxe">Roma Luxe</a></li>' +
                  '<li><a href="/produits/torino-luxe">Torino Luxe</a></li>' +
                '</ul>' +
              '</div>' +
              '<div class="mega-menu__col mega-menu__col--tools">' +
                '<div class="mega-menu__col-title">Découvrir</div>' +
                '<ul>' +
                  '<li><a href="/a-propos">Notre histoire</a></li>' +
                  '<li><a href="/quiz">Trouver mon spa</a></li>' +
                  '<li><a href="/comparateur">Comparer les modèles</a></li>' +
                  '<li><a href="/financement">Simuler le financement</a></li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</li>' +
        '<li><a href="/comparateur">Comparer</a></li>' +
        '<li><a href="/financement">Financement</a></li>' +
        '<li><a href="/revendeurs">Nos magasins</a></li>' +
        '<li><a href="/blog">Blog</a></li>' +
      '</ul>' +

      '<div class="nav__right">' +
        '<a class="nav__cta" href="/quiz">Trouver mon spa \u2192</a>' +
        '<a class="nav__sel-btn" href="/ma-selection" aria-label="Ma sélection" title="Ma sélection">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>' +
          '<span id="selectionBadge" style="display:none;position:absolute;top:-4px;right:-4px;background:#c7a260;color:#1a2d3e;font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;align-items:center;justify-content:center;font-family:\'Inter\',sans-serif;">0</span>' +
        '</a>' +
        '<a class="nav__pro-btn nav__pro-btn--desktop" href="https://pro.gr-spa.com" aria-label="Espace pro" title="Espace pro">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' +
        '</a>' +
      '</div>' +

      '<button class="nav__burger" id="navBurger" aria-label="Menu">' +
        '<span></span><span></span><span></span>' +
      '</button>' +

    '</div>' + /* nav__inner */

    '<div class="nav__mobile-overlay" id="navMobile">' +
      '<ul>' +
        '<li>' +
          '<button class="mobile-accordion-toggle">Nos spas <span class="mobile-arrow">\u25be</span></button>' +
          '<div class="mobile-submenu">' +
            '<div class="mobile-sub-title">Nos gammes</div>' +
            '<ul>' +
              '<li><a href="/gammes/relax">Gamme Relax</a></li>' +
              '<li><a href="/gammes/energy">Gamme Energy</a></li>' +
              '<li><a href="/gammes/luxury">Gamme Luxury</a></li>' +
              '<li><a href="/gammes/spa-de-nage">Spa de nage</a></li>' +
            '</ul>' +
            '<div class="mobile-sub-title">Nos modèles</div>' +
            '<ul>' +
              '<li><a href="/produits/amalfi">Amalfi</a></li>' +
              '<li><a href="/produits/bari">Bari</a></li>' +
              '<li><a href="/produits/capri">Capri</a></li>' +
              '<li><a href="/produits/roma">Roma</a></li>' +
              '<li><a href="/produits/napoli">Napoli</a></li>' +
              '<li><a href="/produits/torino">Torino</a></li>' +
            '</ul>' +
          '</div>' +
        '</li>' +
        '<li><a href="/comparateur">Comparer</a></li>' +
        '<li><a href="/financement">Financement</a></li>' +
        '<li><a href="/revendeurs">Nos magasins</a></li>' +
        '<li><a href="/blog">Blog</a></li>' +
      '</ul>' +
      '<div class="nav__mobile-sep"></div>' +
      '<div class="nav__mobile-icons">' +
        '<a class="nav__mobile-icon-btn" href="/ma-selection" aria-label="Ma sélection" title="Ma sélection">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>' +
          '<span>Ma sélection</span>' +
        '</a>' +
        '<a class="nav__mobile-icon-btn" href="https://pro.gr-spa.com" aria-label="Espace pro" title="Espace pro">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' +
          '<span>Espace pro</span>' +
        '</a>' +
      '</div>' +
      '<a class="nav__mobile-cta" href="/quiz">Trouver mon spa \u2192</a>' +
    '</div>' + /* nav__mobile-overlay */

    '</header>';

  /* ---- Comportements nav (scroll, burger, mega menu, accordion) ---- */

  var navEl = document.getElementById('nav');
  var burgerEl = document.getElementById('navBurger');
  var mobileOverlay = document.getElementById('navMobile');

  /* Scroll transparent → scrolled */
  if (navEl && transparent) {
    function checkScroll() {
      if (window.scrollY > 60) {
        navEl.classList.add('nav--scrolled');
      } else {
        navEl.classList.remove('nav--scrolled');
      }
    }
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* Burger toggle */
  if (burgerEl && mobileOverlay) {
    burgerEl.addEventListener('click', function () {
      burgerEl.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });
  }

  /* Mobile accordion */
  document.querySelectorAll('.mobile-accordion-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var submenu = this.nextElementSibling;
      var isActive = submenu.classList.contains('active');
      document.querySelectorAll('.mobile-submenu.active').forEach(function (s) { s.classList.remove('active'); });
      document.querySelectorAll('.mobile-accordion-toggle.active').forEach(function (b) { b.classList.remove('active'); });
      if (!isActive) {
        submenu.classList.add('active');
        this.classList.add('active');
      }
    });
  });

  /* Mega menu : fond blanc */
  document.querySelectorAll('.nav__menu > li').forEach(function (li) {
    li.addEventListener('mouseenter', function () {
      if (li.querySelector('.mega-menu')) {
        navEl.classList.add('nav--mega-open');
      }
    });
    li.addEventListener('mouseleave', function () {
      navEl.classList.remove('nav--mega-open');
    });
  });

  /* Clic hors mega menu → fermer */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__menu') && !e.target.closest('.mega-menu')) {
      document.querySelectorAll('.nav__menu > li').forEach(function (li) {
        li.classList.remove('mega-open');
      });
      if (navEl) navEl.classList.remove('nav--mega-open');
    }
  });

})();

/* Signale aux autres scripts que le nav est déjà initialisé */
window.GR_NAV_LOADED = true;
