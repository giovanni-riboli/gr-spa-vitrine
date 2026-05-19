/**
 * Giovanni Riboli — Chargement dynamique des produits par gamme (Supabase)
 * Utilisation : définir GAMME_KEY avant ce script, ex: var GAMME_KEY = 'luxury';
 */
(function () {
  'use strict';
  var SUPABASE_URL = 'https://ohjzggceozamhdesecxi.supabase.co';
  var ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njc5MDYsImV4cCI6MjA5MjM0MzkwNn0.wW-tqXBDUtKURR31bh3CUWIcuYMUJTZLqq2LLT1kJnA';

  if (typeof GAMME_KEY === 'undefined') return;

  fetch(SUPABASE_URL + '/rest/v1/produits?gamme=eq.' + GAMME_KEY + '&actif=eq.true&select=slug,nom,ligne,description_courte,nb_places,nb_places_assises,nb_places_allongees,nb_buses,longueur_cm,largeur_cm,hauteur_cm&order=ligne,nom', {
    headers: { 'apikey': ANON_KEY, 'Authorization': 'Bearer ' + ANON_KEY }
  })
    .then(function (r) { return r.json(); })
    .then(function (products) {
      if (!products || !products.length) return;

      // Group by ligne
      var groups = {};
      products.forEach(function (p) {
        var ligne = p.ligne || 'default';
        if (!groups[ligne]) groups[ligne] = [];
        groups[ligne].push(p);
      });

      // Find all gamme-models sections and replace their grids
      var sections = document.querySelectorAll('.gamme-models, .gamme-models--alt');
      
      // Build cards for each product
      function buildCard(p) {
        var places = '';
        if (p.nb_places_assises > 0 && p.nb_places_allongees > 0)
          places = p.nb_places_assises + ' assise' + (p.nb_places_assises > 1 ? 's' : '') + ' + ' + p.nb_places_allongees + ' allongée' + (p.nb_places_allongees > 1 ? 's' : '');
        else if (p.nb_places_assises > 0)
          places = p.nb_places_assises + ' assise' + (p.nb_places_assises > 1 ? 's' : '');
        else if (p.nb_places_allongees > 0)
          places = p.nb_places_allongees + ' allongée' + (p.nb_places_allongees > 1 ? 's' : '');
        else if (p.nb_places > 0)
          places = p.nb_places + ' place' + (p.nb_places > 1 ? 's' : '');

        var dims = '';
        if (p.longueur_cm && p.largeur_cm) {
          dims = p.longueur_cm + ' × ' + p.largeur_cm;
          if (p.hauteur_cm) dims += ' × ' + p.hauteur_cm;
          dims += ' cm';
        }

        return '<article class="model-card">' +
          '<div class="model-card__image"><div class="model-card__placeholder">' +
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c7a260" stroke-width="1">' +
          '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>' +
          '</svg><span>Photo ' + p.nom + '</span></div></div>' +
          '<div class="model-card__content">' +
          '<h3 class="model-card__name"><a href="/produits/' + p.slug + '.html">' + p.nom + '</a></h3>' +
          (p.description_courte ? '<p class="model-card__subtitle">' + p.description_courte + '</p>' : '') +
          '<div class="model-card__specs">' +
          (places ? '<div class="spec"><span class="spec__label">Places</span><span class="spec__value">' + places + '</span></div>' : '') +
          (p.nb_buses ? '<div class="spec"><span class="spec__label">Buses</span><span class="spec__value">' + p.nb_buses + '</span></div>' : '') +
          (dims ? '<div class="spec"><span class="spec__label">Dimensions</span><span class="spec__value">' + dims + '</span></div>' : '') +
          '</div>' +
          '<a class="model-card__link" href="/produits/' + p.slug + '.html">Découvrir ce spa →</a>' +
          '</div></article>';
      }

      // Replace all model grids with dynamic content
      var grids = document.querySelectorAll('.gamme-models__grid');
      if (grids.length === 0) return;

      // If only one section, put all products in it
      if (grids.length === 1) {
        grids[0].innerHTML = products.map(buildCard).join('');
        return;
      }

      // Multiple sections: try to match by ligne grouping
      var ligneKeys = Object.keys(groups);
      grids.forEach(function (grid, i) {
        if (i < ligneKeys.length) {
          grid.innerHTML = groups[ligneKeys[i]].map(buildCard).join('');
        }
      });
    })
    .catch(function (e) { console.error('Erreur chargement produits:', e); });
})();
