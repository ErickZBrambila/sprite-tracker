const el = (id) => document.getElementById(id);

// Detect phone / tablet / desktop and stamp data-device on <html> so CSS can respond.
function setDeviceType() {
  const isTouch = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  const w = window.innerWidth;
  document.documentElement.dataset.device = !isTouch ? 'desktop' : w <= 640 ? 'phone' : 'tablet';
}
setDeviceType();
window.addEventListener('resize', setDeviceType);

const checklistViewEl = el('checklistView');
const dashboardViewEl = el('dashboardView');
const viewSwitchEl = el('viewSwitch');
const exportBtn = el('exportBtn');
const importBtn = el('importBtn');
const importFile = el('importFile');
const resetBtn = el('resetBtn');
const toastEl = el('toast');
const confirmModal = el('confirmModal');
const confirmCancel = el('confirmCancel');
const confirmOk = el('confirmOk');

const CATALOG = SpritesData.CATALOG;
const TOTAL = CATALOG.length;
const RARITIES = ['rare', 'epic', 'legendary', 'mythic'];
const RARITY_LABELS = { rare: 'Rare', epic: 'Epic', legendary: 'Legendary', mythic: 'Mythic' };
const VARIANT_TYPES = ['Base', 'Gold', 'Gummy', 'Galaxy', 'Holofoil', 'Cube', 'Quack', 'Gem'];

let currentView = 'checklist';
let toastTimer = null;

// ---- Stat ring cards ----
const RING_R = 38;
const RING_CIRC = 2 * Math.PI * RING_R;

function buildStatHeadline(ownedCount, masteredCount) {
  function ringCard(count, mod, label) {
    const pct = count / TOTAL;
    const pctLabel = Math.round(pct * 100) + '%';
    const offset = (RING_CIRC * (1 - pct)).toFixed(2);
    const el = document.createElement('div');
    el.className = `stat-card stat-card--${mod}`;
    el.innerHTML = `
      <div class="stat-ring-wrap">
        <svg class="stat-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="stat-ring-bg" cx="50" cy="50" r="${RING_R}"/>
          <circle class="stat-ring-fill stat-ring-fill--${mod}" cx="50" cy="50" r="${RING_R}"
            stroke-dasharray="${RING_CIRC.toFixed(2)}"
            stroke-dashoffset="${RING_CIRC.toFixed(2)}"
            data-target-offset="${offset}"/>
        </svg>
        <div class="stat-overlay">
          <span class="stat-num">${count}</span>
          <span class="stat-denom">/${TOTAL}</span>
          <span class="stat-pct">${pctLabel}</span>
        </div>
      </div>
      <div class="stat-card-label">${label}</div>
    `;
    return el;
  }

  const headline = document.createElement('div');
  headline.className = 'sprite-headline';
  headline.appendChild(ringCard(ownedCount, 'collected', 'Collected'));
  headline.appendChild(ringCard(masteredCount, 'mastered', 'Mastered'));

  // Animate rings after they're in the DOM
  requestAnimationFrame(() => requestAnimationFrame(() => {
    headline.querySelectorAll('.stat-ring-fill[data-target-offset]').forEach(circle => {
      circle.style.strokeDashoffset = circle.dataset.targetOffset;
    });
  }));

  return headline;
}

// ---- Filters (checklist view) ----
let filters = {
  search: '',
  rarity: 'all',
  variant: 'all',
  view: 'all', // all | owned | missing | needsMastery | mastered
  sort: 'species', // species | alpha | rarity | completion
};

function showToast(message, type = 'info') {
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.className = `toast${type === 'error' ? ' error' : ''}`;
  toastEl.hidden = false;
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3200);
}

