
/** NOC Intelligence v6.1 - PRO-STABILITY EDITION **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
      --mw-card: #161b22; --mw-border: #30363d;
      --mw-text: #e6edf3; --mw-glow: 0 0 15px rgba(0, 255, 136, 0.4);
    }

    /* 1. GLOBAL UI CLEANUP */
    html, body, #page, .container-fluid, .device-page { 
      background-color: var(--mw-bg) !important; color: var(--mw-text) !important; 
      font-family: 'Inter', sans-serif !important;
    }
    
    /* Sembunyikan elemen secara paksa via CSS Selector yang valid */
    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults { 
      display: none !important; 
    }

    /* 2. MODERN HORIZONTAL TABS */
    .mw-tabs-container {
      display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0 20px 0; padding: 8px;
      background: rgba(13, 17, 23, 0.95); border-radius: 12px; border: 1px solid var(--mw-border);
      position: sticky; top: 0; z-index: 99999; box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      backdrop-filter: blur(10px);
    }
    .mw-tab-btn {
      background: rgba(33, 38, 45, 0.7); border: 1px solid var(--mw-border);
      color: #8b949e; padding: 10px 18px; cursor: pointer;
      border-radius: 8px; font-weight: 700; font-size: 10.5px;
      text-transform: uppercase; letter-spacing: 1px; transition: 0.2s;
      outline: none;
    }
    .mw-tab-btn:hover { color: #fff; background: #30363d; }
    .mw-tab-btn.active {
      background: linear-gradient(135deg, var(--mw-primary), var(--mw-secondary));
      color: #000; border-color: transparent; box-shadow: var(--mw-glow);
    }

    /* 3. CONTENT COMPRESSION */
    .mw-tab-content { display: none; width: 100% !important; animation: mwPop 0.3s ease-out; }
    .mw-tab-content.active { display: block !important; }
    @keyframes mwPop { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    table { width: 100% !important; border-radius: 10px !important; border: 1px solid var(--mw-border) !important; background: var(--mw-card) !important; margin: 10px 0 !important; }
    th { background: #0d1117 !important; color: var(--mw-secondary) !important; padding: 12px !important; font-size: 11px !important; }
    td { padding: 10px 12px !important; border-bottom: 1px solid var(--mw-border) !important; font-family: monospace !important; font-size: 12.5px !important; }
    
    .mw-hidden { display: none !important; }
  `;

  if (!document.getElementById('mw-style-v6')) {
    const s = document.createElement('style'); s.id='mw-style-v6'; s.innerHTML = css; document.head.appendChild(s);
  }

  function transform() {
    if (!location.hash.includes('/devices/')) return;
    if (document.querySelector('.mw-tabs-container')) return;

    const mainArea = document.querySelector('.container-fluid') || document.querySelector('.device-page') || document.body;
    
    // Logic JS untuk menghapus teks sampah yang tidak bisa dihapus CSS
    const trashWords = ["Faults", "Channel", "Code", "Message", "Detail", "Retries", "Timestamp", "No faults", "Parameter Setting", "All parameters"];
    mainArea.querySelectorAll('h3, div, span').forEach(el => {
        trashWords.forEach(word => {
            if (el.innerText === word || el.innerText.includes("FaultsChannel")) {
                el.style.display = 'none';
            }
        });
    });

    const rawHeaders = Array.from(mainArea.querySelectorAll('h3')).filter(h => h.offsetParent !== null);
    if (rawHeaders.length === 0) return;

    const tabs = {
      'SUMMARY': { icon: '📊', content: document.createElement('div') },
      'WAN': { icon: '🌐', content: document.createElement('div') },
      'WLAN': { icon: '📡', content: document.createElement('div') },
      'LAN/OTHER': { icon: '🔌', content: document.createElement('div') }
    };

    let curr = mainArea.firstChild;
    while (curr && curr !== rawHeaders[0]) {
      let next = curr.nextSibling;
      if (curr.nodeType === 1 || (curr.nodeType === 3 && curr.textContent.trim())) {
        tabs['SUMMARY'].content.appendChild(curr);
      }
      curr = next;
    }

    rawHeaders.forEach(h => {
      const text = h.innerText.toUpperCase();
      let targetTab = 'LAN/OTHER';
      
      if (text.includes('WAN') || text.includes('IP') || text.includes('PPP') || text.includes('VLAN')) targetTab = 'WAN';
      else if (text.includes('WIFI') || text.includes('SSID') || text.includes('WLAN')) targetTab = 'WLAN';
      else if (text.includes('SUMMARY')) targetTab = 'SUMMARY';
      
      if (text.includes('FAULT') || text.includes('ALL PARAMETER') || text.includes('SETTING')) {
        h.classList.add('mw-hidden');
        return;
      }

      const subWrapper = document.createElement('div');
      subWrapper.style.marginBottom = '20px';
      const label = document.createElement('div');
      label.style.color = 'var(--mw-primary)';
      label.style.fontSize = '11px';
      label.style.fontWeight = 'bold';
      label.style.marginBottom = '8px';
      label.innerText = '❯ ' + h.innerText.replace('Summon','').trim();
      subWrapper.appendChild(label);

      let next = h.nextElementSibling;
      while (next && next.tagName !== 'H3') {
        let temp = next.nextElementSibling;
        subWrapper.appendChild(next);
        next = temp;
      }
      tabs[targetTab].content.appendChild(subWrapper);
      h.classList.add('mw-hidden');
    });

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
  }
  setInterval(transform, 1000);
})();
