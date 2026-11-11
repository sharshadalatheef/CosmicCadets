// CosmicCadets Production Local Server & Leaderboard API
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'leaderboard.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial leaderboard seed
function getLeaderboardData() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = [
      { username: 'astromaya', name: 'Commander Maya', stars: 42, dailyStars: 18, rank: 'Space Commander', avatar: 'astrofox' },
      { username: 'leo_star', name: 'Pilot Leo', stars: 36, dailyStars: 16, rank: 'Star Commander', avatar: 'starace' },
      { username: 'nova_sam', name: 'Cadet Sam', stars: 28, dailyStars: 14, rank: 'Flight Lieutenant', avatar: 'novacat' },
      { username: 'cyber_zack', name: 'Ensign Zack', stars: 22, dailyStars: 11, rank: 'Solar Navigator', avatar: 'cyberfalcon' },
      { username: 'pup_orion', name: 'Orion Pup', stars: 15, dailyStars: 8, rank: 'Rookie Astronaut', avatar: 'galaxypup' }
    ];
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Routes
  if (pathname === '/api/leaderboard') {
    const data = getLeaderboardData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  // Static File Serving
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(__dirname, pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('====================================================');
  console.log('  *** COSMIC CADETS ACADEMY SERVER IS LIVE! ***     ');
  console.log('====================================================');
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  Network URL: http://127.0.0.1:${PORT}`);
  console.log('  Ready to play: Cosmic Blaster, Orbit Recycler,');
  console.log('  Debris Dodge, Gyro Spinner, G-Force, and Memory!');
  console.log('====================================================');
});
