const getDb = require('../../_db');

module.exports.config = { api: { bodyParser: { sizeLimit: '2mb' } } };

module.exports = async function handler(req, res) {
  const sql = getDb();
  const { deviceId } = req.query;

  const [device] = await sql`SELECT 1 FROM devices WHERE id = ${deviceId}`;
  if (!device) return res.status(404).json({ error: 'Device not found.' });

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT sprite_id AS id, owned, mastered, at
      FROM events WHERE device_id = ${deviceId} ORDER BY seq ASC
    `;
    return res.json({ events: rows });
  }

  if (req.method === 'POST') {
    const { events } = req.body;
    if (!Array.isArray(events)) return res.status(400).json({ error: 'events must be an array.' });
    if (events.length > 50000) return res.status(400).json({ error: 'Too many events.' });

    const valid = events.filter(e =>
      e
      && typeof e.id === 'string'      && e.id.length <= 64
      && typeof e.owned === 'boolean'
      && typeof e.mastered === 'boolean'
      && typeof e.at === 'string'      && !isNaN(Date.parse(e.at))
    );

    let inserted = 0;
    if (valid.length > 0) {
      // Single-query batch via unnest — one round trip regardless of event count.
      const ids       = valid.map(e => e.id);
      const owneds    = valid.map(e => e.owned);
      const mastereds = valid.map(e => e.mastered);
      const ats       = valid.map(e => e.at);
      const rows = await sql`
        INSERT INTO events (device_id, sprite_id, owned, mastered, at)
        SELECT ${deviceId}, unnest(${ids}::text[]), unnest(${owneds}::boolean[]),
               unnest(${mastereds}::boolean[]), unnest(${ats}::text[])
        ON CONFLICT DO NOTHING
        RETURNING 1
      `;
      inserted = rows.length;
    }

    return res.json({ inserted });
  }

  res.status(405).end();
};
