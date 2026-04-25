
/** NOC Intelligence v7.0 - GHOST ENGINE (Ultra-Stability) **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
      --mw-card: #161b22; --mw-border: #30363d; --mw-text: #c9d1d9;
    }

    /* 1. FORCE GLOBAL DARK THEME */
    html, body, #page, .container-fluid, .device-page { 
      background-color: var(--mw-bg) !important; color: var(--mw-text) !important; 
      font-family: 'Inter', sans-serif !important; 
    }

    /* 2. TAB BAR (FIXED & MINIMAL) */
    .mw-tabs-container {
      display: flex; gap: 4px; margin: 0 0 20px 0; padding: 10px;
      background: #010409; border-bottom: 2px solid var(--mw-border);
      position: sticky; top: 0; z-index: 99999;
    }
    .mw-tab-btn {
      background: transparent; border: none; color: #8b949e; padding: 12px 20px;
      cursor: pointer; border-radius: 6px 6px 0 0; font-weight: 800; font-size: 11px;
      text-transform: uppercase; letter-spacing: 1.5px; transition: 0.2s;
    }
    .mw-tab-btn.active {
      background-color: var(--mw-primary) !important; color: #000 !important;
      border-bottom: 3px solid var(--mw-secondary) !important;
    }

    /* 3. VISIBILITY ENGINE */
    .mw-hide-section { display: none !important; }
    
    /* Executive Grid */
    .mw-grid-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 20px; }
    .mw-info-item { background: var(--mw-card); padding: 12px; border-radius: 8px; border: 1px solid var(--mw-border); border-left: 4px solid var(--mw-primary); }
    .mw-info-label { font-size: 9px; color: var(--mw-secondary); text-transform: uppercase; font-weight: bold; }
    .mw-info-value { font-size: 12px; font-family: monospace; color: #fff; margin-top: 4px; }

    /* Tables */
    table { width: 100% !important; border-radius: 10px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); margin: 10px 0; }
    th { background: #0d1117 !important; color: var(--mw-primary) !important; padding: 12px !important; font-size: 10px; text-transform: uppercase; }
    td { padding: 10px 14px !important; border-bottom: 1px solid var(--mw-border) !important; font-size: 12px; }
    tr:hover td { background: rgba(0, 255, 136, 0.05); }

    /* Sanitization */
    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults { display: none !important; }
  `;

  if (!document.getElementById('mw-ghost-styles')) {
    const s = document.createElement('style'); s.id='mw-ghost-styles'; s.innerHTML = css; document.head.appendChild(s);
  }

  let currentTab = 'DASHBOARD';

  function applyVisibility() {
    const main = document.querySelector('.container-fluid') || document.querySelector('.device-page');
    if (!main) return;

    const headers = Array.from(main.querySelectorAll('h3'));
    const firstH3 = headers[0];

    // 1. Handle Dashboard Info (Everything before first H3)
    const dashboardItems = document.querySelectorAll('.mw-info-item');
    if (currentTab === 'DASHBOARD') {
      dashboardItems.forEach(el => el.parentElement.classList.remove('mw-hide-section'));
    } else {
      dashboardItems.forEach(el => el.parentElement.classList.add('mw-hide-section'));
    }

    // 2. Handle Sections
    const groups = {
      'NETWORK': ['WAN', 'IP', 'PPP', 'VLAN'],
      'WIRELESS': ['WIFI', 'SSID', 'WLAN', 'CONNECTED'],
      'SYSTEM': []
    };

    headers.forEach(h => {
      const text = h.innerText.toUpperCase();
      let group = 'SYSTEM';
      for(let key in groups) { if(groups[key].some(k => text.includes(k))) { group = key; break; } }
      
      const shouldShow = (currentTab === group);
      const isTrash = text.includes('FAULT') || text.includes('PARAMETER') || text.includes('SUMMARY');

      if (isTrash) {
        h.classList.add('mw-hide-section');
        let next = h.nextElementSibling;
        while(next && next.tagName !== 'H3') { next.classList.add('mw-hide-section'); next = next.nextElementSibling; }
      } else {
        if (shouldShow) h.classList.remove('mw-hide-section'); else h.classList.add('mw-hide-section');
        let next = h.nextElementSibling;
        while(next && next.tagName !== 'H3') {
          if (shouldShow) next.classList.remove('mw-hide-section'); else next.classList.add('mw-hide-section');
          next = next.nextElementSibling;
        }
      }
    });
  }

  function init() {
    if (!location.hash.includes('/devices/')) return;
    if (document.querySelector('.mw-tabs-container')) return;

    const main = document.querySelector('.container-fluid') || document.querySelector('.device-page');
    if (!main) return;

    // Build Executive Stat Bar (Summary)
    const grid = document.createElement('div');
    grid.className = 'mw-grid-info';
    main.querySelectorAll('div, span').forEach(el => {
      if (el.innerText.includes(':') && el.childNodes.length < 5) {
        const parts = el.innerText.split(':');
        if (parts.length === 2) {
          const item = document.createElement('div');
          item.className = 'mw-info-item';
          item.innerHTML = `<div class="mw-info-label">${parts[0].trim()}</div><div class="mw-info-value">${parts[1].trim()}</div>`;
          grid.appendChild(item);
          el.style.display = 'none';
        }
      }
    });

    const tabBar = document.createElement('div');
    tabBar.className = 'mw-tabs-container';
    ['DASHBOARD', 'NETWORK', 'WIRELESS', 'SYSTEM'].forEach(name => {
      const btn = document.createElement('button');
      btn.className = 'mw-tab-btn' + (name === currentTab ? ' active' : '');
      btn.innerText = name;
      btn.onclick = () => {
        currentTab = name;
        document.querySelectorAll('.mw-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyVisibility();
      };
      tabBar.appendChild(btn);
    });

    main.prepend(tabBar);
    main.prepend(grid);
    applyVisibility();
  }

  // Monitor secara pasif agar tidak crash
  setInterval(() => {
    if (location.hash.includes('/devices/')) {
        if (!document.querySelector('.mw-tabs-container')) init();
        applyVisibility();
    }
  }, 1000);
})();
