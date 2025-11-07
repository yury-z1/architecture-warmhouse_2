// services/temperature-api/main.js
const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 8081;

// Маппинг из задания: sensorId ↔ location
const idToLocation = { "1": "Living Room", "2": "Bedroom", "3": "Kitchen" };
const locationToId = Object.fromEntries(Object.entries(idToLocation).map(([id, loc]) => [loc.toLowerCase(), id]));

// Случайная температура
const rnd = (min=-10, max=30) => +(Math.random()*(max-min)+min).toFixed(1);

function resolve(sensorId, location) {
  let id = sensorId && String(sensorId);
  let loc = location && String(location);

  if (!loc && id && idToLocation[id]) loc = idToLocation[id];
  if (!id && loc && locationToId[loc.toLowerCase()]) id = locationToId[loc.toLowerCase()];
  if (!id) id = "0";
  if (!loc) loc = "Unknown";
  return { id, loc };
}

function json(res, payload, code=200) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  // Вариант 1: /temperature?location=... | ?sensorId=...
  if (req.method === 'GET' && parsed.pathname === '/temperature') {
    const { id, loc } = resolve(parsed.query.sensorId, parsed.query.location);
    return json(res, { sensorId: id, location: loc, value: rnd(), unit: '°C', timestamp: new Date().toISOString() });
  }

  // Вариант 2: /temperature/:sensorId — добавлено ради совместимости со smarthome-app
  if (req.method === 'GET' && parsed.pathname.startsWith('/temperature/')) {
    const id = parsed.pathname.replace('/temperature/', '').trim();
    if (id) {
      const data = resolve(id, null);
      return json(res, { sensorId: data.id, location: data.loc, value: rnd(), unit: '°C', timestamp: new Date().toISOString() });
    }
  }

  return json(res, { error: 'Not Found' }, 404);
});

server.listen(PORT, () => console.log(`temperature-api listening on :${PORT}`));
