// Laser Shoot Training - Among Us Weapons Style Target Shooter (Zero Emojis, 100% Vector)
function blasterGame(st, api) {
  const c = document.createElement('canvas');
  c.className = 'cv';
  c.width = 360;
  c.height = 420;
  const x = c.getContext('2d');

  // Simple, large tactile button below canvas
  const pad = document.createElement('div');
  pad.className = 'pad';
  const shootBtn = document.createElement('button');
  shootBtn.className = 'big fire-btn';
  shootBtn.innerHTML = Icons.target(24) + ' SHOOT!';
  pad.append(shootBtn);
  st.append(c, pad);

  let score = 0;
  let targetsHit = 0;
  let t = 0;
  const T = 40;
  let done = false;

  let crosshair = { x: 180, y: 200, active: false };
  let lasers = []; // Visual laser beams shooting toward tap
  let targets = [];
  let particles = [];
  let popups = [];
  let shakeTime = 0;

  // Combo system
  let combo = 0;
  let comboTimer = 0;

  function updateCrosshair(e) {
    const rect = c.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    crosshair.x = ((clientX - rect.left) / rect.width) * 360;
    crosshair.y = ((clientY - rect.top) / rect.height) * 420;
    crosshair.active = true;
  }

  function fireAt(targetX, targetY) {
    if (done) return;
    Sound.laser();

    // Twin laser beams from bottom-left (30, 410) and bottom-right (330, 410)
    lasers.push({
      x1: 40, y1: 410,
      x2: 320, y2: 410,
      tx: targetX, ty: targetY,
      t: 0, life: 0.12
    });

    // Check hit on targets
    let hitAny = false;
    targets.forEach(tgt => {
      if (!tgt.dead) {
        const dist = Math.hypot(tgt.x - targetX, tgt.y - targetY);
        if (dist < tgt.r + 14) {
          tgt.hp--;
          hitAny = true;

          if (tgt.hp <= 0) {
            tgt.dead = true;
            targetsHit++;
            combo++;
            comboTimer = 1.8;
            const mult = Math.min(combo, 5);
            const basePts = tgt.type === 'gold' ? 300 : tgt.type === 'mine' ? 200 : tgt.type === 'rock' ? 150 : 100;
            const pts = basePts * mult;
            score += pts;

            Sound.explosion(tgt.type === 'mine');
            if (combo > 1) Sound.combo(mult);

            // Explosion sparks
            const col = tgt.type === 'gold' ? '#ffd23f' : tgt.type === 'mine' ? '#ff5d6c' : tgt.type === 'rock' ? '#a594f9' : '#4cc9f0';
            addSparks(tgt.x, tgt.y, col, 26);
            addPopup(`+${pts}` + (mult > 1 ? ` (x${mult} COMBO!)` : ''), tgt.x, tgt.y - 10, col);

            // Red mine explosion wipes out nearby targets!
            if (tgt.type === 'mine') {
              shakeTime = 0.35;
              targets.forEach(other => {
                if (!other.dead && Math.hypot(other.x - tgt.x, other.y - tgt.y) < 95) {
                  other.dead = true;
                  targetsHit++;
                  score += 150;
                  addSparks(other.x, other.y, '#ffd23f', 18);
                  addPopup('+150 MINE BLAST!', other.x, other.y, '#ff9f1c');
                }
              });
            }
          } else {
            // Armored hit
            Sound.hit();
            addSparks(targetX, targetY, '#ffd23f', 8);
          }
        }
      }
    });

    if (!hitAny) {
      // Missed shot resets combo
      combo = 0;
      addSparks(targetX, targetY, 'rgba(76, 201, 240, 0.4)', 6);
    }
  }

  // Pointer events on canvas (Tap to shoot!)
  c.addEventListener('pointerdown', e => {
    e.preventDefault();
    updateCrosshair(e);
    fireAt(crosshair.x, crosshair.y);
  });
  c.addEventListener('pointermove', e => {
    updateCrosshair(e);
  });

  // Shoot button fires at crosshair or screen center
  shootBtn.addEventListener('pointerdown', e => {
    e.preventDefault();
    shootBtn.classList.add('down');
    fireAt(crosshair.active ? crosshair.x : 180, crosshair.active ? crosshair.y : 180);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(k => {
    shootBtn.addEventListener(k, () => shootBtn.classList.remove('down'));
  });

  // Spacebar / Enter to shoot
  const key = e => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      fireAt(crosshair.active ? crosshair.x : 180, crosshair.active ? crosshair.y : 180);
    }
  };
  addEventListener('keydown', key);

  function spawnTarget() {
    const types = ['drone', 'rock', 'mine'];
    if (Math.random() < 0.15) types.push('gold');
    const type = types[Math.floor(Math.random() * types.length)];

    // Spawn from edges (top or sides)
    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? -20 : 380;
    const startY = 30 + Math.random() * 220;
    const endX = fromLeft ? 380 : -20;
    const endY = 40 + Math.random() * 260;

    const spd = 60 + Math.random() * 65;
    const angle = Math.atan2(endY - startY, endX - startX);

    targets.push({
      type,
      x: startX,
      y: startY,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      hp: type === 'rock' ? 2 : 1,
      r: type === 'rock' ? 20 : type === 'gold' ? 18 : 16,
      rot: 0,
      vrot: (Math.random() - 0.5) * 3
    });
  }

  function addSparks(sx, sy, col, count = 20) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 50 + Math.random() * 200;
      particles.push({
        x: sx, y: sy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        color: col,
        life: 0.45 + Math.random() * 0.35,
        t: 0,
        r: 2 + Math.random() * 3.5
      });
    }
  }

  function addPopup(txt, px, py, color = '#ffd23f') {
    popups.push({ text: txt, x: px, y: py, color, t: 0, life: 0.75 });
  }

  let spawnTimer = 0.3;

  const stop = loop(dt => {
    if (done) return;
    t += dt;
    shakeTime = Math.max(0, shakeTime - dt);

    // Combo decay
    if (combo > 0) {
      comboTimer -= dt;
      if (comboTimer <= 0) combo = 0;
    }

    // Spawn targets
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnTarget();
      spawnTimer = Math.max(0.45, 1.1 - (t / 30) * 0.55);
    }

    // Update targets
    targets.forEach(tgt => {
      tgt.x += tgt.vx * dt;
      tgt.y += tgt.vy * dt;
      tgt.rot += tgt.vrot * dt;
    });
    targets = targets.filter(tgt => !tgt.dead && tgt.x > -40 && tgt.x < 400 && tgt.y < 440);

    // Update lasers
    lasers.forEach(l => l.t += dt);
    lasers = lasers.filter(l => l.t < l.life);

    // Update particles & popups
    particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.t += dt;
    });
    particles = particles.filter(p => p.t < p.life);

    popups.forEach(po => {
      po.y -= 38 * dt;
      po.t += dt;
    });
    popups = popups.filter(po => po.t < po.life);

    // Update HUD
    api.hud(`
      <span class="hud-item">${Icons.target(18)} Score: ${score}</span>
      <span class="hud-item">${Icons.check(18)} Hit: ${targetsHit}</span>
      <span class="hud-item">${Icons.clock(18)} ${Math.max(0, Math.ceil(T - t))}s</span>
    `);

    // DRAW COCKPIT WEAPONS VIEW (Zero Emojis!)
    x.save();
    if (shakeTime > 0) {
      x.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
    }

    // Deep space backdrop
    x.fillStyle = '#060924';
    x.fillRect(0, 0, 360, 420);

    // Stars
    x.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i = 0; i < 22; i++) {
      const sx = (i * 47) % 360;
      const sy = (i * 59 + t * 40) % 420;
      x.fillRect(sx, sy, 2, 2);
    }

    // Cockpit Window Glass Frame Lines
    x.strokeStyle = 'rgba(76, 201, 240, 0.2)';
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(0, 0); x.lineTo(70, 70);
    x.moveTo(360, 0); x.lineTo(290, 70);
    x.moveTo(70, 70); x.lineTo(290, 70);
    x.stroke();

    // Draw Targets
    targets.forEach(tgt => {
      x.save();
      x.translate(tgt.x, tgt.y);
      x.rotate(tgt.rot);

      if (tgt.type === 'drone') {
        // Alien Scout Drone
        x.fillStyle = '#4cc9f0';
        x.beginPath();
        x.ellipse(0, 0, 16, 10, 0, 0, Math.PI * 2);
        x.fill();
        x.fillStyle = '#ffd23f';
        x.beginPath();
        x.arc(0, -4, 6, 0, Math.PI * 2);
        x.fill();
        x.strokeStyle = '#3ddc97';
        x.lineWidth = 2;
        x.stroke();
      } else if (tgt.type === 'rock') {
        // Armored Asteroid
        x.fillStyle = '#8377ad';
        x.beginPath();
        for (let a = 0; a < 6; a++) {
          const ang = (a * Math.PI) / 3;
          const rVar = tgt.r * (0.8 + ((a * 3) % 4) * 0.1);
          if (a === 0) x.moveTo(Math.cos(ang) * rVar, Math.sin(ang) * rVar);
          else x.lineTo(Math.cos(ang) * rVar, Math.sin(ang) * rVar);
        }
        x.closePath();
        x.fill();
        x.fillStyle = '#594d82';
        x.beginPath();
        x.arc(-4, -4, 4, 0, Math.PI * 2);
        x.fill();
      } else if (tgt.type === 'mine') {
        // Red Bomb Mine
        x.fillStyle = '#ff5d6c';
        x.beginPath();
        x.arc(0, 0, 12, 0, Math.PI * 2);
        x.fill();
        x.strokeStyle = '#ffd23f';
        x.lineWidth = 2.5;
        for (let a = 0; a < 6; a++) {
          const ang = (a * Math.PI) / 3;
          x.beginPath();
          x.moveTo(Math.cos(ang) * 9, Math.sin(ang) * 9);
          x.lineTo(Math.cos(ang) * 17, Math.sin(ang) * 17);
          x.stroke();
        }
      } else {
        // Golden Bonus Pod
        x.fillStyle = '#ffd23f';
        x.beginPath();
        x.arc(0, 0, 15, 0, Math.PI * 2);
        x.fill();
        x.fillStyle = '#fff';
        x.fillRect(-5, -5, 10, 10);
      }
      x.restore();
    });

    // Draw Laser Beams (Converging on tap point)
    lasers.forEach(l => {
      const alpha = 1 - l.t / l.life;
      x.strokeStyle = `rgba(76, 201, 240, ${alpha})`;
      x.lineWidth = 4;
      x.shadowColor = '#4cc9f0';
      x.shadowBlur = 14;

      x.beginPath();
      x.moveTo(l.x1, l.y1);
      x.lineTo(l.tx, l.ty);
      x.stroke();

      x.beginPath();
      x.moveTo(l.x2, l.y2);
      x.lineTo(l.tx, l.ty);
      x.stroke();

      // White core
      x.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(l.x1, l.y1); x.lineTo(l.tx, l.ty);
      x.moveTo(l.x2, l.y2); x.lineTo(l.tx, l.ty);
      x.stroke();
      x.shadowBlur = 0;
    });

    // Draw Particles
    particles.forEach(p => {
      x.globalAlpha = Math.max(0, 1 - p.t / p.life);
      x.fillStyle = p.color;
      x.beginPath();
      x.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      x.fill();
    });
    x.globalAlpha = 1;

    // Draw Popups
    popups.forEach(po => {
      x.globalAlpha = Math.max(0, 1 - po.t / po.life);
      x.fillStyle = po.color;
      x.font = 'bold 15px Fredoka, sans-serif';
      x.textAlign = 'center';
      x.fillText(po.text, po.x, po.y);
    });
    x.globalAlpha = 1;

    // Twin Cannons at Bottom Corners (Cockpit Turret)
    // Left Cannon
    x.fillStyle = '#1c2666';
    x.fillRect(20, 370, 40, 50);
    x.fillStyle = '#4cc9f0';
    x.fillRect(34, 340, 12, 40);
    // Right Cannon
    x.fillStyle = '#1c2666';
    x.fillRect(300, 370, 40, 50);
    x.fillStyle = '#4cc9f0';
    x.fillRect(314, 340, 12, 40);

    // Aim Crosshair
    const cx = crosshair.active ? crosshair.x : 180;
    const cy = crosshair.active ? crosshair.y : 180;
    x.strokeStyle = '#ffd23f';
    x.lineWidth = 2;
    x.beginPath();
    x.arc(cx, cy, 14, 0, Math.PI * 2);
    x.stroke();
    x.beginPath();
    x.moveTo(cx - 20, cy); x.lineTo(cx + 20, cy);
    x.moveTo(cx, cy - 20); x.lineTo(cx, cy + 20);
    x.stroke();

    // Combo Banner
    if (combo >= 2) {
      x.fillStyle = '#ffd23f';
      x.font = 'bold 18px Fredoka, sans-serif';
      x.textAlign = 'center';
      x.fillText(`${combo}x COMBO!`, 180, 40);
    }

    x.restore();

    // Game End Check
    if (t >= T) {
      done = true;
      const starsEarned = score >= 3000 ? 3 : score >= 1800 ? 2 : score >= 800 ? 1 : 0;
      const msg = `Great shooting! You blasted ${targetsHit} targets and scored ${score} points!`;
      setTimeout(() => api.end(starsEarned, msg, score), 600);
    }
  });

  return () => {
    stop();
    removeEventListener('keydown', key);
  };
}