function confirmDialog(title, body) {
  el('confirmTitle').textContent = title;
  el('confirmBody').textContent = body;
  return new Promise((resolve) => {
    confirmModal.hidden = false;
    const cleanup = (result) => {
      confirmModal.hidden = true;
      confirmCancel.removeEventListener('click', onCancel);
      confirmOk.removeEventListener('click', onOk);
      resolve(result);
    };
    const onCancel = () => cleanup(false);
    const onOk = () => cleanup(true);
    confirmCancel.addEventListener('click', onCancel);
    confirmOk.addEventListener('click', onOk);
  });
}

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diffMs / 1000);
  if (sec < 5) return 'just now';
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ---- View switching ----
viewSwitchEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.view-switch-btn');
  if (!btn) return;
  currentView = btn.dataset.view;
  [...viewSwitchEl.children].forEach((b) => b.classList.toggle('active', b === btn));
  checklistViewEl.hidden = currentView !== 'checklist';
  dashboardViewEl.hidden = currentView !== 'dashboard';
  render();
});

// ---- Export / Import / Reset ----
exportBtn.addEventListener('click', () => {
  const data = SpriteStore.exportData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sprite-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup downloaded');
});

importBtn.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', async () => {
  const file = importFile.files[0];
  importFile.value = '';
  if (!file) return;
  const text = await file.text();
  const result = SpriteStore.importData(text);
  if (result.ok) {
    showToast(`Imported ${result.imported} events`);
    render();
  } else {
    showToast(result.error, 'error');
  }
});

resetBtn.addEventListener('click', async () => {
  const ok = await confirmDialog('Clear all data?', 'This removes your entire Sprite checklist and history from this browser. Export a backup first if you want to keep it.');
  if (!ok) return;
  SpriteStore.clearAll();
  render();
  showToast('Cleared');
});

// ================= Checklist view =================

function toggleSprite(spriteId) {
  SpriteStore.toggle(spriteId);
  render();
}

