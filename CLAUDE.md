# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A browser-first Fortnite Sprite checklist with an optional Express sync backend. The frontend is zero-dependency (no build step, no framework, no npm). The backend (`server/`) adds cross-device sync via anonymous device IDs — it's optional; the app still works locally without it.

## Running / developing

```bash
# One-time setup: download Sprite images (uses only Node built-ins, no npm)
node scripts/download-images.js

# Run the sync backend (installs Express; uses Node's built-in node:sqlite — no native deps)
cd server && npm install && npm run dev   # → http://localhost:3000

# Or serve the static frontend only (no sync)
npx serve .
python3 -m http.server 8080
```

There are no tests, no linter, and no build. Verify changes by opening the app in a browser.

## Architecture

### Frontend

The app is four plain JavaScript files loaded in order by `index.html`:

1. **`spritesData.js`** — the catalog and nothing else. Exports `SpritesData` (browser) / `module.exports` (Node) via a UMD wrapper so the same file is shared by both the browser app and the Node download script. Contains:
   - `SPECIES`: the master array of `[displayName, rarity, variants[], ability]` tuples
   - `ICON_SOURCES`: a map of `id → original URL` (used only by the download script; the app itself only references the local `images/<id>.<ext>` paths)
   - `buildCatalog()`: expands SPECIES into a flat `CATALOG` array of `{ id, species, variant, rarity, ability, icon }` objects

2. **`store.js`** — the entire data layer, exposed as `SpriteStore`. State is an **append-only event log** in `localStorage` (`sprite-tracker:events:v1`), not a mutable snapshot. Each event is `{ id, owned, mastered, at }`. All reads — current state, history, timeline, activity feed — fold this same log, so the Dashboard and Checklist views can never be out of sync. Export ships the raw log (full history); import replaces it entirely (no merge).

3. **`app.js`** — the whole UI, no framework. Calls `SpriteStore` and reads `SpritesData.CATALOG`. Two views rendered into separate `<main>` elements:
   - **Checklist**: filters (search, rarity, variant, view-mode, sort), Sprites grouped by species, tap-to-cycle state (not owned → owned → mastered → not owned)
   - **Dashboard**: progress bars by rarity/variant/species, a hand-rolled inline SVG progress-over-time chart (`renderTimelineChart`), and a recent-activity feed

4. **`style.css`** — all styling; no CSS framework.

`scripts/download-images.js` is a standalone Node script that reads `ICON_SOURCES` from `spritesData.js` and downloads images to `images/`. It is idempotent — re-running it only fetches what is missing.

### Backend (`server/`)

Express app with SQLite (`node:sqlite` — Node's built-in, no native compilation). Single dependency: `express`. Database file written to `data/sprite-tracker.db` (path overridable via `DB_PATH` env var).

**Sync model — local-first:** `store.js` writes to `localStorage` immediately on every `toggle()` call, then fires a background `fetch` to push the new event to the server. On page load, `SpriteStore.init()` pushes all local events up first (so offline-accumulated changes aren't lost), then pulls the server's canonical log down. Server is authoritative on pull.

**Identity:** on first visit, the server mints an anonymous UUID device ID + a human-readable recovery code (`adjective-animal-number`, e.g. `gentle-deer-72`). Both are stored in `localStorage`. The recovery code is the only thing users need to note down — entering it in the "Sync" modal on a new device connects that browser to the same event log.

**API routes:**
- `POST /api/devices` — register a new device, returns `{ deviceId, recoveryCode }`
- `GET /api/devices/lookup/:code` — find a deviceId by recovery code (must be before `/:deviceId` routes so "lookup" isn't treated as a deviceId)
- `GET /api/devices/:deviceId/events` — fetch full event log
- `POST /api/devices/:deviceId/events` — push events array (idempotent via `INSERT OR IGNORE` on `UNIQUE(device_id, at)`)

**Deployment:** `Dockerfile` builds a single Node 22 container. Mount a volume at `/app/data/` for the SQLite file. Run `node scripts/download-images.js` locally before `docker build` so `images/` is populated in the image.

## Updating the Sprite catalog

Epic adds Sprites mid-season. All changes go in `spritesData.js`:

- **New variant on an existing species**: add the variant name to that species's variants array in `SPECIES`, add its image URL to `ICON_SOURCES` (key: `<species-slug>-<variant-slug>`), then re-run `node scripts/download-images.js`.
- **New species**: add a new entry to `SPECIES` and corresponding `ICON_SOURCES` entries.
- If no image is available, omit the `ICON_SOURCES` entry — `buildCatalog()` sets `icon: null` and the app renders a plain rarity-colored tile as fallback.

Sprite IDs are derived by `slugify(species) + '-' + slugify(variant)` (e.g. `peeky-peely-holofoil`). The slug logic lives in `spritesData.js:slugify`.
