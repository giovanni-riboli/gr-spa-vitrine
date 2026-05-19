// notifications.js — Shared real-time notification system for Espace Pro
// Badge leads + Toast + Realtime status indicator

(function() {
  'use strict';

  let _leadCount = 0;

  function initSupabaseClient() {
    if (typeof initSupabase === 'function') return initSupabase();
    if (window._supabaseClient) return window._supabaseClient;
    const { createClient } = window.supabase || {};
    if (!createClient) return null;
    window._supabaseClient = createClient(
      'https://ohjzggceozamhdesecxi.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njc5MDYsImV4cCI6MjA5MjM0MzkwNn0.wW-tqXBDUtKURR31bh3CUWIcuYMUJTZLqq2LLT1kJnA'
    );
    return window._supabaseClient;
  }

  function updateBadgeUI(count) {
    _leadCount = count;
    document.querySelectorAll('#leadsCount, .notif-badge').forEach(badge => {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'inline';
      } else {
        badge.style.display = 'none';
      }
    });
  }

  function showNotifToast(message) {
    // Only on pages that opt-in (dashboard, leads)
    if (!window._enableNotifToast) return;
    const toast = document.createElement('div');
    toast.className = 'notif-toast';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 5000);
  }

  function setRealtimeStatus(connected) {
    const dot = document.getElementById('realtimeStatus');
    if (dot) {
      dot.style.background = connected ? '#10b981' : '#6b7280';
      dot.title = connected ? 'Temps réel actif' : 'Temps réel déconnecté';
    }
    // Also update old indicator if present
    const old = document.getElementById('realtimeIndicator');
    if (old) old.style.display = connected ? 'inline-flex' : 'none';
  }

  async function updateLeadsBadge(sb) {
    try {
      const { count } = await sb.from('leads').select('id', { count: 'exact', head: true }).eq('statut', 'nouveau');
      updateBadgeUI(count || 0);
    } catch(e) { console.warn('Badge update failed:', e); }
  }

  function setupNotifications() {
    const sb = initSupabaseClient();
    if (!sb) return;

    // Initial badge count
    updateLeadsBadge(sb);

    // Realtime channel
    const channel = sb.channel('notif-leads-badge')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, payload => {
        const nl = payload.new;
        if (nl.statut === 'nouveau') {
          updateBadgeUI(_leadCount + 1);
        }
        showNotifToast(`🔔 Nouveau lead — ${nl.prenom || 'Inconnu'} (${nl.code_postal || '?'})`);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, payload => {
        const oldStatut = payload.old?.statut;
        const newStatut = payload.new?.statut;
        if (oldStatut === 'nouveau' && newStatut !== 'nouveau') {
          updateBadgeUI(Math.max(0, _leadCount - 1));
        } else if (oldStatut !== 'nouveau' && newStatut === 'nouveau') {
          updateBadgeUI(_leadCount + 1);
        }
      })
      .subscribe((status) => {
        setRealtimeStatus(status === 'SUBSCRIBED');
      });
  }

  // Inject CSS for toast
  const style = document.createElement('style');
  style.textContent = `
    @keyframes notifSlideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes notifSlideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100px); opacity: 0; } }
    .notif-toast { position:fixed;bottom:20px;right:20px;background:#253a4c;color:#fff;padding:14px 20px;border-radius:8px;border-left:3px solid #c7a260;font-size:14px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,.3);max-width:300px;transform:translateX(100px);opacity:0;transition:all .3s ease; }
    .notif-toast.show { transform:translateX(0);opacity:1; }
    @media(max-width:600px) { .notif-toast { left:16px;right:16px;bottom:16px;max-width:none;text-align:center; } }
  `;
  document.head.appendChild(style);

  // Auto-init after auth resolves (wait a tick for requireAuth)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(setupNotifications, 500));
  } else {
    setTimeout(setupNotifications, 500);
  }

  // Expose for manual triggering
  window.setupNotifications = setupNotifications;
})();
