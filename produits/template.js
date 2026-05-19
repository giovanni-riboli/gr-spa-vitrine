/**
 * Giovanni Riboli — Fiche produit dynamique (Supabase)
 * Inclure ce script dans chaque fiche produit HTML.
 * Le slug est défini dans une variable globale PRODUCT_SLUG avant ce script.
 */
(function () {
  'use strict';
  var SUPABASE_URL = 'https://ohjzggceozamhdesecxi.supabase.co';
  var ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njc5MDYsImV4cCI6MjA5MjM0MzkwNn0.wW-tqXBDUtKURR31bh3CUWIcuYMUJTZLqq2LLT1kJnA';

  if (typeof PRODUCT_SLUG === 'undefined') return;

  fetch(SUPABASE_URL + '/rest/v1/produits?slug=eq.' + PRODUCT_SLUG + '&select=*', {
    headers: { 'apikey': ANON_KEY, 'Authorization': 'Bearer ' + ANON_KEY }
  })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data || !data[0]) return;
      var p = data[0];

      // === HERO ===
      var titleEl = document.querySelector('.product-title');
      if (titleEl) titleEl.textContent = p.nom;

      var taglineEl = document.querySelector('.product-tagline');
      if (taglineEl && p.description_courte) taglineEl.textContent = p.description_courte;

      var badge = document.querySelector('.gamme-badge');
      if (badge) {
        var gammeLabel = { relax: 'Relax', energy: 'Energy', luxury: 'Luxury', nage: 'Spa de Nage' };
        badge.textContent = (gammeLabel[p.gamme] || p.gamme) + (p.ligne ? ' — ' + p.ligne.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) : '');
      }

      // === QUICK SPECS ===
      var qs = document.querySelector('.quick-specs');
      if (qs) {
        var dim = p.longueur_cm && p.largeur_cm && p.hauteur_cm
          ? p.longueur_cm + ' × ' + p.largeur_cm + ' × ' + p.hauteur_cm + ' cm' : null;

        var places = '';
        if (p.nb_places_assises > 0 && p.nb_places_allongees > 0)
          places = p.nb_places_assises + ' assise' + (p.nb_places_assises > 1 ? 's' : '') + ' + ' + p.nb_places_allongees + ' allongée' + (p.nb_places_allongees > 1 ? 's' : '');
        else if (p.nb_places_assises > 0)
          places = p.nb_places_assises + ' assise' + (p.nb_places_assises > 1 ? 's' : '');
        else if (p.nb_places_allongees > 0)
          places = p.nb_places_allongees + ' allongée' + (p.nb_places_allongees > 1 ? 's' : '');
        else if (p.nb_places)
          places = p.nb_places + ' place' + (p.nb_places > 1 ? 's' : '');

        var isoLabel = p.isolation || '';
        if (isoLabel.indexOf('ISOPLUS') !== -1) isoLabel = 'ISOPLUS®';

        var qsItems = [
          { value: p.nb_buses || '', label: 'Buses inox' },
          { value: p.longueur_cm || '', label: dim || 'Dimensions' },
          { value: places || (p.nb_places ? p.nb_places + ' places' : ''), label: 'Places' },
          { value: isoLabel || '', label: 'Isolation' }
        ];
        var cards = qs.querySelectorAll('.quick-spec');
        qsItems.forEach(function (item, i) {
          if (!cards[i]) return;
          var v = cards[i].querySelector('.quick-spec__value');
          var l = cards[i].querySelector('.quick-spec__label');
          if (v && item.value) v.textContent = item.value;
          if (l && item.label) l.textContent = item.label;
        });
      }

      // === SPECS TABLE ===
      var table = document.querySelector('.specs-table tbody');
      if (table) {
        var rows = [];
        function add(label, value) { if (value) rows.push([label, value]); }

        add('Nombre de buses', p.nb_buses ? p.nb_buses + ' buses inox' : null);
        if (p.nb_places_assises > 0 || p.nb_places_allongees > 0) {
          var pl = '';
          if (p.nb_places_assises > 0) pl += p.nb_places_assises + ' assise' + (p.nb_places_assises > 1 ? 's' : '');
          if (p.nb_places_assises > 0 && p.nb_places_allongees > 0) pl += ' + ';
          if (p.nb_places_allongees > 0) pl += p.nb_places_allongees + ' allongée' + (p.nb_places_allongees > 1 ? 's' : '');
          add('Places', pl);
        } else if (p.nb_places) add('Places', p.nb_places + ' places');
        add('Volume', p.volume_eau_l ? p.volume_eau_l.toLocaleString('fr-FR') + ' L' : null);
        if (p.longueur_cm && p.largeur_cm && p.hauteur_cm)
          add('Dimensions', p.longueur_cm + ' × ' + p.largeur_cm + ' × ' + p.hauteur_cm + ' cm');
        add('Poids à vide', p.poids_kg ? p.poids_kg + ' kg' : null);
        add('Puissance', p.puissance_kw ? p.puissance_kw + ' kW' : null);
        add('Chauffage', p.chauffage || null);

        var pompes = [];
        if (p.nb_pompes_massage > 0) pompes.push(p.nb_pompes_massage + ' pompe' + (p.nb_pompes_massage > 1 ? 's' : '') + ' massage');
        if (p.nb_pompes_filtration > 0) pompes.push(p.nb_pompes_filtration + ' pompe' + (p.nb_pompes_filtration > 1 ? 's' : '') + ' filtration');
        if (p.pompe_air) pompes.push('Pompe air');
        if (pompes.length) add('Pompe(s)', pompes.join(' + '));

        add('Isolation', p.isolation || null);
        add('Structure', p.structure_aluminium || null);
        add('Habillage', p.habillage || null);

        if (p.traitement_uv && p.traitement_uv !== 'Non' && p.traitement_uv !== false)
          add('Traitement UV', typeof p.traitement_uv === 'string' ? p.traitement_uv : 'Série');
        if (p.aromatherapie === true) add('Aromathérapie', 'Série');
        if (p.leds_rgb) add('Chromothérapie', 'LED RGB');
        if (p.cascade_rgb > 0) add('Cascade RGB', p.cascade_rgb + ' unité' + (p.cascade_rgb > 1 ? 's' : ''));

        table.innerHTML = rows.map(function (r) {
          return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>';
        }).join('');
      }

      // === POINTS FORTS ===
      if (p.points_forts && Array.isArray(p.points_forts) && p.points_forts.length > 0) {
        var pfSection = document.getElementById('points-forts');
        if (pfSection) {
          var ul = pfSection.querySelector('ul') || document.createElement('ul');
          ul.className = 'points-forts-list';
          ul.innerHTML = p.points_forts.map(function (pt) {
            return '<li>' + pt + '</li>';
          }).join('');
          if (!pfSection.querySelector('ul')) pfSection.appendChild(ul);
        }
      }

      // === EQUIPEMENTS ===
      var equipGrid = document.querySelector('.equip-grid');
      if (equipGrid) {
        var equips = [];
        function addEquip(icon, label) { equips.push({ icon: icon, label: label }); }

        if (p.nb_buses) addEquip('💧', p.nb_buses + ' jets inox');
        if (p.nb_pompes_massage) addEquip('⚡', p.nb_pompes_massage + ' pompe' + (p.nb_pompes_massage > 1 ? 's' : '') + ' massage');
        if (p.chauffage) addEquip('🔥', 'Chauffage ' + p.chauffage);
        if (p.traitement_uv && p.traitement_uv !== 'Non') addEquip('🔬', 'Traitement UV');
        if (p.aromatherapie) addEquip('🌿', 'Aromathérapie');
        if (p.leds_rgb) addEquip('🌈', 'Chromothérapie LED RGB');
        if (p.cascade_rgb > 0) addEquip('🌊', 'Cascade RGB');
        if (p.pompe_air) addEquip('💨', 'Pompe à air');
        if (p.isolation) addEquip('🧊', 'Isolation ' + p.isolation);
        if (p.structure_aluminium) addEquip('🛡️', 'Structure ' + p.structure_aluminium);
        if (p.revetement_interieur) addEquip('✨', p.revetement_interieur);

        if (equips.length) {
          equipGrid.innerHTML = equips.map(function (e) {
            return '<div class="equip-item"><span class="equip-icon">' + e.icon + '</span><span class="equip-label">' + e.label + '</span></div>';
          }).join('');
        }
      }
    })
    .catch(function () { /* silently fail, static content remains */ });
})();
