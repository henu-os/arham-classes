/**
 * main.js — Arham Coaching Classes
 * Handles: Navbar scroll/hamburger, WhatsApp float, Scroll-to-top,
 *          Announcement bar, Active nav links, Ticker marquee
 */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initAnnouncement();
  initNavbar();
  initMobileMenu();
  initScrollTop();
  setActiveNavLink();
  initTicker();
});

/* ============================================================
   ANNOUNCEMENT BAR
   ============================================================ */
function initAnnouncement() {
  const bar = document.querySelector('.announcement-bar');
  const closeBtn = document.querySelector('.ann-close');
  if (!bar) return;

  // Check if dismissed
  if (localStorage.getItem('ann_dismissed') === 'true') {
    bar.classList.add('hidden');
    return;
  }

  closeBtn?.addEventListener('click', () => {
    bar.style.maxHeight = bar.scrollHeight + 'px';
    bar.style.transition = 'max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease';
    requestAnimationFrame(() => {
      bar.style.maxHeight = '0';
      bar.style.paddingTop = '0';
      bar.style.paddingBottom = '0';
      bar.style.opacity = '0';
    });
    setTimeout(() => {
      bar.classList.add('hidden');
      localStorage.setItem('ann_dismissed', 'true');
    }, 350);
  });
}

/* ============================================================
   NAVBAR — Scroll Shrink
   ============================================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init state
}

/* ============================================================
   MOBILE MENU — Hamburger + Overlay
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileMenu) return;

  const openMenu = () => {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    overlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    overlay?.classList.remove('visible');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay?.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ============================================================
   SCROLL TO TOP BUTTON
   ============================================================ */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  const toggle = () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   ACTIVE NAV LINK — Based on current page
   ============================================================ */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();

    if (
      linkPage === currentPage ||
      (currentPage === '' && linkPage === 'index.html') ||
      (currentPage === 'index.html' && linkPage === 'index.html')
    ) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   TICKER MARQUEE — Duplicate content for seamless loop
   ============================================================ */
function initTicker() {
  const ticker = document.querySelector('.ticker-content');
  if (!ticker) return;

  // Duplicate the text for infinite scroll effect
  const originalText = ticker.innerHTML;
  ticker.innerHTML = originalText + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + originalText;
}

/* ============================================================
   CSS 3D CARD TILT — Applied to .tilt-card elements
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7; // max ±7deg
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
});

/* ============================================================
   MOBILE FLIP CARDS — Tap to toggle on touch devices
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(max-width: 768px)').matches) {
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
      card.addEventListener('click', () => {
        const inner = card.querySelector('.flip-inner');
        if (inner) {
          const isFlipped = inner.style.transform === 'rotateY(180deg)';
          inner.style.transform = isFlipped ? '' : 'rotateY(180deg)';
        }
      });
    });
  }
});
