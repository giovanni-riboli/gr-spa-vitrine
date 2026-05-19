// send-email.js — Netlify Function pour envoyer des emails via Resend
// La clé API est stockée en variable d'environnement Netlify (jamais dans le code)

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'RESEND_API_KEY not configured' }) };
  }

  try {
    const { to, subject, html } = JSON.parse(event.body);

    if (!to || !subject || !html) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: to, subject, html' }) };
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Giovanni Riboli <contact@mail.gr-spa.com>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html
      })
    });

    const data = await res.json();

    return {
      statusCode: res.ok ? 200 : res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
