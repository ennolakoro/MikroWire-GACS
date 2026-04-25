
/** NOC Intelligence v8.0 - THE V-DOM INTERCEPTOR (Final Stable) **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
      --mw-card: #161b22; --mw-border: #30363d; --mw-text: #c9d1d9;
      --mw-glow: 0 0 15px rgba(0, 255, 136, 0.4);
    }

    /* 1. GLOBAL UI RESET */
    html, body, #page, .container-fluid, .device-page { 
      background-color: var(--mw-bg) !important; color: var(--mw-text) !important; 
      font-family: 'Inter', sans-serif !important; 
    }

    /* 2. FLOATING TAB BAR (Anti-Wipe) */
    #mw-persistent-tabs {
      display: flex; gap: 4px; margin-bottom: 20px; padding: 10px;
      background: #010409; border-bottom: 2px solid var(--mw-border);
      position: sticky; top: 0; z-index: 999999; backdrop-filter: blur(10px);
    }
    .mw-tab-btn {
      background: transparent; border: none; color: #8b949e; padding: 12px 25px;
      cursor: pointer; border-radius: 8px 8px 0 0; font-weight: 800; font-size: 11px;
      text-transform: uppercase; letter-spacing: 1.5px; transition: 0.3s;
    }
    .mw-tab-btn.active {
      background-color: var(--mw-primary) !important; color: #000 !important;
      border-bottom: 3px solid var(--mw-secondary) !important;
      box-shadow: var(--mw-glow);
    }

    /* 3. V-DOM COMPATIBLE VISIBILITY */
    .mw-vdom-hidden { display: none !important; }
    
    /* 4. GRID LAYOUT FOR SUMMARY */
    .mw-executive-grid { 
        display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
        gap: 10px; margin-bottom: 20px; 
    }
    .mw-stat-card { 
        background: var(--mw-card); padding: 12px; border-radius: 8px; 
        border: 1px solid var(--mw-border); border-left: 4px solid var(--mw-primary); 
    }
    .mw-stat-label { font-size: 9px; color: var(--mw-secondary); text-transform: uppercase; font-weight: bold; }
    .mw-stat-value { font-size: 12px; font-family: monospace; color: #fff; margin-top: 4px; }

    /* 5. TABLE & TEXT SANITIZATION */
    table { width: 100% !important; border-radius: 10px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); }
    th { background: #0d1117 !important; color: var(--mw-primary) !important; padding: 12px !important; font-size: 10px; text-transform: uppercase; }
    td { padding: 10px 14px !important; border-bottom: 1px solid var(--mw-border) !important; font-size: 12.5px; }
    tr:hover td { background: rgba(0, 255, 136, 0.05); }

    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults { display: none !important; }
  `;

  if (!document.getElementById('mw-vdom-styles')) {
    const s = document.createElement('style'); s.id='mw-vdom-styles'; s.innerHTML = css; document.head.appendChild(s);
  }

  let activeTab = 'DASHBOARD';

  function orchestrate() {
    if (!location.hash.includes('/devices/')) return;
    
    const main = document.querySelector('.container-fluid') || document.querySelector('.device-page');
    if (!main) return;

    // A. Ensure Persistent Tab Bar
    let tabBar = document.getElementById('mw-persistent-tabs');
    if (!tabBar) {
      tabBar = document.createElement('div');
      tabBar.id = 'mw-persistent-tabs';
      ['DASHBOARD', 'NETWORK', 'WIRELESS', 'SYSTEM'].forEach(name => {
        const btn = document.createElement('button');
        btn.className = 'mw-tab-btn' + (name === activeTab ? ' active' : '');
        btn.innerText = name;
        btn.onclick = () => {
          activeTab = name;
          document.querySelectorAll('.mw-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          orchestrate(); // Re-sync visibility immediately
        };
        tabBar.appendChild(btn);
      });
      main.prepend(tabBar);
    }

    // B. Build & Sync Executive Grid (Only if on Dashboard tab)
    let grid = document.getElementById('mw-exec-grid');
    if (!grid) {
        grid = document.createElement('div');
        grid.id = 'mw-exec-grid';
        grid.className = 'mw-executive-grid';
        main.insertBefore(grid, tabBar.nextSibling);
    }
    grid.style.display = (activeTab === 'DASHBOARD') ? 'grid' : 'none';

    // C. Data Extraction & Real-time Sync (Tanpa merusak DOM)
    const headers = Array.from(main.querySelectorAll('h3'));
    
    // 1. Process Summary Info
    main.querySelectorAll('div, span').forEach(el => {
        if (el.id === 'mw-exec-grid' || el.id === 'mw-persistent-tabs') return;
        
        const text = el.innerText.trim();
        if (text.includes(':') && el.childNodes.length < 4) {
            const parts = text.split(':');
            if (parts.length === 2) {
                // Sembunyikan elemen asli tapi jangan hapus
                el.classList.add('mw-vdom-hidden');
                
                // Cari atau buat stat card di grid
                const cardId = 'mw-card-' + parts[0].trim().replace(/\s+/g, '-');
                let card = document.getElementById(cardId);
                if (!card) {
                    card = document.createElement('div');
                    card.id = cardId;
                    card.className = 'mw-stat-card';
                    grid.appendChild(card);
                }
                card.innerHTML = `<div class="mw-stat-label">${parts[0].trim()}</div><div class="mw-stat-value">${parts[1].trim()}</div>`;
            }
        }
        
        // Sanitasi teks sampah "FaultsChannel..."
        if (text.includes('FaultsChannel') || text === 'Parameter Setting' || text === 'Summary' || text === 'All parameters') {
            el.classList.add('mw-vdom-hidden');
        }
    });

    // 2. Logic Tab Switching (Non-Destructive)
    const groups = {
      'NETWORK': ['WAN', 'IP', 'PPP', 'VLAN'],
      'WIRELESS': ['WIFI', 'SSID', 'WLAN', 'CONNECTED'],
      'SYSTEM': []
    };

    headers.forEach(h => {
      const headerText = h.innerText.toUpperCase();
      let group = 'SYSTEM';
      for(let key in groups) { if(groups[key].some(k => headerText.includes(k))) { group = key; break; } }
      
      const shouldShow = (activeTab === group);
      
      // Toggle visibility pada Header dan Konten di bawahnya
      if (shouldShow) h.classList.remove('mw-vdom-hidden'); else h.classList.add('mw-vdom-hidden');
      
      let next = h.nextElementSibling;
      while(next && next.tagName !== 'H3') {
        if (shouldShow) next.classList.remove('mw-vdom-hidden'); else next.classList.add('mw-vdom-hidden');
        next = next.nextElementSibling;
      }
    });
  }

  // Interval pasif: Hanya memastikan status sinkron, bukan merubah struktur
  setInterval(orchestrate, 800);
})();
