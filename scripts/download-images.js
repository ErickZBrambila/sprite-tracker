#!/usr/bin/env node
// One-time setup script: downloads all Sprite icon images from their original source
// (static.beebom.com, see spritesData.js ICON_SOURCES) into ./images/, so the app can be
// hosted/shared without hotlinking someone else's site at runtime.
//
// Usage:
//   node scripts/download-images.js
//
// Safe to re-run - it skips anything already downloaded. Delete a file in images/ (or the
// whole folder) to force it to re-fetch.
//
// No npm dependencies - uses Node's built-in https module only.

const fs = require('fs');
const path = require('path');
const https = require('https');

const { ICON_SOURCES, extOf } = require('../spritesData.js');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const MAX_REDIRECTS = 5;

function download(url, destPath, redirectsLeft = MAX_REDIRECTS) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'sprite-tracker-setup/1.0' } }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        if (redirectsLeft <= 0) return reject(new Error('Too many redirects'));
        return resolve(download(res.headers.location, destPath, redirectsLeft - 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('Timed out')));
  });
}

async function main() {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const entries = Object.entries(ICON_SOURCES);
  console.log(`Downloading ${entries.length} Sprite images into ${IMAGES_DIR} ...\n`);

  let ok = 0, skipped = 0, failed = [];

  for (const [id, url] of entries) {
    const ext = extOf(url);
    const dest = path.join(IMAGES_DIR, `${id}.${ext}`);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      skipped++;
      continue;
    }

    try {
      await download(url, dest);
      const size = fs.statSync(dest).size;
      if (size === 0) throw new Error('Downloaded 0 bytes');
      ok++;
      process.stdout.write(`  ok    ${id}\n`);
    } catch (err) {
      failed.push({ id, url, error: err.message });
      process.stdout.write(`  FAIL  ${id} (${err.message})\n`);
      if (fs.existsSync(dest)) fs.unlinkSync(dest); // don't leave a partial/empty file
    }
  }

  console.log(`\nDone: ${ok} downloaded, ${skipped} already present, ${failed.length} failed.`);
  if (failed.length) {
    console.log('\nFailed downloads (the app will show a plain colored tile for these instead):');
    failed.forEach((f) => console.log(`  - ${f.id}: ${f.url} (${f.error})`));
    console.log('\nRe-run this script any time to retry just the missing ones.');
  }
}

main().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
