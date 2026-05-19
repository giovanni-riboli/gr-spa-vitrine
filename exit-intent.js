// exit-intent.js — Popup de sortie Giovanni Riboli
// Déclenché quand la souris quitte la fenêtre vers le haut (desktop)
// ou après 45 secondes sur mobile sans action

(function() {
  const STORAGE_KEY = 'gr_exit_shown';
  const COOLDOWN = 3 * 24 * 3600 * 1000; // 3 jours

  function shouldShow() {
    const last = localStorage.getItem(STORAGE_KEY);
    if (!last) return true;
    return Date.now() - parseInt(last) > COOLDOWN;
  }

  function markShown() {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }

  function createPopup() {
    // CSS
    const style = document.createElement('style');
    style.textContent = `
      #exit-overlay {
        position: fixed; inset: 0; background: rgba(15,25,35,.85);
        z-index: 9999; display: flex; align-items: center; justify-content: center;
        padding: 20px; opacity: 0; transition: opacity .35s ease;
        backdrop-filter: blur(4px);
      }
      #exit-overlay.show { opacity: 1; }
      #exit-popup {
        background: #1a2d3e; border-radius: 16px; max-width: 520px; width: 100%;
        padding: 44px 40px; position: relative; border-top: 4px solid #c7a260;
        transform: translateY(20px); transition: transform .35s ease;
        box-shadow: 0 24px 60px rgba(0,0,0,.4);
      }
      #exit-overlay.show #exit-popup { transform: translateY(0); }
      #exit-popup .ep-close {
        position: absolute; top: 16px; right: 16px;
        background: rgba(255,255,255,.08); border: none; color: rgba(255,255,255,.5);
        width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
        font-size: 16px; display: flex; align-items: center; justify-content: center;
        transition: all .2s; font-family: sans-serif;
      }
      #exit-popup .ep-close:hover { background: rgba(255,255,255,.15); color: #fff; }
      #exit-popup .ep-eyebrow {
        font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
        color: #c7a260; font-weight: 700; margin-bottom: 14px;
      }
      #exit-popup h2 {
        font-family: 'Cormorant Garamond', serif; font-size: 30px;
        color: #fff; margin: 0 0 10px; line-height: 1.2;
      }
      #exit-popup p { font-size: 14px; color: #8aafc8; margin: 0 0 28px; line-height: 1.7; }
      #exit-popup .ep-form { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
      #exit-popup .ep-form input {
        flex: 1; min-width: 160px; background: rgba(255,255,255,.08);
        border: 1px solid rgba(255,255,255,.15); border-radius: 8px;
        padding: 12px 14px; color: #fff; font-size: 14px;
        font-family: 'Inter', sans-serif; outline: none; min-height: 46px;
      }
      #exit-popup .ep-form input::placeholder { color: rgba(255,255,255,.3); }
      #exit-popup .ep-form input:focus { border-color: #c7a260; }
      #exit-popup .ep-btn {
        background: #c7a260; color: #1a2d3e; border: none;
        padding: 12px 22px; border-radius: 8px; font-size: 14px;
        font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif;
        min-height: 46px; white-space: nowrap; transition: opacity .2s;
      }
      #exit-popup .ep-btn:hover { opacity: .9; }
      #exit-popup .ep-skip {
        text-align: center; font-size: 12px; color: rgba(255,255,255,.3); cursor: pointer;
      }
      #exit-popup .ep-skip:hover { color: rgba(255,255,255,.6); }
      #exit-popup .ep-success {
        background: rgba(16,185,129,.15); border: 1px solid rgba(16,185,129,.3);
        border-radius: 8px; padding: 14px; text-align: center;
        color: #10b981; font-size: 14px; display: none; margin-top: 10px;
      }
      @media (max-width: 520px) {
        #exit-popup { padding: 32px 24px; }
        #exit-popup h2 { font-size: 24px; }
        #exit-popup .ep-form { flex-direction: column; }
        #exit-popup .ep-btn { width: 100%; }
      }
    `;
    document.head.appendChild(style);

    // HTML
    const overlay = document.createElement('div');
    overlay.id = 'exit-overlay';
    overlay.innerHTML = `
      <div id="exit-popup">
        <button class="ep-close" onclick="closeExitPopup()" aria-label="Fermer">✕</button>
        <p class="ep-eyebrow">Avant de partir</p>
        <h2>Recevez notre guide d'achat spa</h2>
        <p>Tout ce que vous devez savoir avant d'acheter un spa — gammes, entretien, financement, questions à poser en showroom.</p>
        <div class="ep-form">
          <input type="email" id="epEmail" placeholder="votre@email.fr" autocomplete="email">
          <button class="ep-btn" onclick="submitExitPopup()">Recevoir le guide →</button>
        </div>
        <div class="ep-success" id="epSuccess">✓ Guide envoyé ! Vérifiez votre boîte mail.</div>
        <p class="ep-skip" onclick="closeExitPopup()">Non merci, je pars sans le guide</p>
      </div>
    `;
    document.body.appendChild(overlay);

    // Animer l'ouverture
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.add('show'));
    });

    // Fermer au clic sur l'overlay
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeExitPopup();
    });

    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeExitPopup();
    });
  }

  window.closeExitPopup = function() {
    const overlay = document.getElementById('exit-overlay');
    if (!overlay) return;
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 350);
  };

  window.submitExitPopup = async function() {
    const email = document.getElementById('epEmail').value.trim();
    if (!email || !email.includes('@')) {
      document.getElementById('epEmail').focus();
      return;
    }

    const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njc5MDYsImV4cCI6MjA5MjM0MzkwNn0.wW-tqXBDUtKURR31bh3CUWIcuYMUJTZLqq2LLT1kJnA';

    try {
      await fetch('https://ohjzggceozamhdesecxi.supabase.co/rest/v1/leads', {
        method: 'POST',
        headers: { 'apikey': ANON, 'Authorization': `Bearer ${ANON}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          email, source: 'exit_intent', statut: 'nouveau',
          email_j1_envoye: false, email_j3_envoye: false, email_j7_envoye: false,
          whatsapp_relance_envoye: false, alerte_jc_envoyee: false
        })
      });
      await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Votre guide d\'achat spa Giovanni Riboli',
          html: `<div style="background:#1a2d3e;padding:20px;font-family:Arial"><div style="max-width:560px;margin:0 auto;background:#253a4c;border-radius:12px;padding:32px;border-top:4px solid #c7a260"><img src="https://gr-spa-vitrine.netlify.app/assets/logo-blanc.svg" width="120" style="margin-bottom:20px"><h2 style="color:#fff;font-size:22px">Votre guide d'achat spa</h2><p style="color:#ccd8e0">Merci pour votre intérêt pour Giovanni Riboli. Voici les points clés à considérer avant d'acheter votre spa :</p><div style="background:#1e3044;border-radius:8px;padding:20px;margin:16px 0"><p style="color:#c7a260;font-weight:700;margin:0 0 8px">1. Choisir sa gamme</p><p style="color:#ccd8e0;font-size:13px;margin:0">Relax (entrée de gamme), Energy (milieu), Luxury (thérapeutique), Spa de Nage</p></div><div style="background:#1e3044;border-radius:8px;padding:20px;margin:16px 0"><p style="color:#c7a260;font-weight:700;margin:0 0 8px">2. Le financement</p><p style="color:#ccd8e0;font-size:13px;margin:0">Dès 99€/mois sur 60 mois avec notre partenaire FranFinance</p></div><div style="background:#1e3044;border-radius:8px;padding:20px;margin:16px 0"><p style="color:#c7a260;font-weight:700;margin:0 0 8px">3. Essayez en showroom</p><p style="color:#ccd8e0;font-size:13px;margin:0">Plus de 40 showrooms en France — venez tester avant d'acheter</p></div><a href="https://go.gr-spa.com/" style="display:inline-block;margin-top:16px;background:#c7a260;color:#1a2d3e;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:700">Trouver un showroom →</a></div></div>`
        })
      });
    } catch(e) {}

    document.getElementById('epSuccess').style.display = 'block';
    setTimeout(closeExitPopup, 3000);
  };

  function init() {
    if (!shouldShow()) return;

    // Ne pas afficher sur la page espace-pro
    if (window.location.pathname.includes('espace-pro') || window.location.pathname.includes('/pro/')) return;

    let triggered = false;

    function trigger() {
      if (triggered) return;
      triggered = true;
      markShown();
      createPopup();
    }

    // Desktop : souris qui sort par le haut
    document.addEventListener('mouseleave', function(e) {
      if (e.clientY <= 0) trigger();
    });

    // Mobile : 45 secondes de lecture
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setTimeout(trigger, 45000);
    }
  }

  // Attendre 5 secondes avant d'activer (laisser le visiteur lire)
  setTimeout(init, 5000);
})();
