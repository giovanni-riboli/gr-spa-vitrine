// Netlify Function — feedback.js
// Reçoit le clic prospect sur "Oui j'ai été rappelé" ou "Non personne ne m'a contacté"
// Met à jour Supabase + alerte JC si non contacté

const SUPABASE_URL = "https://ohjzggceozamhdesecxi.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc2NzkwNiwiZXhwIjoyMDkyMzQzOTA2fQ.89JGBxboodYhj7ZtJPKHdsU_B3nCvyRaxxZsJ5cgpqc";
const N8N_WEBHOOK_NON_CONTACTE = "https://n8n.gr-spa.com/webhook/lead-non-contacte";

exports.handler = async (event) => {
  const { id, rep } = event.queryStringParameters || {};

  if (!id || !rep) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: "<h1>Lien invalide</h1>"
    };
  }

  const statut = rep === "oui" ? "contacte" : "non_contacte";

  try {
    // 1. Récupérer les infos du lead
    const leadRes = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?id=eq.${id}&select=id,prenom,email,code_postal,magasin_nom,responsable,magasin_tel`,
      { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
    );
    const leads = await leadRes.json();
    const lead = leads[0];

    if (!lead) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
        body: "<h1>Lead introuvable</h1>"
      };
    }

    // 2. Mettre à jour Supabase
    await fetch(
      `${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({ statut, feedback_at: new Date().toISOString() })
      }
    );

    // 3. Si non contacté → alerter JC via n8n webhook
    if (rep === "non") {
      await fetch(N8N_WEBHOOK_NON_CONTACTE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: id,
          prenom: lead.prenom,
          email: lead.email,
          code_postal: lead.code_postal,
          magasin_nom: lead.magasin_nom,
          responsable: lead.responsable,
          magasin_tel: lead.magasin_tel
        })
      }).catch(() => {}); // Ne pas bloquer si n8n est indisponible
    }

    // 4. Page de confirmation
    const messageOui = `
      <h1 style="color:#2d7a3a">✅ Merci pour votre réponse !</h1>
      <p>Nous sommes ravis que notre équipe ait pu vous contacter.<br>
      À bientôt chez Giovanni Riboli !</p>
    `;
    const messageNon = `
      <h1 style="color:#c7a260">📩 Message bien reçu</h1>
      <p>Nous avons transmis votre retour à notre équipe.<br>
      Un responsable va vous recontacter très prochainement.<br>
      Toutes nos excuses pour ce délai.</p>
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Giovanni Riboli — Merci</title>
  <style>
    body { font-family: 'Inter', sans-serif; background: #1a2d3e; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
    .card { background: #253a4c; border-radius: 12px; padding: 48px 40px; max-width: 480px; border-top: 4px solid #c7a260; }
    h1 { font-family: serif; font-size: 28px; margin-bottom: 16px; }
    p { color: #ccd8e0; line-height: 1.7; }
    a { display: inline-block; margin-top: 24px; background: #c7a260; color: #1a2d3e; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 700; }
    img { width: 140px; margin-bottom: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <img src="https://gr-spa-vitrine.netlify.app/assets/logo-blanc.svg" alt="Giovanni Riboli">
    ${rep === "oui" ? messageOui : messageNon}
    <a href="https://gr-spa.com">Visiter notre site</a>
  </div>
</body>
</html>`
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: `<h1>Erreur : ${err.message}</h1>`
    };
  }
};
