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

        if (p.nb_buses) addEquip('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>', p.nb_buses + ' jets inox');
        if (p.nb_pompes_massage) addEquip('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>', p.nb_pompes_massage + ' pompe' + (p.nb_pompes_massage > 1 ? 's' : '') + ' massage');
        if (p.chauffage) addEquip('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>', 'Chauffage ' + p.chauffage);
        if (p.traitement_uv && p.traitement_uv !== 'Non') addEquip('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/></svg>', 'Traitement UV');
        if (p.aromatherapie) addEquip('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>', 'Aromathérapie');
        if (p.leds_rgb) addEquip('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M22 17a10 10 0 00-20 0M6 17a6 6 0 0112 0M10 17a2 2 0 014 0"/></svg>', 'Chromothérapie LED RGB');
        if (p.cascade_rgb > 0) addEquip('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12c1.5 0 3-1 4.5-1s3 1 4.5 1 3-1 4.5-1 3 1 4.5 1M3 17c1.5 0 3-1 4.5-1s3 1 4.5 1 3-1 4.5-1 3 1 4.5 1"/></svg>', 'Cascade RGB');
        if (p.pompe_air) addEquip('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg>', 'Pompe à air');
        if (p.isolation) addEquip('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>', 'Isolation ' + p.isolation);
        if (p.structure_aluminium) addEquip('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', 'Structure ' + p.structure_aluminium);
        if (p.revetement_interieur) addEquip('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>', p.revetement_interieur);

        if (equips.length) {
          equipGrid.innerHTML = equips.map(function (e) {
            return '<div class="equip-item"><span class="equip-icon">' + e.icon + '</span><span class="equip-label">' + e.label + '</span></div>';
          }).join('');
        }
      }


      // === BOUTON MA SÉLECTION ===
      var heartBtn = document.getElementById('heartBtn');
      if (heartBtn && p.slug && window.GRSelection) {
        var isInSel = GRSelection.has(p.slug);
        heartBtn.setAttribute('aria-label', isInSel ? 'Retirer de ma sélection' : 'Ajouter à ma sélection');
        heartBtn.classList.toggle('heart-active', isInSel);
        heartBtn.onclick = function() {
          var added = GRSelection.toggle(p.slug, p.nom, p.gamme, p.nb_places, p.nb_buses);
          heartBtn.classList.toggle('heart-active');
          heartBtn.setAttribute('aria-label', heartBtn.classList.contains('heart-active') ? 'Retirer de ma sélection' : 'Ajouter à ma sélection');
          // Toast
          var toast = document.createElement('div');
          toast.style.cssText = 'position:fixed;bottom:80px;right:20px;background:#1a2d3e;color:#fff;padding:12px 20px;border-radius:8px;font-size:13px;font-family:Inter,sans-serif;z-index:999;border-left:3px solid #c7a260;box-shadow:0 4px 12px rgba(0,0,0,.2)';
          toast.textContent = heartBtn.classList.contains('heart-active') ? '♥ Ajouté à votre sélection' : 'Retiré de votre sélection';
          document.body.appendChild(toast);
          setTimeout(function(){ toast.remove(); }, 2500);
        };
      }

      // === COMPARER CE MODELE ===
      var compareBtn = document.getElementById('product-compare-btn');
      if (compareBtn && p.slug) {
        compareBtn.href = '../comparateur.html?pre=' + p.slug;
        compareBtn.style.display = 'inline-flex';
      }

      // === MODELES SIMILAIRES ===
      var similarSection = document.getElementById('similar-products');
      if (similarSection && p.gamme) {
        fetch(
          'https://ohjzggceozamhdesecxi.supabase.co/rest/v1/produits?gamme=eq.' + p.gamme + '&slug=neq.' + p.slug + '&actif=eq.true&select=slug,nom,gamme,nb_places,nb_buses&limit=3',
          { headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njc5MDYsImV4cCI6MjA5MjM0MzkwNn0.wW-tqXBDUtKURR31bh3CUWIcuYMUJTZLqq2LLT1kJnA', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njc5MDYsImV4cCI6MjA5MjM0MzkwNn0.wW-tqXBDUtKURR31bh3CUWIcuYMUJTZLqq2LLT1kJnA' } }
        ).then(function(r) { return r.json(); }).then(function(similar) {
          if (!similar || !similar.length) return;
          similarSection.style.display = 'block';
          var grid = document.getElementById('similar-grid');
          if (grid) {
            grid.innerHTML = similar.map(function(s) {
              return '<a href="../produits/' + s.slug + '.html" class="similar-card">' +
                '<img src="../assets/produits/' + s.slug + '.jpg" alt="' + s.nom + '" style="width:100%;height:120px;object-fit:contain;border-radius:6px;background:#f8f6f2;margin-bottom:12px" onerror="this.style.display='none'">' +
                '<div class="similar-gamme">' + (s.gamme.charAt(0).toUpperCase() + s.gamme.slice(1)) + '</div>' +
                '<div class="similar-nom">' + s.nom + '</div>' +
                '<div class="similar-specs">' + (s.nb_places || '—') + ' places · ' + (s.nb_buses || '—') + ' buses</div>' +
                '<span class="similar-cta">Voir le modèle →</span>' +
              '</a>';
            }).join('');
          }
        }).catch(function(){});
      }

    })
    .catch(function () { /* silently fail, static content remains */ });
})();
