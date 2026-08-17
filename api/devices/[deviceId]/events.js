const { sql, createClient, ensureSchema } = require('../../_db');

module.exports.config = { api: { bodyParser: { sizeLimit: '2mb' } } };

module.exports = async function handler(req, res) {
  await ensureSchema();
  const { deviceId } = req.query;

  const { rows: found } = await sql`SELECT 1 FROM devices WHERE id = ${deviceId}`;
  if (!found.length) return res.status(404).json({ error: 'Device not found.' });

  if (req.method === 'GET') {
    const { rows } = await sql`
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

    const client = createClient();
    await client.connect();
    let inserted = 0;
    try {
      await client.query('BEGIN');
      for (const e of valid) {
        const result = await client.query(
          `INSERT INTO events (device_id, sprite_id, owned, mastered, at)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
          [deviceId, e.id, e.owned, e.mastered, e.at]
        );
        inserted += result.rowCount;
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      await client.end();
    }

    return res.json({ inserted });
  }

  res.status(405).end();
};
