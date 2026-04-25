
/** NOC Intelligence v6.5 - LUXURY TECH EDITION **/
(function() {
  const css = `
    :root {
      --mw-primary: #f2eddf; 
      --mw-secondary: #d1c8b1; 
      --mw-bg: #0a0c10;
      --mw-card: rgba(22, 27, 34, 0.98); 
      --mw-border: #30363d;
      --mw-text: #f2eddf; 
      --mw-glow: 0 0 15px rgba(242, 237, 223, 0.3);
      --mw-highlight: rgba(242, 237, 223, 0.1);
    }

    /* 1. TOTAL SANITIZATION */
    html, body, #page, .container-fluid, .device-page { 
      background-color: var(--mw-bg) !important; color: var(--mw-text) !important; 
      font-family: 'Inter', sans-serif !important;
    }
    
    /* Hapus header sampah dan teks mengambang */
    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults,
    h3:contains("Summary"), h3:contains("Faults"), h3:contains("Parameter") { 
      display: none !important; 
    }

    /* 2. COMPACT TAB BAR */
    .mw-tabs-container {
      display: flex; gap: 4px; margin: 0 0 20px 0; padding: 6px;
      background: #161b22; border-bottom: 1px solid var(--mw-border);
      position: sticky; top: 0; z-index: 99999;
    }
    .mw-tab-btn {
      background: transparent; border: none; color: #8b949e; padding: 10px 20px;
      cursor: pointer; border-radius: 4px; font-weight: 700; font-size: 10px;
      text-transform: uppercase; letter-spacing: 1.5px; transition: 0.3s;
    }
    .mw-tab-btn:hover { color: var(--mw-primary); background: var(--mw-highlight); }
    .mw-tab-btn.active {
      background: var(--mw-primary); color: #000;
      box-shadow: var(--mw-glow);
    }

    /* 3. CONTENT AREAS */
    .mw-tab-content { display: none; width: 100% !important; padding: 10px; animation: mwFade 0.4s ease; }
    .mw-tab-content.active { display: block !important; }
    @keyframes mwFade { from { opacity: 0; } to { opacity: 1; } }

    /* 4. COMPACT TABLES & GRIDS (LUXURY STYLE) */
    .mw-grid-info {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px; margin-bottom: 20px;
    }
    .mw-info-item { 
      background: #0d1117; padding: 12px; border-radius: 8px; 
      border: 1px solid var(--mw-border); 
      border-left: 3px solid var(--mw-primary);
    }
    .mw-info-label { font-size: 9px; color: var(--mw-secondary); text-transform: uppercase; letter-spacing: 1px; }
    .mw-info-value { font-size: 13px; font-family: 'JetBrains Mono', monospace; color: #fff; margin-top: 4px; }

    table { width: 100% !important; border-radius: 8px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); }
    th { background: #0d1117 !important; color: var(--mw-primary) !important; padding: 12px !important; font-size: 10px !important; text-transform: uppercase; letter-spacing: 1px; }
    td { padding: 10px 14px !important; border-bottom: 1px solid var(--mw-border) !important; font-size: 12px !important; transition: 0.2s; }
    
    /* Highlight Row saat disorot */
    tr:hover td { 
      background: var(--mw-highlight) !important; 
      color: #fff !important;
      border-bottom: 1px solid var(--mw-primary) !important;
    }
    
    .mw-hidden { display: none !important; }
    .mw-sub-header { color: var(--mw-primary); font-size: 11px; font-weight: bold; margin: 20px 0 8px 0; text-transform: uppercase; letter-spacing: 1px; }
  `;

  if (!document.getElementById('mw-luxury-style')) {
    const s = document.createElement('style'); s.id='mw-luxury-style'; s.innerHTML = css; document.head.appendChild(s);
  }

  function transform() {
    if (!location.hash.includes('/devices/')) return;
    if (document.querySelector('.mw-tabs-container')) return;

    const mainArea = document.querySelector('.container-fluid') || document.querySelector('.device-page') || document.body;
    
    // Total Sanitization
    const trashText = ["FaultsChannel", "CodeMessage", "DetailRetries", "TimestampNo faults", "Parameter Setting"];
    mainArea.querySelectorAll('*').forEach(el => {
      trashText.forEach(t => { if(el.innerText && el.innerText.includes(t)) el.style.display = 'none'; });
    });

    const headers = Array.from(mainArea.querySelectorAll('h3')).filter(h => h.offsetParent !== null);
    if (headers.length === 0) return;

    const tabs = {
      'DASHBOARD': { icon: '📊', content: document.createElement('div'), keywords: [] },
      'NETWORK': { icon: '🌐', content: document.createElement('div'), keywords: ['WAN', 'IP', 'PPP', 'VLAN'] },
      'WIRELESS': { icon: '📡', content: document.createElement('div'), keywords: ['WIFI', 'SSID', 'WLAN', 'CONNECTED'] },
      'SYSTEM': { icon: '⚙️', content: document.createElement('div'), keywords: ['OUI', 'PRODUCT', 'HARDWARE', 'SOFTWARE'] }
    };

    // 1. Dashboard Grid
    const grid = document.createElement('div');
    grid.className = 'mw-grid-info';
    let curr = mainArea.firstChild;
    while (curr && curr !== headers[0]) {
      let next = curr.nextSibling;
      if (curr.nodeType === 1 && curr.innerText.includes(':')) {
        const parts = curr.innerText.split(':');
        const item = document.createElement('div');
        item.className = 'mw-info-item';
        item.innerHTML = `<div class="mw-info-label">${parts[0].trim()}</div><div class="mw-info-value">${parts[1].trim()}</div>`;
        grid.appendChild(item);
        curr.style.display = 'none';
      } else if (curr.nodeType === 3 && curr.textContent.trim()) {
        curr.textContent = '';
      }
      curr = next;
    }
    tabs['DASHBOARD'].content.appendChild(grid);

    // 2. Map Groups
    headers.forEach(h => {
      const text = h.innerText.toUpperCase();
      if (text.includes('FAULT') || text.includes('ALL PARAMETER') || text.includes('SETTING') || text.includes('SUMMARY')) {
        h.style.display = 'none';
        return;
      }

      let targetKey = 'SYSTEM';
      for (const key in tabs) {
        if (tabs[key].keywords.some(k => text.includes(k))) { targetKey = key; break; }
      }

      const subWrapper = document.createElement('div');
      subWrapper.innerHTML = `<div class="mw-sub-header">❯ ${h.innerText.replace('Summon','').trim()}</div>`;
      
      let n = h.nextElementSibling;
      let hasContent = false;
      while (n && n.tagName !== 'H3') {
        let tmp = n.nextElementSibling;
        if (n.innerText && n.innerText.trim() !== "") {
            subWrapper.appendChild(n);
            hasContent = true;
        }
        n = tmp;
      }
      if (hasContent) tabs[targetKey].content.appendChild(subWrapper);
      h.style.display = 'none';
    });

    // 3. Build Tab Bar
    const tabBar = document.createElement('div');
    tabBar.className = 'mw-tabs-container';
    
    Object.keys(tabs).forEach((key, idx) => {
      const tab = tabs[key];
      if (tab.content.childNodes.length === 0) return;
      tab.content.className = 'mw-tab-content' + (idx === 0 ? ' active' : '');
      const btn = document.createElement('button');
      btn.className = 'mw-tab-btn' + (idx === 0 ? ' active' : '');
      btn.innerHTML = `${tab.icon} ${key}`;
      btn.onclick = () => {
        tabBar.querySelectorAll('.mw-tab-btn').forEach(b => b.classList.remove('active'));
        mainArea.querySelectorAll('.mw-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        tab.content.classList.add('active');
      };
      tabBar.appendChild(btn);
      mainArea.appendChild(tab.content);
    });

    mainArea.prepend(tabBar);
  }

  setInterval(transform, 1000);
})();
