
/** NOC Intelligence v6.3 - PRO INTELLIGENCE (Final Polish) **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
      --mw-card: rgba(22, 27, 34, 0.98); --mw-border: #30363d;
      --mw-text: #e6edf3; --mw-glow: 0 0 20px rgba(0, 255, 136, 0.4);
      --mw-danger: #ff4444; --mw-warning: #ffbb33;
    }

    /* 1. EXECUTIVE DASHBOARD BAR */
    .mw-executive-bar {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px; padding: 18px; background: #161b22; border: 1px solid var(--mw-border);
      border-radius: 14px; margin-bottom: 25px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    }
    .mw-stat-box { border-left: 3px solid var(--mw-primary); padding-left: 15px; transition: 0.3s; }
    .mw-stat-box:hover { transform: translateX(5px); }
    .mw-stat-label { font-size: 10px; color: var(--mw-secondary); text-transform: uppercase; font-weight: 800; letter-spacing: 1px; }
    .mw-stat-value { font-size: 14px; font-family: 'JetBrains Mono', monospace; color: #fff; margin-top: 6px; font-weight: 500; }

    /* 2. TAB SYSTEM */
    .mw-tabs-container {
      display: flex; gap: 8px; margin-bottom: 30px; padding: 6px;
      background: rgba(1, 4, 9, 0.8); border-radius: 12px; border: 1px solid var(--mw-border);
      backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 9999;
    }
    .mw-tab-btn {
      background: transparent; border: none; color: #8b949e; padding: 12px 24px;
      cursor: pointer; border-radius: 8px; font-weight: 700; font-size: 11px;
      text-transform: uppercase; letter-spacing: 1.5px; transition: 0.3s;
    }
    .mw-tab-btn.active {
      background: linear-gradient(135deg, var(--mw-primary), var(--mw-secondary));
      color: #000; box-shadow: var(--mw-glow); transform: scale(1.02);
    }

    /* 3. TABLE INTELLIGENCE */
    table { width: 100% !important; border-collapse: separate !important; border-spacing: 0; border-radius: 12px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); }
    th { background: #0d1117 !important; color: var(--mw-secondary) !important; padding: 16px !important; font-size: 10.5px !important; text-transform: uppercase; border-bottom: 1px solid var(--mw-border) !important; }
    td { padding: 14px 16px !important; border-bottom: 1px solid var(--mw-border) !important; font-size: 13px !important; color: #c9d1d9; }
    tr:last-child td { border-bottom: none !important; }
    tr:hover td { background: rgba(255,255,255,0.03) !important; }

    /* 4. SIGNAL COLORS */
    .val-good { color: var(--mw-primary) !important; font-weight: bold; }
    .val-warn { color: var(--mw-warning) !important; font-weight: bold; }
    .val-crit { color: var(--mw-danger) !important; font-weight: bold; }

    .mw-hidden { display: none !important; }
    h3, .Parameter_Setting, .all-parameters, .device-faults { display: none !important; }
  `;

  if (!document.getElementById('mw-final-styles')) {
    const s = document.createElement('style'); s.id='mw-final-styles'; s.innerHTML = css; document.head.appendChild(s);
  }

  function transform() {
    if (!location.hash.includes('/devices/')) return;
    if (document.querySelector('.mw-tabs-container')) return;

    const mainArea = document.querySelector('.container-fluid') || document.querySelector('.device-page') || document.body;
    
    // Cleanup Junk
    const trash = ["FaultsChannel", "Parameter Setting", "Summary", "All parameters"];
    mainArea.querySelectorAll('div, span, h3').forEach(el => {
      if (trash.some(t => el.innerText.includes(t))) el.style.display = 'none';
    });

    const headers = Array.from(mainArea.querySelectorAll('h3')).filter(h => h.offsetParent !== null);
    if (headers.length === 0) return;

    // 1. Executive Bar
    const execBar = document.createElement('div');
    execBar.className = 'mw-executive-bar';
    let curr = mainArea.firstChild;
    while (curr && curr !== headers[0]) {
      let next = curr.nextSibling;
      if (curr.nodeType === 1 && curr.innerText.includes(':')) {
        const parts = curr.innerText.split(':');
        const box = document.createElement('div');
        box.className = 'mw-stat-box';
        let val = parts[1].trim();
        let valClass = "";
        
        // Signal Intelligence Logic
        if (parts[0].includes('Rx Power')) {
           const num = parseFloat(val);
           if (num > -25) valClass = "val-good";
           else if (num > -28) valClass = "val-warn";
           else valClass = "val-crit";
        }

        box.innerHTML = `<div class="mw-stat-label">${parts[0].trim()}</div><div class="mw-stat-value ${valClass}">${val}</div>`;
        execBar.appendChild(box);
        curr.style.display = 'none';
      }
      curr = next;
    }

    // 2. Tab Grouping
    const tabs = {
      'NETWORK': { icon: '🌐', content: document.createElement('div'), keywords: ['WAN', 'IP', 'PPP', 'VLAN'] },
      'WIRELESS': { icon: '📡', content: document.createElement('div'), keywords: ['WIFI', 'SSID', 'WLAN', 'CONNECTED'] },
      'SYSTEM': { icon: '⚙️', content: document.createElement('div'), keywords: [] }
    };

    headers.forEach(h => {
      const text = h.innerText.toUpperCase();
      if (trash.some(t => text.includes(t.toUpperCase()))) return;

      let targetKey = 'SYSTEM';
      for (const key in tabs) {
        if (tabs[key].keywords.some(k => text.includes(k))) { targetKey = key; break; }
      }

      const wrapper = document.createElement('div');
      wrapper.style.marginBottom = '30px';
      wrapper.innerHTML = `<div style="color:var(--mw-primary);font-size:11px;font-weight:bold;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">❯ ${h.innerText.replace('Summon','').trim()}</div>`;
      
      let n = h.nextElementSibling;
      let hasContent = false;
      while (n && n.tagName !== 'H3') {
        let tmp = n.nextElementSibling;
        if (n.innerText && n.innerText.trim() !== "") {
            wrapper.appendChild(n);
            hasContent = true;
        }
        n = tmp;
      }
      if (hasContent) tabs[targetKey].content.appendChild(wrapper);
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
