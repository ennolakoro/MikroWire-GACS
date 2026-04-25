
/** NOC Intelligence v13.0 - NETWORK RESILIENT (Senior Edition) **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
      --mw-card: #161b22; --mw-border: #30363d; --mw-text: #c9d1d9;
      --mw-error: #ff4444;
    }

    /* 1. GLOBAL & NOTIFICATION PROTECTION */
    body, html { background-color: var(--mw-bg) !important; color: var(--mw-text) !important; }
    
    /* Pastikan Notifikasi Sistem (Faults) Selalu Muncul di Paling Atas */
    .alert, .fault, .error, .notification, [class*="alert-"] { 
      display: block !important; position: relative !important; z-index: 1000001 !important; 
      margin: 10px !important; border-radius: 8px !important; border: 1px solid var(--mw-error) !important;
      background: rgba(255, 68, 68, 0.1) !important; color: var(--mw-error) !important;
      font-weight: bold !important;
    }

    #mw-hud {
      position: sticky; top: 0; z-index: 1000000; background: #0a0c10;
      padding: 12px 20px; border-bottom: 1px solid var(--mw-border);
      box-shadow: 0 10px 50px rgba(0,0,0,0.9);
    }

    .mw-stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 12px; }
    .mw-pill { background: var(--mw-card); padding: 10px; border-radius: 8px; border-left: 4px solid var(--mw-primary); }
    .mw-pill-label { font-size: 9px; color: var(--mw-secondary); text-transform: uppercase; font-weight: 800; }
    .mw-pill-value { font-size: 13px; font-family: monospace; color: #fff; margin-top: 4px; }

    .mw-tab-row { display: flex; gap: 4px; }
    .mw-btn {
      background: #1c2128; border: 1px solid var(--mw-border); color: #8b949e;
      padding: 10px 24px; cursor: pointer; border-radius: 6px 6px 0 0;
      font-weight: 800; font-size: 11px; text-transform: uppercase; transition: 0.2s;
    }
    .mw-btn.active { background: var(--mw-primary) !important; color: #000 !important; border-bottom: 3px solid var(--mw-secondary) !important; }

    /* 2. SMART VISIBILITY (Anti-Notification Block) */
    /* Sembunyikan elemen aslinya, KECUALI yang berhubungan dengan notifikasi/faults */
    body[data-mw-route="device"] .device-page > *:not(.alert):not(.fault):not(.error):not(#mw-hud) { 
      display: none !important; 
    }

    /* Tampilkan elemen yang sesuai Tab Aktif */
    body[data-mw-tab="NETWORK"] [data-mw-group="NETWORK"],
    body[data-mw-tab="WIRELESS"] [data-mw-group="WIRELESS"],
    body[data-mw-tab="SYSTEM"] [data-mw-group="SYSTEM"] { 
      display: block !important; 
    }

    /* 3. TABLE STYLING */
    table { width: 100% !important; border-radius: 12px; overflow: hidden; border: 1px solid var(--mw-border) !important; background: var(--mw-card); margin: 15px 0 !important; }
    th { background: #0d1117 !important; color: var(--mw-primary) !important; padding: 14px !important; text-transform: uppercase; font-size: 10.5px; }
    td { padding: 12px 16px !important; border-bottom: 1px solid var(--mw-border) !important; font-size: 13px; color: #e6edf3; }

    /* SANITIZATION */
    h3.Summon, .summon-button, .Parameter_Setting, .all-parameters, .device-faults, .mw-trash { display: none !important; }
  `;

  if (!document.getElementById('mw-resilient-styles')) {
    const s = document.createElement('style'); s.id='mw-resilient-styles'; s.innerHTML = css; document.head.appendChild(s);
  }

  let activeT = 'NETWORK';

  function orchestrate() {
    const isDevice = location.hash.includes('/devices/');
    document.body.setAttribute('data-mw-route', isDevice ? 'device' : 'other');
    if (!isDevice) return;

    const main = document.querySelector('.device-page') || document.querySelector('.container-fluid');
    if (!main) return;

    // 1. HUD Lifecycle
    let hud = document.getElementById('mw-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'mw-hud';
      hud.innerHTML = `<div class="mw-stat-row" id="mw-stats"></div><div class="mw-tab-row" id="mw-tabs"></div>`;
      main.prepend(hud);

      ['NETWORK', 'WIRELESS', 'SYSTEM'].forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'mw-btn' + (t === activeT ? ' active' : '');
        btn.innerText = t;
        btn.onclick = () => {
          activeT = t;
          document.querySelectorAll('.mw-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.body.setAttribute('data-mw-tab', t);
        };
        hud.querySelector('#mw-tabs').appendChild(btn);
      });
      document.body.setAttribute('data-mw-tab', activeT);
    }

    // 2. Network-Aware Tagging
    let currentG = 'SYSTEM';
    const stats = hud.querySelector('#mw-stats');
    const groupMap = { 'NETWORK': ['WAN', 'IP', 'PPP', 'VLAN'], 'WIRELESS': ['WIFI', 'SSID', 'WLAN', 'CONNECTED'] };
    const trash = ["FaultsChannel", "Parameter Setting", "Summary", "All parameters"];

    Array.from(main.children).forEach(el => {
      if (el.id === 'mw-hud' || el.classList.contains('alert') || el.classList.contains('fault')) return;
      
      const txt = (el.innerText || "").trim();
      
      // Sync Summary Data ke HUD
      if (txt.includes(':') && el.tagName !== 'TABLE' && el.childNodes.length < 5) {
        const p = txt.split(':');
        const id = 'stat-' + p[0].trim().replace(/\s+/g, '-');
        let item = document.getElementById(id);
        if (!item) { item = document.createElement('div'); item.id = id; item.className = 'mw-pill'; stats.appendChild(item); }
        item.innerHTML = `<div class="mw-pill-label">${p[0].trim()}</div><div class="mw-pill-value">${p[1].trim()}</div>`;
        el.classList.add('mw-trash');
        return;
      }

      if (el.tagName === 'H3') {
        currentG = 'SYSTEM';
        for(let g in groupMap) { if(groupMap[g].some(k => txt.toUpperCase().includes(k))) { currentG = g; break; } }
      }
      
      if (trash.some(j => txt.includes(j))) el.classList.add('mw-trash');
      el.setAttribute('data-mw-group', currentG);
    });
  }

  // MutationObserver untuk sinkronisasi instan saat Mithril re-render
  const observer = new MutationObserver(() => orchestrate());
  observer.observe(document.body, { childList: true, subtree: true });
  setInterval(orchestrate, 1000);
})();
