const SUPABASE_URL = "https://ohjzggceozamhdesecxi.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc2NzkwNiwiZXhwIjoyMDkyMzQzOTA2fQ.89JGBxboodYhj7ZtJPKHdsU_B3nCvyRaxxZsJ5cgpqc";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "text/html; charset=utf-8"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: HEADERS, body: "" };
  }

  const { id, rep } = event.queryStringParameters || {};

  if (!id || !rep) {
    return { statusCode: 400, headers: HEADERS, body: "<h1>Lien invalide</h1>" };
  }

  const statut = rep === "oui" ? "contacte" : "non_contacte";

  try {
    // Récupérer le lead
    const leadRes = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?id=eq.${id}&select=id,prenom,email,code_postal,magasin_nom,responsable,magasin_tel`,
      { headers: { "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` } }
    );
    const leads = await leadRes.json();
    const lead = leads[0];

    if (!lead) {
      return { statusCode: 404, headers: HEADERS, body: "<h1>Lead introuvable</h1>" };
    }

    // Mettre à jour Supabase
    await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ statut, feedback_at: new Date().toISOString() })
    });

    const pageOui = `<h1 style="color:#2d7a3a">✅ Merci pour votre retour !</h1><p>Nous sommes ravis que notre équipe ait pu vous contacter. À bientôt !</p>`;
    const pageNon = `<h1 style="color:#c7a260">📩 Message bien reçu</h1><p>Nous avons transmis votre retour.<br>Un responsable va vous recontacter très prochainement.<br>Toutes nos excuses pour ce délai.</p>`;

    return {
      statusCode: 200,
      headers: HEADERS,
      body: `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Giovanni Riboli</title><style>body{margin:0;padding:20px;background:#1a2d3e;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}.card{background:#253a4c;border-radius:12px;padding:48px 40px;max-width:480px;width:100%;border-top:4px solid #c7a260;text-align:center}img{width:140px;margin-bottom:24px}h1{font-size:24px;margin:0 0 16px}p{color:#ccd8e0;line-height:1.7;font-size:15px;margin:0 0 12px}a{display:inline-block;margin-top:20px;background:#c7a260;color:#1a2d3e;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:700}</style></head><body><div class="card"><img src="/assets/logo-blanc.svg" alt="Giovanni Riboli">${rep === "oui" ? pageOui : pageNon}<a href="https://gr-spa.com">Visiter notre site</a></div></body></html>`
    };

  } catch (err) {
    return { statusCode: 500, headers: HEADERS, body: `<h1>Erreur: ${err.message}</h1>` };
  }
};
