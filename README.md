# Sprite Tracker

A standalone, account-free checklist and progress dashboard for Fortnite Sprites (Chapter 7
Season 3, "Runners"). No login, no server, no accounts — everything is stored in your own
browser. Built to be shared and self-hosted by anyone.

## ⚠️ Read this first

- This is an **unofficial fan project**, not affiliated with, endorsed by, or sponsored by
  Epic Games, Inc. Fortnite is a trademark of Epic Games, Inc.
- There is no API that exposes which specific Sprites a player owns (see "Why this exists"
  below) — this is a **manual checklist**, not something that reads your Fortnite account.
  You tap Sprites yourself as you collect/master them in-game.
- Your data (what you've checked off, and when) lives only in your browser's `localStorage`
  on your device. Nothing is sent to any server — there isn't one. Clearing your browser data
  will erase it, so use the Export button to keep a backup.
- Sprite names, rarities, abilities, and images were hand-compiled from
  [Beebom's Sprites guide](https://beebom.com/fortnite-sprites-guide/) and their
  [Gem Sprites guide](https://beebom.com/fortnite-gem-sprites-locations-powers/). This list is
  a best-effort snapshot as of August 2026 and will drift as Epic adds new Sprites/variants
  mid-season — see `spritesData.js` to update it.

## Why this exists

Fortnite Sprites are collected and Mastered in-match, and Epic's own systems clearly track
Mastery status somewhere (mastering one is permanent for the rest of the season). But nothing
in Epic's publicly reachable account data exposes *which* specific Sprites you have — the
closest thing is an aggregate quest/reward-ladder counter, with no per-Sprite names attached.
This isn't a gap in searching; it's confirmed by the fact that other dedicated Sprite-tracking
tools (Sprite Field Guide, Sprite Tracker) are themselves manual, no-account checklists for the
same reason.

So: a manual checklist it is, but a good one — with real Sprite names/art, useful filters, and
a dashboard to actually see your progress instead of just a flat list.

## Setup

No build step, no framework, no dependencies to install for the app itself.

1. **Download the Sprite images once** (they're self-hosted, not hotlinked, so this app can be
   shared/deployed safely):
   ```bash
   node scripts/download-images.js
   ```
   This uses only Node's built-in `https` module — no npm install needed. It's safe to re-run;
   it skips anything already downloaded and only retries what failed.
2. **Open `index.html`** directly in a browser, or serve the folder with anything static:
   ```bash
   npx serve .
   # or: python3 -m http.server 8080
   ```

## Deploying / sharing it

This is a plain static site (`index.html` + `style.css` + `app.js` + `store.js` +
`spritesData.js` + `images/`) — drag-and-drop it onto any static host:

- **Netlify / Vercel / Cloudflare Pages**: drag the folder into their dashboard, or connect a
  git repo. Zero config needed.
- **GitHub Pages**: push this folder to a repo and enable Pages on it.

Run `node scripts/download-images.js` **before** deploying so the `images/` folder is populated
— the deployed site itself never needs internet access to Beebom, since the images ship with
it.

## How it works

- `spritesData.js` — the static catalog (116 Sprites: 25 species × variant types). Also holds
  `ICON_SOURCES`, the original image URLs used only by the one-time download script.
- `store.js` — the whole data layer. State is an **append-only, timestamped event log** in
  `localStorage`, not just a snapshot — every tap of a Sprite records `{ id, owned, mastered,
  at }`. Current state and the dashboard's history are both derived by folding this same log,
  so they can never drift apart. Export ships the raw log (full history), not just a snapshot.
- `app.js` — renders the Checklist view (search, rarity/variant filters, view filter including
  "Needs Mastery", multiple sort orders) and the Dashboard view (completion by rarity/variant/
  species, a hand-rolled SVG progress-over-time chart, and a recent-activity feed) from that
  same store.
- No external JS dependencies (no CDN scripts) — the whole thing is self-contained and works
  offline once loaded.

## Updating the Sprite list

Epic adds Sprites/variants mid-season. To add one:

1. Add it to the `SPECIES` array in `spritesData.js` (or a new species entry).
2. Add its image URL to `ICON_SOURCES` (or leave it out — the app falls back to a plain
   colored tile if `icon` is `null`).
3. Re-run `node scripts/download-images.js` to fetch the new image.
