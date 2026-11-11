// Vercel Serverless Function: Cloud Cadet Authentication (Free Upstash Redis / Vercel KV)
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { action, username, name, password, avatar } = body;

  if (!username) {
    return res.status(400).json({ ok: false, error: 'Username required' });
  }

  if (!url || !token) {
    // Cloud database not connected, fallback to local storage authentication
    return res.status(200).json({ ok: true, isLocalFallback: true });
  }

  try {
    const userKey = `auth:${username.toLowerCase().trim()}`;

    if (action === 'register') {
      // Check if user already exists
      const checkRes = await fetch(`${url}/get/${userKey}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const checkData = await checkRes.json();
      if (checkData.result) {
        return res.status(400).json({ ok: false, error: 'Username already taken' });
      }

      const userData = JSON.stringify({
        username: username.toLowerCase().trim(),
        name: name || username,
        password: password || '',
        avatar: avatar || 'astrofox',
        stars: 0,
        createdAt: Date.now()
      });

      await fetch(`${url}/set/${userKey}/${encodeURIComponent(userData)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return res.status(200).json({ ok: true, user: JSON.parse(userData), isCloud: true });
    }

    if (action === 'login') {
      const getRes = await fetch(`${url}/get/${userKey}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const getData = await getRes.json();
      if (!getData.result) {
        return res.status(404).json({ ok: false, error: 'Cadet profile not found' });
      }

      const user = JSON.parse(getData.result);
      if (user.password !== password) {
        return res.status(401).json({ ok: false, error: 'Incorrect password' });
      }

      return res.status(200).json({ ok: true, user, isCloud: true });
    }
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }

  return res.status(400).json({ ok: false, error: 'Invalid action' });
};
