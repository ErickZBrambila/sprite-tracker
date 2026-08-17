const { neon } = require('@neondatabase/serverless');

// HTTP-based Neon driver — no TCP connection, no cold-start penalty on Vercel serverless.
// Falls back to DATABASE_URL if the Neon integration uses that name instead of POSTGRES_URL.
let _sql;
module.exports = function getDb() {
  if (!_sql) _sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL);
  return _sql;
};
