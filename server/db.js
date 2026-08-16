const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'sprite-tracker.db');

let _db;
function getDb() {
  if (_db) return _db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  _db = new DatabaseSync(DB_PATH);
  _db.exec("PRAGMA journal_mode = WAL");
  _db.exec(`
    CREATE TABLE IF NOT EXISTS devices (
      id            TEXT PRIMARY KEY,
      recovery_code TEXT UNIQUE NOT NULL,
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      seq       INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT    NOT NULL REFERENCES devices(id),
      sprite_id TEXT    NOT NULL,
      owned     INTEGER NOT NULL,
      mastered  INTEGER NOT NULL,
      at        TEXT    NOT NULL,
      UNIQUE(device_id, at)
    );

    CREATE INDEX IF NOT EXISTS idx_events_device ON events(device_id, seq);
  `);
  return _db;
}

module.exports = { getDb };
