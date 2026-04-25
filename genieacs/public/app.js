
/** NOC Intelligence v16.0 - RESPONSIVE ELITE EDIT (UX Edition) **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
      --mw-card: #161b22; --mw-border: #30363d; --mw-text: #c9d1d9;
      --mw-error: #ff4444; --mw-success: #00ff88;
    }

    /* 1. SEAMLESS UI & NAVIGATION */
    header, nav, .navbar, #nav, .navigation, .top-bar { background-color: var(--mw-bg) !important; border-bottom: 1px solid var(--mw-border) !important; background-image: none !important; }
    nav a, .nav-link { color: #8b949e !important; font-weight: 600 !important; text-transform: uppercase !important; font-size: 11px !important; letter-spacing: 1px !important; }
    nav a.active, .nav-link.active { color: var(--mw-primary) !important; text-shadow: 0 0 10px rgba(0, 255, 136, 0.5) !important; border-bottom: 2px solid var(--mw-primary) !important; }

    /* 2. RESPONSIVE INPUTS (Edit Mode) */
    input, select, textarea {
      background-color: #0d1117 !important; border: 1px solid var(--mw-border) !important;
      color: #fff !important; padding: 12px 15px !important; border-radius: 8px !important;
      font-size: 14px !important; width: 100% !important; max-width: 400px !important;
      transition: 0.3s !important; outline: none !important;
    }
    input:focus { border-color: var(--mw-primary) !important; box-shadow: 0 0 10px rgba(0, 255, 136, 0.3) !important; }
    
    /* Edit Pencilling Icons */
    .edit-icon, [class*="edit"] { filter: hue-rotate(90deg) brightness(1.5); cursor: pointer; }

    /* 3. QUANTUM ACTION BUTTONS (Commit/Discard) */
    .commit-button, button.commit, button.save, .btn-primary {
      background: linear-gradient(135deg, var(--mw-success), #00cc6a) !important;
      color: #000 !important; font-weight: 900 !important; text-transform: uppercase !important;
      padding: 15px 30px !important; border-radius: 12px !important; border: none !important;
      box-shadow: 0 5px 20px rgba(0, 255, 136, 0.4) !important; position: fixed !important;
      bottom: 30px; right: 30px; z-index: 10000000 !important; cursor: pointer;
    }

    button.discard, button.cancel, .btn-secondary {
      background: #1c2128 !important; color: #8b949e !important;
      padding: 15px 25px !important; border-radius: 12px !important; border: 1px solid var(--mw-border) !important;
      position: fixed !important; bottom: 30px; right: 180px; z-index: 10000000 !important;
    }
    button:hover { transform: scale(1.05); }

    /* 4. EXECUTIVE HUD (Responsive Grid) */
    #mw-hud { position: sticky; top: 0; z-index: 1000000; background: #0a0c10; padding: 10px 20px; border-bottom: 1px solid var(--mw-border); box-shadow: 0 10px 40px rgba(0,0,0,0.9); }
    .mw-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin-bottom: 10px; }
    .mw-pill { background: var(--mw-card); padding: 8px 12px; border-radius: 8px; border-left: 4px solid var(--mw-primary); border-top: 1px solid var(--mw-border); }
    .mw-pill-label { font-size: 8.5px; color: var(--mw-secondary); text-transform: uppercase; font-weight: 800; }
    .mw-pill-value { font-size: 11.5px; font-family: monospace; color: #fff; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* 5. VISIBILITY ENGINE */
    body[data-mw-route="device"] .device-page > *:not(.alert):not(.fault):not(.error):not(#mw-hud):not(#faults),
    body[data-mw-route="device"] .container-fluid > *:not(.alert):not(.fault):not(.error):not(#mw-hud):not(#faults) { display: none !important; }
    body[data-mw-tab="NETWORK"] [data-mw-group="NETWORK"],
    body[data-mw-tab="WIRELESS"] [data-mw-group="WIRELESS"],
    body[data-mw-tab="SYSTEM"] [data-mw-group="SYSTEM"] { display: block !important; }

    table { width: 100% !important; border-radius: 12px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); margin: 15px 0 !important; }
    th { background: #0d1117 !important; color: var(--mw-primary) !important; padding: 12px !important; text-transform: uppercase; font-size: 10px; }
    td { padding: 12px 16px !important; border-bottom: 1px solid var(--mw-border) !important; font-size: 13px; }

    /* MOBILE ADJUSTMENTS */
    @media (max-width: 768px) {
      .mw-tabs { overflow-x: auto; padding-bottom: 5px; }
      .mw-btn { padding: 8px 15px; font-size: 9px; }
      button.discard { right: 160px; padding: 12px 20px; font-size: 12px; }
      .commit-button { padding: 12px 20px; font-size: 12px; }
    }
    
    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults, .mw-trash { display: none !important; }
  `;

  if (!document.getElementById('mw-elite-edit-styles')) {
    const s = document.createElement('style'); s.id='mw-elite-edit-styles'; s.innerHTML = css; document.head.appendChild(s);
  }

  let activeTab = 'NETWORK';

  function sync() {
    const isDevice = location.hash.includes('/devices/');
    document.body.setAttribute('data-mw-route', isDevice ? 'device' : 'other');
    if (!isDevice) return;

    const container = document.querySelector('.device-page') || document.querySelector('.container-fluid');
    if (!container) return;

    let hud = document.getElementById('mw-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'mw-hud';
      hud.innerHTML = `<div class="mw-stat-grid" id="mw-stats"></div><div class="mw-tabs" id="mw-tab-bar"></div>`;
      document.body.prepend(hud);
      ['NETWORK', 'WIRELESS', 'SYSTEM'].forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'mw-btn' + (t === activeTab ? ' active' : '');
        btn.innerText = t;
        btn.onclick = () => { activeTab = t; document.querySelectorAll('.mw-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); document.body.setAttribute('data-mw-tab', t); };
        hud.querySelector('#mw-tab-bar').appendChild(btn);
      });
      document.body.setAttribute('data-mw-tab', activeTab);
    }

    const stats = hud.querySelector('#mw-stats');
    let currentG = 'SYSTEM';
    const groupMap = { 'NETWORK': ['WAN', 'IP', 'PPP', 'VLAN'], 'WIRELESS': ['WIFI', 'SSID', 'WLAN', 'CONNECTED'] };

    Array.from(container.children).forEach(el => {
      if (el.id === 'mw-hud' || el.classList.contains('alert') || el.classList.contains('fault')) return;
      const txt = (el.innerText || "").trim();
      if (txt.includes(':') && el.tagName !== 'TABLE' && el.childNodes.length < 6) {
        const p = txt.split(':');
        const label = p[0].trim();
        const id = 'stat-' + label.replace(/\s+/g, '-');
        let item = document.getElementById(id);
        if (!item) { item = document.createElement('div'); item.id = id; item.className = 'mw-pill'; stats.appendChild(item); }
        let val = p[1].trim();
        const isOffline = el.querySelector('.offline') || (label === 'Last Inform' && el.innerText.includes('off') && !el.innerText.includes('on'));
        let valClass = isOffline ? 'mw-pill-value offline' : 'mw-pill-value';
        item.innerHTML = `<div class="mw-pill-label">${label}</div><div class="${valClass}">${val}</div>`;
        el.classList.add('mw-trash');
        return;
      }
      if (el.tagName === 'H3') {
        currentG = 'SYSTEM';
        for(let g in groupMap) { if(groupMap[g].some(k => txt.toUpperCase().includes(k))) { currentG = g; break; } }
      }
      el.setAttribute('data-mw-group', currentG);
    });
  }

  const observer = new MutationObserver(() => sync());
  observer.observe(document.body, { childList: true, subtree: true });
  setInterval(sync, 1000);
})();
