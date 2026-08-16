const express = require('express');
const path = require('path');
const { randomUUID } = require('crypto');
const { getDb } = require('./db');
const { recoveryCode } = require('./words');

const app = express();
app.use(express.json({ limit: '2mb' }));

// Serve the static app from the project root — same-origin, no CORS needed.
app.use(express.static(path.join(__dirname, '..')));

// POST /api/devices — register a new anonymous device
app.post('/api/devices', (req, res) => {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  const insert = db.prepare('INSERT INTO devices (id, recovery_code, created_at) VALUES (?, ?, ?)');

  for (let attempt = 0; attempt < 10; attempt++) {
    const code = recoveryCode();
    try {
      insert.run(id, code, now);
      return res.json({ deviceId: id, recoveryCode: code });
    } catch (e) {
      // UNIQUE constraint on recovery_code — generate a new one and retry
      if (!e.message?.includes('UNIQUE constraint failed')) throw e;
    }
  }
  res.status(500).json({ error: 'Could not generate a unique sync code. Please try again.' });
});

// GET /api/devices/lookup/:code — find a device by recovery code
// Declared before /:deviceId routes so "lookup" isn't matched as a deviceId.
app.get('/api/devices/lookup/:code', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT id FROM devices WHERE recovery_code = ?').get(req.params.code.toLowerCase());
  if (!row) return res.status(404).json({ error: 'Sync code not found.' });
  res.json({ deviceId: row.id });
});

// GET /api/devices/:deviceId/events — fetch the full event log for a device
app.get('/api/devices/:deviceId/events', (req, res) => {
  const db = getDb();
  if (!db.prepare('SELECT 1 FROM devices WHERE id = ?').get(req.params.deviceId)) {
    return res.status(404).json({ error: 'Device not found.' });
  }
  const rows = db.prepare(
    'SELECT sprite_id AS id, owned, mastered, at FROM events WHERE device_id = ? ORDER BY seq ASC'
  ).all(req.params.deviceId);
  // node:sqlite returns booleans as integers — convert back before returning.
  res.json({ events: rows.map(r => ({ ...r, owned: r.owned === 1, mastered: r.mastered === 1 })) });
});

// POST /api/devices/:deviceId/events — push events (bulk, idempotent via INSERT OR IGNORE)
app.post('/api/devices/:deviceId/events', (req, res) => {
  const { deviceId } = req.params;
  const { events } = req.body;

  if (!Array.isArray(events)) return res.status(400).json({ error: 'events must be an array.' });

  const db = getDb();
  if (!db.prepare('SELECT 1 FROM devices WHERE id = ?').get(deviceId)) {
    return res.status(404).json({ error: 'Device not found.' });
  }

  const valid = events.filter(
    e => e && typeof e.id === 'string' && typeof e.owned === 'boolean'
      && typeof e.mastered === 'boolean' && typeof e.at === 'string'
  );

  const insert = db.prepare(
    'INSERT OR IGNORE INTO events (device_id, sprite_id, owned, mastered, at) VALUES (?, ?, ?, ?, ?)'
  );
  let inserted = 0;
  db.exec('BEGIN');
  try {
    for (const e of valid) inserted += insert.run(deviceId, e.id, e.owned ? 1 : 0, e.mastered ? 1 : 0, e.at).changes;
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }

  res.json({ inserted });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sprite Tracker  →  http://localhost:${PORT}`));
