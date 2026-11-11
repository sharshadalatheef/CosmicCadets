// CosmicCadets Core Shared Engine Utilities - Mobile & Desktop Robust
(function() {
  window.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  window.TAU = Math.PI * 2;

  // Universal touch and pointer coordinates helper for mobile & desktop
  window.getCanvasCoords = function(e, canvas, virtualW = 360, virtualH = 420) {
    if (!canvas) return { x: virtualW / 2, y: virtualH / 2 };
    const rect = canvas.getBoundingClientRect();
    let cx = 0, cy = 0;

    if (e.touches && e.touches.length > 0) {
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      cx = e.changedTouches[0].clientX;
      cy = e.changedTouches[0].clientY;
    } else {
      cx = e.clientX != null ? e.clientX : (rect.left + rect.width / 2);
      cy = e.clientY != null ? e.clientY : (rect.top + rect.height / 2);
    }

    const rw = rect.width || 1;
    const rh = rect.height || 1;
    return {
      x: Math.max(0, Math.min(virtualW, ((cx - rect.left) / rw) * virtualW)),
      y: Math.max(0, Math.min(virtualH, ((cy - rect.top) / rh) * virtualH))
    };
  };

  // Bulletproof hold button helper for mobile & desktop
  window.hold = function(el, on, off) {
    if (!el) return;
    let isDown = false;
    let activePointerId = null;

    const start = e => {
      e.preventDefault();
      if (isDown) return;
      isDown = true;
      activePointerId = e.pointerId != null ? e.pointerId : 'touch';
      el.classList.add('down');
      try {
        if (e.pointerId != null && el.setPointerCapture) {
          el.setPointerCapture(e.pointerId);
        }
      } catch (err) {}
      on();
    };

    const stop = e => {
      if (!isDown) return;
      if (e && e.pointerId != null && activePointerId !== null && e.pointerId !== activePointerId) return;
      isDown = false;
      activePointerId = null;
      el.classList.remove('down');
      try {
        if (e && e.pointerId != null && el.releasePointerCapture) {
          el.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}
      off();
    };

    el.addEventListener('pointerdown', start);
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);

    // Explicit touch events fallback for iOS Safari
    el.addEventListener('touchstart', start, { passive: false });
    el.addEventListener('touchend', stop, { passive: false });
    el.addEventListener('touchcancel', stop, { passive: false });
  };

  // Instant responsive tap for mobile buttons (no 300ms delay)
  window.addMobileTap = function(el, fn) {
    if (!el) return;
    let tapped = false;
    const trigger = e => {
      e.preventDefault();
      e.stopPropagation();
      if (tapped) return;
      tapped = true;
      setTimeout(() => tapped = false, 120);
      fn(e);
    };
    el.addEventListener('pointerdown', trigger);
    el.addEventListener('touchstart', trigger, { passive: false });
  };

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
