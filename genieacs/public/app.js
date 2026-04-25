
/** NOC Intelligence v6.7 - THE ARCHITECT (Real-Time Sync) **/
(function() {
  const css = `
    :root {
      --mw-primary: #f2eddf; 
      --mw-secondary: #d1c8b1; 
      --mw-bg: #0a0c10;
      --mw-card: #161b22; 
      --mw-border: #30363d;
    }

    /* 1. GLOBAL UI RESET */
    html, body, #page, .container-fluid, .device-page { 
      background-color: var(--mw-bg) !important; color: var(--mw-primary) !important; 
    }

    /* 2. ELITE TAB BAR */
    .mw-tabs-container {
      display: flex; gap: 4px; margin-bottom: 20px; padding: 10px;
      background: #111; border-bottom: 2px solid var(--mw-border);
      position: sticky; top: 0; z-index: 99999;
    }
    .mw-tab-btn {
      background: transparent; border: none; color: #8b949e; padding: 12px 25px;
      cursor: pointer; border-radius: 6px 6px 0 0; font-weight: 800; font-size: 11px;
      text-transform: uppercase; letter-spacing: 1.5px; transition: 0.3s;
    }
    .mw-tab-btn.active {
      background-color: #f2eddf !important; color: #0a0c10 !important;
      border-bottom: 3px solid var(--mw-secondary) !important;
    }

    /* 3. REAL-TIME HIDING LOGIC (Zero-Blank) */
    .mw-tab-content-hidden { display: none !important; }
    
    /* 4. EXECUTIVE STATS GRID */
    .mw-grid-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 25px; }
    .mw-info-item { background: #161b22; padding: 15px; border-radius: 8px; border: 1px solid var(--mw-border); border-left: 4px solid var(--mw-primary); }
    .mw-info-label { font-size: 9px; color: var(--mw-secondary); text-transform: uppercase; font-weight: bold; }
    .mw-info-value { font-size: 13px; font-family: monospace; color: #fff; margin-top: 5px; }

    /* 5. TABLE STYLING */
    table { width: 100% !important; border-radius: 10px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); margin: 10px 0; }
    th { background: #0d1117 !important; color: var(--mw-primary) !important; padding: 12px !important; font-size: 11px; text-transform: uppercase; }
    td { padding: 12px 15px !important; border-bottom: 1px solid var(--mw-border) !important; transition: 0.2s; }
    tr:hover td { background: rgba(242, 237, 223, 0.1); border-bottom: 1px solid var(--mw-primary) !important; }

    /* 6. SANITIZATION */
    .trash-hidden { display: none !important; }
    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults { display: none !important; }
  `;

  if (!document.getElementById('mw-architect-style')) {
    const s = document.createElement('style'); s.id='mw-architect-style'; s.innerHTML = css; document.head.appendChild(s);
  }

  function transform() {
    if (!location.hash.includes('/devices/')) return;
    const main = document.querySelector('.container-fluid') || document.querySelector('.device-page') || document.body;
    if (document.querySelector('.mw-tabs-container') || !main) return;

    const headers = Array.from(main.querySelectorAll('h3')).filter(h => h.innerText.trim() !== "");
    if (headers.length === 0) return;

    // A. Executive Info Extraction (Summary)
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

    // B. Grouping Logic
    const groups = {
      'DASHBOARD': [],
      'NETWORK': ['WAN', 'IP', 'PPP', 'VLAN'],
      'WIRELESS': ['WIFI', 'SSID', 'WLAN', 'CONNECTED'],
      'SYSTEM': []
    };

    headers.forEach(h => {
      const text = h.innerText.toUpperCase();
      if (text.includes('FAULT') || text.includes('PARAMETER') || text.includes('SUMMARY')) {
        h.classList.add('trash-hidden');
        let next = h.nextElementSibling;
        while(next && next.tagName !== 'H3') { next.classList.add('trash-hidden'); next = next.nextElementSibling; }
        return;
      }

      let group = 'SYSTEM';
      for(let key in groups) { if(groups[key].some(k => text.includes(k))) { group = key; break; } }
      
      h.setAttribute('data-mw-group', group);
      let next = h.nextElementSibling;
      while(next && next.tagName !== 'H3') {
        next.setAttribute('data-mw-group', group);
        next = next.nextElementSibling;
      }
    });

    // C. Create Tab Bar
    const tabBar = document.createElement('div');
    tabBar.className = 'mw-tabs-container';
    ['DASHBOARD', 'NETWORK', 'WIRELESS', 'SYSTEM'].forEach((name, i) => {
      const btn = document.createElement('button');
      btn.className = 'mw-tab-btn' + (i === 0 ? ' active' : '');
      btn.innerText = name;
      btn.onclick = () => {
        tabBar.querySelectorAll('.mw-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show/Hide based on group
        main.querySelectorAll('[data-mw-group]').forEach(el => {
          if (el.getAttribute('data-mw-group') === name) el.classList.remove('mw-tab-content-hidden');
          else el.classList.add('mw-tab-content-hidden');
        });
        
        // Special Dashboard case
        if (name === 'DASHBOARD') grid.style.display = 'grid';
        else grid.style.display = 'none';
      };
      tabBar.appendChild(btn);
    });

    main.prepend(tabBar);
    main.prepend(grid);
    
    // Trigger first tab
    tabBar.querySelector('.mw-tab-btn').click();
  }

  setInterval(transform, 1000);
})();
