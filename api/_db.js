const { sql, createClient } = require('@vercel/postgres');

// Module-level flag so schema creation only runs once per warm Lambda instance.
let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS devices (
      id            TEXT PRIMARY KEY,
      recovery_code TEXT UNIQUE NOT NULL,
      created_at    TEXT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      seq       BIGSERIAL PRIMARY KEY,
      device_id TEXT    NOT NULL REFERENCES devices(id),
      sprite_id TEXT    NOT NULL,
      owned     BOOLEAN NOT NULL,
      mastered  BOOLEAN NOT NULL,
      at        TEXT    NOT NULL,
      UNIQUE(device_id, at)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_device ON events(device_id, seq)`;
  schemaReady = true;
}

module.exports = { sql, createClient, ensureSchema };
