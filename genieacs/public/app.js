
/** NOC Intelligence v5.0 - TOTAL TRANSFORMATION **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
      --mw-card: #161b22; --mw-border: #30363d;
      --mw-text: #e6edf3; --mw-text-dim: #8b949e;
      --mw-glow: 0 0 20px rgba(0, 255, 136, 0.3);
    }

    /* 1. GLOBAL RESET - Memaksa Dark Mode di Seluruh App (Termasuk Login) */
    html, body, #page, .container-fluid, [class*="container"], .login-page, .login-content { 
      background-color: var(--mw-bg) !important; 
      color: var(--mw-text) !important; 
      font-family: 'Inter', system-ui, sans-serif !important;
    }

    /* 2. STYLING LOGIN & INPUT */
    input, select, textarea {
      background-color: #0d1117 !important;
      border: 1px solid var(--mw-border) !important;
      color: var(--mw-text) !important;
      border-radius: 6px !important;
    }
    .login-content { border: 1px solid var(--mw-border) !important; border-radius: 12px !important; padding: 30px !important; box-shadow: 0 10px 50px rgba(0,0,0,0.5) !important; }
    .btn-primary, button[type="submit"] {
      background: linear-gradient(135deg, var(--mw-primary), var(--mw-secondary)) !important;
      color: #000 !important; font-weight: bold !important; border: none !important;
    }

    /* 3. NAVIGATION & SIDEBAR */
    .navbar, .navigation, #nav { 
      background-color: #010409 !important; 
      border-bottom: 1px solid var(--mw-border) !important; 
    }
    .nav-tabs .nav-link.active { background-color: var(--mw-card) !important; color: var(--mw-primary) !important; }

    /* 4. DEVICE PAGE - TAB SYSTEM */
    .mw-tabs-container {
      display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 25px 0; padding: 10px;
      background: rgba(13, 17, 23, 0.9); backdrop-filter: blur(15px);
      border-radius: 14px; border: 1px solid var(--mw-border);
      position: sticky; top: 0; z-index: 9999; box-shadow: 0 15px 50px rgba(0,0,0,0.8);
    }
    .mw-tab-btn {
      background: rgba(33, 38, 45, 0.8); border: 1px solid var(--mw-border);
      color: var(--mw-text-dim); padding: 12px 24px; cursor: pointer;
      border-radius: 10px; font-weight: 700; font-size: 11px; text-transform: uppercase; transition: 0.2s;
    }
    .mw-tab-btn.active {
      background: linear-gradient(135deg, var(--mw-primary), var(--mw-secondary));
      color: #000; border-color: transparent; box-shadow: var(--mw-glow);
    }
    .mw-tab-content { display: none; width: 100% !important; animation: mwFade 0.3s ease-in; }
    .mw-tab-content.active { display: block !important; }

    /* 5. TABLES & CARDS */
    table { width: 100% !important; background: var(--mw-card) !important; border-radius: 12px !important; border: 1px solid var(--mw-border) !important; overflow: hidden; margin: 15px 0 !important; }
    th { background: #0d1117 !important; color: var(--mw-secondary) !important; padding: 15px !important; }
    td { padding: 12px 15px !important; border-bottom: 1px solid var(--mw-border) !important; color: var(--mw-text) !important; font-family: monospace !important; }
    
    .mw-hidden { display: none !important; }
    h3, h4 { color: var(--mw-primary) !important; }
  `;

  // Langsung injeksi CSS saat script dimuat (Agar Login pun langsung Dark)
  const s = document.createElement('style'); 
  s.id='mw-total-styles'; 
  s.innerHTML = css; 
  document.head.appendChild(s);

  function transform() {
    if (!location.hash.includes('/devices/')) return;
    if (document.querySelector('.mw-tabs-container')) return;

    const mainArea = document.querySelector('.container-fluid') || document.querySelector('.device-page') || document.body;
    const headers = Array.from(mainArea.querySelectorAll('h3'));
    if (headers.length === 0) return;

    const sections = [];
    const summaryWrapper = document.createElement('div');
    summaryWrapper.className = 'mw-tab-content active';
    
    let curr = mainArea.firstChild;
    while (curr && curr !== headers[0]) {
      let next = curr.nextSibling;
      summaryWrapper.appendChild(curr);
      curr = next;
    }
    sections.push({ title: 'Summary', content: summaryWrapper });

    headers.forEach((h, i) => {
      const content = document.createElement('div');
      content.className = 'mw-tab-content';
      let next = h.nextElementSibling;
      while (next && next.tagName !== 'H3') {
        let temp = next.nextElementSibling;
        content.appendChild(next);
        next = temp;
      }
      h.classList.add('mw-hidden');
      sections.push({ title: h.innerText.replace('Summon','').trim(), content });
    });

    const tabBar = document.createElement('div');
    tabBar.className = 'mw-tabs-container';
    sections.forEach((sec, idx) => {
      const btn = document.createElement('button');
      btn.className = 'mw-tab-btn' + (idx === 0 ? ' active' : '');
      btn.innerText = sec.title;
      btn.onclick = () => {
        tabBar.querySelectorAll('.mw-tab-btn').forEach(b => b.classList.remove('active'));
        mainArea.querySelectorAll('.mw-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        sec.content.classList.add('active');
      };
      tabBar.appendChild(btn);
      mainArea.appendChild(sec.content);
    });
    mainArea.prepend(tabBar);
  }
  
  // Transform tab khusus di halaman device, tapi CSS global jalan terus
  setInterval(transform, 1000);
})();
