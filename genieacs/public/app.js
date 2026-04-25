
/** NOC Intelligence v10.0 - THE V-DOM GHOST (Final Enterprise) **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
      --mw-card: rgba(22, 27, 34, 0.95); --mw-border: #30363d; --mw-text: #e6edf3;
      --mw-glow: 0 0 15px rgba(0, 255, 136, 0.4);
    }

    /* 1. LAYOUT RESET */
    body, html { background-color: var(--mw-bg) !important; color: var(--mw-text) !important; overflow-x: hidden; }
    
    #mw-hud {
      position: sticky; top: 0; z-index: 1000000; background: rgba(10, 12, 16, 0.9);
      backdrop-filter: blur(15px); border-bottom: 1px solid var(--mw-border);
      padding: 10px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    }

    .mw-stat-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; }
    .mw-stat-pill { 
      background: var(--mw-card); padding: 8px 15px; border-radius: 8px; 
      border-left: 3px solid var(--mw-primary); flex: 1; min-width: 150px;
    }
    .mw-stat-label { font-size: 9px; color: var(--mw-secondary); text-transform: uppercase; font-weight: 800; }
    .mw-stat-value { font-size: 12px; font-family: monospace; color: #fff; margin-top: 3px; }

    .mw-tab-row { display: flex; gap: 5px; }
    .mw-btn {
      background: #1c2128; border: 1px solid var(--mw-border); color: #8b949e;
      padding: 10px 20px; cursor: pointer; border-radius: 6px 6px 0 0;
      font-weight: 800; font-size: 11px; text-transform: uppercase; transition: 0.2s;
    }
    .mw-btn.active { background: var(--mw-primary) !important; color: #000 !important; border-color: transparent; box-shadow: var(--mw-glow); }

    /* 2. VISIBILITY LOGIC (Zero-Crash) */
    .mw-force-hide { display: none !important; }
    
    /* 3. TABLE ENHANCEMENT */
    table { width: 100% !important; border-radius: 12px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); margin: 15px 0 !important; }
    th { background: #0d1117 !important; color: var(--mw-primary) !important; padding: 12px !important; text-transform: uppercase; font-size: 10px; }
    td { padding: 12px 15px !important; border-bottom: 1px solid var(--mw-border) !important; font-size: 13px; color: #fff; }
    tr:hover td { background: rgba(0, 255, 136, 0.05); }

    /* Hide Original Junk */
    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults { display: none !important; }
  `;

  if (!document.getElementById('mw-v10-styles')) {
    const s = document.createElement('style'); s.id='mw-v10-styles'; s.innerHTML = css; document.head.appendChild(s);
  }

  let activeTab = 'NETWORK';

  function refreshUI() {
    if (!location.hash.includes('/devices/')) {
      const hud = document.getElementById('mw-hud');
      if (hud) hud.remove();
      return;
    }

    const container = document.querySelector('.device-page') || document.querySelector('.container-fluid');
    if (!container) return;

    // A. Create/Update HUD
    let hud = document.getElementById('mw-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'mw-hud';
      hud.innerHTML = `<div class="mw-stat-row" id="mw-stat-grid"></div><div class="mw-tab-row" id="mw-tab-bar"></div>`;
      document.body.prepend(hud);

      ['NETWORK', 'WIRELESS', 'SYSTEM'].forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'mw-btn' + (t === activeTab ? ' active' : '');
        btn.innerText = t;
        btn.onclick = () => {
          activeTab = t;
          document.querySelectorAll('.mw-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          refreshUI();
        };
        hud.querySelector('#mw-tab-bar').appendChild(btn);
      });
    }

    // B. Grouping & Sanitization Engine
    const statsGrid = hud.querySelector('#mw-stat-grid');
    const headers = Array.from(container.querySelectorAll('h3'));
    
    const groups = {
      'NETWORK': ['WAN', 'IP', 'PPP', 'VLAN'],
      'WIRELESS': ['WIFI', 'SSID', 'WLAN', 'CONNECTED'],
      'SYSTEM': []
    };

    const trash = ["FaultsChannel", "Parameter Setting", "Summary", "All parameters", "No faults"];

    // 1. Process Executive Stats
    container.querySelectorAll('div, span').forEach(el => {
      const text = (el.innerText || "").trim();
      if (text.includes(':') && el.tagName !== 'TABLE' && el.childNodes.length < 5) {
        const parts = text.split(':');
        const statId = 'stat-' + parts[0].trim().replace(/\s+/g, '-');
        let statPill = document.getElementById(statId);
        if (!statPill) {
          statPill = document.createElement('div');
          statPill.id = statId;
          statPill.className = 'mw-stat-pill';
          statsGrid.appendChild(statPill);
        }
        statPill.innerHTML = `<div class="mw-stat-label">${parts[0].trim()}</div><div class="mw-stat-value">${parts[1].trim()}</div>`;
        el.classList.add('mw-force-hide');
      }
      
      if (trash.some(t => text.includes(t))) el.classList.add('mw-force-hide');
    });

    // 2. Tab Section Visibility
    let currentSectionGroup = 'NETWORK';
    Array.from(container.children).forEach(child => {
      if (child.id === 'mw-hud') return;
      if (child.classList.contains('mw-force-hide')) return;

      if (child.tagName === 'H3') {
        const hText = child.innerText.toUpperCase();
        currentSectionGroup = 'SYSTEM';
        for(let g in groups) { if(groups[g].some(k => hText.includes(k))) { currentSectionGroup = g; break; } }
        child.classList.add('mw-force-hide'); // Hide original header
      }

      if (currentSectionGroup === activeTab) {
        child.classList.remove('mw-force-hide');
      } else {
        child.classList.add('mw-force-hide');
      }
    });
  }

  // Use passive high-frequency monitoring for real-time Mithril sync
  setInterval(refreshUI, 1000);
})();
