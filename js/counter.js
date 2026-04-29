/**
 * counter.js — Arham Coaching Classes
 * Animated count-up for stat numbers using IntersectionObserver
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
});

function initCounters() {
  const statCards = document.querySelectorAll('.stat-card');
  if (!statCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.stat-number');
        if (numEl && !numEl.dataset.counted) {
          numEl.dataset.counted = 'true';
          animateCount(numEl);
          observer.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.3 });

  statCards.forEach(card => observer.observe(card));
}

function animateCount(el) {
  const raw = el.dataset.target || el.textContent.trim();
  // Parse suffix (+ or %)
  const suffix = raw.replace(/[0-9.]/g, '');
  const target = parseFloat(raw.replace(/[^0-9.]/g, ''));
  const duration = 2000; // ms
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(update);
}
