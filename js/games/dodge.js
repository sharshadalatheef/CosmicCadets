// Debris Dodge - Reflex Steering Trainer (Zero Emojis, 100% Vector)
function dodgeGame(st, api) {
  const c = document.createElement('canvas');
  c.className = 'cv';
  c.width = 360;
  c.height = 420;
  c.style.touchAction = 'none';
  const x = c.getContext('2d');

  const pad = document.createElement('div');
  pad.className = 'pad';
  const bl = document.createElement('button');
  bl.className = 'big pad-btn';
  bl.style.touchAction = 'none';
  bl.innerHTML = Icons.arrowLeft(24);
  const br = document.createElement('button');
  br.className = 'big pad-btn';
  br.style.touchAction = 'none';
  br.innerHTML = Icons.arrowRight(24);
  pad.append(bl, br);
  st.append(c, pad);

  let px = 180, tx = 180, L = 0, R = 0, drag = 0;
  let lives = 3, sc = 0, t = 0;
  const T = 45;
  let obs = [], sp = 0, inv = 0, done = false, bgy = 0;

  hold(bl, () => L = 1, () => L = 0);
  hold(br, () => R = 1, () => R = 0);

  const setT = e => {
    const pos = window.getCanvasCoords ? window.getCanvasCoords(e, c, 360, 420) : { x: 180, y: 200 };
    tx = pos.x;
  };

  c.addEventListener('pointerdown', e => {
    drag = 1;
    try { c.setPointerCapture(e.pointerId); } catch(err) {}
    setT(e);
  });
  c.addEventListener('pointermove', e => { if (drag) setT(e); });
  const stopDodgeDrag = e => {
    drag = 0;
    if (e && e.pointerId) {
      try { c.releasePointerCapture(e.pointerId); } catch(err) {}
    }
  };
  ['pointerup', 'pointercancel'].forEach(k => c.addEventListener(k, stopDodgeDrag));
  window.addEventListener('pointerup', stopDodgeDrag);
  window.addEventListener('pointercancel', stopDodgeDrag);

  const kd = e => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') L = 1;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') R = 1;
  };
  const ku = e => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') L = 0;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') R = 0;
  };
  addEventListener('keydown', kd);
  addEventListener('keyup', ku);

  function drawStarCrystal(cx, cy, radius = 13) {
    x.save();
    x.translate(cx, cy);
    x.fillStyle = '#ffd23f';
    x.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const ai = a + Math.PI / 5;
      if (i === 0) x.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
      else x.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
      x.lineTo(Math.cos(ai) * (radius * 0.45), Math.sin(ai) * (radius * 0.45));
    }
    x.closePath();
    x.fill();
    x.fillStyle = '#fff';
    x.beginPath();
    x.arc(-radius * 0.25, -radius * 0.25, radius * 0.2, 0, Math.PI * 2);
    x.fill();
    x.restore();
  }

  function drawAsteroid(cx, cy, radius = 16, rot = 0) {
    x.save();
    x.translate(cx, cy);
    x.rotate(rot);
    x.fillStyle = '#7a6f9b';
    x.beginPath();
    for (let i = 0; i < 7; i++) {
      const a = (i * Math.PI * 2) / 7;
      const rVar = radius * (0.8 + ((i * 3) % 4) * 0.1);
      if (i === 0) x.moveTo(Math.cos(a) * rVar, Math.sin(a) * rVar);
      else x.lineTo(Math.cos(a) * rVar, Math.sin(a) * rVar);
    }
    x.closePath();
    x.fill();

    // Crater textures
    x.fillStyle = '#524873';
    x.beginPath();
    x.arc(-4, -3, 3.5, 0, Math.PI * 2);
    x.arc(5, 4, 2.5, 0, Math.PI * 2);
    x.fill();
    x.restore();
  }

  const stop = loop(dt => {
    if (done) return;
    t += dt;
    inv = Math.max(0, inv - dt);

    if (L) px -= 280 * dt;
    if (R) px += 280 * dt;
    if (drag) px += (tx - px) * Math.min(1, 12 * dt);
    px = clamp(px, 24, 336);

    sp -= dt;
    if (sp <= 0) {
      sp = 0.55 - 0.2 * Math.min(1, t / 30);
      obs.push({
        x: 20 + Math.random() * 320,
        y: -24,
        v: 130 + t * 3.5 + Math.random() * 60,
        star: Math.random() < 0.45,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 3
      });
    }

    for (const o of obs) {
      o.y += o.v * dt;
      o.rot += o.vrot * dt;
      if (Math.hypot(o.x - px, o.y - 375) < 32 && !o.dead) {
        o.dead = 1;
        if (o.star) {
          sc++;
          Sound.star();
          pb(c, o.x, o.y, '#ffd23f', 14);
        } else if (!inv) {
          lives--;
          inv = 1.2;
          Sound.damage();
          pb(c, px, 375, '#ff9f1c', 26);
          shake(c);
        }
      }
    }
    obs = obs.filter(o => !o.dead && o.y < 450);

    api.hud(`
      <span class="hud-item">${Icons.star(true, 18)} ${sc}</span>
      <span class="hud-item">${Icons.hearts(Math.max(0, lives), 3, 18)}</span>
      <span class="hud-item">${Icons.clock(18)} ${Math.max(0, Math.ceil(T - t))}s</span>
    `);

    bgy = (bgy + 200 * dt) % 40;
    x.fillStyle = '#070b2a';
    x.fillRect(0, 0, 360, 420);

    // Speed lines
    x.strokeStyle = 'rgba(255,255,255,.14)';
    x.lineWidth = 2;
    for (let i = 0; i < 9; i++) {
      const yy = bgy + i * 40;
      x.beginPath();
      x.moveTo(40 + i * 35, yy);
      x.lineTo(40 + i * 35, yy + 14);
      x.stroke();
    }

    // Draw objects (Vector Stars and Asteroids - Zero Emojis!)
    for (const o of obs) {
      if (o.star) {
        drawStarCrystal(o.x, o.y, 14);
      } else {
        drawAsteroid(o.x, o.y, 16, o.rot);
      }
    }

    // Draw Rocket
    if (!inv || Math.floor(t * 12) % 2) {
      x.fillStyle = '#ff9f1c';
      x.beginPath();
      x.moveTo(px - 7, 392);
      x.lineTo(px, 414 + Math.random() * 8);
      x.lineTo(px + 7, 392);
      x.fill();

      x.fillStyle = '#e8ecff';
      x.beginPath();
      x.moveTo(px, 350);
      x.lineTo(px + 20, 394);
      x.lineTo(px - 20, 394);
      x.closePath();
      x.fill();

      x.fillStyle = '#4cc9f0';
      x.beginPath();
      x.arc(px, 374, 6, 0, Math.PI * 2);
      x.fill();
    }

    if (lives <= 0 || t >= T) {
      done = true;
      const starsEarned = sc >= 18 ? 3 : sc >= 10 ? 2 : sc >= 4 ? 1 : 0;
      const score = sc * 100 + lives * 200;
      const msg = lives <= 0
        ? `Asteroid collision! You grabbed ${sc} star crystals before impact.`
        : `Navigation complete! You gathered ${sc} star crystals!`;
      setTimeout(() => api.end(starsEarned, msg, score), 600);
    }
  });

  return () => {
    stop();
    window.removeEventListener('pointerup', stopDodgeDrag);
    window.removeEventListener('pointercancel', stopDodgeDrag);
    removeEventListener('keydown', kd);
    removeEventListener('keyup', ku);
  };
}
