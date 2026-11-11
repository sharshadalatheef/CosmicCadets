// Gyro Spinner - Timing Machine Trainer (Zero Emojis, 100% Vector)
function gyroGame(st, api) {
  const c = document.createElement('canvas');
  c.className = 'cv';
  c.width = c.height = 360;
  const x = c.getContext('2d');

  const b = document.createElement('button');
  b.className = 'big gyro-stop-btn';
  b.innerHTML = Icons.target(24) + ' STOP!';
  st.append(c, b);

  let a = 0, sp = 1.8, w = 1.1, z = Math.random() * Math.PI * 2, hits = 0, lives = 3, fl = 0, fc = '#fff', done = false;

  const updateHud = () => {
    api.hud(`
      <span class="hud-item">${Icons.target(18)} Hits: ${hits}/8</span>
      <span class="hud-item">${Icons.hearts(lives, 3, 18)}</span>
    `);
  };
  updateHud();

  function tap() {
    if (done) return;
    let d = Math.abs(((a - z) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
    if (d > Math.PI) d = Math.PI * 2 - d;

    if (d < w / 2) {
      hits++;
      sp *= 1.12;
      w = Math.max(0.36, w * 0.88);
      z = Math.random() * Math.PI * 2;
      fc = '#3ddc97';
      Sound.star();
      pb(c, 180, 180, '#3ddc97', 26);
    } else {
      lives--;
      fc = '#ff5d6c';
      Sound.damage();
      pb(c, 180, 180, '#ff5d6c', 16);
      shake(c);
    }
    fl = 0.25;
    updateHud();

    if (hits >= 8 || lives <= 0) {
      done = true;
      const starsEarned = hits >= 8 ? 3 : hits >= 5 ? 2 : hits >= 2 ? 1 : 0;
      const msg = hits >= 8 ? 'The gyro is perfectly locked and stabilized!' : `You locked the gyro ${hits} times.`;
      const finalScore = hits * 100 + lives * 50;
      setTimeout(() => api.end(starsEarned, msg, finalScore), 700);
    }
  }

  b.addEventListener('pointerdown', e => { e.preventDefault(); tap(); });
  c.addEventListener('pointerdown', tap);

  const key = e => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      tap();
    }
  };
  addEventListener('keydown', key);

  const stop = loop(dt => {
    if (!done) a = (a + sp * dt) % (Math.PI * 2);
    fl = Math.max(0, fl - dt);

    x.clearRect(0, 0, 360, 360);
    x.lineCap = 'round';

    // Outer ring
    x.lineWidth = 30;
    x.strokeStyle = fl ? fc : '#26307a';
    x.beginPath();
    x.arc(180, 180, 125, 0, Math.PI * 2);
    x.stroke();

    // Target green zone
    x.strokeStyle = '#3ddc97';
    x.beginPath();
    x.arc(180, 180, 125, z - w / 2, z + w / 2);
    x.stroke();

    // Rotating pointer needle
    x.strokeStyle = '#ffd23f';
    x.lineWidth = 8;
    x.beginPath();
    x.moveTo(180, 180);
    x.lineTo(180 + Math.cos(a) * 135, 180 + Math.sin(a) * 135);
    x.stroke();

    // Center hub
    x.fillStyle = '#fff';
    x.beginPath();
    x.arc(180, 180, 14, 0, Math.PI * 2);
    x.fill();

    // Vector Pilot Helmet in lower quadrant (Zero Emojis!)
    x.save();
    x.translate(180, 260);
    x.fillStyle = '#1b2370';
    x.beginPath();
    x.arc(0, 0, 24, 0, Math.PI * 2);
    x.fill();
    x.strokeStyle = '#4cc9f0';
    x.lineWidth = 3;
    x.stroke();
    x.fillStyle = '#ffd23f';
    x.beginPath();
    x.ellipse(0, -2, 16, 10, 0, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = '#ff7a3d';
    x.beginPath();
    x.ellipse(0, -2, 12, 6, 0, 0, Math.PI * 2);
    x.fill();
    x.restore();

    // Instruction text
    x.font = '600 20px Fredoka, sans-serif';
    x.fillStyle = '#b9c3ff';
    x.textAlign = 'center';
    x.fillText('Stop in the green zone!', 180, 120);
  });

  return () => {
    stop();
    removeEventListener('keydown', key);
  };
}
