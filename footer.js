/* ============================================
   GR SPA — footer.js — Composant Footer
   Injecte le footer dans <div id="gr-footer"></div>
   ============================================ */
(function () {
  var el = document.getElementById('gr-footer');
  if (!el) return;

  el.innerHTML =
    '<footer class="footer" id="contact">' +
    '<div class="container footer__inner">' +

      '<div class="footer__brand">' +
        '<img src="/assets/logo-blanc.svg" alt="Giovanni Riboli" class="footer__logo">' +
        '<p class="footer__tagline">L\'art du spa à domicile.</p>' +
        '<p class="footer__address">Giovanni Riboli — France</p>' +
      '</div>' +

      '<div class="footer__nav">' +
        '<h4>Produits</h4>' +
        '<a href="/gammes/relax">Gamme Relax</a>' +
        '<a href="/gammes/energy">Gamme Energy</a>' +
        '<a href="/gammes/luxury">Gamme Luxury</a>' +
        '<a href="/gammes/spa-de-nage">Spa de Nage</a>' +
      '</div>' +

      '<div class="footer__nav">' +
        '<h4>Découvrir</h4>' +
        '<a href="/a-propos">Notre histoire</a>' +
        '<a href="/revendeurs">Nos magasins</a>' +
        '<a href="https://pro.gr-spa.com">Espace Pro</a>' +
        '<a href="/blog">Blog</a>' +
      '</div>' +

      '<div class="footer__nav">' +
        '<h4>Outils</h4>' +
        '<a href="/financement">Simulateur de financement</a>' +
        '<a href="/comparateur">Comparer les modèles</a>' +
        '<a href="/quiz">Configurateur</a>' +
      '</div>' +

      '<div class="footer__nav">' +
        '<h4>Légal</h4>' +
        '<a href="/cgv">Conditions de vente</a>' +
        '<a href="/mentions-legales">Mentions légales</a>' +
        '<a href="/politique-confidentialite">Vie privée</a>' +
        '<a href="/politique-cookies">Politique cookies</a>' +
        '<a href="#" id="cookieSettings">Gérer mes cookies</a>' +
      '</div>' +

      '<div class="footer__nav">' +
        '<h4>Contact</h4>' +
        '<a href="https://go.gr-spa.com/" target="_blank">go.gr-spa.com</a>' +
        '<p class="footer__address-detail">2 Rue Paul Emile-Victor<br>17640 Vaux-sur-Mer</p>' +
      '</div>' +

    '</div>' +
    '<div class="footer__bottom">' +
      '<div class="container">' +
        '<p>&copy; 2026 Giovanni Riboli \u2014 Tous droits r\u00e9serv\u00e9s</p>' +
      '</div>' +
    '</div>' +
    '</footer>';

  // ─── Bandeau cookie (injecté sur toutes les pages) ───────────────
  if (!document.getElementById('cookieBanner')) {
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookieBanner';
    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<div class="cookie-banner__text">' +
          '<p><strong>Nous utilisons des cookies</strong> pour améliorer votre expérience et mesurer notre trafic. Vous pouvez accepter ou personnaliser vos préférences.</p>' +
        '</div>' +
        '<div class="cookie-banner__actions">' +
          '<button class="btn btn--outline btn--sm" id="cookieCustomize">Personnaliser</button>' +
          '<button class="btn btn--ghost-dark btn--sm" id="cookieRefuse">Refuser</button>' +
          '<button class="btn btn--primary btn--sm" id="cookieAccept">Tout accepter</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);
  }

  // ─── Chargement cookie-manager.js ──────────────────────────────
  if (!document.querySelector('script[src*="cookie-manager"]')) {
    var cm = document.createElement('script');
    cm.src = '/cookie-manager.js';
    document.body.appendChild(cm);
  }

})();
