// CosmicCadets Storage, Authentication & Leaderboard Engine
const Storage = (function() {
  const USERS_KEY = 'cosmic_cadets_profiles';
  const ACTIVE_USER_KEY = 'cosmic_cadets_active_user';

  const RANKS = [
    { min: 0, title: 'Space Cadet', icon: 'rocket' },
    { min: 6, title: 'Rocket Rookie', icon: 'zap' },
    { min: 12, title: 'Star Pilot', icon: 'star' },
    { min: 20, title: 'Cosmic Captain', icon: 'shield' },
    { min: 30, title: 'Fleet Admiral', icon: 'gem' },
    { min: 42, title: 'Grand Commander', icon: 'crown' }
  ];

  // Simulated Academy Classmates on the Star Leaderboard
  const ACADEMY_RIVALS = [
    { username: 'orion_b', name: 'Orion Blaze', avatar: 'starace', stars: 39, dailyStars: 15, badges: ['firstFlight','starCollector','perfectPilot','commander','veteran','sharpshooter'], highScores: { blaster: 4200, collector: 3800 } },
    { username: 'luna_s', name: 'Luna Spark', avatar: 'novacat', stars: 33, dailyStars: 14, badges: ['firstFlight','starCollector','perfectPilot','commander','ecoHero'], highScores: { blaster: 3600, collector: 4100 } },
    { username: 'jax_a', name: 'Astro Jax', avatar: 'robocadet', stars: 28, dailyStars: 12, badges: ['firstFlight','starCollector','commander'], highScores: { blaster: 3100, collector: 2900 } },
    { username: 'nova_v', name: 'Nova Vance', avatar: 'astrofox', stars: 22, dailyStars: 9, badges: ['firstFlight','starCollector'], highScores: { blaster: 2600, collector: 2400 } },
    { username: 'chloe_c', name: 'Comet Chloe', avatar: 'cyberfalcon', stars: 16, dailyStars: 7, badges: ['firstFlight','starCollector'], highScores: { blaster: 2100, collector: 2200 } },
    { username: 'zoe_z', name: 'Zenith Zoe', avatar: 'galaxypup', stars: 11, dailyStars: 5, badges: ['firstFlight'], highScores: { blaster: 1600, collector: 1700 } },
    { username: 'pip_s', name: 'Pip Stellar', avatar: 'robocadet', stars: 6, dailyStars: 3, badges: ['firstFlight'], highScores: { blaster: 1100, collector: 1200 } },
    { username: 'rusty_b', name: 'Rusty Bolt', avatar: 'astrofox', stars: 2, dailyStars: 1, badges: [], highScores: { blaster: 600, collector: 800 } }
  ];

  function getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveAllUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {}
  }

  function getActiveUsername() {
    return localStorage.getItem(ACTIVE_USER_KEY) || null;
  }

  function setActiveUsername(username) {
    if (username) {
      localStorage.setItem(ACTIVE_USER_KEY, username);
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  }

  return {
    getRank(stars = 0) {
      let r = RANKS[0];
      for (let i = 0; i < RANKS.length; i++) {
        if (stars >= RANKS[i].min) r = RANKS[i];
      }
      return r;
    },

    getActiveUser() {
      const username = getActiveUsername();
      if (!username) return null;
      const users = getAllUsers();
      return users[username] || null;
    },

    getOrCreateActiveUser() {
      let user = this.getActiveUser();
      if (!user) {
        const users = getAllUsers();
        const existing = Object.values(users)[0];
        if (existing) {
          setActiveUsername(existing.username);
          return existing;
        }
        const res = this.register('Cadet Rookie', 'rookie_cadet', 'cadet123', 'astrofox');
        return res.user;
      }
      return user;
    },

    register(name, username, password, avatar = 'astrofox') {
      name = (name || '').trim();
      username = (username || '').trim().toLowerCase();
      password = (password || '').trim();

      if (!name) return { ok: false, error: 'Please enter a cadet callsign!' };
      if (!username || username.length < 3) return { ok: false, error: 'Username must be at least 3 characters!' };
      if (!password || password.length < 3) return { ok: false, error: 'Password must be at least 3 characters!' };

      const users = getAllUsers();
      if (users[username]) {
        return { ok: false, error: 'That username is already taken by another cadet!' };
      }

      const newUser = {
        name,
        username,
        password,
        avatar: avatar || 'astrofox',
        stars: 0,
        dailyStars: 0,
        dailyDate: new Date().toISOString().slice(0, 10),
        bestStars: { gyro: 0, gforce: 0, dodge: 0, memory: 0, blaster: 0, collector: 0 },
        highScores: { gyro: 0, gforce: 0, dodge: 0, memory: 0, blaster: 0, collector: 0 },
        dailyCompleted: {},
        badges: [],
        plays: 0,
        perfects: 0,
        createdAt: Date.now()
      };

      users[username] = newUser;
      saveAllUsers(users);
      setActiveUsername(username);
      return { ok: true, user: newUser };
    },

    login(username, password) {
      username = (username || '').trim().toLowerCase();
      password = (password || '').trim();

      const users = getAllUsers();
      const user = users[username];
      if (!user) {
        return { ok: false, error: 'Cadet profile not found. Check username or enlist!' };
      }
      if (user.password !== password) {
        return { ok: false, error: 'Incorrect passcode! Try again.' };
      }

      setActiveUsername(username);
      return { ok: true, user };
    },

    quickRookie() {
      const id = Math.floor(100 + Math.random() * 900);
      const username = 'rookie_' + id;
      const res = this.register('Rookie ' + id, username, 'cadet123', 'robocadet');
      return res.user;
    },

    logout() {
      setActiveUsername(null);
    },

    saveUser(user) {
      if (!user || !user.username) return;
      const users = getAllUsers();
      users[user.username] = user;
      saveAllUsers(users);
    },

    recordPlay(gameId, earnedStars, score, isDaily = false, dailyLevelIndex = null, todayStr = '') {
      const user = this.getActiveUser();
      if (!user) return { user: null, rankUp: false, newBadges: [] };

      user.plays = (user.plays || 0) + 1;
      if (earnedStars === 3) user.perfects = (user.perfects || 0) + 1;

      // Update game high score
      user.highScores = user.highScores || {};
      user.bestStars = user.bestStars || {};
      const prevStars = user.bestStars[gameId] || 0;
      if (earnedStars > prevStars) {
        user.bestStars[gameId] = earnedStars;
      }
      if (score > (user.highScores[gameId] || 0)) {
        user.highScores[gameId] = score;
      }

      // Check daily mission completion
      if (isDaily && dailyLevelIndex != null && todayStr) {
        user.dailyCompleted = user.dailyCompleted || {};
        user.dailyCompleted[todayStr] = user.dailyCompleted[todayStr] || {};
        const oldDailyStars = user.dailyCompleted[todayStr][dailyLevelIndex] || 0;
        if (earnedStars > oldDailyStars) {
          user.dailyCompleted[todayStr][dailyLevelIndex] = earnedStars;
          user.dailyStars = (user.dailyStars || 0) + (earnedStars - oldDailyStars);
          user.stars = (user.stars || 0) + (earnedStars - oldDailyStars);
        }
      } else {
        // Training simulator star addition (diff from previous best)
        if (earnedStars > prevStars) {
          user.stars = (user.stars || 0) + (earnedStars - prevStars);
        }
      }

      // Check badges
      const newBadges = [];
      user.badges = user.badges || [];
      const hasBadge = b => user.badges.includes(b);
      const award = b => { if (!hasBadge(b)) { user.badges.push(b); newBadges.push(b); } };

      if (user.plays >= 1) award('firstFlight');
      if (user.stars >= 10) award('starCollector');
      if (user.perfects >= 1) award('perfectPilot');
      if (user.stars >= 25) award('commander');
      if (user.plays >= 20) award('veteran');
      if ((user.highScores.blaster || 0) >= 2500) award('sharpshooter');
      if ((user.highScores.collector || 0) >= 2500) award('ecoHero');

      // Check if all 6 daily levels completed today
      if (todayStr && user.dailyCompleted && user.dailyCompleted[todayStr]) {
        const completedLevels = Object.keys(user.dailyCompleted[todayStr]).length;
        if (completedLevels >= 6) award('dailyMaster');
      }

      this.saveUser(user);

      // Async Cloud Sync to Vercel Database
      try {
        fetch('/api/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            stars: user.stars || 0,
            dailyStars: user.dailyStars || 0,
            score,
            gameId
          })
        }).catch(() => {});
      } catch (e) {}

      return { user, newBadges };
    },

    fetchCloudLeaderboard(callback) {
      try {
        fetch('/api/leaderboard')
          .then(res => res.json())
          .then(data => {
            if (data && data.leaderboard && typeof callback === 'function') {
              callback(data.leaderboard);
            }
          })
          .catch(() => {});
      } catch (e) {}
    },

    getLeaderboard(type = 'stars', todayStr = '') {
      const users = getAllUsers();
      const list = [...ACADEMY_RIVALS];

      // Add local registered users
      Object.values(users).forEach(u => {
        // If rival with same username exists, don't duplicate
        const idx = list.findIndex(r => r.username === u.username);
        if (idx >= 0) {
          list[idx] = u;
        } else {
          list.push(u);
        }
      });

      if (type === 'daily') {
        return list.sort((a, b) => (b.dailyStars || 0) - (a.dailyStars || 0));
      }
      return list.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    }
  };
})();
