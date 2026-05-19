(async () => {
    if (typeof MAGASIN_SLUG === 'undefined') return;
    const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njc5MDYsImV4cCI6MjA5MjM0MzkwNn0.wW-tqXBDUtKURR31bh3CUWIcuYMUJTZLqq2LLT1kJnA';
    try {
        const res = await fetch(`https://ohjzggceozamhdesecxi.supabase.co/rest/v1/magasins?slug=eq.${MAGASIN_SLUG}&select=*`, {
            headers: { 'apikey': ANON, 'Authorization': `Bearer ${ANON}` }
        });
        const data = await res.json();
        const m = data[0];
        if (!m) return;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        const setHref = (id, href) => { const el = document.getElementById(id); if (el) el.href = href; };

        set('magasin-nom', m.nom);
        set('magasin-adresse', `${m.adresse}, ${m.cp} ${m.ville}`);
        set('magasin-responsable', m.responsable);

        const telEl = document.getElementById('magasin-tel');
        if (telEl) {
            telEl.textContent = m.telephone;
            if (telEl.tagName === 'A') telEl.href = `tel:${m.telephone}`;
        }
        const emailEl = document.getElementById('magasin-email');
        if (emailEl) {
            emailEl.textContent = m.email;
            if (emailEl.tagName === 'A') emailEl.href = `mailto:${m.email}`;
        }
    } catch(e) { console.warn('magasin-loader:', e); }
})();
