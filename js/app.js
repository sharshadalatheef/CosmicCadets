// CosmicCadets Main Application Controller
(function() {
  const $ = s => document.querySelector(s);
  const mk = (t, c, h) => {
    const e = document.createElement(t);
    if (c) e.className = c;
    if (h != null) e.innerHTML = h;
    return e;
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const addTap = (el, fn) => {
    if (!el) return;
    if (window.addMobileTap) window.addMobileTap(el, fn);
    else el.onclick = fn;
  };

  let activeGame = null;
  let stopGameFn = null;
  let isDailyPlay = false;
  let dailyLevelIndex = null;
  let selectedAvatar = 'astrofox';

  // Game Registry (Training Modules)
  const GAMES = [
    {
      id: 'blaster',
      name: 'Laser Shoot Training',
      category: 'Weapons',
      icon: 'blaster',
      desc: 'Tap flying targets to blast them with twin lasers!',
      how: 'Tap or click anywhere to shoot your dual lasers! Blast alien drones and rocks fast to build big combos!',
      fn: blasterGame
    },
    {
      id: 'collector',
      name: 'Space Trash Training',
      category: 'Airlock',
      icon: 'recycle',
      desc: 'Drag trash into the chute and pull the big red lever!',
      how: 'Drag floating space trash down into the vacuum chute, or pull down the big red lever to flush everything out into space!',
      fn: collectorGame
    },
    {
      id: 'dodge',
      name: 'Asteroid Dodge Training',
      category: 'Navigation',
      icon: 'meteor',
      desc: 'Steer left and right. Catch stars and dodge rocks!',
      how: 'Tap Left and Right (or use arrow keys) to steer. Catch golden stars and dodge floating space rocks!',
      fn: dodgeGame
    },
    {
      id: 'gyro',
      name: 'Ring Align Training',
      category: 'Engines',
      icon: 'gyro',
      desc: 'Tap STOP when the needle lands in the green zone!',
      how: 'The needle spins around. Tap the big STOP button when the needle is inside the green target zone!',
      fn: gyroGame
    },
    {
      id: 'gforce',
      name: 'Rocket Boost Training',
      category: 'Thrusters',
      icon: 'rocket',
      desc: 'Hold BOOST to keep the rocket inside the green zone!',
      how: 'Hold the BOOST button to push your rocket up, release to drop. Keep your rocket centered in the green zone!',
      fn: gforceGame
    },
    {
      id: 'memory',
      name: 'Code Match Training',
      category: 'Reactor',
      icon: 'memory',
      desc: 'Watch the colors light up and tap them in order!',
      how: 'Watch the colored lights flash and listen to the tones. Tap the pads in the exact same sequence!',
      fn: memoryGame
    }
  ];
  window.GAMES = GAMES;
  window.showGameIntro = showGameIntro;
  window.startGame = startGame;

  // Use core.js robust loop & hold helpers if already present
  if (!window.loop) {
    window.loop = function(fn) {
      let id, last = performance.now(), on = true;
      const f = n => {
        if (!on) return;
        const dt = Math.min(0.05, (n - last) / 1000);
        last = n;
        fn(dt);
        id = requestAnimationFrame(f);
      };
      id = requestAnimationFrame(f);
      return () => { on = false; cancelAnimationFrame(id); };
    };
  }

  if (!window.hold) {
    window.hold = function(el, on, off) {
      const d = e => { e.preventDefault(); el.classList.add('down'); on(); };
      const u = () => { el.classList.remove('down'); off(); };
      el.addEventListener('pointerdown', d);
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(k => el.addEventListener(k, u));
    };
  }

  const TAU = Math.PI * 2;
  const bg = $('#bg'), bx = bg.getContext('2d'), fx = $('#fx'), fxc = fx.getContext('2d');
  let W = 0, H = 0, sf = [], shoot = [], parts = [], mx = 0.5, my = 0.5;

  function size() {
    W = bg.width = fx.width = innerWidth;
    H = bg.height = fx.height = innerHeight;
    sf = Array.from({ length: Math.round((W * H) / 5000) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.3,
      z: Math.random() * 0.9 + 0.1,
      p: Math.random() * 6
    }));
  }
  addEventListener('resize', size);
  size();
  addEventListener('pointermove', e => { mx = e.clientX / W; my = e.clientY / H; });

  window.pbx = function(x, y, col, n = 14) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, s = 60 + Math.random() * 220;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, l: 0.7 + Math.random() * 0.5, t: 0, c: col, r: 2 + Math.random() * 4 });
    }
  };
  window.pb = function(cv, cx, cy, col, n) {
    const r = cv.getBoundingClientRect();
    pbx(r.left + (cx * r.width) / cv.width, r.top + (cy * r.height) / cv.height, col, n);
  };
  window.pbe = function(el, col, n) {
    const r = el.getBoundingClientRect();
    pbx(r.left + r.width / 2, r.top + r.height / 2, col, n);
  };
  window.confetti = function() {
    const cs = ['#ffd23f', '#ff5d6c', '#3ddc97', '#4cc9f0', '#fff'];
    for (let i = 0; i < 90; i++) {
      parts.push({ x: Math.random() * W, y: -10, vx: (Math.random() - 0.5) * 140, vy: 120 + Math.random() * 260, l: 2.6, t: 0, c: cs[i % 5], r: 4 + Math.random() * 4, g: 1 });
    }
  };
  window.shake = function(el) {
    el.animate([
      { transform: 'translate(0)' },
      { transform: 'translate(-8px, 3px)' },
      { transform: 'translate(7px, -3px)' },
      { transform: 'translate(0)' }
    ], { duration: 260 });
  };

  loop(dt => {
    bx.clearRect(0, 0, W, H);
    const tm = performance.now() / 1000;
    for (const s of sf) {
      const x = ((s.x - (mx - 0.5) * 40 * s.z) % W + W) % W;
      const y = ((s.y - (my - 0.5) * 40 * s.z) % H + H) % H;
      bx.globalAlpha = 0.45 + 0.5 * Math.sin(tm * 2 + s.p);
      bx.fillStyle = '#fff';
      bx.beginPath();
      bx.arc(x, y, s.r, 0, TAU);
      bx.fill();
    }
    bx.globalAlpha = 1;
    if (Math.random() < 0.012) shoot.push({ x: Math.random() * W, y: Math.random() * H * 0.5, l: 0 });
    shoot = shoot.filter(s => (s.l += dt) < 0.8);
    for (const s of shoot) {
      const x = s.x + s.l * 500, y = s.y + s.l * 250;
      const g = bx.createLinearGradient(x, y, x - 90, y - 45);
      g.addColorStop(0, '#fff');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      bx.strokeStyle = g;
      bx.lineWidth = 2;
      bx.beginPath();
      bx.moveTo(x, y);
      bx.lineTo(x - 90, y - 45);
      bx.stroke();
    }
    fxc.clearRect(0, 0, W, H);
    parts = parts.filter(p => (p.t += dt) < p.l);
    for (const p of parts) {
      if (!p.g) p.vy += 400 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      fxc.globalAlpha = 1 - p.t / p.l;
      fxc.fillStyle = p.c;
      fxc.beginPath();
      fxc.arc(p.x, p.y, p.r, 0, TAU);
      fxc.fill();
    }
    fxc.globalAlpha = 1;
  });

  // Modal Overlay functions
  function showDialog(html, buttons = []) {
    const bx = $('#box');
    bx.innerHTML = html;
    const row = mk('div', 'row');
    buttons.forEach(([label, fn, cls]) => {
      const b = mk('button', cls || '', label);
      addTap(b, () => {
        Sound.click();
        fn();
      });
      row.append(b);
    });
    bx.append(row);
    $('#ov').hidden = false;
    const goBtn = row.querySelector('.go');
    if (goBtn) goBtn.focus();
  }

  function closeDialog() {
    $('#ov').hidden = true;
  }

  // Audio Buttons sync
  function syncAudioButtons() {
    $('#mute').innerHTML = Icons.sound(!Sound.isSfxMuted(), 20);
    $('#mus').innerHTML = Icons.music(!Sound.isMusicMuted(), 20);
  }

  // Leaderboard Modal Renderer
  function openLeaderboard(tab = 'stars') {
    Sound.click();
    const todayStr = Daily.getTodayString();
    const list = Storage.getLeaderboard(tab, todayStr);
    const currentUser = Storage.getActiveUser();

    const rowsHtml = list.map((u, i) => {
      const isMe = currentUser && u.username === currentUser.username;
      const rankNum = i + 1;
      const rankBadge = rankNum === 1 ? 'rank-gold' : rankNum === 2 ? 'rank-silver' : rankNum === 3 ? 'rank-bronze' : '';
      const starsDisplay = tab === 'daily' ? (u.dailyStars || 0) : (u.stars || 0);
      const userRank = Storage.getRank(u.stars || 0);

      return `
        <div class="lb-row ${isMe ? 'lb-me' : ''} ${rankBadge}">
          <span class="lb-rank">#${rankNum}</span>
          <div class="lb-avatar">${Icons.getAvatar(u.avatar || 'astrofox', 34)}</div>
          <div class="lb-info">
            <div class="lb-name">${u.name || 'Cadet'} ${isMe ? '<span class="you-tag">(YOU)</span>' : ''}</div>
            <div class="lb-meta">@${u.username || 'cadet'} · ${userRank.title || 'Space Cadet'}</div>
          </div>
          <div class="lb-stars">
            ${Icons.star(true, 18)}
            <span>${starsDisplay}</span>
          </div>
        </div>
      `;
    }).join('');

    const html = `
      <div class="lb-header">
        <div class="lb-title">${Icons.trophy(28)} Academy Star Leaderboard</div>
        <div class="lb-tabs">
          <button class="lb-tab ${tab === 'stars' ? 'active' : ''}" id="tab-stars">${Icons.star(true, 16)} All-Time Stars</button>
          <button class="lb-tab ${tab === 'daily' ? 'active' : ''}" id="tab-daily">${Icons.calendar(16)} Today's Daily Stars</button>
        </div>
      </div>
      <div class="lb-list">${rowsHtml}</div>
    `;

    showDialog(html, [
      ['Close', closeDialog, 'pad-btn']
    ]);

    addTap($('#tab-stars'), () => openLeaderboard('stars'));
    addTap($('#tab-daily'), () => openLeaderboard('daily'));
  }

  // Onboarding & Enlistment Screen
  function renderOnboardingPortal() {
    const portal = $('#onboarding-portal');
    if (!portal) return;

    portal.innerHTML = `
      <div class="portal-card">
        <button class="portal-close" id="btn-portal-close" aria-label="Close portal">${Icons.cross(20)}</button>
        <div class="portal-logo">${Icons.rocket(64)}</div>
        <h1>COSMIC<span>CADETS</span></h1>
        <div class="portal-sub">Space Training Games</div>
        <p class="portal-tagline">Play fun space minigames, shoot targets, empty space trash, and earn stars!</p>
        
        <div class="portal-auth-tabs">
          <button class="auth-tab active" id="tab-enlist">New Cadet</button>
          <button class="auth-tab" id="tab-login">Sign In</button>
        </div>

        <div id="auth-form-container">
          <!-- Populated by renderAuthForm -->
        </div>

        <div class="portal-quick">
          <button class="quick-btn" id="btn-quick-play">${Icons.zap(18)} GUEST PLAY (NO LOGIN)</button>
        </div>
      </div>
    `;

    addTap($('#btn-portal-close'), () => {
      Sound.click();
      portal.hidden = true;
      refreshUI();
    });

    renderAuthForm('enlist');

    addTap($('#tab-enlist'), () => {
      Sound.click();
      const cur = $('.auth-tab.active');
      if (cur) cur.classList.remove('active');
      $('#tab-enlist').classList.add('active');
      renderAuthForm('enlist');
    });

    addTap($('#tab-login'), () => {
      Sound.click();
      const cur = $('.auth-tab.active');
      if (cur) cur.classList.remove('active');
      $('#tab-login').classList.add('active');
      renderAuthForm('login');
    });

    addTap($('#btn-quick-play'), () => {
      Sound.click();
      Storage.quickRookie();
      Sound.win();
      portal.hidden = true;
      refreshUI();
      Tutorial.start();
    });
  }

  function renderAuthForm(mode = 'enlist') {
    const container = $('#auth-form-container');
    if (!container) return;

    if (mode === 'enlist') {
      container.innerHTML = `
        <div class="form-group">
          <label>Your Cadet Name:</label>
          <input type="text" id="reg-name" placeholder="e.g. StarAce Leo" maxlength="16">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Username:</label>
            <input type="text" id="reg-user" placeholder="e.g. starace" maxlength="14">
          </div>
          <div class="form-group">
            <label>Password:</label>
            <input type="password" id="reg-pass" placeholder="e.g. 1234" maxlength="16">
          </div>
        </div>
        <div class="form-group">
          <label>Choose Helmet:</label>
          <div class="avatar-picker">
            ${['astrofox', 'robocadet', 'starace', 'novacat', 'cyberfalcon', 'galaxypup'].map(av => `
              <div class="av-option ${av === selectedAvatar ? 'selected' : ''}" data-avatar="${av}">
                ${Icons.getAvatar(av, 48)}
              </div>
            `).join('')}
          </div>
        </div>
        <div id="auth-err" class="auth-err"></div>
        <button class="go big-submit" id="btn-enlist">${Icons.rocket(20)} START PLAYING!</button>
      `;

      container.querySelectorAll('.av-option').forEach(el => {
        addTap(el, () => {
          Sound.click();
          container.querySelectorAll('.av-option').forEach(o => o.classList.remove('selected'));
          el.classList.add('selected');
          selectedAvatar = el.dataset.avatar;
        });
      });

      addTap($('#btn-enlist'), () => {
        const name = $('#reg-name').value.trim();
        const username = $('#reg-user').value.trim();
        const password = $('#reg-pass').value.trim();
        const res = Storage.register(name, username, password, selectedAvatar);
        if (!res.ok) {
          Sound.damage();
          $('#auth-err').textContent = res.error;
          return;
        }
        Sound.rankUp();
        confetti();
        $('#onboarding-portal').hidden = true;
        refreshUI();
        Tutorial.start();
      });
    } else {
      container.innerHTML = `
        <div class="form-group">
          <label>Username:</label>
          <input type="text" id="log-user" placeholder="Enter username" maxlength="14">
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input type="password" id="log-pass" placeholder="Enter password" maxlength="16">
        </div>
        <div id="auth-err" class="auth-err"></div>
        <button class="go big-submit" id="btn-login">${Icons.zap(20)} SIGN IN & PLAY</button>
      `;

      addTap($('#btn-login'), () => {
        const username = $('#log-user').value.trim();
        const password = $('#log-pass').value.trim();
        const res = Storage.login(username, password);
        if (!res.ok) {
          Sound.damage();
          $('#auth-err').textContent = res.error;
          return;
        }
        Sound.win();
        $('#onboarding-portal').hidden = true;
        refreshUI();
      });
    }
  }

  // Header & Menu Renderers
  function renderHeader() {
    const user = Storage.getActiveUser();
    if (!user) return;

    const rank = Storage.getRank(user.stars || 0);

    $('#cadet-pill').innerHTML = `
      <div class="hdr-avatar">${Icons.getAvatar(user.avatar || 'astrofox', 26)}</div>
      <span class="hdr-name">${user.name || 'Cadet'}</span>
    `;

    $('#rank-pill').innerHTML = `
      <span class="rank-ic">${Icons[rank.icon] ? Icons[rank.icon](18) : Icons.rocket(18)}</span>
      <span>${rank.title || 'Space Cadet'}</span>
    `;

    $('#stars-pill').innerHTML = `
      ${Icons.star(true, 18)}
      <span>${user.stars || 0} Stars</span>
    `;
  }

  // Unified Space Training Tasks Deck
  function renderDailyDeck() {
    const user = Storage.getActiveUser();
    if (!user) return;

    const todayStr = Daily.getTodayString();
    const dailyLevels = Daily.getDailyLevels(todayStr);
    const featuredGame = Daily.getFeaturedGame(todayStr) || GAMES[0];
    const userDaily = (user.dailyCompleted && user.dailyCompleted[todayStr]) || {};
    const dailyStarsEarned = Object.values(userDaily).reduce((a, b) => a + b, 0);

    $('#daily-deck').innerHTML = `
      <div class="space-fact-card">
        <span class="fact-tag">${Icons.star(true, 18)} DAILY SPACE FACT</span>
        <span class="fact-text">${Daily.getDailySpaceFact(todayStr) || 'Space is full of amazing wonders!'}</span>
      </div>

      <div class="daily-banner">
        <div class="daily-info">
          <div class="daily-tag">${Icons.calendar(18)} TODAY'S SPACE TRAINING</div>
          <h2>6 Daily Training Tasks</h2>
          <p>Complete all 6 training tasks today to earn up to 18 Stars!</p>
        </div>
        <div class="daily-tracker">
          <div class="daily-stars-count">${Icons.star(true, 20)} ${dailyStarsEarned}/18 Stars</div>
          <div class="daily-timer">${Icons.clock(16)} Next refresh in ${Daily.getTimeUntilReset()}</div>
        </div>
      </div>

      <div class="featured-banner">
        <span class="feat-badge">${Icons.zap(16)} BONUS TASK TODAY</span>
        <span><b>${featuredGame.name || 'Featured Task'}</b> awards double mastery progress today!</span>
      </div>

      <div class="tasks-grid">
        ${dailyLevels.map((dl, idx) => {
          const g = GAMES.find(gm => gm.id === dl.gameId);
          const starsGot = userDaily[idx] || 0;
          const isDone = starsGot > 0;
          const isFeatured = dl.gameId === featuredGame.id;
          const hiScore = (user.highScores && user.highScores[dl.gameId]) || 0;

          // Strip any duplicate 'Task X:' prefixes from title cleanly
          const rawTitle = dl.title || (g && g.name) || 'Space Mission';
          const cleanTitle = String(rawTitle).replace(/^(Task\s*\d*:\s*)+/gi, '').trim();

          // Ensure badge is never 'undefined' or empty
          const rawBadge = dl.badge;
          const badgeText = (rawBadge && rawBadge !== 'undefined' && String(rawBadge).trim() !== '')
            ? String(rawBadge).toUpperCase()
            : ((g && g.category) ? g.category.toUpperCase() : 'TRAINING');

          const cleanDesc = dl.desc || (g && g.desc) || 'Complete this space mission to earn stars!';

          return `
            <div class="task-card ${isDone ? 'done' : ''} ${isFeatured ? 'featured' : ''}" data-level="${idx}">
              <div class="task-card-head">
                <span class="task-badge-pill">${badgeText}</span>
                ${isFeatured ? `<span class="task-feat-tag">${Icons.zap(14)} BONUS</span>` : ''}
              </div>

              <div class="task-main">
                <div class="task-ic">${Icons[dl.icon] ? Icons[dl.icon](36) : Icons.rocket(36)}</div>
                <div class="task-text">
                  <h3>Task ${idx + 1}: ${cleanTitle}</h3>
                  <p>${cleanDesc}</p>
                </div>
              </div>

              <div class="task-stats-box">
                <div class="task-stat-row">
                  <span class="stat-label">Daily Stars:</span>
                  <span class="st">${Icons.stars(starsGot, 3, 18)}</span>
                </div>
                <div class="task-stat-row">
                  <span class="stat-label">Goal: ${dl.starGoals && dl.starGoals[1] ? dl.starGoals[1] : 'Earn 2 Stars'}</span>
                  <span class="stat-hi">${Icons.trophy(14)} Best: ${hiScore}</span>
                </div>
              </div>

              <button class="big-task-btn dl-play-btn" data-level="${idx}">
                ${isDone ? Icons.refresh(18) + ' PLAY AGAIN' : Icons.rocket(18) + ' START TASK'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    $('#daily-deck').querySelectorAll('.dl-play-btn').forEach(btn => {
      addTap(btn, () => {
        Sound.click();
        const lvlIdx = parseInt(btn.dataset.level, 10);
        const dl = dailyLevels[lvlIdx];
        const g = GAMES.find(gm => gm.id === dl.gameId);
        if (g) {
          isDailyPlay = true;
          dailyLevelIndex = lvlIdx;
          showGameIntro(g, dl);
        }
      });
    });
  }

  // Badges & Profile Panel Renderer
  function renderBadgesPanel() {
    const user = Storage.getActiveUser();
    if (!user) return;

    const ALL_BADGES = [
      { id: 'firstFlight', title: 'First Flight', desc: 'Flown your first machine' },
      { id: 'starCollector', title: 'Star Collector', desc: 'Accumulated 10+ stars' },
      { id: 'perfectPilot', title: 'Perfect Pilot', desc: 'Achieved a 3-star rating' },
      { id: 'commander', title: 'Commander', desc: 'Collected 25+ stars' },
      { id: 'veteran', title: 'Veteran Pilot', desc: 'Completed 20 missions' },
      { id: 'sharpshooter', title: 'Ace Blaster', desc: 'Score 2,500 in Blaster' },
      { id: 'ecoHero', title: 'Eco Hero', desc: 'Recycled 18+ space junk' },
      { id: 'dailyMaster', title: 'Daily Master', desc: 'Cleared all 6 daily levels' }
    ];

    const badgesHtml = ALL_BADGES.map(b => {
      const earned = (user.badges || []).includes(b.id);
      return `
        <div class="b ${earned ? 'on' : ''}" title="${b.title}: ${b.desc}">
          ${Icons.badges[b.id] ? Icons.badges[b.id](32) : Icons.trophy(32)}
          <small>${b.title}</small>
        </div>
      `;
    }).join('');

    $('#panel').innerHTML = `
      <div class="panel-head">
        <h3>${Icons.gem(20)} Cadet Badges & Milestones</h3>
        <span class="panel-stats">Missions Flown: ${user.plays || 0} · 3-Star Runs: ${user.perfects || 0}</span>
      </div>
      <div class="bd">${badgesHtml}</div>
      <div class="panel-actions">
        <button class="rs" id="btn-switch-cadet">${Icons.user(16)} Switch Cadet Profile</button>
        <button class="rs danger" id="rs">${Icons.refresh(16)} Reset Cadet Data</button>
      </div>
    `;

    addTap($('#btn-switch-cadet'), () => {
      Sound.click();
      Storage.logout();
      $('#onboarding-portal').hidden = false;
      renderOnboardingPortal();
    });

    addTap($('#rs'), () => {
      Sound.click();
      showDialog(`
        <h2>Reset Cadet Progress?</h2>
        <p>This will reset stars, badges, and scores for cadet <b>${user.name || 'Cadet'}</b>.</p>
      `, [
        ['Cancel', closeDialog, 'pad-btn'],
        ['Reset Everything', () => {
          user.stars = 0;
          user.dailyStars = 0;
          user.bestStars = { gyro: 0, gforce: 0, dodge: 0, memory: 0, blaster: 0, collector: 0 };
          user.highScores = { gyro: 0, gforce: 0, dodge: 0, memory: 0, blaster: 0, collector: 0 };
          user.dailyCompleted = {};
          user.badges = [];
          user.plays = 0;
          user.perfects = 0;
          Storage.saveUser(user);
          closeDialog();
          refreshUI();
        }, 'go']
      ]);
    });
  }

  function refreshUI() {
    Storage.getOrCreateActiveUser();
    renderHeader();
    renderDailyDeck();
    renderBadgesPanel();
  }

  // Game Flow: Intro -> Run -> Finish
  function showGameIntro(g, dailyCfg = null) {
    if (stopGameFn) { stopGameFn(); stopGameFn = null; }
    activeGame = g;
    $('#menu').hidden = true;
    $('#play').hidden = false;
    $('#gt').innerHTML = `${Icons[g.icon](24)} <span>${g.name}</span>`;
    $('#hud').innerHTML = '';
    $('#stage').innerHTML = '';

    const cleanIntroName = dailyCfg
      ? String(dailyCfg.title || g.name).replace(/^(Task\s*\d*:\s*)+/gi, '').trim()
      : g.name;
    const modalTitle = dailyCfg
      ? `Task ${dailyCfg.levelNumber || 1}: ${cleanIntroName}`
      : g.name;

    const introHtml = `
      <div class="intro-icon">${Icons[g.icon](64)}</div>
      <h2>${modalTitle}</h2>
      <p class="intro-desc">${dailyCfg ? dailyCfg.desc : g.how}</p>
      ${dailyCfg ? `
        <div class="daily-goals-box">
          <div class="goal-line">${Icons.star(true, 18)} 1 Star: ${dailyCfg.starGoals[0]}</div>
          <div class="goal-line">${Icons.stars(2, 3, 18)} 2 Stars: ${dailyCfg.starGoals[1]}</div>
          <div class="goal-line">${Icons.stars(3, 3, 18)} 3 Stars: ${dailyCfg.starGoals[2]}</div>
        </div>
      ` : ''}
    `;

    showDialog(introHtml, [
      ['Back to Menu', returnToMenu, 'pad-btn'],
      ['START!', () => startGame(g), 'go']
    ]);
  }

  function startGame(g) {
    closeDialog();
    $('#stage').innerHTML = '';
    stopGameFn = g.fn($('#stage'), {
      hud: html => $('#hud').innerHTML = html,
      end: (stars, msg, score) => handleGameFinish(g, stars, msg, score)
    });
  }

  function handleGameFinish(g, stars, msg, score = 0) {
    if (stopGameFn) { stopGameFn(); stopGameFn = null; }

    const todayStr = Daily.getTodayString();
    const prevRank = Storage.getRank(Storage.getActiveUser()?.stars || 0);

    const result = Storage.recordPlay(g.id, stars, score, isDailyPlay, dailyLevelIndex, todayStr);
    const newRank = Storage.getRank(result.user?.stars || 0);
    const rankUp = newRank.title !== prevRank.title;

    if (stars === 3) confetti();
    if (rankUp) Sound.rankUp();
    else if (stars > 0) Sound.win();
    else Sound.damage();

    const title = stars === 3 ? 'Perfect Performance!' : stars >= 1 ? 'Mission Accomplished!' : 'Keep Training!';

    const badgeMap = {
      firstFlight: 'First Flight',
      starCollector: 'Star Collector',
      perfectPilot: 'Perfect Pilot',
      commander: 'Commander',
      veteran: 'Veteran Pilot',
      sharpshooter: 'Ace Blaster',
      ecoHero: 'Eco Hero',
      dailyMaster: 'Daily Master'
    };

    const badgeNote = result.newBadges && result.newBadges.length > 0
      ? `<div class="badge-unlocked">${Icons.gem(20)} <b>New Badge Unlocked: ${result.newBadges.map(b => badgeMap[b] || b).join(', ')}!</b></div>`
      : '';

    const rankNote = rankUp
      ? `<div class="rank-promo">${Icons.crown(22)} <b>PROMOTION: You are now a ${newRank.title}!</b></div>`
      : '';

    const html = `
      <h2>${title}</h2>
      <div class="end-stars">${Icons.stars(stars, 3, 36)}</div>
      <p class="end-msg">${msg}</p>
      <div class="end-score">${Icons.trophy(18)} Score: <b>${score}</b></div>
      ${badgeNote}
      ${rankNote}
    `;

    showDialog(html, [
      ['Back to Menu', returnToMenu, 'pad-btn'],
      ['Play Again', () => showGameIntro(g, isDailyPlay ? Daily.getDailyLevels()[dailyLevelIndex] : null), 'go']
    ]);
  }

  function returnToMenu() {
    if (stopGameFn) { stopGameFn(); stopGameFn = null; }
    activeGame = null;
    closeDialog();
    $('#play').hidden = true;
    $('#menu').hidden = false;
    refreshUI();
  }

  // Global Button Handlers
  addTap($('#back'), returnToMenu);
  addTap($('#btn-leaderboard'), () => openLeaderboard('stars'));
  addTap($('#btn-fieldguide'), () => { Sound.click(); Tutorial.start(); });

  addTap($('#mute'), () => {
    Sound.setSfxMuted(!Sound.isSfxMuted());
    syncAudioButtons();
  });

  addTap($('#mus'), () => {
    Sound.setMusicMuted(!Sound.isMusicMuted());
    syncAudioButtons();
  });

  addTap($('#cadet-pill'), () => {
    Sound.click();
    $('#onboarding-portal').hidden = false;
    renderOnboardingPortal();
  });

  // Initialization
  Sound.init();
  syncAudioButtons();

  const activeUser = Storage.getActiveUser();
  refreshUI();
  if (!activeUser) {
    $('#onboarding-portal').hidden = false;
    renderOnboardingPortal();
  } else {
    $('#onboarding-portal').hidden = true;
  }
})();
