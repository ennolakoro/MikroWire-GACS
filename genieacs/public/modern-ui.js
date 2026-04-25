/**
 * MikroWire Modern UI - Tab Transformer Script
 */

(function() {
  const css = `
/* MikroWire Cyber-Modern UI - GenieACS */
:root {
  --primary: #00ff88;
  --secondary: #00d4ff;
  --accent: #ff00ff;
  --bg-dark: #0d1117;
  --card-bg: #161b22;
  --header-bg: #1c2128;
  --border-color: #30363d;
  --text-main: #c9d1d9;
  --text-dim: #8b949e;
  --glow: 0 0 12px rgba(0, 255, 136, 0.4);
}

body {
  background-color: var(--bg-dark) !important;
  color: var(--text-main) !important;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif !important;
}

.mw-tabs-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 25px 0;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 15px;
}

.mw-tab-btn {
  background: #21262d;
  border: 1px solid var(--border-color);
  color: var(--text-dim);
  padding: 12px 28px;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 13px;
}

.mw-tab-btn:hover {
  color: var(--text-main);
  background: #30363d;
  border-color: var(--text-dim);
}

.mw-tab-btn.active {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #000;
  border-color: transparent;
  box-shadow: var(--glow);
  transform: translateY(-2px);
}

.mw-hidden-section-header { display: none !important; }

.mw-tab-content { display: none; animation: mwSlideUp 0.4s ease-out; }
.mw-tab-content.active { display: block; }

@keyframes mwSlideUp { 
  from { opacity: 0; transform: translateY(20px); } 
  to { opacity: 1; transform: translateY(0); } 
}

/* Styled Sections (Cards) */
.summary-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  transition: transform 0.2s ease;
}

.summary-section:hover {
  border-color: var(--secondary);
}

.summary-section h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--primary);
  font-size: 1.1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
  display: flex;
  align-items: center;
}

/* Improved Tables & Data */
table { 
  width: 100%; 
  border-collapse: separate; 
  border-spacing: 0;
  background: var(--card-bg);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

th { 
  background: var(--header-bg); 
  color: var(--secondary); 
  padding: 12px 16px; 
  text-align: left; 
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

td { 
  padding: 10px 16px; 
  border-bottom: 1px solid var(--border-color);
  color: var(--text-main);
}

/* Parameter Value Styling */
.parameter-value {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: var(--secondary);
}

.mw-status-online { color: var(--primary); text-shadow: var(--glow); }
.mw-status-offline { color: #ff4444; }

/* Summon Button Customization */
button {
  cursor: pointer;
  border: none;
  font-weight: 500;
}

.mw-tab-btn, button { outline: none !important; }
  `;

  function injectCSS() {
    if (document.getElementById('mikrowire-styles')) return;
    const style = document.createElement('style');
    style.id = 'mikrowire-styles';
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  function transformToTabs() {
    if (!window.location.hash.includes('/devices/')) return;
    if (document.querySelector('.mw-tabs-container')) return;

    injectCSS();

    const headers = Array.from(document.querySelectorAll('h3, h4'));
    const validSections = [];

    headers.forEach(header => {
      let content = header.nextElementSibling;
      if (content && (content.tagName === 'TABLE' || content.querySelector('table'))) {
        validSections.push({ header, content });
      }
    });

    if (validSections.length === 0) return;

    const tabBar = document.createElement('div');
    tabBar.className = 'mw-tabs-container';
    validSections[0].header.parentNode.insertBefore(tabBar, validSections[0].header);

    validSections.forEach((section, index) => {
      const { header, content } = section;
      const title = header.innerText.replace('Summon', '').trim() || `Section ${index+1}`;
      
      const btn = document.createElement('button');
      btn.className = 'mw-tab-btn' + (index === 0 ? ' active' : '');
      btn.innerText = title;
      
      btn.onclick = () => {
        tabBar.querySelectorAll('.mw-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.mw-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        content.classList.add('active');
      };

      tabBar.appendChild(btn);
      header.classList.add('mw-hidden-section-header');
      content.classList.add('mw-tab-content');
      if (index === 0) content.classList.add('active');
    });
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(transformToTabs, 500);
    }
    if (window.location.hash.includes('/devices/') && !document.querySelector('.mw-tabs-container')) {
      transformToTabs();
    }
  }).observe(document, { subtree: true, childList: true });

  setTimeout(transformToTabs, 1000);
})();
