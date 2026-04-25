
/** NOC Intelligence v6.2 - EXECUTIVE EDITION (Final Polish) **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
      --mw-card: rgba(22, 27, 34, 0.95); --mw-border: #30363d;
      --mw-text: #e6edf3; --mw-glow: 0 0 15px rgba(0, 255, 136, 0.4);
    }

    /* 1. GLOBAL CLEANUP & EXECUTIVE BAR */
    html, body, #page, .container-fluid, .device-page { 
      background-color: var(--mw-bg) !important; color: var(--mw-text) !important; 
      font-family: 'Inter', sans-serif !important;
    }
    
    .mw-executive-bar {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px; padding: 15px; background: #161b22; border: 1px solid var(--mw-border);
      border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }

    .mw-stat-box { border-left: 3px solid var(--mw-primary); padding-left: 12px; }
    .mw-stat-label { font-size: 10px; color: var(--mw-secondary); text-transform: uppercase; font-weight: bold; }
    .mw-stat-value { font-size: 13px; font-family: 'JetBrains Mono', monospace; color: #fff; margin-top: 4px; }

    /* Hide Messy Headers */
    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults, h3:contains("Summary"), h3:contains("Parameter") { 
      display: none !important; 
    }

    /* 2. HORIZONTAL TABS SYSTEM */
    .mw-tabs-container {
      display: flex; gap: 8px; margin-bottom: 25px; padding: 6px;
      background: #0d1117; border-radius: 10px; border: 1px solid var(--mw-border);
    }
    .mw-tab-btn {
      background: transparent; border: none; color: #8b949e; padding: 10px 20px;
      cursor: pointer; border-radius: 6px; font-weight: 700; font-size: 11px;
      text-transform: uppercase; transition: 0.2s; outline: none;
    }
    .mw-tab-btn.active {
      background: linear-gradient(135deg, var(--mw-primary), var(--mw-secondary));
      color: #000; box-shadow: var(--mw-glow);
    }

    /* 3. CONTENT AREA */
    .mw-tab-content { display: none; width: 100% !important; animation: mwFade 0.3s ease-in; }
    .mw-tab-content.active { display: block !important; }
    @keyframes mwFade { from { opacity: 0; } to { opacity: 1; } }

    table { width: 100% !important; border-radius: 8px !important; border: 1px solid var(--mw-border) !important; background: var(--mw-card) !important; overflow: hidden; }
    th { background: #1c2128 !important; color: var(--mw-secondary) !important; padding: 12px !important; font-size: 10px !important; text-transform: uppercase; }
    td { padding: 10px 12px !important; border-bottom: 1px solid var(--mw-border) !important; font-size: 12px !important; }
    
    .mw-hidden { display: none !important; }
  `;

  const s = document.createElement('style'); s.innerHTML = css; document.head.appendChild(s);

  function transform() {
    if (!location.hash.includes('/devices/')) return;
    if (document.querySelector('.mw-tabs-container')) return;

    const mainArea = document.querySelector('.container-fluid') || document.querySelector('.device-page') || document.body;
    
    // Hard Cleanup for "FaultsChannel..."
    mainArea.querySelectorAll('div, span, h3').forEach(el => {
      if (el.innerText.includes('FaultsChannel') || el.innerText === "Parameter Setting" || el.innerText === "Summary") {
        el.style.display = 'none';
      }
    });

    const headers = Array.from(mainArea.querySelectorAll('h3')).filter(h => h.offsetParent !== null);
    if (headers.length === 0) return;

    // 1. Create Executive Bar for Summary Info
    const execBar = document.createElement('div');
    execBar.className = 'mw-executive-bar';
    
    let curr = mainArea.firstChild;
    while (curr && curr !== headers[0]) {
      let next = curr.nextSibling;
      if (curr.nodeType === 1 && curr.innerText.includes(':')) {
        const parts = curr.innerText.split(':');
        const box = document.createElement('div');
        box.className = 'mw-stat-box';
        box.innerHTML = `<div class="mw-stat-label">${parts[0].trim()}</div><div class="mw-stat-value">${parts[1].trim()}</div>`;
        execBar.appendChild(box);
        curr.style.display = 'none';
      } else if (curr.nodeType === 3 && curr.textContent.trim()) {
         curr.textContent = ''; // Clear stray text
      }
      curr = next;
    }

    // 2. Map sections to logical Tabs
    const tabs = {
      'NETWORK (WAN/IP)': { icon: '🌐', content: document.createElement('div'), keywords: ['WAN', 'IP', 'PPP', 'VLAN'] },
      'WIRELESS (WIFI)': { icon: '📡', content: document.createElement('div'), keywords: ['WIFI', 'SSID', 'WLAN', 'CONNECTED'] },
      'SYSTEM / LAN': { icon: '⚙️', content: document.createElement('div'), keywords: [] }
    };

    headers.forEach(h => {
      const text = h.innerText.toUpperCase();
      if (text.includes('FAULT') || text.includes('ALL PARAMETER') || text.includes('SUMMARY')) {
        h.classList.add('mw-hidden');
        return;
      }

      let targetKey = 'SYSTEM / LAN';
      for (const key in tabs) {
        if (tabs[key].keywords.some(k => text.includes(k))) {
          targetKey = key;
          break;
        }
      }

      const wrapper = document.createElement('div');
      wrapper.style.marginBottom = '25px';
      wrapper.innerHTML = `<div style="color:var(--mw-primary);font-size:11px;font-weight:bold;margin-bottom:8px">❯ ${h.innerText.replace('Summon','').trim()}</div>`;
      
      let n = h.nextElementSibling;
      while (n && n.tagName !== 'H3') {
        let tmp = n.nextElementSibling;
        wrapper.appendChild(n);
        n = tmp;
      }
      tabs[targetKey].content.appendChild(wrapper);
      h.classList.add('mw-hidden');
    });

    // 3. Render
    const tabBar = document.createElement('div');
    tabBar.className = 'mw-tabs-container';
    
    Object.keys(tabs).forEach((key, idx) => {
      const tab = tabs[key];
      if (tab.content.childNodes.length === 0) return;
      tab.content.className = 'mw-tab-content' + (idx === 0 ? ' active' : '');
      const btn = document.createElement('button');
      btn.className = 'mw-tab-btn' + (idx === 0 ? ' active' : '');
      btn.innerHTML = `<span>${tab.icon}</span> ${key}`;
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
    mainArea.prepend(execBar);
  }

  setInterval(transform, 1000);
})();
