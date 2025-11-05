const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 8081;

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  if (req.method === 'GET' && parsed.pathname === '/temperature') {
    const loc = parsed.query.location || 'unknown';
    const value = (Math.random() * 15 + 10).toFixed(1); // 10..25 C

    const body = JSON.stringify({
      location: loc,
      value: Number(value),
      unit: 'C',
      ts: new Date().toISOString()
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(body);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`temperature-api listening on :${PORT}`);
});
