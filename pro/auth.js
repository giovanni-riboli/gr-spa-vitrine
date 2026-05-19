// auth.js — Supabase Auth for Giovanni Riboli Espace Pro
const SUPABASE_URL = 'https://ohjzggceozamhdesecxi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njc5MDYsImV4cCI6MjA5MjM0MzkwNn0.wW-tqXBDUtKURR31bh3CUWIcuYMUJTZLqq2LLT1kJnA';

let _supabase = null;

function initSupabase() {
  if (_supabase) return _supabase;
  _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _supabase;
}

async function login(email, password) {
  const sb = initSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: error.message };
  return { success: true, user: data.user };
}

async function logout() {
  const sb = initSupabase();
  await sb.auth.signOut();
  window.location.href = '../espace-pro.html';
}

async function getUser() {
  const sb = initSupabase();
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

async function getProUser() {
  const user = await getUser();
  if (!user) return null;
  const meta = user.user_metadata || {};
  return {
    id: user.id,
    email: user.email,
    nom: meta.full_name || meta.nom || user.email,
    role: meta.role || 'revendeur',
    magasin_nom: meta.magasin_nom || null,
    magasin_ville: meta.magasin_ville || null,
    departements: meta.departements || null,
    actif: meta.actif !== false
  };
}

async function isLoggedIn() {
  const sb = initSupabase();
  const { data: { session } } = await sb.auth.getSession();
  return !!session;
}

async function requireAuth() {
  const sb = initSupabase();
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = '../espace-pro.html';
    return null;
  }
  const proUser = await getProUser();
  if (!proUser || !proUser.actif) {
    await sb.auth.signOut();
    window.location.href = '../espace-pro.html';
    return null;
  }
  return proUser;
}

// Helper: fetch leads filtered by user role/departments
async function fetchLeads(proUser, opts = {}) {
  const sb = initSupabase();
  let query = sb.from('leads').select('*');
  
  // Role-based filtering
  if (proUser.role !== 'admin' && proUser.departements && proUser.departements.length > 0) {
    // Filter by department prefix of code_postal
    const orFilters = proUser.departements.map(d => `code_postal.like.${d}%`).join(',');
    query = query.or(orFilters);
  }
  
  if (opts.statut) {
    query = query.eq('statut', opts.statut);
  }
  
  query = query.order('created_at', { ascending: false });
  
  if (opts.limit) {
    query = query.limit(opts.limit);
  }
  
  const { data, error } = await query;
  if (error) { console.error('fetchLeads error:', error); return []; }
  return data || [];
}

// Helper: update lead status
async function updateLeadStatut(leadId, newStatut) {
  const sb = initSupabase();
  const { data, error } = await sb.from('leads').update({ statut: newStatut, updated_at: new Date().toISOString() }).eq('id', leadId).select();
  if (error) { console.error('updateLead error:', error); return null; }
  return data;
}

// Helper: fetch offres
async function fetchOffres() {
  const sb = initSupabase();
  const { data, error } = await sb.from('offres').select('*').eq('actif', true).order('date_debut', { ascending: false });
  if (error) { console.error('fetchOffres error:', error); return []; }
  return data || [];
}

// Helper: create offre (admin only)
async function createOffre(offre) {
  const sb = initSupabase();
  const { data, error } = await sb.from('offres').insert(offre).select();
  if (error) { console.error('createOffre error:', error); return null; }
  return data;
}
