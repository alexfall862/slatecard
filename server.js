const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Find the folder that actually contains index.html, so the deploy
// works whether files live in ./public or at the repo root.
const candidates = [
  path.join(__dirname, 'public'),
  __dirname,
  path.join(process.cwd(), 'public'),
  process.cwd(),
];
const PUBLIC_DIR = candidates.find(d => {
  try { return fs.existsSync(path.join(d, 'index.html')); } catch { return false; }
});

if (!PUBLIC_DIR) {
  console.error('FATAL: index.html not found. Looked in:');
  candidates.forEach(d => {
    let listing = '(unreadable)';
    try { listing = fs.readdirSync(d).join(', '); } catch {}
    console.error(`  ${d} -> ${listing}`);
  });
} else {
  console.log(`Serving from: ${PUBLIC_DIR}`);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

http.createServer((req, res) => {
  if (!PUBLIC_DIR) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    return res.end('Server misconfigured: index.html not found. Check deploy logs.');
  }

  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.normalize(path.join(PUBLIC_DIR, urlPath === '/' ? 'index.html' : urlPath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, index) => {
        if (e2) {
          console.error('Failed to read index.html:', e2.message);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Server error: could not read index.html');
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(index);
      });
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=300',
    });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => console.log(`Slate running on port ${PORT}`));
