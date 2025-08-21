// index.js
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const BlogManager = require('./blogManager');

const PORT = 3000;
const manager = new BlogManager();

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

async function send404(res) {
  try {
    const p404 = path.join(__dirname, 'public', '404.html');
    const html = await fs.readFile(p404);
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - Sayfa bulunamadı');
  }
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        reject(new Error('Geçersiz JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method.toUpperCase();

  try {
    if (method === 'GET' && pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Basit Blog Sistemine Hoş Geldiniz!');
      return;
    }

    if (method === 'GET' && pathname === '/blogs') {
      const blogs = await manager.getAllBlogs();
      return sendJson(res, 200, blogs);
    }

    if (method === 'GET' && pathname.startsWith('/blog/')) {
      const id = pathname.split('/')[2];
      const blog = await manager.readBlog(id);
      if (!blog) return sendJson(res, 404, { error: 'Blog bulunamadı' });
      return sendJson(res, 200, blog);
    }

    if (method === 'POST' && pathname === '/create') {
      const body = await readRequestBody(req);
      if (!body.title || !body.content) {
        return sendJson(res, 400, { error: 'title ve content gerekli' });
      }
      const blog = await manager.createBlog(body.title, body.content);
      return sendJson(res, 201, blog);
    }

    await send404(res);
  } catch (err) {
    await manager.logActivity(`ERROR ${method} ${pathname} -> ${err.message}`);
    sendJson(res, 500, { error: 'Sunucu hatası', detail: err.message });
  }
});

server.listen(PORT, () => console.log(`Sunucu çalışıyor: http://localhost:${PORT}`));
