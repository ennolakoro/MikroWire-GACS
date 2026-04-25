
/** NOC Intelligence v6.8 - CYBER-ARCHITECT (Final NOC Theme) **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; 
      --mw-secondary: #00d4ff; 
      --mw-bg: #0a0c10;
      --mw-card: #161b22; 
      --mw-border: #30363d;
      --mw-text: #c9d1d9;
      --mw-glow: 0 0 20px rgba(0, 255, 136, 0.4);
    }

    /* 1. GLOBAL UI RESET */
    html, body, #page, .container-fluid, .device-page { 
      background-color: var(--mw-bg) !important; color: var(--mw-text) !important; 
      font-family: 'Inter', sans-serif !important;
    }

    /* 2. CYBER TAB BAR */
    .mw-tabs-container {
      display: flex; gap: 6px; margin-bottom: 25px; padding: 10px;
      background: rgba(1, 4, 9, 0.8); border-bottom: 2px solid var(--mw-border);
      position: sticky; top: 0; z-index: 99999; backdrop-filter: blur(10px);
    }
    .mw-tab-btn {
      background: transparent; border: none; color: #8b949e; padding: 12px 25px;
      cursor: pointer; border-radius: 8px 8px 0 0; font-weight: 800; font-size: 11px;
      text-transform: uppercase; letter-spacing: 1.5px; transition: 0.3s;
    }
    .mw-tab-btn:hover { color: var(--mw-primary); background: rgba(0, 255, 136, 0.05); }
    
    .mw-tab-btn.active {
      background-color: var(--mw-primary) !important; 
      color: #000 !important;
      box-shadow: var(--mw-glow);
      border-bottom: 3px solid var(--mw-secondary) !important;
    }

    /* 3. CONTENT LOGIC */
    .mw-tab-content-hidden { display: none !important; }
    
    /* 4. EXECUTIVE STATS GRID */
    .mw-grid-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 25px; }
    .mw-info-item { background: var(--mw-card); padding: 15px; border-radius: 10px; border: 1px solid var(--mw-border); border-left: 4px solid var(--mw-primary); transition: 0.3s; }
    .mw-info-item:hover { border-color: var(--mw-primary); transform: translateY(-3px); }
    .mw-info-label { font-size: 9px; color: var(--mw-secondary); text-transform: uppercase; font-weight: bold; }
    .mw-info-value { font-size: 13px; font-family: 'JetBrains Mono', monospace; color: #fff; margin-top: 5px; }

    /* 5. TABLES */
    table { width: 100% !important; border-radius: 12px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); margin: 10px 0; }
    th { background: #0d1117 !important; color: var(--mw-secondary) !important; padding: 14px !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    td { padding: 12px 16px !important; border-bottom: 1px solid var(--mw-border) !important; transition: 0.2s; font-size: 13px; }
    tr:hover td { background: rgba(0, 255, 136, 0.03) !important; color: #fff !important; }

    /* 6. SANITIZATION */
    .trash-hidden { display: none !important; }
    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults { display: none !important; }
  `;

  if (!document.getElementById('mw-cyber-style')) {
    const s = document.createElement('style'); s.id='mw-cyber-style'; s.innerHTML = css; document.head.appendChild(s);
  }

  function transform() {
    if (!location.hash.includes('/devices/')) return;
    const main = document.querySelector('.container-fluid') || document.querySelector('.device-page') || document.body;
    if (document.querySelector('.mw-tabs-container') || !main) return;

    const headers = Array.from(main.querySelectorAll('h3')).filter(h => h.innerText.trim() !== "");
    if (headers.length === 0) return;

    const grid = document.createElement('div');
    grid.className = 'mw-grid-info';
    let curr = main.firstChild;
    while (curr && curr !== headers[0]) {
      let next = curr.nextSibling;
      if (curr.nodeType === 1 && curr.innerText.includes(':')) {
        const parts = curr.innerText.split(':');
        const item = document.createElement('div');
        item.className = 'mw-info-item';
        item.innerHTML = `<div class="mw-info-label">${parts[0].trim()}</div><div class="mw-info-value">${parts[1].trim()}</div>`;
        grid.appendChild(item);
        curr.classList.add('trash-hidden');
      } else if (curr.nodeType === 3 && curr.textContent.trim()) {
        curr.textContent = '';
      }
      curr = next;
    }

    const groups = {
      'DASHBOARD': [],
      'NETWORK': ['WAN', 'IP', 'PPP', 'VLAN'],
      'WIRELESS': ['WIFI', 'SSID', 'WLAN', 'CONNECTED'],
      'SYSTEM': []
    };

    headers.forEach(h => {
      const text = h.innerText.toUpperCase();
      if (text.includes('FAULT') || text.includes('PARAMETER') || text.includes('SUMMARY') || text.includes('SETTING')) {
        h.classList.add('trash-hidden');
        let next = h.nextElementSibling;
        while(next && next.tagName !== 'H3') { next.classList.add('trash-hidden'); next = next.nextElementSibling; }
        return;
      }
      let group = 'SYSTEM';
      for(let key in groups) { if(groups[key].some(k => text.includes(k))) { group = key; break; } }
      h.setAttribute('data-mw-group', group);
      let next = h.nextElementSibling;
      while(next && next.tagName !== 'H3') { next.setAttribute('data-mw-group', group); next = next.nextElementSibling; }
    });

    const tabBar = document.createElement('div');
    tabBar.className = 'mw-tabs-container';
    ['DASHBOARD', 'NETWORK', 'WIRELESS', 'SYSTEM'].forEach((name, i) => {
      const btn = document.createElement('button');
      btn.className = 'mw-tab-btn' + (i === 0 ? ' active' : '');
      btn.innerText = name;
      btn.onclick = () => {
        tabBar.querySelectorAll('.mw-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        main.querySelectorAll('[data-mw-group]').forEach(el => {
          if (el.getAttribute('data-mw-group') === name) el.classList.remove('mw-tab-content-hidden');
          else el.classList.add('mw-tab-content-hidden');
        });
        grid.style.display = (name === 'DASHBOARD') ? 'grid' : 'none';
      };
      tabBar.appendChild(btn);
    });

    main.prepend(tabBar);
    main.prepend(grid);
    tabBar.querySelector('.mw-tab-btn').click();
  }

  setInterval(transform, 1000);
})();
