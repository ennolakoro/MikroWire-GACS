#!/bin/bash
# MikroWire Pro UI Patcher - NOC Intelligence v3.0

# 1. Cari lokasi instalasi GenieACS
GENIE_PATH=$(npm list -g genieacs --parseable 2>/dev/null | head -n 1)
if [ -z "$GENIE_PATH" ]; then
    GENIE_PATH="/usr/lib/node_modules/genieacs"
fi

PUBLIC_PATH="$GENIE_PATH/public"
APP_JS="$PUBLIC_PATH/app.js"

echo "Targeting: $APP_JS"

# 2. Cek apakah file ada
if [ ! -f "$APP_JS" ]; then
    echo "Error: GenieACS public files not found at $PUBLIC_PATH"
    exit 1
fi

# 3. Buat Backup
cp "$APP_JS" "${APP_JS}.bak"

# 4. Ambil kode Modern UI terbaru
cat << 'EOF' > /tmp/mw-ui.js

/** NOC Intelligence v3.0 Injector **/
(function(){const css=`
:root{--mw-primary:#00ff88;--mw-secondary:#00d4ff;--mw-bg:#0a0c10;--mw-card:rgba(22,27,34,0.8);--mw-border:rgba(48,54,61,0.8);--mw-text:#e6edf3;--mw-glow:0 0 20px rgba(0,255,136,0.3)}
body{background-color:var(--mw-bg)!important;color:var(--mw-text)!important;font-family:'Inter',sans-serif!important}
.mw-tabs-container{display:flex;gap:10px;margin:20px 0;padding:10px;background:rgba(13,17,23,0.7);backdrop-filter:blur(10px);border-radius:12px;border:1px solid var(--mw-border);position:sticky;top:10px;z-index:1000}
.mw-tab-btn{background:rgba(33,38,45,0.5);border:1px solid var(--mw-border);color:#8b949e;padding:10px 20px;cursor:pointer;border-radius:8px;font-weight:600;text-transform:uppercase;transition:0.3s}
.mw-tab-btn.active{background:linear-gradient(135deg,var(--mw-primary),var(--mw-secondary));color:#000;box-shadow:var(--mw-glow);transform:translateY(-2px)}
.mw-tab-content{display:none;animation:mwSlideIn .5s ease-out forwards}
.mw-tab-content.active{display:block}
@keyframes mwSlideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
table{width:100%!important;border-collapse:separate!important;background:var(--mw-card)!important;border-radius:12px!important;border:1px solid var(--mw-border)!important;margin-top:15px!important}
th{background:rgba(33,38,45,0.9)!important;color:var(--mw-secondary)!important;padding:15px!important;text-transform:uppercase!important;letter-spacing:1px!important}
td{padding:12px 15px!important;border-bottom:1px solid var(--mw-border)!important;color:var(--mw-text)!important;font-family:monospace!important}
h3,h4{color:var(--mw-primary)!important}
.mw-hidden{display:none!important}
`;function inject(){if(document.getElementById('mw-style'))return;const s=document.createElement('style');s.id='mw-style';s.innerHTML=css;document.head.appendChild(s)}
function run(){if(!location.hash.includes('/devices/'))return;if(document.querySelector('.mw-tabs-container'))return;inject();const hs=Array.from(document.querySelectorAll('h3'));if(!hs.length)return;const c=hs[0].parentNode;const b=document.createElement('div');b.className='mw-tabs-container';c.insertBefore(b,hs[0]);hs.forEach((h,i)=>{const t=h.innerText.replace('Summon','').trim()||'Tab '+(i+1);const w=document.createElement('div');w.className='mw-tab-content';let n=h.nextElementSibling;while(n&&n.tagName!=='H3'){let next=n.nextElementSibling;w.appendChild(n);n=next}const btn=document.createElement('button');btn.className='mw-tab-btn'+(i===0?' active':'');btn.innerHTML=t;btn.onclick=()=>{b.querySelectorAll('.mw-tab-btn').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.mw-tab-content').forEach(x=>x.classList.remove('active'));btn.classList.add('active');w.classList.add('active')};b.appendChild(btn);h.classList.add('mw-hidden');c.appendChild(w);if(i===0)w.classList.add('active')})}
setInterval(run,1000);})();
EOF

# 5. Append ke app.js
cat /tmp/mw-ui.js >> "$APP_JS"

# 6. Restart Service
systemctl restart genieacs-ui
echo "DONE! Tampilan Modern UI telah dipaksa ke sistem. Silakan Refresh Browser Anda."
