// CosmicCadets Core Shared Engine Utilities
(function() {
  window.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  window.TAU = Math.PI * 2;

  // Animation Loop with capped delta time
  window.loop = function(fn) {
    let id, last = performance.now(), on = true;
    const f = n => {
      if (!on) return;
      const dt = Math.min(0.05, (n - last) / 1000);
      last = n;
      try {
        fn(dt);
      } catch (err) {
        console.error('Error in game loop:', err);
      }
      id = requestAnimationFrame(f);
    };
    id = requestAnimationFrame(f);
    return () => {
      on = false;
      cancelAnimationFrame(id);
    };
  };

  // Hold pointer event helper for buttons
  window.hold = function(el, on, off) {
    if (!el) return;
    const d = e => {
      e.preventDefault();
      el.classList.add('down');
      on();
    };
    const u = () => {
      el.classList.remove('down');
      off();
    };
    el.addEventListener('pointerdown', d);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(k => el.addEventListener(k, u));
  };

  // Particle systems
  window.pbx = function(x, y, col, n = 14) {
    if (!window.__parts) window.__parts = [];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * window.TAU;
      const s = 60 + Math.random() * 220;
      window.__parts.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 40,
        l: 0.7 + Math.random() * 0.5,
        t: 0,
        c: col,
        r: 2 + Math.random() * 4
      });
    }
  };

  window.pb = function(cv, cx, cy, col, n) {
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    window.pbx(r.left + (cx * r.width) / cv.width, r.top + (cy * r.height) / cv.height, col, n);
  };

  window.pbe = function(el, col, n) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    window.pbx(r.left + r.width / 2, r.top + r.height / 2, col, n);
  };

  window.confetti = function() {
    if (!window.__parts) window.__parts = [];
    const cs = ['#ffd23f', '#ff5d6c', '#3ddc97', '#4cc9f0', '#fff'];
    const W = window.innerWidth || 800;
    for (let i = 0; i < 90; i++) {
      window.__parts.push({
        x: Math.random() * W,
        y: -10,
        vx: (Math.random() - 0.5) * 140,
        vy: 120 + Math.random() * 260,
        l: 2.6,
        t: 0,
        c: cs[i % 5],
        r: 4 + Math.random() * 4,
        g: 1
      });
    }
  };

  window.shake = function(el) {
    if (!el || !el.animate) return;
    el.animate([
      { transform: 'translate(0)' },
      { transform: 'translate(-8px, 3px)' },
      { transform: 'translate(7px, -3px)' },
      { transform: 'translate(0)' }
    ], { duration: 260 });
  };
})();
