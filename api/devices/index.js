const { randomUUID } = require('crypto');
const getDb = require('../_db');
const { recoveryCode } = require('../../server/words');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sql = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();

  for (let attempt = 0; attempt < 10; attempt++) {
    const code = recoveryCode();
    try {
      await sql`INSERT INTO devices (id, recovery_code, created_at) VALUES (${id}, ${code}, ${now})`;
      return res.json({ deviceId: id, recoveryCode: code });
    } catch (e) {
      if (!e.message?.includes('unique') && !e.message?.includes('duplicate')) throw e;
    }
  }
  res.status(500).json({ error: 'Could not generate a unique sync code. Please try again.' });
};
