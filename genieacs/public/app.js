
/** NOC Intelligence v9.0 - THE V-DOM MASTER (Ultra-Stable) **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
      --mw-card: #161b22; --mw-border: #30363d; --mw-text: #c9d1d9;
    }

    /* 1. GLOBAL & PERSISTENT UI */
    html, body { background-color: var(--mw-bg) !important; color: var(--mw-text) !important; font-family: 'Inter', sans-serif !important; }
    
    #mw-hud-container {
      position: sticky; top: 0; z-index: 999999; background: #0a0c10;
      padding: 10px 20px; border-bottom: 1px solid var(--mw-border);
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    }

    .mw-tabs { display: flex; gap: 5px; margin-top: 10px; }
    .mw-tab-btn {
      background: #1c2128; border: 1px solid var(--mw-border); color: #8b949e;
      padding: 10px 20px; cursor: pointer; border-radius: 6px 6px 0 0;
      font-weight: 800; font-size: 11px; text-transform: uppercase; transition: 0.2s;
    }
    .mw-tab-btn.active { background: var(--mw-primary); color: #000; border-color: transparent; }

    .mw-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
    .mw-stat-item { background: var(--mw-card); padding: 10px; border-radius: 8px; border-left: 3px solid var(--mw-primary); }
    .mw-stat-label { font-size: 9px; color: var(--mw-secondary); text-transform: uppercase; font-weight: bold; }
    .mw-stat-value { font-size: 12px; font-family: monospace; color: #fff; margin-top: 3px; }

    /* 2. LOGIC FILTERING (Mithril Compatible) */
    /* Sembunyikan elemen asli yang sudah dipindah ke HUD */
    .mw-origin-hidden { display: none !important; }
    
    /* Sembunyikan trash text */
    .mw-trash { display: none !important; }

    /* Tab Filtering System */
    body[data-mw-tab="DASHBOARD"] .device-page > *:not([data-mw-group="DASHBOARD"]),
    body[data-mw-tab="NETWORK"] .device-page > *:not([data-mw-group="NETWORK"]),
    body[data-mw-tab="WIRELESS"] .device-page > *:not([data-mw-group="WIRELESS"]),
    body[data-mw-tab="SYSTEM"] .device-page > *:not([data-mw-group="SYSTEM"]) {
        display: none !important;
    }

    /* 3. TABLE STYLING */
    table { width: 100% !important; border-radius: 12px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); margin: 15px 0 !important; }
    th { background: #0d1117 !important; color: var(--mw-primary) !important; padding: 12px !important; text-transform: uppercase; font-size: 10px; }
    td { padding: 12px 15px !important; border-bottom: 1px solid var(--mw-border) !important; font-size: 13px; }
    tr:hover td { background: rgba(0, 255, 136, 0.03); }

    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters { display: none !important; }
  `;

  if (!document.getElementById('mw-v9-styles')) {
    const s = document.createElement('style'); s.id='mw-v9-styles'; s.innerHTML = css; document.head.appendChild(s);
  }

  let activeTab = 'DASHBOARD';

  function scanAndTag() {
    if (!location.hash.includes('/devices/')) {
        const hud = document.getElementById('mw-hud-container');
        if (hud) hud.remove();
        return;
    }

    const container = document.querySelector('.device-page') || document.querySelector('.container-fluid');
    if (!container) return;

    // 1. Create HUD if missing
    let hud = document.getElementById('mw-hud-container');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'mw-hud-container';
      hud.innerHTML = `<div class="mw-stats-grid" id="mw-stats"></div><div class="mw-tabs" id="mw-tab-bar"></div>`;
      document.body.prepend(hud);
      
      const tabBar = hud.querySelector('#mw-tab-bar');
      ['DASHBOARD', 'NETWORK', 'WIRELESS', 'SYSTEM'].forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'mw-tab-btn' + (t === activeTab ? ' active' : '');
        btn.innerText = t;
        btn.onclick = () => {
          activeTab = t;
          document.querySelectorAll('.mw-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.body.setAttribute('data-mw-tab', t);
        };
        tabBar.appendChild(btn);
      });
      document.body.setAttribute('data-mw-tab', activeTab);
    }

    // 2. Tagging Engine (Non-Destructive)
    let currentGroup = 'DASHBOARD';
    const statsGrid = hud.querySelector('#mw-stats');

    const groups = {
      'NETWORK': ['WAN', 'IP', 'PPP', 'VLAN'],
      'WIRELESS': ['WIFI', 'SSID', 'WLAN', 'CONNECTED'],
      'SYSTEM': []
    };

    const trash = ["FaultsChannel", "Parameter Setting", "Summary", "All parameters", "Faults"];

    Array.from(container.childNodes).forEach(el => {
      if (el.nodeType === 3) { // Text Node
        if (el.textContent.trim() === "") return;
        el.textContent = ""; // Hide raw floating text
        return;
      }
      
      if (el.nodeType !== 1) return; // Skip non-elements
      if (el.id === 'mw-hud-container') return;

      const text = el.innerText || "";
      
      // Handle Summary Extraction to HUD
      if (text.includes(':') && el.tagName !== 'TABLE' && el.childNodes.length < 5) {
        const parts = text.split(':');
        const id = 'stat-' + parts[0].trim().replace(/\s+/g, '-');
        let statItem = document.getElementById(id);
        if (!statItem) {
          statItem = document.createElement('div');
          statItem.id = id;
          statItem.className = 'mw-stat-item';
          statsGrid.appendChild(statItem);
        }
        statItem.innerHTML = `<div class="mw-stat-label">${parts[0].trim()}</div><div class="mw-stat-value">${parts[1].trim()}</div>`;
        el.classList.add('mw-origin-hidden');
        return;
      }

      // Handle Trash
      if (trash.some(t => text.includes(t))) {
        el.classList.add('mw-trash');
        return;
      }

      // Switch Group on H3
      if (el.tagName === 'H3') {
        currentGroup = 'SYSTEM';
        const hText = text.toUpperCase();
        for (let g in groups) {
          if (groups[g].some(k => hText.includes(k))) { currentGroup = g; break; }
        }
        el.style.display = 'none'; // Hide original H3, we use tabs
      }

      // Apply Group Tag
      el.setAttribute('data-mw-group', currentGroup);
    });
  }

  // Use passive monitoring to avoid Mithril conflicts
  setInterval(scanAndTag, 1000);
})();
