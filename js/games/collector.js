// Space Trash Training - Challenging Among Us Style Airlock Trash Purge (Production Ready, Zero Emojis)
function collectorGame(st, api) {
  const c = document.createElement('canvas');
  c.className = 'cv';
  c.width = 360;
  c.height = 430;
  c.style.touchAction = 'none';
  const x = c.getContext('2d');

  // Big tactile tactile lever button below canvas
  const pad = document.createElement('div');
  pad.className = 'pad';
  const leverBtn = document.createElement('button');
  leverBtn.className = 'big suction-btn';
  leverBtn.style.touchAction = 'none';
  leverBtn.innerHTML = Icons.recycle(24) + ' HOLD TO FLUSH LEVER!';
  pad.append(leverBtn);
  st.append(c, pad);

  let score = 0;
  let trashCleaned = 0;
  let lives = 3;
  let t = 0;
  const T = 45;
  let wave = 1;
  let done = false;

  // Hydraulic Lever & Airlock Hatch States
  let leverProgress = 0; // 0 to 1
  let isHoldingLever = false;
  let hatchOpen = 0;
  let sirenTimer = 0;
  let shakeTime = 0;

  // Wave items
  let trashList = [];
  let hazards = []; // Mines and slime
  let particles = [];
  let popups = [];

  // Dragging mechanics
  let draggedItem = null;
  let dragOffsetX = 0, dragOffsetY = 0;

  const CHUTE_X = 180, CHUTE_Y = 385, CHUTE_R = 46;
  const LEVER_X = 320, LEVER_Y_UP = 160, LEVER_H = 120;

  function spawnWave(waveNum) {
    trashList = [];
    hazards = [];

    const itemCount = waveNum === 1 ? 6 : waveNum === 2 ? 8 : 10;
    const types = ['can', 'pizza', 'wrench', 'battery', 'foil'];

    for (let i = 0; i < itemCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const spd = 30 + waveNum * 15 + Math.random() * 30;
      const ang = Math.random() * Math.PI * 2;
      trashList.push({
        id: Math.random(),
        type,
        x: 45 + Math.random() * 210,
        y: 45 + Math.random() * 180,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 2.5,
        r: 17,
        pts: type === 'battery' ? 180 : type === 'wrench' ? 140 : 100
      });
    }

    // Add Mines in Wave 2 & 3
    if (waveNum >= 2) {
      const mineCount = waveNum === 2 ? 1 : 2;
      for (let m = 0; m < mineCount; m++) {
        hazards.push({
          id: Math.random(),
          type: 'mine',
          x: 60 + Math.random() * 180,
          y: 60 + Math.random() * 140,
          vx: (Math.random() - 0.5) * 40,
          vy: (Math.random() - 0.5) * 40,
          rot: 0,
          r: 20,
          tapsLeft: 2, // Must tap 2 times to defuse!
          armed: true,
          pulseTimer: 0
        });
      }
    }

    // Add Alien Slime in Wave 3
    if (waveNum >= 3) {
      hazards.push({
        id: Math.random(),
        type: 'slime',
        x: 80 + Math.random() * 140,
        y: 80 + Math.random() * 100,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        rot: 0,
        r: 22,
        tapsLeft: 1,
        armed: true
      });
    }

    addPopup(`WAVE ${waveNum}!`, 180, 160, '#ffd23f');
  }

  spawnWave(1);

  function addSparks(sx, sy, col, count = 18) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 60 + Math.random() * 180;
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

  function addPopup(txt, px, py, color = '#3ddc97') {
    popups.push({ text: txt, x: px, y: py, color, t: 0, life: 0.8 });
  }

  // Trigger flush action
  function triggerFlushSuccess() {
    // Check if any armed hazards exist in airlock
    const armedMine = hazards.find(h => h.type === 'mine' && h.armed);
    if (armedMine) {
      // DANGER! FLUSHED AN ARMED MINE!
      Sound.damage();
      Sound.explosion(true);
      lives--;
      shakeTime = 0.5;
      sirenTimer = 0.8;
      addSparks(CHUTE_X, CHUTE_Y, '#ff5d6c', 40);
      addPopup('DANGER! MINE EXPLODED! -1 LIFE', CHUTE_X, 220, '#ff5d6c');
      hazards = hazards.filter(h => h.id !== armedMine.id);
      return;
    }

    // Safe purge!
    Sound.vacuum();
    Sound.star();
    sirenTimer = 0.4;
    shakeTime = 0.25;
    hatchOpen = 1.0;

    const count = trashList.length;
    const bonus = count * 150 + (wave * 250);
    score += bonus;
    trashCleaned += count;

    trashList.forEach(item => addSparks(item.x, item.y, '#3ddc97', 14));
    trashList = [];

    addSparks(CHUTE_X, CHUTE_Y, '#3ddc97', 35);
    addPopup(`FLUSHED! +${bonus} PTS!`, CHUTE_X, 220, '#ffd23f');

    // Next wave
    if (wave < 3) {
      wave++;
      setTimeout(() => { if (!done) spawnWave(wave); }, 700);
    } else {
      // Loop wave 3 with bonus
      setTimeout(() => { if (!done) spawnWave(3); }, 700);
    }
  }

  const getCoords = e => (window.getCanvasCoords ? window.getCanvasCoords(e, c, 360, 430) : { x: 180, y: 200 });

  c.addEventListener('pointerdown', e => {
    e.preventDefault();
    try { c.setPointerCapture(e.pointerId); } catch(err) {}
    const pos = getCoords(e);

    // Check Lever on right (generous touch hit area for thumb taps on mobile)
    if (pos.x >= 265 && pos.y >= LEVER_Y_UP - 25 && pos.y <= LEVER_Y_UP + LEVER_H + 35) {
      isHoldingLever = true;
      return;
    }

    // Check tap on hazards (defuse mines / pop slime)
    for (let h of hazards) {
      if (Math.hypot(pos.x - h.x, pos.y - h.y) < h.r + 18) {
        if (h.armed) {
          h.tapsLeft--;
          Sound.click();
          addSparks(h.x, h.y, '#ffd23f', 10);
          if (h.tapsLeft <= 0) {
            h.armed = false;
            Sound.star();
            score += 200;
            addSparks(h.x, h.y, '#3ddc97', 22);
            addPopup(h.type === 'mine' ? 'MINE DEFUSED! +200' : 'SLIME CLEANED! +200', h.x, h.y - 20, '#3ddc97');
          }
        }
        return;
      }
    }

    // Check drag on trash items
    for (let i = trashList.length - 1; i >= 0; i--) {
      const item = trashList[i];
      if (Math.hypot(pos.x - item.x, pos.y - item.y) < item.r + 20) {
        draggedItem = item;
        dragOffsetX = item.x - pos.x;
        dragOffsetY = item.y - pos.y;
        break;
      }
    }
  });

  c.addEventListener('pointermove', e => {
    const pos = getCoords(e);

    if (draggedItem) {
      draggedItem.x = pos.x + dragOffsetX;
      draggedItem.y = pos.y + dragOffsetY;

      // Check drop into bottom chute
      if (Math.hypot(draggedItem.x - CHUTE_X, draggedItem.y - CHUTE_Y) < CHUTE_R + 18) {
        const item = draggedItem;
        draggedItem = null;
        trashList = trashList.filter(t => t.id !== item.id);
        trashCleaned++;
        score += item.pts;
        Sound.star();
        addSparks(CHUTE_X, CHUTE_Y - 12, '#3ddc97', 16);
        addPopup(`+${item.pts}`, CHUTE_X, CHUTE_Y - 32, '#3ddc97');

        // Check if wave is fully cleared
        if (trashList.length === 0 && hazards.filter(h => h.armed).length === 0) {
          score += 300;
          addPopup('WAVE CLEAR! +300', 180, 200, '#ffd23f');
          if (wave < 3) wave++;
          setTimeout(() => { if (!done) spawnWave(wave); }, 600);
        }
      }
    }
  });

  const stopPulling = e => {
    isHoldingLever = false;
    draggedItem = null;
    if (e && e.pointerId) {
      try { c.releasePointerCapture(e.pointerId); } catch(err) {}
    }
  };
  ['pointerup', 'pointercancel'].forEach(ev => c.addEventListener(ev, stopPulling));
  window.addEventListener('pointerup', stopPulling);
  window.addEventListener('pointercancel', stopPulling);

  // Button hold listeners using upgraded hold()
  hold(leverBtn, () => isHoldingLever = true, () => isHoldingLever = false);

  // Keyboard Space hold
  const kd = e => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      isHoldingLever = true;
    }
  };
  const ku = e => {
    if (e.code === 'Space' || e.code === 'Enter') {
      isHoldingLever = false;
    }
  };
  addEventListener('keydown', kd);
  addEventListener('keyup', ku);

  const stop = loop(dt => {
    if (done) return;
    t += dt;
    shakeTime = Math.max(0, shakeTime - dt);
    sirenTimer = Math.max(0, sirenTimer - dt);
    hatchOpen = Math.max(0, hatchOpen - 2.5 * dt);

    // Lever pull physics
    if (isHoldingLever) {
      leverProgress = Math.min(1, leverProgress + 1.2 * dt);
      if (Math.random() < 0.25) Sound.vacuum();

      // Lever fully pulled down!
      if (leverProgress >= 1.0) {
        isHoldingLever = false;
        leverProgress = 0;
        triggerFlushSuccess();
      }
    } else {
      // Spring back up
      leverProgress = Math.max(0, leverProgress - 3.5 * dt);
    }

    // Move trash in airlock
    trashList.forEach(item => {
      if (item !== draggedItem) {
        item.x += item.vx * dt;
        item.y += item.vy * dt;
        item.rot += item.vrot * dt;

        // Bounce walls
        if (item.x < 30 || item.x > 265) item.vx *= -1;
        if (item.y < 30 || item.y > 330) item.vy *= -1;
        item.x = clamp(item.x, 26, 269);
        item.y = clamp(item.y, 26, 334);
      }
    });

    // Move hazards
    hazards.forEach(h => {
      h.x += h.vx * dt;
      h.y += h.vy * dt;
      h.pulseTimer += 4 * dt;
      if (h.x < 35 || h.x > 260) h.vx *= -1;
      if (h.y < 35 || h.y > 320) h.vy *= -1;
    });

    // Update particles & popups
    particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.t += dt;
    });
    particles = particles.filter(p => p.t < p.life);

    popups.forEach(po => {
      po.y -= 40 * dt;
      po.t += dt;
    });
    popups = popups.filter(po => po.t < po.life);

    // Update HUD
    api.hud(`
      <span class="hud-item">${Icons.recycle(18)} ${score}</span>
      <span class="hud-item">${Icons.hearts(lives, 3, 18)}</span>
      <span class="hud-item">Wave ${wave}/3</span>
      <span class="hud-item">${Icons.clock(18)} ${Math.max(0, Math.ceil(T - t))}s</span>
    `);

    // DRAW AIRLOCK SCENE (Zero Emojis!)
    x.save();
    if (shakeTime > 0) {
      x.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
    }

    // Interior Chamber Wall
    x.fillStyle = '#0f1738';
    x.fillRect(0, 0, 360, 430);

    // Space Hatch Window
    x.fillStyle = '#060a22';
    x.beginPath();
    x.roundRect ? x.roundRect(24, 24, 252, 310, 16) : x.rect(24, 24, 252, 310);
    x.fill();
    x.strokeStyle = '#2b367d';
    x.lineWidth = 3;
    x.stroke();

    // Passing stars
    x.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 18; i++) {
      const sx = 30 + ((i * 41) % 240);
      const sy = 30 + ((i * 53 + t * 30) % 290);
      x.fillRect(sx, sy, 2, 2);
    }

    // Siren alarm frame if hazard warning
    const hasArmedMine = hazards.some(h => h.type === 'mine' && h.armed);
    x.strokeStyle = sirenTimer > 0 || hasArmedMine ? '#ff5d6c' : '#ffd23f';
    x.lineWidth = 4;
    x.strokeRect(26, 26, 248, 306);

    // Hazard Alert Banner
    if (hasArmedMine) {
      x.fillStyle = 'rgba(255, 93, 108, 0.2)';
      x.fillRect(26, 26, 248, 26);
      x.fillStyle = '#ff5d6c';
      x.font = 'bold 12px Fredoka, sans-serif';
      x.textAlign = 'center';
      x.fillText('CAUTION: TAP TO DEFUSE MINES BEFORE FLUSHING!', 150, 43);
    }

    // VACUUM CHUTE AT BOTTOM (180, 385)
    x.save();
    x.translate(CHUTE_X, CHUTE_Y);
    const chuteGrad = x.createRadialGradient(0, 0, 4, 0, 0, 48);
    chuteGrad.addColorStop(0, '#3ddc97');
    chuteGrad.addColorStop(0.6, 'rgba(76, 201, 240, 0.35)');
    chuteGrad.addColorStop(1, 'transparent');
    x.fillStyle = chuteGrad;
    x.beginPath();
    x.arc(0, 0, 46, 0, Math.PI * 2);
    x.fill();

    // Chute metal opening
    x.fillStyle = '#070b1a';
    x.beginPath();
    x.ellipse(0, 0, 44, 22, 0, 0, Math.PI * 2);
    x.fill();
    x.strokeStyle = '#3ddc97';
    x.lineWidth = 3.5;
    x.stroke();

    // Downward arrow
    x.fillStyle = '#3ddc97';
    x.beginPath();
    x.moveTo(-10, -8); x.lineTo(10, -8); x.lineTo(0, 8);
    x.closePath();
    x.fill();
    x.restore();

    // Chute Label
    x.fillStyle = '#b9c3ff';
    x.font = 'bold 11px Fredoka, sans-serif';
    x.textAlign = 'center';
    x.fillText('DROP TRASH HERE', CHUTE_X, 350);

    // DRAW TRASH ITEMS
    trashList.forEach(item => {
      x.save();
      x.translate(item.x, item.y);
      x.rotate(item.rot);

      if (item.type === 'can') {
        x.fillStyle = '#ff5d6c';
        x.beginPath();
        x.roundRect ? x.roundRect(-8, -14, 16, 28, 4) : x.rect(-8, -14, 16, 28);
        x.fill();
        x.fillStyle = '#ffd23f';
        x.fillRect(-8, -4, 16, 8);
        x.strokeStyle = '#fff';
        x.lineWidth = 1.5;
        x.stroke();
      } else if (item.type === 'pizza') {
        x.fillStyle = '#ffd23f';
        x.beginPath();
        x.moveTo(0, 16); x.lineTo(-14, -12); x.lineTo(14, -12);
        x.closePath();
        x.fill();
        x.fillStyle = '#ff5d6c';
        x.beginPath();
        x.arc(-3, -2, 3, 0, Math.PI * 2);
        x.arc(4, 4, 2.5, 0, Math.PI * 2);
        x.fill();
      } else if (item.type === 'wrench') {
        x.fillStyle = '#4cc9f0';
        x.fillRect(-4, -16, 8, 32);
        x.beginPath();
        x.arc(0, -16, 7, 0, Math.PI);
        x.arc(0, 16, 7, Math.PI, 0);
        x.fill();
      } else if (item.type === 'battery') {
        x.fillStyle = '#3ddc97';
        x.beginPath();
        x.roundRect ? x.roundRect(-8, -14, 16, 28, 4) : x.rect(-8, -14, 16, 28);
        x.fill();
        x.fillStyle = '#fff';
        x.fillRect(-4, -10, 8, 4);
      } else {
        x.fillStyle = '#c5d3e8';
        x.beginPath();
        x.arc(0, 0, 12, 0, Math.PI * 2);
        x.fill();
        x.strokeStyle = '#9381ff';
        x.lineWidth = 2;
        x.stroke();
      }
      x.restore();
    });

    // DRAW HAZARDS (Mines & Slime)
    hazards.forEach(h => {
      x.save();
      x.translate(h.x, h.y);

      if (h.type === 'mine') {
        // Red Spiked Mine
        const pulse = 1 + 0.15 * Math.sin(h.pulseTimer);
        x.scale(pulse, pulse);

        x.fillStyle = h.armed ? '#ff5d6c' : '#4cc9f0';
        x.beginPath();
        x.arc(0, 0, 14, 0, Math.PI * 2);
        x.fill();

        x.strokeStyle = h.armed ? '#ffd23f' : '#3ddc97';
        x.lineWidth = 3;
        for (let a = 0; a < 6; a++) {
          const ang = (a * Math.PI) / 3;
          x.beginPath();
          x.moveTo(Math.cos(ang) * 11, Math.sin(ang) * 11);
          x.lineTo(Math.cos(ang) * 19, Math.sin(ang) * 19);
          x.stroke();
        }

        // Tap count badge
        if (h.armed) {
          x.fillStyle = '#fff';
          x.font = 'bold 11px Fredoka, sans-serif';
          x.textAlign = 'center';
          x.textBaseline = 'middle';
          x.fillText(`TAP ${h.tapsLeft}`, 0, 0);
        } else {
          x.fillStyle = '#061824';
          x.font = 'bold 10px Fredoka, sans-serif';
          x.textAlign = 'center';
          x.textBaseline = 'middle';
          x.fillText('SAFE', 0, 0);
        }
      } else {
        // Alien Slime Blob
        x.fillStyle = h.armed ? '#70e000' : '#3ddc97';
        x.beginPath();
        x.arc(0, 0, 16, 0, Math.PI * 2);
        x.fill();
        x.fillStyle = '#38b000';
        x.beginPath();
        x.arc(-4, -4, 5, 0, Math.PI * 2);
        x.arc(5, 3, 4, 0, Math.PI * 2);
        x.fill();

        if (h.armed) {
          x.fillStyle = '#fff';
          x.font = 'bold 11px Fredoka, sans-serif';
          x.textAlign = 'center';
          x.textBaseline = 'middle';
          x.fillText('POP', 0, 0);
        }
      }
      x.restore();
    });

    // DRAW HYDRAULIC LEVER ON RIGHT
    // Rail
    x.fillStyle = '#080d26';
    x.beginPath();
    x.roundRect ? x.roundRect(LEVER_X - 10, LEVER_Y_UP - 10, 20, LEVER_H + 20, 10) : x.rect(LEVER_X - 10, LEVER_Y_UP - 10, 20, LEVER_H + 20);
    x.fill();
    x.strokeStyle = isHoldingLever ? '#ffd23f' : '#3a45a8';
    x.lineWidth = 3;
    x.stroke();

    // Lever arm
    const handleY = LEVER_Y_UP + leverProgress * LEVER_H;
    x.strokeStyle = '#ff9f1c';
    x.lineWidth = 8;
    x.beginPath();
    x.moveTo(LEVER_X, LEVER_Y_UP);
    x.lineTo(LEVER_X, handleY);
    x.stroke();

    // Chunky Red Handle Knob
    x.fillStyle = leverProgress > 0.85 ? '#3ddc97' : '#ff5d6c';
    x.beginPath();
    x.arc(LEVER_X, handleY, 20, 0, Math.PI * 2);
    x.fill();
    x.strokeStyle = '#fff';
    x.lineWidth = 3;
    x.stroke();

    // Lever instructions
    x.fillStyle = '#ffd23f';
    x.font = 'bold 11px Fredoka, sans-serif';
    x.textAlign = 'center';
    x.fillText('HOLD', LEVER_X, LEVER_Y_UP - 18);
    x.fillText('LEVER', LEVER_X, LEVER_Y_UP + LEVER_H + 30);

    // Lever Hold Progress Bar
    if (leverProgress > 0) {
      x.fillStyle = 'rgba(61, 220, 151, 0.4)';
      x.fillRect(LEVER_X - 6, handleY, 12, (LEVER_Y_UP + LEVER_H) - handleY);
    }

    // Draw Particles & Popups
    particles.forEach(p => {
      x.globalAlpha = Math.max(0, 1 - p.t / p.life);
      x.fillStyle = p.color;
      x.beginPath();
      x.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      x.fill();
    });
    x.globalAlpha = 1;

    popups.forEach(po => {
      x.globalAlpha = Math.max(0, 1 - po.t / po.life);
      x.fillStyle = po.color;
      x.font = 'bold 14px Fredoka, sans-serif';
      x.textAlign = 'center';
      x.fillText(po.text, po.x, po.y);
    });
    x.globalAlpha = 1;

    x.restore();

    // End conditions (out of lives or timer finished)
    if (lives <= 0 || t >= T) {
      done = true;
      const starsEarned = score >= 3500 ? 3 : score >= 2200 ? 2 : score >= 1000 ? 1 : 0;
      const msg = lives <= 0
        ? `Airlock breached by an explosive mine! You cleaned ${trashCleaned} trash items.`
        : `Airlock 100% secured! You cleaned ${trashCleaned} trash items and scored ${score} points!`;
      setTimeout(() => api.end(starsEarned, msg, score), 600);
    }
  });

  return () => {
    stop();
    window.removeEventListener('pointerup', stopPulling);
    window.removeEventListener('pointercancel', stopPulling);
    removeEventListener('keydown', kd);
    removeEventListener('keyup', ku);
  };
}
