// Client-side, account-free state store. The source of truth is an append-only, timestamped
// EVENT LOG in localStorage rather than just "current state" — current state and the
// Dashboard's history are both derived by folding the same log, so they can never drift apart.
//
// Export/Import ship the raw event log (full history, not just a snapshot).
//
// Sync: when a backend server is present, events are also persisted via /api/devices/*.
// Local-first: localStorage is written immediately (instant, works offline), and the server
// is updated in the background. On load, local events are pushed up before pulling the
// server's canonical log, so offline-accumulated changes are never silently discarded.

const SpriteStore = (function () {
  const KEY        = 'sprite-tracker:events:v1';
  const DEVICE_KEY = 'sprite-tracker:deviceId';
  const CODE_KEY   = 'sprite-tracker:recoveryCode';

  function readRaw() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeRaw(events) {
    localStorage.setItem(KEY, JSON.stringify(events));
  }

  // Public: full event log, oldest first. Each event: { id, owned, mastered, at }.
  function getEvents() {
    return readRaw();
  }

  // Folds the event log into "current state per sprite" - last event per id wins.
  function getCurrentState() {
    const state = {};
    for (const ev of readRaw()) {
      state[ev.id] = { owned: ev.owned, mastered: ev.mastered, at: ev.at };
    }
    return state;
  }

  function stateOf(spriteId) {
    return getCurrentState()[spriteId] || { owned: false, mastered: false, at: null };
  }

  // not owned -> owned -> mastered -> not owned. Appends one event, doesn't mutate history.
  function toggle(spriteId) {
    const current = stateOf(spriteId);
    let next;
    if (!current.owned && !current.mastered) next = { owned: true, mastered: false };
    else if (current.owned && !current.mastered) next = { owned: true, mastered: true };
    else next = { owned: false, mastered: false };

    const events = readRaw();
    const ev = { id: spriteId, owned: next.owned, mastered: next.mastered, at: new Date().toISOString() };
    events.push(ev);
    writeRaw(events);
    _pushEvents([ev]); // fire-and-forget background sync
    return next;
  }

  // Replays the log into a cumulative timeline for charting: one point per event, tracking how
  // many distinct sprites are currently owned/mastered at that moment in time.
  function getTimeline() {
    const events = readRaw();
    const ownedSet = new Set();
    const masteredSet = new Set();
    const points = [];

    for (const ev of events) {
      if (ev.owned) ownedSet.add(ev.id); else ownedSet.delete(ev.id);
      if (ev.mastered) masteredSet.add(ev.id); else masteredSet.delete(ev.id);
      points.push({ at: ev.at, owned: ownedSet.size, mastered: masteredSet.size });
    }
    return points;
  }

  // Most recent events first, for an activity feed. Includes a human label.
  function getRecentActivity(limit = 15) {
    const events = readRaw();
    return events
      .slice(-limit)
      .reverse()
      .map((ev) => ({
        ...ev,
        label: ev.mastered ? 'Mastered' : ev.owned ? 'Marked owned' : 'Reset',
      }));
  }

  function exportData() {
    return JSON.stringify(
      { app: 'sprite-tracker', version: 1, exportedAt: new Date().toISOString(), events: readRaw() },
      null,
      2
    );
  }

  // Returns { ok, error?, imported? }. Replaces the current log entirely - this is a restore,
  // not a merge (merging two independent histories correctly is ambiguous; keep it simple and
  // predictable instead).
  function importData(jsonString) {
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      return { ok: false, error: 'That file isn’t valid JSON.' };
    }
    if (!parsed || !Array.isArray(parsed.events)) {
      return { ok: false, error: 'That file doesn’t look like a Sprite Tracker export.' };
    }
    const valid = parsed.events.every(
      (ev) => ev && typeof ev.id === 'string' && typeof ev.owned === 'boolean' && typeof ev.mastered === 'boolean' && typeof ev.at === 'string'
    );
    if (!valid) {
      return { ok: false, error: 'That export file looks corrupted.' };
    }
    writeRaw(parsed.events);
    return { ok: true, imported: parsed.events.length };
  }

  function clearAll() {
    localStorage.removeItem(KEY);
  }

  // ---- Server sync ----

  function getDeviceId()     { return localStorage.getItem(DEVICE_KEY); }
  function getRecoveryCode() { return localStorage.getItem(CODE_KEY); }

  async function _pushEvents(events) {
    const deviceId = getDeviceId();
    if (!deviceId || !events.length) return;
    try {
      await fetch(`/api/devices/${deviceId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
    } catch {} // Offline — events are safe in localStorage
  }

  // On page load: register device if new, push local events up, pull server state down.
  // Returns { changed } so the caller can re-render if the server had new data.
  async function init() {
    let deviceId = getDeviceId();

    if (!deviceId) {
      try {
        const res = await fetch('/api/devices', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem(DEVICE_KEY, data.deviceId);
          localStorage.setItem(CODE_KEY, data.recoveryCode);
          deviceId = data.deviceId;
        }
      } catch {} // Server not reachable — work locally
    }

    if (!deviceId) return { changed: false };

    // Push local events first so offline-accumulated changes aren't lost on pull
    const local = readRaw();
    let pushed = local.length === 0;
    try {
      const res = await fetch(`/api/devices/${deviceId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: local }),
      });
      pushed = res.ok;
    } catch {}

    if (!pushed) return { changed: false }; // Offline — keep local state as-is

    // Pull the canonical log from the server
    try {
      const res = await fetch(`/api/devices/${deviceId}/events`);
      if (res.ok) {
        const { events } = await res.json();
        const changed = events.length !== local.length;
        writeRaw(events);
        return { changed };
      }
    } catch {}

    return { changed: false };
  }

  // Connect this browser to an existing device using a recovery code.
  // Replaces local data with the server's event log for that device.
  async function connectDevice(code) {
    let res;
    try {
      res = await fetch(`/api/devices/lookup/${encodeURIComponent(code.trim().toLowerCase())}`);
    } catch {
      return { ok: false, error: 'Could not reach the server. Check your connection.' };
    }
    if (res.status === 404) return { ok: false, error: 'Sync code not found. Check for typos.' };
    if (!res.ok)            return { ok: false, error: 'Something went wrong. Please try again.' };

    const { deviceId } = await res.json();
    localStorage.setItem(DEVICE_KEY, deviceId);
    localStorage.setItem(CODE_KEY, code.trim().toLowerCase());

    try {
      const evRes = await fetch(`/api/devices/${deviceId}/events`);
      if (evRes.ok) {
        const { events } = await evRes.json();
        writeRaw(events);
      }
    } catch {}

    return { ok: true };
  }

  // ---- Friends ----

  const FRIENDS_KEY = 'sprite-tracker:friends';

  function getFriends() {
    try { return JSON.parse(localStorage.getItem(FRIENDS_KEY) || '[]'); } catch { return []; }
  }
  function _saveFriends(f) { localStorage.setItem(FRIENDS_KEY, JSON.stringify(f)); }

  function _foldEvents(events) {
    const s = {};
    for (const ev of events) s[ev.id] = { owned: ev.owned, mastered: ev.mastered };
    return s;
  }

  async function _fetchFriendState(deviceId) {
    const res = await fetch(`/api/devices/${deviceId}/events`);
    if (!res.ok) return null;
    const { events } = await res.json();
    return _foldEvents(events);
  }

  async function addFriend(code, name) {
    const friends = getFriends();
    if (friends.length >= 4) return { ok: false, error: 'Maximum 4 friends.' };
    const norm = code.trim().toLowerCase();
    if (friends.some(f => f.code === norm)) return { ok: false, error: 'Already added.' };

    let res;
    try { res = await fetch(`/api/devices/lookup/${encodeURIComponent(norm)}`); }
    catch { return { ok: false, error: 'Could not reach the server.' }; }
    if (res.status === 404) return { ok: false, error: 'Sync code not found.' };
    if (!res.ok) return { ok: false, error: 'Something went wrong.' };

    const { deviceId } = await res.json();
    let state;
    try { state = await _fetchFriendState(deviceId); }
    catch { return { ok: false, error: 'Could not load friend data.' }; }
    if (!state) return { ok: false, error: 'Could not load friend data.' };

    friends.push({ code: norm, deviceId, name: (name.trim() || norm).slice(0, 20), state, fetchedAt: new Date().toISOString() });
    _saveFriends(friends);
    return { ok: true };
  }

  async function refreshFriend(code) {
    const friends = getFriends();
    const f = friends.find(f => f.code === code.toLowerCase());
    if (!f) return { ok: false, error: 'Friend not found.' };
    try {
      const state = await _fetchFriendState(f.deviceId);
      if (!state) return { ok: false, error: 'Could not reach the server.' };
      f.state = state;
      f.fetchedAt = new Date().toISOString();
      _saveFriends(friends);
      return { ok: true };
    } catch { return { ok: false, error: 'Could not reach the server.' }; }
  }

  function removeFriend(code) {
    _saveFriends(getFriends().filter(f => f.code !== code.toLowerCase()));
  }

  return {
    getEvents, getCurrentState, stateOf, toggle,
    getTimeline, getRecentActivity,
    exportData, importData, clearAll,
    init, connectDevice, getRecoveryCode,
    getFriends, addFriend, refreshFriend, removeFriend,
  };
})();
