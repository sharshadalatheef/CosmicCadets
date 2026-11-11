// CosmicCadets Daily Tasks Engine - Simple Training Tasks & Daily Space Facts
const Daily = (function() {
  const ALL_GAMES = [
    { id: 'blaster', name: 'Laser Shoot Training', icon: 'blaster' },
    { id: 'collector', name: 'Space Trash Training', icon: 'recycle' },
    { id: 'dodge', name: 'Asteroid Dodge Training', icon: 'meteor' },
    { id: 'gyro', name: 'Ring Align Training', icon: 'gyro' },
    { id: 'gforce', name: 'Rocket Boost Training', icon: 'rocket' },
    { id: 'memory', name: 'Code Match Training', icon: 'memory' }
  ];

  const SPACE_FACTS = [
    "One day on Venus is longer than one whole year on Earth!",
    "Astronauts can grow up to 2 inches taller while floating in space!",
    "Space is completely silent because there is no air for sound to travel!",
    "The footprints left by astronauts on the Moon will stay there for millions of years!",
    "Over one million Earths could easily fit inside the Sun!",
    "Saturn's rings are made of billions of chunks of ice and rock!",
    "Mars has the biggest volcano in the whole solar system, Olympus Mons!",
    "There are more stars in space than grains of sand on every beach on Earth!",
    "Sunset on Mars looks blue instead of red!",
    "A spacesuit costs over 12 million dollars to build!",
    "Jupiter has 95 known moons orbiting around it!"
  ];

  function getTodayString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function getDailySeed(dateStr) {
    return hashCode(dateStr || getTodayString());
  }

  return {
    getTodayString,

    getDailySpaceFact(dateStr = '') {
      const seed = getDailySeed(dateStr);
      return SPACE_FACTS[seed % SPACE_FACTS.length];
    },

    getFeaturedGame(dateStr = '') {
      const seed = getDailySeed(dateStr);
      const idx = seed % ALL_GAMES.length;
      return ALL_GAMES[idx];
    },

    getDailyLevels(dateStr = '') {
      const today = dateStr || getTodayString();
      const seed = getDailySeed(today);

      const games = [...ALL_GAMES];
      for (let i = games.length - 1; i > 0; i--) {
        const j = (seed + i * 7) % (i + 1);
        [games[i], games[j]] = [games[j], games[i]];
      }

      const taskConfigs = {
        blaster: {
          badge: 'WEAPONS',
          title: 'Laser Target Shoot',
          desc: 'Tap flying targets to blast them with twin lasers!',
          starGoals: ['Score 800 pts', 'Score 1,800 pts', 'Score 3,000 pts'],
          thresholds: [800, 1800, 3000]
        },
        collector: {
          badge: 'AIRLOCK',
          title: 'Empty Space Trash',
          desc: 'Drag trash into the chute and pull the big lever to flush it out!',
          starGoals: ['Clean 8 pieces', 'Clean 16 pieces', 'Clean 24 pieces'],
          thresholds: [800, 1800, 3000]
        },
        dodge: {
          badge: 'NAVIGATION',
          title: 'Dodge Space Rocks',
          desc: 'Steer left and right. Catch stars and dodge rocks!',
          starGoals: ['Catch 8 stars', 'Catch 14 stars', 'Catch 20 stars'],
          thresholds: [8, 14, 20]
        },
        gyro: {
          badge: 'ENGINES',
          title: 'Stop the Spin',
          desc: 'Tap STOP when the needle lands in the green zone!',
          starGoals: ['Land 4 stops', 'Land 6 stops', 'Land 8 perfect stops'],
          thresholds: [4, 6, 8]
        },
        gforce: {
          badge: 'THRUSTERS',
          title: 'Hold the Boost',
          desc: 'Hold BOOST to keep the rocket inside the green zone!',
          starGoals: ['Survive 8s in zone', 'Survive 14s in zone', 'Survive 20s in zone'],
          thresholds: [8, 14, 20]
        },
        memory: {
          badge: 'REACTOR',
          title: 'Match the Lights',
          desc: 'Watch the colors light up and tap them in the same order!',
          starGoals: ['Solve 3 rounds', 'Solve 5 rounds', 'Solve 7 rounds'],
          thresholds: [3, 5, 7]
        }
      };

      return games.map((g, index) => {
        const cfg = taskConfigs[g.id] || {
          badge: 'TRAINING',
          title: g.name,
          desc: 'Complete this training mission to earn stars!',
          starGoals: ['1 Star', '2 Stars', '3 Stars'],
          thresholds: [1, 2, 3]
        };
        return {
          levelNumber: index + 1,
          gameId: g.id,
          name: g.name,
          badge: cfg.badge || 'TRAINING',
          title: cfg.title,
          desc: cfg.desc,
          icon: g.icon,
          starGoals: cfg.starGoals,
          thresholds: cfg.thresholds
        };
      });
    },

    getTimeUntilReset() {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow - now;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${mins}m`;
    }
  };
})();
