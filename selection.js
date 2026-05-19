// selection.js — "Ma sélection" (liste de souhaits)
// Stockée en localStorage, badge dans la nav, page dédiée

(function() {
  const KEY = 'gr_selection';
  
  function getSelection() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch(e) { return []; }
  }
  
  function saveSelection(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
    updateBadge();
  }
  
  function updateBadge() {
    const list = getSelection();
    const badge = document.getElementById('selectionBadge');
    if (!badge) return;
    if (list.length > 0) {
      badge.textContent = list.length;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
  
  window.GRSelection = {
    get: getSelection,
    
    add: function(slug, nom, gamme, nb_places, nb_buses) {
      const list = getSelection();
      if (list.find(p => p.slug === slug)) return false; // déjà présent
      if (list.length >= 6) return false; // max 6
      list.push({ slug, nom, gamme, nb_places, nb_buses, addedAt: Date.now() });
      saveSelection(list);
      return true;
    },
    
    remove: function(slug) {
      const list = getSelection().filter(p => p.slug !== slug);
      saveSelection(list);
    },
    
    has: function(slug) {
      return getSelection().some(p => p.slug === slug);
    },
    
    toggle: function(slug, nom, gamme, nb_places, nb_buses) {
      if (this.has(slug)) {
        this.remove(slug);
        return false;
      } else {
        return this.add(slug, nom, gamme, nb_places, nb_buses);
      }
    },
    
    count: function() {
      return getSelection().length;
    }
  };
  
  // Initialiser le badge au chargement
  document.addEventListener('DOMContentLoaded', updateBadge);
  if (document.readyState !== 'loading') updateBadge();
  
})();
