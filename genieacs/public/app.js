
/** NOC Intelligence v6.6 - ZERO-BLANK & ELITE THEME **/
(function() {
  const css = `
    :root {
      --mw-primary: #f2eddf; 
      --mw-secondary: #d1c8b1; 
      --mw-bg: #0a0c10;
      --mw-card: #161b22; 
      --mw-border: #30363d;
      --mw-text: #f2eddf;
      --mw-highlight: rgba(242, 237, 223, 0.15);
    }

    /* 1. GLOBAL & RESET */
    html, body, #page, .container-fluid, .device-page { 
      background-color: var(--mw-bg) !important; color: var(--mw-text) !important; 
      font-family: 'Inter', sans-serif !important;
    }

    /* 2. ELITE TAB BAR (Warna Request: #f2eddf) */
    .mw-tabs-container {
      display: flex; gap: 4px; margin: 0 0 25px 0; padding: 10px;
      background: #111; border-bottom: 2px solid var(--mw-border);
      position: sticky; top: 0; z-index: 99999;
    }
    .mw-tab-btn {
      background: transparent; border: none; color: #8b949e; padding: 12px 25px;
      cursor: pointer; border-radius: 6px 6px 0 0; font-weight: 800; font-size: 11px;
      text-transform: uppercase; letter-spacing: 1.5px; transition: 0.3s;
    }
    .mw-tab-btn:hover { color: var(--mw-primary); background: var(--mw-highlight); }
    
    /* Active Tab Style sesuai Request */
    .mw-tab-btn.active {
      background-color: #f2eddf !important; 
      color: #0a0c10 !important;
      border-bottom: 3px solid #d1c8b1 !important;
      box-shadow: 0 5px 15px rgba(242, 237, 223, 0.2);
    }

    /* 3. CONTENT AREA */
    .mw-tab-content { display: none; width: 100% !important; padding: 15px; animation: mwFade 0.4s ease-out; }
    .mw-tab-content.active { display: block !important; }
    @keyframes mwFade { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    /* 4. LUXURY STATS & TABLES */
    .mw-grid-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 20px; }
    .mw-info-item { background: #161b22; padding: 12px; border-radius: 8px; border: 1px solid var(--mw-border); border-left: 4px solid var(--mw-primary); }
    .mw-info-label { font-size: 9px; color: var(--mw-secondary); text-transform: uppercase; }
    .mw-info-value { font-size: 13px; font-family: monospace; color: #fff; margin-top: 4px; }

    table { width: 100% !important; border-radius: 10px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); }
    th { background: #0d1117 !important; color: var(--mw-primary) !important; padding: 12px !important; font-size: 10px !important; text-transform: uppercase; }
    td { padding: 10px 14px !important; border-bottom: 1px solid var(--mw-border) !important; font-size: 12px !important; transition: 0.2s; }
    tr:hover td { background: var(--mw-highlight) !important; border-bottom: 1px solid var(--mw-primary) !important; }

    /* HIDE TRASH */
    .mw-hidden { display: none !important; }
    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults { display: none !important; }
  `;

  const s = document.createElement('style'); s.innerHTML = css; document.head.appendChild(s);

  function transform() {
    if (!location.hash.includes('/devices/')) return;
    if (document.querySelector('.mw-tabs-container')) return;

    const mainArea = document.querySelector('.container-fluid') || document.querySelector('.device-page') || document.body;
    
    // Cleaner: Hindari manipulasi element yang bisa memicu 'Blank Page'
    const headers = Array.from(mainArea.querySelectorAll('h3')).filter(h => h.innerText.trim() !== "");
    if (headers.length === 0) return;

    const tabs = {
      'DASHBOARD': { icon: '📊', content: document.createElement('div'), keywords: [] },
      'NETWORK': { icon: '🌐', content: document.createElement('div'), keywords: ['WAN', 'IP', 'PPP', 'VLAN'] },
      'WIRELESS': { icon: '📡', content: document.createElement('div'), keywords: ['WIFI', 'SSID', 'WLAN', 'CONNECTED'] },
      'SYSTEM': { icon: '⚙️', content: document.createElement('div'), keywords: ['OUI', 'PRODUCT', 'HARDWARE', 'SOFTWARE'] }
    };

    // 1. Dashboard Grid (Summary)
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
      }
      curr = next;
    }
    tabs['DASHBOARD'].content.appendChild(grid);

    // 2. Map Elements safely
    headers.forEach(h => {
      const text = h.innerText.toUpperCase();
      if (text.includes('FAULT') || text.includes('ALL PARAMETER') || text.includes('SETTING')) {
        h.style.display = 'none';
        return;
      }
      let targetKey = 'SYSTEM';
      for (const key in tabs) {
        if (tabs[key].keywords.some(k => text.includes(k))) { targetKey = key; break; }
      }
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `<div style="color:var(--mw-primary);font-size:11px;font-weight:bold;margin:20px 0 8px 0;text-transform:uppercase;">❯ ${h.innerText.replace('Summon','').trim()}</div>`;
      let n = h.nextElementSibling;
      while (n && n.tagName !== 'H3') {
        let tmp = n.nextElementSibling;
        wrapper.appendChild(n.cloneNode(true)); // Gunakan cloneNode untuk kestabilan SPA
        n.style.display = 'none';
        n = tmp;
      }
      tabs[targetKey].content.appendChild(wrapper);
      h.style.display = 'none';
    });

    // 3. Render Tabs
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
