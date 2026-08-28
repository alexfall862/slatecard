const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

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
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);

  // Prevent path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Single-page site: serve index.html for anything not found
      return fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, index) => {
        if (e2) { res.writeHead(500); return res.end('Server error'); }
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
}).listen(PORT, () => console.log(`Slate running on port ${PORT}`));
