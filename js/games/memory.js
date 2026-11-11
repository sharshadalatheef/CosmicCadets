// Control Panel Memory - Launch Code Sequencer (Zero Emojis, 100% Vector)
function memoryGame(st, api) {
  const P = [
    { color: '#ff5d6c', icon: Icons.blaster(36), note: 262, name: 'Plasma' },
    { color: '#ffd23f', icon: Icons.zap(36), note: 330, name: 'Power' },
    { color: '#3ddc97', icon: Icons.shield(36), note: 392, name: 'Shield' },
    { color: '#4cc9f0', icon: Icons.gyro(36), note: 523, name: 'Warp' }
  ];

  const g = document.createElement('div');
  g.className = 'pad4 memory-pad';
  const m = document.createElement('div');
  m.className = 'msg memory-msg';
  m.textContent = 'Watch the launch code sequence...';
  st.append(g, m);

  const btn = P.map((p, i) => {
    const e = document.createElement('button');
    e.className = 'pp memory-btn';
    e.style.touchAction = 'manipulation';
    e.innerHTML = `<span class="mem-ic">${p.icon}</span><span class="mem-label">${p.name}</span>`;
    e.style.background = `radial-gradient(circle, ${p.color}55 0%, #101642 90%)`;
    e.style.borderColor = p.color;
    e.style.color = p.color;
    e.setAttribute('aria-label', p.name);

    if (window.addMobileTap) {
      window.addMobileTap(e, () => press(i));
    } else {
      e.addEventListener('pointerdown', ev => {
        ev.preventDefault();
        press(i);
      });
    }
    g.append(e);
    return e;
  });

  let seq = [], pos = 0, round = 0, busy = true, done = false, tm = [];
  const later = (f, ms) => tm.push(setTimeout(f, ms));

  const lit = i => {
    btn[i].classList.add('lit');
    pbe(btn[i], P[i].color, 16);
    Sound.combo(i + 1);
    later(() => btn[i].classList.remove('lit'), 320);
  };

  function next() {
    if (done) return;
    seq.push(Math.floor(Math.random() * 4));
    round++;
    pos = 0;
    busy = true;
    m.textContent = 'Watch the lights flash...';
    api.hud(`<span class="hud-item">${Icons.memory(18)} Round: ${round}/8</span>`);

    seq.forEach((s, k) => later(() => lit(s), 700 + k * 580));
    later(() => {
      busy = false;
      m.textContent = 'Your turn! Tap the pads';
    }, 700 + seq.length * 580);
  }

  function press(i) {
    if (busy || done) return;
    lit(i);

    if (i === seq[pos]) {
      pos++;
      if (pos === seq.length) {
        busy = true;
        if (round >= 8) {
          done = true;
          later(() => api.end(3, 'Mastery achieved! Every code decrypted!', 1200), 600);
        } else {
          m.textContent = 'Code verified! Next round...';
          later(next, 900);
        }
      }
    } else {
      done = true;
      busy = true;
      Sound.damage();
      m.textContent = 'Code mismatch! Training ended';
      const ok = round - 1;
      later(() => {
        const starsEarned = ok >= 7 ? 3 : ok >= 4 ? 2 : ok >= 2 ? 1 : 0;
        api.end(starsEarned, `You solved ${ok} launch code sequence${ok === 1 ? '' : 's'}!`, ok * 150);
      }, 800);
    }
  }

  const kd = e => {
    const k = '1234'.indexOf(e.key);
    if (k > -1) press(k);
  };
  addEventListener('keydown', kd);

  later(next, 500);

  return () => {
    tm.forEach(clearTimeout);
    removeEventListener('keydown', kd);
  };
}
