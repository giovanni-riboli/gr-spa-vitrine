// product-bar.js — Sticky bar bottom sur les fiches produits
// Affiche une barre avec financement estimé + CTAs après 3 secondes de lecture

(function() {
  const SUPABASE_URL = 'https://ohjzggceozamhdesecxi.supabase.co';
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njc5MDYsImV4cCI6MjA5MjM0MzkwNn0.wW-tqXBDUtKURR31bh3CUWIcuYMUJTZLqq2LLT1kJnA';

  // Taux FranFinance — calcul mensualité indicative sur 60 mois
  function calcMensualite(montant) {
    if (!montant || montant < 1000) return null;
    const tn = montant < 6000 ? 6.69 : 5.75; // tranche 60 mois
    const taux = tn / 100 / 12;
    const duree = 60;
    const m = montant * taux * Math.pow(1 + taux, duree) / (Math.pow(1 + taux, duree) - 1);
    return Math.round(m);
  }

  async function init() {
    const slug = window.PRODUCT_SLUG;
    if (!slug) return;

    // Attendre 3 secondes avant d'afficher (laisser l'utilisateur lire)
    await new Promise(r => setTimeout(r, 3000));

    // Récupérer les données du produit
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/produits?slug=eq.${slug}&select=nom,gamme,nb_places,nb_buses&limit=1`,
        { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` } }
      );
      const data = await res.json();
      const produit = data[0];
      if (!produit) return;

      afficher(produit, slug);
    } catch(e) {
      // Afficher sans données produit
      afficher(null, slug);
    }
  }

  function afficher(produit, slug) {
    const style = document.createElement('style');
    style.textContent = `
      #product-bar {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        z-index: 999;
        background: #1a2d3e;
        border-top: 2px solid #c7a260;
        padding: 12px 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        font-family: 'Inter', sans-serif;
        transform: translateY(100%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 -4px 24px rgba(0,0,0,.3);
      }
      #product-bar.visible { transform: translateY(0); }
      #product-bar .pb-info { display: flex; align-items: center; gap: 16px; flex: 1; }
      #product-bar .pb-nom { font-size: 14px; font-weight: 600; color: #fff; }
      #product-bar .pb-fin {
        font-size: 13px; color: #8aafc8;
        background: rgba(255,255,255,.06);
        padding: 4px 12px; border-radius: 20px;
      }
      #product-bar .pb-fin strong { color: #c7a260; }
      #product-bar .pb-actions { display: flex; gap: 10px; align-items: center; }
      #product-bar .btn-pb-simuler {
        background: none; border: 1px solid rgba(199,162,96,.5);
        color: #c7a260; padding: 9px 18px; border-radius: 6px;
        font-size: 13px; font-weight: 600; cursor: pointer;
        font-family: 'Inter', sans-serif; text-decoration: none;
        white-space: nowrap; transition: all .2s;
      }
      #product-bar .btn-pb-simuler:hover { background: rgba(199,162,96,.1); border-color: #c7a260; }
      #product-bar .btn-pb-devis {
        background: #c7a260; color: #1a2d3e;
        padding: 9px 20px; border-radius: 6px;
        font-size: 13px; font-weight: 700;
        text-decoration: none; white-space: nowrap;
        transition: opacity .2s;
      }
      #product-bar .btn-pb-devis:hover { opacity: .9; }
      #product-bar .pb-close {
        background: none; border: none; cursor: pointer;
        color: rgba(255,255,255,.4); font-size: 18px;
        padding: 4px 8px; transition: color .2s;
      }
      #product-bar .pb-close:hover { color: #fff; }
      @media (max-width: 768px) {
        #product-bar { padding: 12px 16px; flex-wrap: wrap; }
        #product-bar .pb-info { width: 100%; }
        #product-bar .pb-actions { width: 100%; justify-content: stretch; }
        #product-bar .btn-pb-simuler, #product-bar .btn-pb-devis { flex: 1; text-align: center; }
        #product-bar .pb-close { display: none; }
      }
    `;
    document.head.appendChild(style);

    // Calcul mensualité indicative (sur 60 mois, montant moyen selon gamme)
    const gammeMonts = { relax: 3500, energy: 10000, luxury: 18000, nage: 25000 };
    const montantBase = produit ? (gammeMonts[produit.gamme] || 12000) : 12000;
    const mensualite = calcMensualite(montantBase);
    const nomProduit = produit ? produit.nom : '';

    const bar = document.createElement('div');
    bar.id = 'product-bar';
    bar.innerHTML = `
      <div class="pb-info">
        ${nomProduit ? `<span class="pb-nom">${nomProduit}</span>` : ''}
        ${mensualite ? `<span class="pb-fin">Financement dès <strong>${mensualite}€/mois</strong> sur 60 mois*</span>` : ''}
      </div>
      <div class="pb-actions">
        <a href="/financement.html" class="btn-pb-simuler">Simuler le financement</a>
        <a href="https://go.gr-spa.com/" class="btn-pb-devis" target="_blank">Demander un devis →</a>
        <button class="pb-close" onclick="document.getElementById('product-bar').classList.remove('visible')" aria-label="Fermer">✕</button>
      </div>
    `;
    document.body.appendChild(bar);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => bar.classList.add('visible'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