function renderChecklist() {
  checklistViewEl.innerHTML = '';
  const state = SpriteStore.getCurrentState();

  const wrap = document.createElement('div');
  wrap.className = 'sprite-wrap';

  const ownedCount = CATALOG.filter((s) => state[s.id]?.owned).length;
  const masteredCount = CATALOG.filter((s) => state[s.id]?.mastered).length;

  wrap.appendChild(buildStatHeadline(ownedCount, masteredCount));

  // ---- Toolbar ----
  const toolbar = document.createElement('div');
  toolbar.className = 'sprite-toolbar';

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'Search Sprites…';
  searchInput.value = filters.search;
  searchInput.className = 'sprite-search';
  searchInput.oninput = () => { filters.search = searchInput.value; renderChecklist(); };
  toolbar.appendChild(searchInput);

  toolbar.appendChild(makeSelect('sprite-filter-select', filters.rarity, [
    ['all', 'All rarities'], ...RARITIES.map((r) => [r, RARITY_LABELS[r]]),
  ], (v) => { filters.rarity = v; renderChecklist(); }));

  toolbar.appendChild(makeSelect('sprite-filter-select', filters.variant, [
    ['all', 'All variants'], ...VARIANT_TYPES.map((v) => [v, v]),
  ], (v) => { filters.variant = v; renderChecklist(); }));

  toolbar.appendChild(makeSelect('sprite-filter-select', filters.sort, [
    ['species', 'Sort: Species'], ['alpha', 'Sort: A-Z'], ['rarity', 'Sort: Rarity'], ['completion', 'Sort: Least complete first'],
  ], (v) => { filters.sort = v; renderChecklist(); }));

  const viewGroup = document.createElement('div');
  viewGroup.className = 'sprite-view-group';
  [['all', 'All'], ['owned', 'Owned'], ['missing', 'Missing'], ['needsMastery', 'Needs Mastery'], ['mastered', 'Mastered']].forEach(([value, label]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sprite-view-btn' + (filters.view === value ? ' active' : '');
    btn.textContent = label;
    btn.onclick = () => { filters.view = value; renderChecklist(); };
    viewGroup.appendChild(btn);
  });
  toolbar.appendChild(viewGroup);

  wrap.appendChild(toolbar);

  // ---- Filtering ----
  const q = filters.search.trim().toLowerCase();
  const filtered = CATALOG.filter((sprite) => {
    if (filters.rarity !== 'all' && sprite.rarity !== filters.rarity) return false;
    if (filters.variant !== 'all' && sprite.variant !== filters.variant) return false;
    if (q && !sprite.species.toLowerCase().includes(q)) return false;

    const s = state[sprite.id] || { owned: false, mastered: false };
    if (filters.view === 'owned' && !s.owned) return false;
    if (filters.view === 'missing' && s.owned) return false;
    if (filters.view === 'mastered' && !s.mastered) return false;
    if (filters.view === 'needsMastery' && !(s.owned && !s.mastered)) return false;
    return true;
  });

  // ---- Group by species, then sort groups ----
  const bySpecies = new Map();
  for (const sprite of filtered) {
    if (!bySpecies.has(sprite.species)) bySpecies.set(sprite.species, []);
    bySpecies.get(sprite.species).push(sprite);
  }

  let groups = [...bySpecies.entries()];
  const rarityRank = (r) => RARITIES.indexOf(r);
  const completionOf = (variants) => variants.filter((v) => state[v.id]?.owned).length / variants.length;

  if (filters.sort === 'alpha') groups.sort((a, b) => a[0].localeCompare(b[0]));
  else if (filters.sort === 'rarity') groups.sort((a, b) => rarityRank(a[1][0].rarity) - rarityRank(b[1][0].rarity) || a[0].localeCompare(b[0]));
  else if (filters.sort === 'completion') groups.sort((a, b) => completionOf(a[1]) - completionOf(b[1]) || a[0].localeCompare(b[0]));
  // 'species' = catalog's natural order (already grouped in definition order)

  const list = document.createElement('div');
  list.className = 'sprite-species-list';

  if (!groups.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `<div class="glyph">\u{1f50d}</div><div>No Sprites match this filter.</div>`;
    list.appendChild(empty);
  }

  for (const [species, variants] of groups) {
    const rarity = variants[0].rarity;
    const speciesOwned = variants.filter((v) => state[v.id]?.owned).length;

    const group = document.createElement('div');
    group.className = `sprite-species rarity-${rarity}`;

    const header = document.createElement('div');
    header.className = 'sprite-species-header';
    header.innerHTML = `
      <span class="dot"></span>
      <span class="sprite-species-name">${species}</span>
      <span class="sprite-species-count">${speciesOwned}/${variants.length}</span>
    `;
    group.appendChild(header);

    const ability = document.createElement('p');
    ability.className = 'sprite-species-ability';
    ability.textContent = variants[0].ability;
    group.appendChild(ability);

    const chips = document.createElement('div');
    chips.className = 'sprite-chip-row';
    variants.forEach((sprite) => {
      const s = state[sprite.id] || { owned: false, mastered: false };
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'sprite-chip' + (s.mastered ? ' mastered' : s.owned ? ' owned' : '');
      chip.title = s.mastered ? 'Mastered — tap to reset' : s.owned ? 'Owned — tap to mark Mastered' : 'Tap to mark Owned';

      if (sprite.icon) {
        const thumb = document.createElement('div');
        thumb.className = 'sprite-chip-thumb';
        const img = document.createElement('img');
        img.src = sprite.icon;
        img.alt = '';
        img.loading = 'lazy';
        img.onerror = () => { thumb.remove(); chip.classList.add('no-icon'); };
        thumb.appendChild(img);
        chip.appendChild(thumb);
      } else {
        chip.classList.add('no-icon');
      }

      const label = document.createElement('span');
      label.className = 'sprite-chip-label';
      label.textContent = `${s.mastered ? '★ ' : s.owned ? '✓ ' : ''}${sprite.variant}`;
      chip.appendChild(label);

      chip.onclick = () => toggleSprite(sprite.id);
      chips.appendChild(chip);
    });
    group.appendChild(chips);

    list.appendChild(group);
  }

  wrap.appendChild(list);
  checklistViewEl.appendChild(wrap);
}

