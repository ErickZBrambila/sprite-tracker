const getDb = require('../../_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const sql = getDb();
  const { code } = req.query;
  const norm = code.toLowerCase();
  const rows = await sql`SELECT id FROM devices WHERE recovery_code = ${norm} OR alias = ${norm}`;
  if (!rows.length) return res.status(404).json({ error: 'Sync code not found.' });
  res.json({ deviceId: rows[0].id });
};
