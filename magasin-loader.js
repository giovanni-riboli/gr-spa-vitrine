/* =====================================================================
   magasin-loader.js — Chargeur dynamique pages magasins GR Spa
   Charge les données depuis Supabase selon MAGASIN_SLUG
   Injecte badge bleu (revendeur) ou doré (propre), carte, meta tags
   ===================================================================== */
(async () => {
    if (typeof MAGASIN_SLUG === 'undefined') return;

    const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njc5MDYsImV4cCI6MjA5MjM0MzkwNn0.wW-tqXBDUtKURR31bh3CUWIcuYMUJTZLqq2LLT1kJnA';

    let m;
    try {
        const res = await fetch(
            `https://ohjzggceozamhdesecxi.supabase.co/rest/v1/magasins?slug=eq.${MAGASIN_SLUG}&select=*`,
            { headers: { 'apikey': ANON, 'Authorization': `Bearer ${ANON}` } }
        );
        const data = await res.json();
        m = data[0];
    } catch (e) {
        console.warn('[magasin-loader] fetch error:', e);
        return;
    }
    if (!m) {
        console.warn('[magasin-loader] slug introuvable:', MAGASIN_SLUG);
        return;
    }

    const isPropre  = m.type === 'propre';
    const badgeText = isPropre ? 'SHOWROOM OFFICIEL GIOVANNI RIBOLI' : 'REVENDEUR AGRÉÉ GIOVANNI RIBOLI';
    const typeClass = isPropre ? 'shop-hero--propre' : 'shop-hero--revendeur';

    /* ── Helpers ──────────────────────────────────────────────── */
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el && val != null) el.textContent = val;
    };
    const setAttr = (selector, attr, val) => {
        const el = document.querySelector(selector);
        if (el && val) el[attr] = val;
    };

    /* ── Hero ─────────────────────────────────────────────────── */
    const hero = document.getElementById('shop-hero');
    if (hero) hero.classList.add(typeClass);

    set('shop-badge',           badgeText);
    set('magasin-nom-h1',       m.nom);
    set('magasin-nom',          m.nom);
    set('breadcrumb-nom',       m.nom);
    set('contact-nom',          m.nom);

    if (m.ville) {
        const dept = m.departement ? ` — Département ${m.departement}` : '';
        set('magasin-ville-subtitle', `${m.ville}${dept}`);
    }

    /* ── Bouton Appeler ───────────────────────────────────────── */
    const btnAppeler = document.getElementById('btn-appeler');
    if (btnAppeler) {
        if (m.telephone) {
            const firstTel = m.telephone.split(/[\s,]+/)[0].replace(/[-\s]/g, '');
            btnAppeler.href = `tel:${firstTel}`;
        }
        btnAppeler.classList.add(isPropre ? 'btn-shop--gold' : 'btn-shop--navy');
    }

    /* ── Infos card ───────────────────────────────────────────── */
    if (m.adresse && m.cp && m.ville) {
        set('magasin-adresse', `${m.adresse}, ${m.cp} ${m.ville}`);
    }

    if (m.telephone) {
        // Afficher le(s) numéro(s) — nettoyer les éventuels doubles
        const displayTel = m.telephone.split(/\s+(?=0[0-9]|-[0-9])/)[0];
        set('magasin-tel', m.telephone);
        const telLink = document.getElementById('magasin-tel-link');
        if (telLink) {
            const cleanTel = displayTel.replace(/[-\s]/g, '');
            telLink.href = `tel:${cleanTel}`;
        }
    }

    if (m.email) {
        // Prendre le premier email (certains champs ont plusieurs emails)
        const firstEmail = m.email.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)?.[0] || m.email;
        set('magasin-email', firstEmail);
        const emailLink = document.getElementById('magasin-email-link');
        if (emailLink) emailLink.href = `mailto:${firstEmail}`;
    }

    set('magasin-responsable', m.responsable);

    /* ── Meta tags ────────────────────────────────────────────── */
    const typeLabel = isPropre ? 'Showroom officiel' : 'Revendeur agréé';
    const pageTitle = `${m.nom} — Giovanni Riboli`;
    const pageDesc  = isPropre
        ? `${m.nom}, showroom officiel Giovanni Riboli à ${m.ville}. Spas et spas de nage haut de gamme.`
        : `${m.nom}, revendeur agréé Giovanni Riboli à ${m.ville}. Spas et spas de nage haut de gamme.`;

    document.title = pageTitle;
    setAttr('meta[name="description"]',    'content', pageDesc);
    setAttr('meta[property="og:title"]',   'content', pageTitle);
    setAttr('meta[property="og:description"]', 'content', pageDesc);

    /* ── Schema.org (injecté/mis à jour dynamiquement) ──────────── */
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: m.nom,
        description: pageDesc,
        url: `https://gr-spa.com/magasins/${MAGASIN_SLUG}.html`,
        brand: { '@type': 'Brand', name: 'Giovanni Riboli' },
        image: 'https://gr-spa.com/assets/hero-ambiance.webp',
        priceRange: '€€€',
        sameAs: ['https://gr-spa.com'],
        address: {
            '@type': 'PostalAddress',
            streetAddress: m.adresse,
            addressLocality: m.ville,
            postalCode: m.cp,
            addressCountry: 'FR'
        }
    };
    if (m.telephone) {
        schema.telephone = m.telephone.split(/[\s,]+/)[0];
    }
    if (m.email) {
        schema.email = m.email.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)?.[0];
    }
    if (m.lat && m.lng) {
        schema.geo = { '@type': 'GeoCoordinates', latitude: m.lat, longitude: m.lng };
    }

    let ldEl = document.querySelector('script[type="application/ld+json"]');
    if (!ldEl) {
        ldEl = document.createElement('script');
        ldEl.type = 'application/ld+json';
        document.head.appendChild(ldEl);
    }
    ldEl.textContent = JSON.stringify(schema, null, 2);

    /* ── Carte Google Maps ──────────────────────────────────────── */
    if (m.lat && m.lng) {
        window._shopMapData = { lat: parseFloat(m.lat), lng: parseFloat(m.lng) };
        // Si Google Maps déjà chargé (peu probable mais possible)
        if (typeof google !== 'undefined' && google.maps) {
            _initShopMap(window._shopMapData.lat, window._shopMapData.lng);
        }
        // Sinon initShopMapCallback() sera appelé par le script async Google Maps
    }

})();

/* ── Callback Google Maps (appelé quand l'API est chargée) ─────────── */
function initShopMapCallback() {
    const d = window._shopMapData;
    if (d && d.lat && d.lng) _initShopMap(d.lat, d.lng);
}

function _initShopMap(lat, lng) {
    const mapEl = document.getElementById('shopMap');
    if (!mapEl) return;
    const pos = { lat, lng };
    const map = new google.maps.Map(mapEl, {
        center: pos,
        zoom: 14,
        styles: [
            { featureType: 'poi',       elementType: 'all',      stylers: [{ visibility: 'off' }] },
            { featureType: 'water',     elementType: 'geometry', stylers: [{ color: '#e8f0f4' }] },
            { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f8f6f2' }] },
            { featureType: 'road',      elementType: 'geometry', stylers: [{ color: '#ffffff' }] }
        ]
    });
    new google.maps.Marker({
        position: pos,
        map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#c7a260',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        }
    });
}
