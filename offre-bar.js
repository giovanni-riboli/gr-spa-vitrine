// offre-bar.js — Sticky bar offre en cours depuis Supabase
// Chargée sur toutes les pages publiques

(function() {
  const SUPABASE_URL = 'https://ohjzggceozamhdesecxi.supabase.co';
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njc5MDYsImV4cCI6MjA5MjM0MzkwNn0.wW-tqXBDUtKURR31bh3CUWIcuYMUJTZLqq2LLT1kJnA';
  const STORAGE_KEY = 'gr_offre_bar_closed';

  async function init() {
    // Si l'utilisateur a fermé la barre récemment (24h), ne pas la montrer
    const closed = localStorage.getItem(STORAGE_KEY);
    if (closed && Date.now() - parseInt(closed) < 24 * 3600 * 1000) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/offres?actif=eq.true&date_debut=lte.${today}&date_fin=gte.${today}&select=titre,sous_titre,cta_texte,cta_url&limit=1`,
        { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` } }
      );
      const offres = await res.json();
      if (!offres || !offres.length) return;

      const offre = offres[0];
      afficher(offre);
    } catch(e) {
      // Silencieux — pas de barre si erreur réseau
    }
  }

  function afficher(offre) {
    // Créer le CSS
    const style = document.createElement('style');
    style.textContent = `
      #offre-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: #c7a260;
        color: #1a2d3e;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 500;
        padding: 0 16px;
        transform: translateY(-100%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      #offre-bar.visible { transform: translateY(0); }
      #offre-bar .offre-titre { font-weight: 600; }
      #offre-bar .offre-sous-titre { opacity: 0.8; }
      #offre-bar .offre-cta {
        background: #1a2d3e;
        color: #c7a260;
        padding: 5px 14px;
        border-radius: 20px;
        text-decoration: none;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
        transition: opacity .2s;
      }
      #offre-bar .offre-cta:hover { opacity: .8; }
      #offre-bar .offre-close {
        position: absolute;
        right: 12px;
        background: none;
        border: none;
        cursor: pointer;
        color: #1a2d3e;
        font-size: 18px;
        line-height: 1;
        padding: 4px;
        opacity: .7;
        font-family: sans-serif;
      }
      #offre-bar .offre-close:hover { opacity: 1; }
      /* Décaler le header quand la barre est visible */
      body.offre-bar-open #nav,
      body.offre-bar-open .nav {
        top: 44px !important;
      }
      @media (max-width: 600px) {
        #offre-bar { font-size: 11px; gap: 8px; }
        #offre-bar .offre-sous-titre { display: none; }
      }
    `;
    document.head.appendChild(style);

    // Créer la barre
    const bar = document.createElement('div');
    bar.id = 'offre-bar';
    bar.innerHTML = `
      <span class="offre-titre">${offre.titre}</span>
      ${offre.sous_titre ? `<span class="offre-sous-titre">${offre.sous_titre}</span>` : ''}
      <a href="${offre.cta_url || 'https://go.gr-spa.com/'}" class="offre-cta" target="_blank">${offre.cta_texte || 'En profiter →'}</a>
      <button class="offre-close" onclick="window.__closeOffreBar()" aria-label="Fermer">✕</button>
    `;
    document.body.prepend(bar);
    document.body.classList.add('offre-bar-open');

    // Animer l'apparition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.classList.add('visible');
      });
    });

    // Fonction de fermeture globale
    window.__closeOffreBar = function() {
      bar.classList.remove('visible');
      document.body.classList.remove('offre-bar-open');
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      setTimeout(() => bar.remove(), 400);
    };
  }

  // Lancer après le chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
