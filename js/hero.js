/**
 * hero.js — Arham Coaching Classes
 * Canvas particle animation for the hero section
 * 80 floating gold/cream particles + mouse parallax
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const PARTICLE_COUNT = isMobile ? 35 : 80;

  let width, height, particles, animId;
  let mouseX = 0, mouseY = 0;

  // ── Resize canvas ──
  function resize() {
    width  = canvas.width  = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  // ── Particle class ──
  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(randomY = false) {
      this.x    = Math.random() * width;
      this.y    = randomY ? Math.random() * height : height + 20;
      this.size = Math.random() * 3 + 1;       // 1–4px
      this.speedY = Math.random() * 0.6 + 0.15; // upward
      this.speedX = (Math.random() - 0.5) * 0.3; // gentle drift
      this.opacity = Math.random() * 0.55 + 0.1;
      this.parallaxFactor = Math.random() * 0.04 + 0.005; // mouse drift sensitivity

      // Color: gold, bright gold, or white
      const colors = [
        `rgba(200,151,42,${this.opacity})`,
        `rgba(240,180,41,${this.opacity})`,
        `rgba(255,255,255,${this.opacity * 0.55})`,
        `rgba(255,209,102,${this.opacity})`,
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];

      // Twinkling
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinklePhase = Math.random() * Math.PI * 2;
    }

    update(t) {
      // Float upward
      this.y -= this.speedY;
      this.x += this.speedX;

      // Twinkle opacity
      this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(this.twinklePhase + t * this.twinkleSpeed));

      // Mouse parallax — particles drift slightly toward cursor
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      this.x += dx * this.parallaxFactor * 0.01;
      this.y += dy * this.parallaxFactor * 0.01;

      // Reset when out of bounds
      if (this.y < -10 || this.x < -20 || this.x > width + 20) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.currentOpacity));
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.size * 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ── Education symbols ──
  const symbols = ['∑', 'π', '√', '∫', '≠', '∞', '%', '+'];
  class SymbolParticle {
    constructor() {
      this.reset(true);
    }

    reset(randomY = false) {
      this.x     = Math.random() * width;
      this.y     = randomY ? Math.random() * height : height + 30;
      this.size  = Math.random() * 10 + 10;
      this.speedY = Math.random() * 0.3 + 0.08;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.15 + 0.05;
      this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.006;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y < -40 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = `rgba(240,180,41,1)`;
      ctx.font = `${this.size}px serif`;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.textAlign = 'center';
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  // ── Init ──
  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
    // Add 8 symbol particles
    for (let i = 0; i < 8; i++) {
      particles.push(new SymbolParticle());
    }
  }

  // ── Render loop ──
  let t = 0;
  function animate() {
    animId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    t++;

    particles.forEach(p => {
      p.update(t);
      p.draw();
    });
  }

  // ── Mouse tracking ──
  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  // ── Handle resize ──
  const debouncedResize = debounce(() => {
    resize();
    // Reposition particles within new bounds
    particles.forEach(p => {
      if (p.x > width) p.x = Math.random() * width;
    });
  }, 200);

  window.addEventListener('resize', debouncedResize);

  // ── Start ──
  init();
  animate();

  // ── Cleanup on page unload ──
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animId);
  });

  // ── Hero word reveal animation ──
  function initHeroWordReveal() {
    const title = document.querySelector('.hero-title[data-word-reveal]');
    if (!title) return;

    const text = title.textContent.trim();
    title.innerHTML = '';

    text.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word-reveal';
      span.textContent = word + (i < text.split(' ').length - 1 ? '\u00A0' : '');
      span.style.animationDelay = `${0.15 + i * 0.18}s`;
      title.appendChild(span);
    });

    // Trigger after a small delay
    setTimeout(() => {
      title.querySelectorAll('.word-reveal').forEach(span => {
        span.classList.add('visible');
      });
    }, 200);
  }

  initHeroWordReveal();
});

// ── Utility ──
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
