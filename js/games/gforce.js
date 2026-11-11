// G-Force Trainer - Balance Machine Trainer (Zero Emojis, 100% Vector)
function gforceGame(st, api) {
  const c = document.createElement('canvas');
  c.className = 'cv';
  c.width = 360;
  c.height = 380;
  const x = c.getContext('2d');

  const b = document.createElement('button');
  b.className = 'big gforce-thrust-btn';
  b.innerHTML = Icons.flame(24) + ' HOLD THRUST';
  st.append(c, b);

  let h = false, y = 0.2, vy = 0, t = 0, inz = 0;
  const T = 30;
  let done = false;

  hold(b, () => h = true, () => h = false);

  const kd = e => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      h = true;
    }
  };
  const ku = e => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      h = false;
    }
  };
  addEventListener('keydown', kd);
  addEventListener('keyup', ku);

  const stop = loop(dt => {
    if (done) return;
    t += dt;
    vy += ((h ? 0.65 : -0.55) - vy) * 3 * dt;
    y = clamp(y + vy * dt, 0, 1);

    const zc = 0.5 + 0.28 * Math.sin(t * 0.9) + 0.1 * Math.sin(t * 2.3);
    const zh = 0.12;
    const inn = Math.abs(y - zc) < zh;

    if (inn) {
      inz += dt;
      if (Math.random() < 0.35) {
        pb(c, 180, 360 - y * 330 + 20, '#3ddc97', 2);
      }
    }

    api.hud(`
      <span class="hud-item">${Icons.clock(18)} ${Math.ceil(T - t)}s</span>
      <span class="hud-item">${Icons.shield(18)} In Zone: ${inz.toFixed(1)}s</span>
    `);

    const py = v => 360 - v * 330;

    x.clearRect(0, 0, 360, 380);

    // Track column
    x.fillStyle = '#1b2370';
    x.fillRect(120, 30, 120, 330);

    // Target stability zone
    x.fillStyle = inn ? 'rgba(61,220,151,.55)' : 'rgba(61,220,151,.3)';
    x.fillRect(120, py(zc + zh), 120, (zh * 2) * 330);
    x.strokeStyle = '#3ddc97';
    x.lineWidth = 3;
    x.strokeRect(120, py(zc + zh), 120, (zh * 2) * 330);

    // Vector Rocket Graphic (Zero Emojis!)
    const rY = py(y);
    x.save();
    x.translate(180, rY);

    // Thruster flame when holding
    if (h) {
      x.fillStyle = Math.random() < 0.5 ? '#ff9f1c' : '#ffd23f';
      x.beginPath();
      x.moveTo(-6, 20);
      x.lineTo(0, 34 + Math.random() * 8);
      x.lineTo(6, 20);
      x.closePath();
      x.fill();
    }

    // Rocket body
    x.fillStyle = '#e8ecff';
    x.beginPath();
    x.moveTo(0, -22);
    x.lineTo(14, 14);
    x.lineTo(-14, 14);
    x.closePath();
    x.fill();

    // Rocket fins
    x.fillStyle = '#ff5d6c';
    x.beginPath();
    x.moveTo(-14, 8);
    x.lineTo(-22, 18);
    x.lineTo(-12, 18);
    x.closePath();
    x.fill();

    x.beginPath();
    x.moveTo(14, 8);
    x.lineTo(22, 18);
    x.lineTo(12, 18);
    x.closePath();
    x.fill();

    // Port window
    x.fillStyle = inn ? '#3ddc97' : '#ff5d6c';
    x.beginPath();
    x.arc(0, 0, 5, 0, Math.PI * 2);
    x.fill();
    x.restore();

    // Side Status Dial (Green check or Red caution vector indicator)
    x.save();
    x.translate(290, rY);
    x.fillStyle = inn ? '#3ddc97' : '#ff5d6c';
    x.beginPath();
    x.arc(0, 0, 16, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = '#0b1033';
    x.font = 'bold 12px Fredoka, sans-serif';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText(inn ? 'STABLE' : 'WARN', 0, 1);
    x.restore();

    // Guide text
    x.font = '600 17px Fredoka, sans-serif';
    x.fillStyle = '#b9c3ff';
    x.textAlign = 'center';
    x.fillText('Keep rocket in the green zone!', 180, 20);

    if (t >= T) {
      done = true;
      const starsEarned = inz >= 20 ? 3 : inz >= 13 ? 2 : inz >= 6 ? 1 : 0;
      const score = Math.round(inz * 100);
      setTimeout(() => api.end(starsEarned, `You maintained stability for ${inz.toFixed(1)} seconds!`, score), 600);
    }
  });

  return () => {
    stop();
    removeEventListener('keydown', kd);
    removeEventListener('keyup', ku);
  };
}
