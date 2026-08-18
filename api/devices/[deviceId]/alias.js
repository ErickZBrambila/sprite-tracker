const getDb = require('../../_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).end();

  const sql = getDb();
  const { deviceId } = req.query;
  const { alias } = req.body || {};

  if (!alias || typeof alias !== 'string') return res.status(400).json({ error: 'alias is required.' });

  const norm = alias.trim().toLowerCase().slice(0, 32);
  if (!/^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/.test(norm)) {
    return res.status(400).json({ error: 'Username must be 3–32 characters: letters, numbers, hyphens.' });
  }

  const [device] = await sql`SELECT 1 FROM devices WHERE id = ${deviceId}`;
  if (!device) return res.status(404).json({ error: 'Device not found.' });

  try {
    await sql`UPDATE devices SET alias = ${norm} WHERE id = ${deviceId}`;
    res.json({ ok: true, alias: norm });
  } catch (e) {
    if (e.message?.includes('unique') || e.code === '23505') {
      return res.status(409).json({ error: 'That username is already taken.' });
    }
    throw e;
  }
};