function makeSelect(className, value, options, onChange) {
  const select = document.createElement('select');
  select.className = className;
  options.forEach(([v, label]) => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = label;
    if (v === value) opt.selected = true;
    select.appendChild(opt);
  });
  select.onchange = () => onChange(select.value);
  return select;
}

// ================= Dashboard view =================

function bar(label, completed, total, color) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const row = document.createElement('div');
  row.className = 'mastery-bar-row';
  const fillStyle = color ? `background:${color};box-shadow:0 0 8px ${color}55` : '';
  row.innerHTML = `
    <div class="mastery-bar-label">
      <span>${label}</span>
      <span class="mastery-bar-count">${completed}/${total} <span class="mastery-bar-pct">· ${pct}%</span></span>
    </div>
    <div class="mastery-bar-track"><div class="mastery-bar-fill" style="width:${pct}%;${fillStyle}"></div></div>
  `;
  return row;
}

function renderTimelineChart(points) {
  const wrap = document.createElement('div');
  wrap.className = 'timeline-chart';

  if (points.length < 2) {
    wrap.innerHTML = `<div class="empty-state small"><div class="glyph">\u{1f4c8}</div><div>Check off a few Sprites to see your progress over time here.</div></div>`;
    return wrap;
  }

  const W = 640, H = 200, PAD = 28;
  const maxY = Math.max(...points.map((p) => p.owned), 1);
  const t0 = new Date(points[0].at).getTime();
  const t1 = new Date(points[points.length - 1].at).getTime();
  const span = Math.max(t1 - t0, 1);

  const x = (i) => PAD + ((new Date(points[i].at).getTime() - t0) / span) * (W - PAD * 2);
  const y = (v) => H - PAD - (v / maxY) * (H - PAD * 2);

  const ownedPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.owned).toFixed(1)}`).join(' ');
  const masteredPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.mastered).toFixed(1)}`).join(' ');

  // Close paths down to baseline for area fill
  const xFirst = x(0).toFixed(1), xLast = x(points.length - 1).toFixed(1), yBase = (H - PAD).toFixed(1);
  const ownedFill    = `${ownedPath} L ${xLast} ${yBase} L ${xFirst} ${yBase} Z`;
  const masteredFill = `${masteredPath} L ${xLast} ${yBase} L ${xFirst} ${yBase} Z`;

  // Horizontal grid lines at 25 / 50 / 75% of maxY
  const gridLines = [0.25, 0.5, 0.75].map(pct => {
    const yPos = y(maxY * pct).toFixed(1);
    return `<line x1="${PAD}" y1="${yPos}" x2="${W - PAD}" y2="${yPos}" class="timeline-grid"/>`;
  }).join('');

  // Endpoint dots
  const last = points.length - 1;
  const ownedDot    = `<circle cx="${x(last).toFixed(1)}" cy="${y(points[last].owned).toFixed(1)}" r="4.5" class="timeline-dot timeline-dot-owned"/>`;
  const masteredDot = `<circle cx="${x(last).toFixed(1)}" cy="${y(points[last].mastered).toFixed(1)}" r="4.5" class="timeline-dot timeline-dot-mastered"/>`;

  wrap.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="timeline-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad-owned" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#22d3ee" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="grad-mastered" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#ffd95a" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#ffd95a" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${gridLines}
      <line x1="${PAD}" y1="${H - PAD}" x2="${W - PAD}" y2="${H - PAD}" class="timeline-axis"/>
      <path d="${ownedFill}"    fill="url(#grad-owned)"    stroke="none"/>
      <path d="${masteredFill}" fill="url(#grad-mastered)" stroke="none"/>
      <path d="${ownedPath}"    class="timeline-line owned"    fill="none"/>
      <path d="${masteredPath}" class="timeline-line mastered" fill="none"/>
      ${ownedDot}${masteredDot}
    </svg>
    <div class="timeline-legend">
      <span><i class="swatch owned"></i>Collected</span>
      <span><i class="swatch mastered"></i>Mastered</span>
      <span class="timeline-range">${new Date(points[0].at).toLocaleDateString()} → ${new Date(points[points.length - 1].at).toLocaleDateString()}</span>
    </div>
  `;
  return wrap;
}

function renderDashboard() {
  dashboardViewEl.innerHTML = '';
  const state = SpriteStore.getCurrentState();
  const wrap = document.createElement('div');
  wrap.className = 'sprite-wrap dashboard-wrap';

  const ownedCount = CATALOG.filter((s) => state[s.id]?.owned).length;
  const masteredCount = CATALOG.filter((s) => state[s.id]?.mastered).length;

  wrap.appendChild(buildStatHeadline(ownedCount, masteredCount));

  // ---- Progress over time ----
  const section1 = document.createElement('section');
  section1.className = 'dashboard-section';
  section1.innerHTML = `<h2 class="dashboard-h2">Progress over time</h2>`;
  section1.appendChild(renderTimelineChart(SpriteStore.getTimeline()));
  wrap.appendChild(section1);

  const grid2 = document.createElement('div');
  grid2.className = 'dashboard-grid';

  // ---- By rarity ----
  const RARITY_COLORS = { rare: '#4fa8ff', epic: '#c46bff', legendary: '#ff9f43', mythic: '#ffd95a' };
  const rarityCard = document.createElement('div');
  rarityCard.className = 'dashboard-card';
  rarityCard.innerHTML = `<h2 class="dashboard-h2">By rarity</h2>`;
  RARITIES.forEach((r) => {
    const inRarity = CATALOG.filter((s) => s.rarity === r);
    rarityCard.appendChild(bar(RARITY_LABELS[r], inRarity.filter((s) => state[s.id]?.owned).length, inRarity.length, RARITY_COLORS[r]));
  });
  grid2.appendChild(rarityCard);

  // ---- By variant type ----
  const variantCard = document.createElement('div');
  variantCard.className = 'dashboard-card';
  variantCard.innerHTML = `<h2 class="dashboard-h2">By variant</h2>`;
  VARIANT_TYPES.forEach((v) => {
    const inVariant = CATALOG.filter((s) => s.variant === v);
    if (!inVariant.length) return;
    variantCard.appendChild(bar(v, inVariant.filter((s) => state[s.id]?.owned).length, inVariant.length));
  });
  grid2.appendChild(variantCard);

  wrap.appendChild(grid2);

  // ---- Species leaderboard ----
  const speciesSection = document.createElement('section');
  speciesSection.className = 'dashboard-section';
  speciesSection.innerHTML = `<h2 class="dashboard-h2">By species</h2>`;
  const bySpecies = new Map();
  for (const sprite of CATALOG) {
    if (!bySpecies.has(sprite.species)) bySpecies.set(sprite.species, []);
    bySpecies.get(sprite.species).push(sprite);
  }
  const speciesRows = [...bySpecies.entries()]
    .map(([species, variants]) => ({
      species,
      owned: variants.filter((v) => state[v.id]?.owned).length,
      total: variants.length,
    }))
    .sort((a, b) => (b.owned / b.total) - (a.owned / a.total) || a.species.localeCompare(b.species));
  const speciesList = document.createElement('div');
  speciesList.className = 'species-leaderboard';
  speciesRows.forEach((row) => speciesList.appendChild(bar(row.species, row.owned, row.total)));
  speciesSection.appendChild(speciesList);
  wrap.appendChild(speciesSection);

  // ---- Recent activity ----
  const activitySection = document.createElement('section');
  activitySection.className = 'dashboard-section';
  activitySection.innerHTML = `<h2 class="dashboard-h2">Recent activity</h2>`;
  const activity = SpriteStore.getRecentActivity(15);
  if (!activity.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state small';
    empty.innerHTML = `<div class="glyph">\u{1f4cb}</div><div>Nothing tracked yet — head to the Checklist tab to get started.</div>`;
    activitySection.appendChild(empty);
  } else {
    const feed = document.createElement('div');
    feed.className = 'activity-feed';
    activity.forEach((ev) => {
      const sprite = CATALOG.find((s) => s.id === ev.id);
      const row = document.createElement('div');
      row.className = 'activity-row';
      row.innerHTML = `
        <span class="activity-label activity-${ev.mastered ? 'mastered' : ev.owned ? 'owned' : 'reset'}">${ev.label}</span>
        <span class="activity-name">${sprite ? `${sprite.variant} ${sprite.species}` : ev.id}</span>
        <span class="activity-time">${relativeTime(ev.at)}</span>
      `;
      feed.appendChild(row);
    });
    activitySection.appendChild(feed);
  }
  wrap.appendChild(activitySection);

  dashboardViewEl.appendChild(wrap);
}

function render() {
  if (currentView === 'checklist') renderChecklist();
  else renderDashboard();
}

render();

// ================= Sync modal =================

const syncBtn         = el('syncBtn');
const syncCodeChip    = el('syncCodeChip');
const syncModal       = el('syncModal');
const syncCloseBtn    = el('syncCloseBtn');
const syncCodeDisplay = el('syncCodeDisplay');
const syncCopyBtn     = el('syncCopyBtn');
const syncCodeInput   = el('syncCodeInput');
const syncConnectBtn  = el('syncConnectBtn');
const usernameInput   = el('usernameInput');
const usernameSaveBtn = el('usernameSaveBtn');

const USERNAME_KEY = 'sprite-tracker:username';

function getUsername() {
  return localStorage.getItem(USERNAME_KEY) || null;
}

function setUsername(name) {
  const trimmed = name.trim().slice(0, 32);
  if (trimmed) {
    localStorage.setItem(USERNAME_KEY, trimmed);
  } else {
    localStorage.removeItem(USERNAME_KEY);
  }
  return trimmed;
}

function updateHeaderChip() {
  const username = getUsername();
  const code = SpriteStore.getRecoveryCode();
  syncCodeChip.textContent = username || code || '···';
}

function updateCodeDisplays(code) {
  if (!code) return;
  syncCodeDisplay.textContent = code;
  updateHeaderChip();
}

function openSyncModal() {
  syncCodeDisplay.textContent = SpriteStore.getRecoveryCode() || 'connecting…';
  usernameInput.value = getUsername() || '';
  syncCodeInput.value = '';
  syncModal.hidden = false;
}

usernameSaveBtn.addEventListener('click', () => {
  const saved = setUsername(usernameInput.value);
  updateHeaderChip();
  showToast(saved ? `Display name set to "${saved}"` : 'Display name cleared');
});

usernameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') usernameSaveBtn.click();
});

syncBtn.addEventListener('click', openSyncModal);
syncCloseBtn.addEventListener('click', () => { syncModal.hidden = true; });
syncModal.addEventListener('click', (e) => { if (e.target === syncModal) syncModal.hidden = true; });

syncCopyBtn.addEventListener('click', () => {
  const code = SpriteStore.getRecoveryCode();
  if (!code) return;
  navigator.clipboard.writeText(code)
    .then(() => showToast('Sync code copied'))
    .catch(() => showToast('Copy failed — select and copy the code manually', 'error'));
});

syncConnectBtn.addEventListener('click', async () => {
  const code = syncCodeInput.value.trim();
  if (!code) return;
  syncConnectBtn.disabled = true;
  syncConnectBtn.textContent = 'Connecting…';
  const result = await SpriteStore.connectDevice(code);
  syncConnectBtn.disabled = false;
  syncConnectBtn.textContent = 'Connect';
  if (result.ok) {
    syncModal.hidden = true;
    updateCodeDisplays(SpriteStore.getRecoveryCode());
    render();
    showToast('Connected — checklist loaded from the other device');
  } else {
    showToast(result.error, 'error');
  }
});

// Show code/username immediately if we already have it (returning visitor), then sync.
updateHeaderChip();
updateCodeDisplays(SpriteStore.getRecoveryCode());
SpriteStore.init().then(({ changed }) => {
  if (changed) render();
  updateCodeDisplays(SpriteStore.getRecoveryCode());
});
