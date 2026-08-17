(function () {
  const TOUR_KEY = 'sprite-tracker:toured:v1';

  function hasSeen() { return localStorage.getItem(TOUR_KEY) === '1'; }
  function markSeen() { localStorage.setItem(TOUR_KEY, '1'); }

  function switchView(view) {
    const btn = document.querySelector(`[data-view="${view}"]`);
    if (btn) btn.click();
  }

  const STEPS = [
    {
      target: null,
      title: 'Welcome to Sprite Tracker!',
      body: 'Your personal Fortnite Sprite collection checklist. Let\'s walk through the key features — takes about 30 seconds.',
    },
    {
      before: () => switchView('checklist'),
      target: () => document.querySelector('.sprite-chip'),
      scroll: true,
      title: 'Tap to collect',
      body: 'Tap any Sprite once to mark it <strong>owned ✓</strong>, again for <strong>mastered ★</strong>, once more to clear. Progress saves instantly.',
    },
    {
      target: () => document.querySelector('.stat-card'),
      title: 'Progress rings',
      body: 'Tap a ring to filter the checklist — jump straight to what\'s <em>Missing</em> or <em>Needs Mastery</em>.',
    },
    {
      before: () => switchView('dashboard'),
      target: () => document.querySelector('[data-view="dashboard"]'),
      title: 'Dashboard',
      body: 'See your progress over time with charts, rarity breakdowns, and a recent activity feed.',
    },
    {
      before: () => switchView('compare'),
      target: () => document.querySelector('.compare-add-btn'),
      scroll: true,
      title: 'Compare with friends',
      body: 'Tap <strong>Add Friend</strong> and enter their sync code to see their collection side-by-side. Up to 4 friends at once.',
    },
    {
      before: () => switchView('checklist'),
      target: () => document.getElementById('syncBtn'),
      title: 'Your sync code',
      body: 'Save this code to access your checklist from any device — or share it with a friend so they can add you in Compare.',
    },
  ];

  let current = 0;
  let overlay, spotlight, tooltip, keyHandler;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    overlay.addEventListener('click', handleOverlayClick);

    spotlight = document.createElement('div');
    spotlight.className = 'tour-spotlight';

    tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip';

    document.body.append(overlay, spotlight, tooltip);
  }

  function showStep(i) {
    current = i;
    const step = STEPS[i];
    const isLast = i === STEPS.length - 1;

    if (step.before) step.before();

    tooltip.innerHTML = `
      <div class="tour-step-count">${i + 1} / ${STEPS.length}</div>
      <h3 class="tour-title">${step.title}</h3>
      <p class="tour-body">${step.body}</p>
      <div class="tour-actions">
        <button class="tour-skip">Skip tour</button>
        <button class="tour-next btn-primary">${isLast ? 'Done!' : 'Next →'}</button>
      </div>
    `;

    tooltip.querySelector('.tour-skip').addEventListener('click', end);
    tooltip.querySelector('.tour-next').addEventListener('click', next);

    const getTarget = step.target;

    if (getTarget) {
      overlay.style.background = 'transparent';
      const delay = step.scroll ? 420 : step.before ? 80 : 0;
      setTimeout(() => {
        const target = getTarget();
        if (!target) { positionTooltipCentered(); return; }
        if (step.scroll) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => positionOnTarget(getTarget()), step.scroll ? 420 : 0);
      }, delay);
    } else {
      overlay.style.background = 'rgba(0,0,0,0.65)';
      spotlight.style.cssText = 'top:-9999px;left:-9999px;width:0;height:0;border-radius:0;box-shadow:none;';
      positionTooltipCentered();
    }
  }

  function positionOnTarget(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pad = 10;

    spotlight.style.top         = (rect.top  - pad) + 'px';
    spotlight.style.left        = (rect.left - pad) + 'px';
    spotlight.style.width       = (rect.width  + pad * 2) + 'px';
    spotlight.style.height      = (rect.height + pad * 2) + 'px';
    spotlight.style.borderRadius = '14px';
    spotlight.style.boxShadow   = '0 0 0 9999px rgba(0,0,0,0.72)';

    positionTooltipNear(rect, pad);
  }

  function positionTooltipCentered() {
    tooltip.style.cssText = `
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: min(340px, calc(100vw - 32px));
    `;
  }

  function positionTooltipNear(rect, pad) {
    const tw    = 300;
    const thEst = 210;
    const vw    = window.innerWidth;
    const vh    = window.innerHeight;

    let top, left;

    if (rect.bottom + pad + thEst + 16 < vh) {
      top = rect.bottom + pad + 8;
    } else if (rect.top - pad - thEst - 8 > 0) {
      top = rect.top - pad - thEst - 8;
    } else {
      top = Math.max(8, rect.bottom + 8);
    }

    left = rect.left;
    left = Math.max(8, Math.min(left, vw - tw - 8));

    tooltip.style.cssText = `
      top: ${top}px;
      left: ${left}px;
      max-width: min(${tw}px, calc(100vw - 32px));
      transform: none;
    `;
  }

  function handleOverlayClick(e) {
    const step = STEPS[current];
    const target = step && step.target ? step.target() : null;
    if (!target) { next(); return; }
    const rect = target.getBoundingClientRect();
    const pad = 10;
    const inSpot = (
      e.clientX >= rect.left - pad && e.clientX <= rect.right  + pad &&
      e.clientY >= rect.top  - pad && e.clientY <= rect.bottom + pad
    );
    if (!inSpot) next();
  }

  function next() {
    if (current < STEPS.length - 1) {
      showStep(current + 1);
    } else {
      end();
    }
  }

  function end() {
    markSeen();
    overlay.remove();
    spotlight.remove();
    tooltip.remove();
    overlay = spotlight = tooltip = null;
    document.removeEventListener('keydown', keyHandler);
  }

  keyHandler = function (e) {
    if (!overlay) return;
    if (e.key === 'Escape') end();
    if (e.key === 'ArrowRight') next();
  };

  function launch() {
    if (overlay) return;
    current = 0;
    build();
    document.addEventListener('keydown', keyHandler);
    showStep(0);
  }

  window.startTour = launch;

  if (!hasSeen()) {
    setTimeout(launch, 900);
  }
})();
