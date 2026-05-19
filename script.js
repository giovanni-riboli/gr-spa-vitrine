/* ============================================
   GIOVANNI RIBOLI — SCRIPT
   ============================================ */

// --- NAV SCROLL ---
const nav = document.getElementById('nav');
const handleNavScroll = () => {
  if (window.scrollY > 60) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
};
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// --- NAV MOBILE ---
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('navMobile');
burger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('is-open');
});
// Fermer au clic sur un lien
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
});

// --- COOKIE BANNER ---
const cookieBanner = document.getElementById('cookieBanner');
const hasConsent = localStorage.getItem('gr-cookie-consent');
if (!hasConsent) {
  setTimeout(() => cookieBanner?.classList.add('is-visible'), 1200);
}
const setConsent = (val) => {
  localStorage.setItem('gr-cookie-consent', val);
  cookieBanner?.classList.remove('is-visible');
};
document.getElementById('cookieAccept')?.addEventListener('click', () => setConsent('all'));
document.getElementById('cookieRefuse')?.addEventListener('click', () => setConsent('none'));
document.getElementById('cookieCustomize')?.addEventListener('click', () => {
  // À implémenter : modal de personnalisation
  setConsent('custom');
});
document.getElementById('cookieSettings')?.addEventListener('click', (e) => {
  e.preventDefault();
  cookieBanner?.classList.add('is-visible');
});

// --- STORE LOCATOR SEARCH ---
function searchLocator() {
  const val = document.getElementById('locatorInput')?.value.trim();
  if (val) {
    window.location.href = `revendeurs.html?cp=${encodeURIComponent(val)}`;
  }
}
document.getElementById('locatorInput')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchLocator();
});

// --- ANIMATIONS AU SCROLL ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.gamme-card, .testimonial, .stats__item, .pourquoi__item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

/* ============================================
   MEGA MENU JS — Giovanni Riboli
   ============================================ */
(function() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobileOverlay = document.getElementById('navMobile');

  // Scroll behavior for transparent nav
  if (nav && nav.classList.contains('nav--transparent')) {
    function checkScroll() {
      if (window.scrollY > 60) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  // Burger toggle
  if (burger && mobileOverlay) {
    burger.addEventListener('click', function() {
      burger.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Mobile accordion
  document.querySelectorAll('.mobile-accordion-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const submenu = this.nextElementSibling;
      const isActive = submenu.classList.contains('active');
      // Close all
      document.querySelectorAll('.mobile-submenu.active').forEach(function(s) { s.classList.remove('active'); });
      document.querySelectorAll('.mobile-accordion-toggle.active').forEach(function(b) { b.classList.remove('active'); });
      if (!isActive) {
        submenu.classList.add('active');
        this.classList.add('active');
      }
    });
  });

  // Close mega menu on click outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav__menu') && !e.target.closest('.mega-menu')) {
      document.querySelectorAll('.nav__menu > li').forEach(function(li) {
        li.classList.remove('mega-open');
      });
    }
  });
})();

/* Scroll reveal - fade-up */
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
})();
