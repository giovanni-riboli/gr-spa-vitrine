// api-mock.js — Mock API pour l'espace pro Giovanni Riboli
const MOCK_USERS = [
  { email: "bordeaux@gr-spa.com", password: "GR2026!", name: "GR Spa Bordeaux", region: "Sud-Ouest", id: "mag_33" },
  { email: "mauguio@gr-spa.com", password: "GR2026!", name: "GR Spa Mauguio", region: "Sud", id: "mag_34" },
  { email: "contact@maison-bali-france.com", password: "GR2026!", name: "Maison Bali Valenciennes", region: "Nord", id: "mag_59" },
  { email: "demo@gr-spa.com", password: "demo", name: "Compte démo", region: "France", id: "mag_demo" }
];

const MOCK_DOCUMENTS = [
  { id: 1, name: "Catalogue Relax 2026", category: "catalogues", type: "pdf", date: "2026-01-15", size: "12 Mo" },
  { id: 2, name: "Catalogue Energy 2026", category: "catalogues", type: "pdf", date: "2026-01-15", size: "14 Mo" },
  { id: 3, name: "Catalogue Luxury 2026", category: "catalogues", type: "pdf", date: "2026-01-20", size: "18 Mo" },
  { id: 4, name: "Fiche Solar Pool 640Wc", category: "fiches", type: "pdf", date: "2026-02-10", size: "2 Mo" },
  { id: 5, name: "Fiches produits par modèle", category: "fiches", type: "pdf", date: "2026-02-15", size: "8 Mo" },
  { id: 6, name: "Argumentaire Solar Pool", category: "argumentaires", type: "pdf", date: "2026-03-01", size: "3 Mo" },
  { id: 7, name: "Guide de vente 2026", category: "argumentaires", type: "pdf", date: "2026-03-05", size: "5 Mo" },
  { id: 8, name: "Pack réseaux sociaux Offre Électrisante", category: "visuels", type: "drive", date: "2026-03-20", size: "—" }
];

const MOCK_STOCKS = [
  { model: "R.1", gamme: "Relax", status: "stock", label: "En stock", delay: "Immédiat" },
  { model: "R.2", gamme: "Relax", status: "stock", label: "En stock", delay: "Immédiat" },
  { model: "Amalfi", gamme: "Energy", status: "stock", label: "En stock", delay: "2-3 semaines" },
  { model: "Bari", gamme: "Energy", status: "low", label: "Stock faible", delay: "2-3 semaines" },
  { model: "Capri", gamme: "Energy", status: "stock", label: "En stock", delay: "2-3 semaines" },
  { model: "Rimini", gamme: "Energy", status: "out", label: "Rupture", delay: "6-8 semaines" },
  { model: "Roma", gamme: "Luxury Massage", status: "stock", label: "En stock", delay: "3-4 semaines" },
  { model: "Napoli", gamme: "Luxury Massage", status: "stock", label: "En stock", delay: "3-4 semaines" },
  { model: "Torino", gamme: "Luxury Massage", status: "low", label: "Stock faible", delay: "3-4 semaines" },
  { model: "Napoli Luxe", gamme: "Luxury Thérapeutique", status: "stock", label: "En stock", delay: "4-6 semaines" },
  { model: "Roma Luxe", gamme: "Luxury Thérapeutique", status: "stock", label: "En stock", delay: "4-6 semaines" },
  { model: "Torino Luxe", gamme: "Luxury Thérapeutique", status: "stock", label: "En stock", delay: "4-6 semaines" }
];

// Mock API functions
function mockLogin(email, password) {
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, error: "Identifiants incorrects" };
  return { success: true, user: { email: user.email, name: user.name, region: user.region, id: user.id } };
}

function mockGetDocuments() { return MOCK_DOCUMENTS; }
function mockGetStocks() { return MOCK_STOCKS; }
