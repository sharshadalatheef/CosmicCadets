// Vercel Serverless Function: Cloud Leaderboard (Free Upstash Redis / Vercel KV)
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  // Fallback data if cloud database is not connected yet
  const DEFAULT_RIVALS = [
    { username: 'orion_b', name: 'Orion Blaze', avatar: 'starace', stars: 39, dailyStars: 15, badges: ['firstFlight','starCollector','commander'], highScores: { blaster: 4200, collector: 3800 } },
    { username: 'luna_s', name: 'Luna Spark', avatar: 'novacat', stars: 33, dailyStars: 14, badges: ['firstFlight','starCollector','ecoHero'], highScores: { blaster: 3600, collector: 4100 } },
    { username: 'jax_a', name: 'Astro Jax', avatar: 'robocadet', stars: 28, dailyStars: 12, badges: ['firstFlight','starCollector'], highScores: { blaster: 3100, collector: 2900 } },
    { username: 'nova_v', name: 'Nova Vance', avatar: 'astrofox', stars: 22, dailyStars: 9, badges: ['firstFlight'], highScores: { blaster: 2600, collector: 2400 } },
    { username: 'chloe_c', name: 'Comet Chloe', avatar: 'cyberfalcon', stars: 16, dailyStars: 7, badges: ['firstFlight'], highScores: { blaster: 2100, collector: 2200 } },
    { username: 'zoe_z', name: 'Zenith Zoe', avatar: 'galaxypup', stars: 11, dailyStars: 5, badges: ['firstFlight'], highScores: { blaster: 1600, collector: 1700 } },
    { username: 'pip_s', name: 'Pip Stellar', avatar: 'robocadet', stars: 6, dailyStars: 3, badges: ['firstFlight'], highScores: { blaster: 1100, collector: 1200 } }
  ];

  if (!url || !token) {
    // Database credentials not configured yet, return fallback rivals safely
    if (req.method === 'POST') {
      return res.status(200).json({ ok: true, storedLocally: true });
    }
    return res.status(200).json({ ok: true, leaderboard: DEFAULT_RIVALS, isCloud: false });
  }

  // Cloud Database Integration via Upstash REST API
  try {
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { username, name, avatar, stars, dailyStars, score, gameId } = body;

      if (!username) {
        return res.status(400).json({ ok: false, error: 'Username required' });
      }

      // Store profile JSON
      const profileKey = `cadet:${username}`;
      const profileData = JSON.stringify({
        username,
        name: name || username,
        avatar: avatar || 'astrofox',
        stars: parseInt(stars, 10) || 0,
        dailyStars: parseInt(dailyStars, 10) || 0,
        lastActive: Date.now()
      });

      // Update in Redis
      await fetch(`${url}/set/${profileKey}/${encodeURIComponent(profileData)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update in Sorted Set for rankings
      await fetch(`${url}/zadd/leaderboard_stars/${stars || 0}/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return res.status(200).json({ ok: true, isCloud: true });
    }

    if (req.method === 'GET') {
      // Fetch top 50 cadets from Redis sorted set
      const rangeRes = await fetch(`${url}/zrevrange/leaderboard_stars/0/49/WITHSCORES`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const rangeData = await rangeRes.json();
      const entries = rangeData.result || [];

      const list = [];
      for (let i = 0; i < entries.length; i += 2) {
        const username = entries[i];
        const stars = parseInt(entries[i + 1], 10);

        // Fetch profile
        const profRes = await fetch(`${url}/get/cadet:${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profData = await profRes.json();
        let profile = {};
        try {
          profile = JSON.parse(profData.result || '{}');
        } catch (e) {}

        list.push({
          username,
          name: profile.name || username,
          avatar: profile.avatar || 'astrofox',
          stars: stars || profile.stars || 0,
          dailyStars: profile.dailyStars || 0
        });
      }

      // Merge with default rivals so the board is always full and fun
      DEFAULT_RIVALS.forEach(r => {
        if (!list.some(x => x.username === r.username)) {
          list.push(r);
        }
      });

      list.sort((a, b) => b.stars - a.stars);
      return res.status(200).json({ ok: true, leaderboard: list, isCloud: true });
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.status(200).json({ ok: true, leaderboard: DEFAULT_RIVALS, isCloud: false, error: err.message });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
