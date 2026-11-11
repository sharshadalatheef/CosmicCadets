// CosmicCadets Localhost Web Server (Zero Dependencies)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');

  // Handle serverless API routes locally
  if (req.url.startsWith('/api/leaderboard')) {
    const handler = require('./api/leaderboard.js');
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      req.body = body;
      res.status = code => { res.statusCode = code; return res; };
      res.json = data => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };
      handler(req, res);
    });
    return;
  }

  if (req.url.startsWith('/api/auth')) {
    const handler = require('./api/auth.js');
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      req.body = body;
      res.status = code => { res.statusCode = code; return res; };
      res.json = data => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };
      handler(req, res);
    });
    return;
  }

  let safeUrl = decodeURI(req.url.split('?')[0]);
  if (safeUrl === '/' || safeUrl === '') safeUrl = '/index.html';

  const filePath = path.join(ROOT, safeUrl);

  // Security check: ensure path stays within ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

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
  console.log('  🚀 COSMIC CADETS ACADEMY SERVER IS LIVE! 🚀       ');
  console.log('====================================================');
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  Network URL: http://127.0.0.1:${PORT}`);
  console.log('  Ready to play: Cosmic Blaster, Orbit Recycler,');
  console.log('  Debris Dodge, Gyro Spinner, G-Force, and Memory!');
  console.log('====================================================');
});
