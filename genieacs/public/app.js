
/** NOC Intelligence v4.5 Final - Verified Senior Logic **/
(function() {
  const css = `
    :root {
      --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
      --mw-card: rgba(22, 27, 34, 0.98); --mw-border: #30363d;
      --mw-text: #e6edf3; --mw-glow: 0 0 20px rgba(0, 255, 136, 0.35);
    }
    body, html, #page, .container-fluid, [class*="container"] { 
      background-color: var(--mw-bg) !important; color: var(--mw-text) !important; 
    }
    .mw-tabs-container {
      display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 20px 0; padding: 10px;
      background: rgba(13, 17, 23, 0.95); backdrop-filter: blur(20px);
      border-radius: 14px; border: 1px solid var(--mw-border);
      position: sticky; top: 0; z-index: 99999; box-shadow: 0 15px 50px rgba(0,0,0,0.9);
    }
    .mw-tab-btn {
      background: rgba(33, 38, 45, 0.8); border: 1px solid var(--mw-border);
      color: #8b949e; padding: 10px 20px; cursor: pointer;
      border-radius: 8px; font-weight: 700; font-size: 11px;
      text-transform: uppercase; transition: 0.2s;
    }
    .mw-tab-btn.active {
      background: linear-gradient(135deg, var(--mw-primary), var(--mw-secondary));
      color: #000; border-color: transparent; box-shadow: var(--mw-glow);
    }
    .mw-tab-content { display: none; width: 100% !important; animation: mwFade 0.3s ease-in; }
    .mw-tab-content.active { display: block !important; }
    @keyframes mwFade { from { opacity: 0; } to { opacity: 1; } }
    table { width: 100% !important; background: var(--mw-card) !important; border-radius: 12px !important; border: 1px solid var(--mw-border) !important; overflow: hidden; margin: 15px 0 !important; }
    th { background: #1c2128 !important; color: var(--mw-secondary) !important; padding: 12px !important; }
    .mw-hidden { display: none !important; }
  `;

  function transform() {
    if (!location.hash.includes('/devices/')) return;
    if (document.querySelector('.mw-tabs-container')) return;

    // Logic Paling Agresif: Cari area di mana ada tulisan "Last Inform"
    const mainArea = document.querySelector('.container-fluid') || document.querySelector('.device-page') || document.body;
    const headers = Array.from(mainArea.querySelectorAll('h3'));
    
    if (headers.length === 0) return;

    if (!document.getElementById('mw-style')) {
      const s = document.createElement('style'); s.id='mw-style'; s.innerHTML = css; document.head.appendChild(s);
    }

    const sections = [];
    const summaryWrapper = document.createElement('div');
    summaryWrapper.className = 'mw-tab-content active';
    
    // Tarik semua elemen teratas (Summary)
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
  setInterval(transform, 1000);
})();
