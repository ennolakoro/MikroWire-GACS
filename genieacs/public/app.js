
/** NOC Intelligence v18.0 - THE FINAL ABSOLUTE (Senior Masterpiece) **/
(function() {
  const css = `
    :root {
      --mw-bg: #0a0c10; --mw-card: #161b22; --mw-border: #30363d;
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-text: #c9d1d9;
      --mw-error: #ff4444; --mw-success: #00ff88;
    }

    /* 1. TOTAL FORCE DARK MODE - NO MORE CREAM/GRAY */
    *, *:before, *:after { box-sizing: border-box; }
    html, body, #page, .container-fluid, .device-page, .well, .panel, .panel-body, .list-group-item, .login-page, .login-content { 
      background-color: var(--mw-bg) !important; color: var(--mw-text) !important; border-color: var(--mw-border) !important;
      background-image: none !important;
    }
    
    header, nav, .navbar, .top-bar, #nav, .navigation { 
      background: var(--mw-bg) !important; border-bottom: 1px solid var(--mw-border) !important; 
    }
    
    /* Nav Links Active Effect */
    nav a.active, .nav-link.active, .nav-item.active a { 
      color: var(--mw-primary) !important; text-shadow: 0 0 10px rgba(0,255,136,0.5) !important;
      border-bottom: 2px solid var(--mw-primary) !important;
    }

    /* 2. ELITE TAB & HUD HUD (Heads-Up Display) */
    #mw-hud { position: sticky; top: 0; z-index: 1000000; background: var(--mw-bg); padding: 10px 20px; border-bottom: 2px solid var(--mw-border); box-shadow: 0 10px 40px #000; }
    .mw-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 8px; margin-bottom: 10px; }
    .mw-pill { background: var(--mw-card); padding: 10px; border-radius: 8px; border-left: 4px solid var(--mw-primary); border-top: 1px solid var(--mw-border); }
    .mw-pill-label { font-size: 9px; color: var(--mw-secondary); text-transform: uppercase; font-weight: 800; }
    .mw-pill-value { font-size: 11.5px; font-family: monospace; color: #fff; margin-top: 3px; }
    .mw-pill-value.offline { color: var(--mw-error) !important; text-shadow: 0 0 10px var(--mw-error); }

    .mw-tabs { display: flex; gap: 4px; }
    .mw-btn { background: #21262d; border: 1px solid var(--mw-border); color: #8b949e; padding: 10px 24px; cursor: pointer; border-radius: 6px 6px 0 0; font-weight: 800; font-size: 11px; text-transform: uppercase; }
    .mw-btn.active { background: var(--mw-primary) !important; color: #000 !important; border-bottom: 3px solid var(--mw-secondary) !important; }

    /* 3. RESPONSIVE INPUTS & BUTTONS */
    input, select, textarea { background: #0d1117 !important; border: 1px solid var(--mw-border) !important; color: #fff !important; padding: 12px !important; border-radius: 8px !important; width: 100% !important; max-width: 400px !important; }
    .btn-primary, .commit-button { background: linear-gradient(135deg, var(--mw-success), #00cc6a) !important; color: #000 !important; font-weight: 900 !important; border: none !important; padding: 15px 30px !important; border-radius: 12px !important; cursor: pointer; box-shadow: 0 5px 20px rgba(0,255,136,0.3) !important; }

    /* 4. FAULT & NOTIFICATION OVERLAY */
    .alert, .fault, .error, .notification, .alert-danger { 
      display: block !important; position: fixed !important; top: 120px !important; left: 50%; transform: translateX(-50%);
      z-index: 9999999 !important; width: 90%; max-width: 750px; border: 2px solid var(--mw-error) !important;
      background: rgba(30, 5, 5, 0.95) !important; color: #fff !important; padding: 20px !important; border-radius: 12px;
      box-shadow: 0 0 50px rgba(255,0,0,0.5); backdrop-filter: blur(10px);
    }

    /* 5. VISIBILITY ENGINE (Anti-Blank) */
    body[data-mw-route="device"] .device-page > *:not(.alert):not(.fault):not(.error):not(#mw-hud):not(#faults),
    body[data-mw-route="device"] .container-fluid > *:not(.alert):not(.fault):not(.error):not(#mw-hud):not(#faults) { display: none !important; }
    body[data-mw-tab="NETWORK"] [data-mw-group="NETWORK"],
    body[data-mw-tab="WIRELESS"] [data-mw-group="WIRELESS"],
    body[data-mw-tab="SYSTEM"] [data-mw-group="SYSTEM"] { display: block !important; }

    table { width: 100% !important; border-radius: 12px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); margin: 15px 0 !important; }
    th { background: #0d1117 !important; color: var(--mw-primary) !important; padding: 14px !important; text-transform: uppercase; font-size: 10px; }
    td { padding: 12px 16px !important; border-bottom: 1px solid var(--mw-border) !important; font-size: 13px; }

    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults, .mw-trash { display: none !important; }
  `;

  if (!document.getElementById('mw-final-absolute-styles')) {
    const s = document.createElement('style'); s.id='mw-final-absolute-styles'; s.innerHTML = css; document.head.appendChild(s);
  }

  let activeTab = 'NETWORK';

  function sync() {
    if (!location.hash.includes('/devices/')) {
        document.body.removeAttribute('data-mw-route');
        const hud = document.getElementById('mw-hud'); if(hud) hud.remove();
        return;
    }
    document.body.setAttribute('data-mw-route', 'device');
    const container = document.querySelector('.device-page') || document.querySelector('.container-fluid');
    if (!container) return;

    let hud = document.getElementById('mw-hud');
    if (!hud) {
      hud = document.createElement('div'); hud.id = 'mw-hud';
      hud.innerHTML = `<div class="mw-stat-grid" id="mw-stats"></div><div class="mw-tabs" id="mw-tab-bar"></div>`;
      document.body.prepend(hud);
      ['NETWORK', 'WIRELESS', 'SYSTEM'].forEach(t => {
        const btn = document.createElement('button'); btn.className = 'mw-btn' + (t === activeTab ? ' active' : ''); btn.innerText = t;
        btn.onclick = () => { activeTab = t; document.querySelectorAll('.mw-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); document.body.setAttribute('data-mw-tab', t); };
        hud.querySelector('#mw-tab-bar').appendChild(btn);
      });
    }
    document.body.setAttribute('data-mw-tab', activeTab);

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
        const isOff = el.querySelector('.offline') || (label.includes('Inform') && txt.includes('off') && !txt.includes('on'));
        item.innerHTML = `<div class="mw-pill-label">${label}</div><div class="mw-pill-value ${isOff?'offline':''}">${p[1].trim()}</div>`;
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
