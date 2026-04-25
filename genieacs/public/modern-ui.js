/**
 * MikroWire Modern UI - Tab Transformer Script
 */

(function() {
  const css = `
/* MikroWire Modern UI - GenieACS Tab System */
:root {
  --primary-color: #00ff88;
  --bg-dark: #0d1117;
  --card-bg: #161b22;
  --border-color: #30363d;
  --text-main: #c9d1d9;
}

.mw-tabs-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 20px 0;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 10px;
}

.mw-tab-btn {
  background: #21262d;
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 8px 20px;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  font-weight: 600;
  font-family: inherit;
}

.mw-tab-btn.active {
  background: var(--primary-color);
  color: #000;
  border-color: var(--primary-color);
}

.mw-hidden-section-header { display: none !important; }

.mw-tab-content { display: none; animation: mwFadeIn 0.3s ease; }
.mw-tab-content.active { display: block; }

@keyframes mwFadeIn { from { opacity: 0; } to { opacity: 1; } }

table { width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid var(--border-color); }
th { background: #21262d; color: var(--primary-color); padding: 10px; text-align: left; }
td { padding: 8px 10px; border-bottom: 1px solid var(--border-color); }
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
