import{a as me,b as nt,c as Ue}from"./chunk-CDG7S4P5.js";var xt=me((uf,ii)=>{var re=Object.create,v=Object.defineProperty,ce=Object.getOwnPropertyDescriptor,le=Object.getOwnPropertyNames,ue=Object.getPrototypeOf,fe=Object.prototype.hasOwnProperty,de=(e,t)=>function(){return t||(e((t={exports:{}}).exports,t),t.exports),t.exports},pe=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of le(t))!fe.call(e,s)&&s!==r&&v(e,s,{get:()=>t[s],enumerable:!(n=ce(t,s))||n.enumerable});return e},he=(e,t,r)=>(pe(e,t,"default"),(r=ue(t)),pe(e,r,"default"))});/**
 * MikroWire Pro NOC UI v3.5 - Intelligence Edition (Aggressive)
 * Optimized for GenieACS v1.2+
 */

(function() {
  const css = `
:root {
  --mw-primary: #00ff88; --mw-secondary: #00d4ff; --mw-bg: #0a0c10;
  --mw-card: rgba(22, 27, 34, 0.9); --mw-border: #30363d;
  --mw-text: #e6edf3; --mw-text-dim: #8b949e;
  --mw-glow: 0 0 20px rgba(0, 255, 136, 0.3);
}

body, html { background-color: var(--mw-bg) !important; color: var(--mw-text) !important; font-family: 'Inter', system-ui, sans-serif !important; }
.device-page, .container-fluid { background: transparent !important; border: none !important; }

/* REVOLUTIONARY TABS */
.mw-tabs-container {
  display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0 25px 0; padding: 10px;
  background: rgba(13, 17, 23, 0.8); backdrop-filter: blur(15px);
  border-radius: 14px; border: 1px solid var(--mw-border);
  position: sticky; top: 0; z-index: 9999; box-shadow: 0 10px 40px rgba(0,0,0,0.7);
}

.mw-tab-btn {
  background: rgba(33, 38, 45, 0.6); border: 1px solid var(--mw-border);
  color: var(--mw-text-dim); padding: 12px 24px; cursor: pointer;
  border-radius: 10px; font-weight: 700; font-size: 12px;
  text-transform: uppercase; letter-spacing: 1.2px; transition: 0.3s;
  display: flex; align-items: center; gap: 8px; outline: none;
}

.mw-tab-btn:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: var(--mw-primary); }
.mw-tab-btn.active {
  background: linear-gradient(135deg, var(--mw-primary), var(--mw-secondary));
  color: #000; border-color: transparent; box-shadow: var(--mw-glow); transform: translateY(-2px);
}

.mw-tab-content { display: none; animation: mwFadeIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
.mw-tab-content.active { display: block; }

@keyframes mwFadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

/* MODERN TABLES */
table { width: 100% !important; border-collapse: separate !important; border-spacing: 0 !important; margin: 20px 0 !important; border-radius: 12px !important; overflow: hidden !important; border: 1px solid var(--mw-border) !important; background: var(--mw-card) !important; }
th { background: #161b22 !important; color: var(--mw-secondary) !important; padding: 16px !important; font-size: 11px !important; text-transform: uppercase !important; letter-spacing: 1.5px !important; border-bottom: 1px solid var(--mw-border) !important; }
td { padding: 14px 16px !important; border-bottom: 1px solid var(--mw-border) !important; color: var(--mw-text) !important; font-family: 'JetBrains Mono', monospace !important; font-size: 13px !important; }
tr:hover td { background: rgba(0, 212, 255, 0.05) !important; }

/* CUSTOM HEADERS */
h1, h2, h3, h4 { color: var(--mw-primary) !important; font-weight: 800 !important; }
.mw-hidden { display: none !important; }
  `;

  function injectCSS() {
    if (document.getElementById('mw-force-styles')) return;
    const style = document.createElement('style');
    style.id = 'mw-force-styles';
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  function transformToTabs() {
    if (!location.hash.includes('/devices/')) return;
    const page = document.querySelector('.device-page') || document.querySelector('body > .container') || document.querySelector('.container-fluid');
    if (!page || document.querySelector('.mw-tabs-container')) return;

    injectCSS();
    
    const sections = [];
    const headers = Array.from(page.querySelectorAll('h3'));
    
    // 1. Handle Orphaned Summary (Capture everything BEFORE the first H3)
    const firstH3 = headers[0];
    if (firstH3) {
      const summaryWrapper = document.createElement('div');
      summaryWrapper.className = 'mw-tab-content active';
      
      let curr = page.firstChild;
      while (curr && curr !== firstH3) {
        let next = curr.nextSibling;
        if (curr.nodeType === 1 || (curr.nodeType === 3 && curr.textContent.trim())) {
          summaryWrapper.appendChild(curr);
        }
        curr = next;
      }
      sections.push({ title: 'Summary', icon: '📊', content: summaryWrapper });
    }

    // 2. Map existing H3 sections
    headers.forEach((h, i) => {
      const title = h.innerText.replace('Summon', '').trim() || `Tab ${i+1}`;
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'mw-tab-content';
      
      let next = h.nextElementSibling;
      while (next && next.tagName !== 'H3') {
        let temp = next.nextElementSibling;
        contentWrapper.appendChild(next);
        next = temp;
      }
      h.classList.add('mw-hidden');
      sections.push({ title, icon: '📄', content: contentWrapper });
    });

    if (sections.length === 0) return;

    // 3. Create Tab Bar
    const tabBar = document.createElement('div');
    tabBar.className = 'mw-tabs-container';
    
    sections.forEach((sec, idx) => {
      const btn = document.createElement('button');
      btn.className = 'mw-tab-btn' + (idx === 0 ? ' active' : '');
      btn.innerHTML = `<span>${sec.icon}</span> ${sec.title}`;
      btn.onclick = () => {
        tabBar.querySelectorAll('.mw-tab-btn').forEach(b => b.classList.remove('active'));
        page.querySelectorAll('.mw-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        sec.content.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      tabBar.appendChild(btn);
      page.appendChild(sec.content);
    });

    page.prepend(tabBar);
  }

  new MutationObserver(() => {
    if (location.hash.includes('/devices/') && !document.querySelector('.mw-tabs-container')) {
      transformToTabs();
    }
  }).observe(document.body, { subtree: true, childList: true });

  setTimeout(transformToTabs, 500);
})();
