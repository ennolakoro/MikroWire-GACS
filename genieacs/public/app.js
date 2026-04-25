
/** NOC Intelligence v11.0 - THE V-DOM HYBRID (Absolute Stability) **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
      --mw-card: #161b22; --mw-border: #30363d; --mw-text: #c9d1d9;
      --mw-glow: 0 0 15px rgba(0, 255, 136, 0.4);
    }

    /* 1. GLOBAL UI RESET */
    body, html { background-color: var(--mw-bg) !important; color: var(--mw-text) !important; }
    
    #mw-hud {
      position: sticky; top: 0; z-index: 1000000; background: #0a0c10;
      padding: 10px 20px; border-bottom: 1px solid var(--mw-border);
      box-shadow: 0 10px 40px rgba(0,0,0,0.9);
    }

    .mw-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 10px; }
    .mw-stat-pill { 
      background: var(--mw-card); padding: 10px; border-radius: 8px; 
      border-left: 3px solid var(--mw-primary); border-top: 1px solid var(--mw-border);
    }
    .mw-stat-label { font-size: 9px; color: var(--mw-secondary); text-transform: uppercase; font-weight: 800; }
    .mw-stat-value { font-size: 12px; font-family: monospace; color: #fff; margin-top: 4px; }

    .mw-tabs { display: flex; gap: 4px; }
    .mw-btn {
      background: #1c2128; border: 1px solid var(--mw-border); color: #8b949e;
      padding: 10px 22px; cursor: pointer; border-radius: 6px 6px 0 0;
      font-weight: 800; font-size: 11px; text-transform: uppercase; transition: 0.2s;
    }
    .mw-btn.active { background: var(--mw-primary) !important; color: #000 !important; border-bottom: 3px solid var(--mw-secondary) !important; box-shadow: var(--mw-glow); }

    /* 2. ENGINE VISIBILITY (Mithril-Safe) */
    /* Secara default sembunyikan semua elemen di halaman device */
    body[data-mw-route="device"] .device-page > *, 
    body[data-mw-route="device"] .container-fluid > * { display: none !important; }

    /* Hanya tampilkan HUD dan elemen yang sesuai dengan Tab Aktif */
    body[data-mw-route="device"] #mw-hud { display: block !important; }
    
    body[data-mw-tab="NETWORK"] [data-mw-group="NETWORK"],
    body[data-mw-tab="WIRELESS"] [data-mw-group="WIRELESS"],
    body[data-mw-tab="SYSTEM"] [data-mw-group="SYSTEM"] { 
      display: block !important; 
    }

    /* 3. TABLE & COMPONENT STYLING */
    table { width: 100% !important; border-radius: 12px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); margin: 15px 0 !important; }
    th { background: #0d1117 !important; color: var(--mw-primary) !important; padding: 12px !important; text-transform: uppercase; font-size: 10px; border-bottom: 1px solid var(--mw-border) !important; }
    td { padding: 12px 15px !important; border-bottom: 1px solid var(--mw-border) !important; font-size: 13px; color: #e6edf3; }
    tr:hover td { background: rgba(0, 255, 136, 0.03); }

    /* CLEANUP JUNK */
    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults { display: none !important; }
  `;

  if (!document.getElementById('mw-v11-styles')) {
    const s = document.createElement('style'); s.id='mw-v11-styles'; s.innerHTML = css; document.head.appendChild(s);
  }

  let activeTab = 'NETWORK';

  function orchestrate() {
    const isDevicePage = location.hash.includes('/devices/');
    document.body.setAttribute('data-mw-route', isDevicePage ? 'device' : 'other');
    if (!isDevicePage) return;

    const container = document.querySelector('.device-page') || document.querySelector('.container-fluid');
    if (!container) return;

    // 1. Ensure HUD Existence
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
        btn.onclick = () => {
          activeTab = t;
          document.querySelectorAll('.mw-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.body.setAttribute('data-mw-tab', t);
        };
        hud.querySelector('#mw-tab-bar').appendChild(btn);
      });
      document.body.setAttribute('data-mw-tab', activeTab);
    }

    // 2. Intelligence Tagging (Non-Destructive)
    let currentGroup = 'SYSTEM';
    const statsGrid = hud.querySelector('#mw-stats');
    const groups = {
      'NETWORK': ['WAN', 'IP', 'PPP', 'VLAN'],
      'WIRELESS': ['WIFI', 'SSID', 'WLAN', 'CONNECTED']
    };

    Array.from(container.children).forEach(el => {
      if (el.id === 'mw-hud') return;
      
      const text = (el.innerText || "").trim();
      
      // Extract Summary Data to HUD
      if (text.includes(':') && el.tagName !== 'TABLE' && el.childNodes.length < 5) {
        const parts = text.split(':');
        const id = 'stat-' + parts[0].trim().replace(/\s+/g, '-');
        let statItem = document.getElementById(id);
        if (!statItem) {
          statItem = document.createElement('div'); statItem.id = id; statItem.className = 'mw-stat-pill';
          statsGrid.appendChild(statItem);
        }
        statItem.innerHTML = `<div class="mw-stat-label">${parts[0].trim()}</div><div class="mw-stat-value">${parts[1].trim()}</div>`;
        return;
      }

      // Identify Groups based on H3
      if (el.tagName === 'H3') {
        const hText = text.toUpperCase();
        currentGroup = 'SYSTEM';
        for(let g in groups) { if(groups[g].some(k => hText.includes(k))) { currentGroup = g; break; } }
      }

      // Assign Group Attribute for CSS Filtering
      el.setAttribute('data-mw-group', currentGroup);
    });
  }

  // Passive Monitoring (Every 1s to sync real-time data)
  setInterval(orchestrate, 1000);
})();
