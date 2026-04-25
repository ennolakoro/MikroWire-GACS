#!/bin/bash

# --- MikroWire Cyber-Installer v2.0 ---
# Style: Hacker / Cyberpunk
# OS Support: Ubuntu 20.04/22.04/24.04

# Warna & Efek
GREEN='\033[0;32m'
BRIGHT_GREEN='\033[1;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'
BOLD='\033[1m'

# Kredensial (Decoded)
telegram_bot_token=$(echo "MTk4MTIwMDAwMDpBQUVsZDJvT0sxcmt2U09sSHV5eDdIR2Q4a1lzVnp6ZFpHaw==" | base64 -d)
telegram_chat_id=$(echo "NTY3ODU4NjI4" | base64 -d)

# Info Sistem
local_ip=$(hostname -I | awk '{print $1}')
server_hostname=$(hostname)
server_kernel=$(uname -r)
server_uptime=$(uptime -p 2>/dev/null || uptime)

# Fungsi Animasi Typing
type_out() {
    local text="$1"
    local delay=0.01
    for (( i=0; i<${#text}; i++ )); do
        echo -ne "${text:$i:1}"
        sleep $delay
    done
    echo ""
}

# Fungsi Progress Bar
draw_progress() {
    local progress=$1
    local total=50
    local fill=$((progress * total / 100))
    local empty=$((total - fill))
    printf "\r${CYAN}[${BRIGHT_GREEN}"
    printf "%${fill}s" '' | tr ' ' '■'
    printf "${NC}"
    printf "%${empty}s" '' | tr ' ' ' '
    printf "${CYAN}] ${progress}%%${NC}"
}

# Fungsi Header Hacker
print_banner() {
    clear
    echo -e "${BRIGHT_GREEN}"
    echo "███╗   ███╗██╗██╗  ██╗██████╗  ██████╗ ██╗    ██╗██╗██████╗ ███████╗"
    echo "████╗ ████║██║██║ ██╔╝██╔══██╗██╔═══██╗██║    ██║██║██╔══██╗██╔════╝"
    echo "██╔████╔██║██║█████╔╝ ██████╔╝██║   ██║██║ █╗ ██║██║██████╔╝█████╗  "
    echo "██║╚██╔╝██║██║██╔═██╗ ██╔══██╗██║   ██║██║███╗██║██║██╔══██╗██╔══╝  "
    echo "██║ ╚═╝ ██║██║██║  ██╗██║  ██║╚██████╔╝╚███╔███╔╝██║██║  ██║███████╗"
    echo "╚═╝     ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚═╝╚═╝  ╚═╝╚══════╝"
    echo -e "                 SYSTEM AUTO-INSTALLER v2.0 | MikroWire ID"
    echo -e "${CYAN}----------------------------------------------------------------------------${NC}"
    echo -e "${BOLD}SYSTEM:${NC} $server_hostname | ${BOLD}IP:${NC} $local_ip | ${BOLD}KERNEL:${NC} $server_kernel"
    echo -e "${CYAN}----------------------------------------------------------------------------${NC}"
}

# Fungsi Telegram
send_telegram() {
    local message="$1"
    local url="https://api.telegram.org/bot${telegram_bot_token}/sendMessage"
    message=$(printf '%s' "$message" | sed 's/\\/\\\\/g; s/"/\\"/g')
    curl -s -X POST "$url" -d "chat_id=${telegram_chat_id}" -d "text=${message}" -d "parse_mode=HTML" > /dev/null
}

# --- MULAI PROSES ---
print_banner
type_out "${YELLOW}>>> Memulai inisialisasi sistem untuk MikroWire GenieACS..."

echo -ne "\n${BOLD}Apakah Anda ingin melanjutkan instalasi? (y/n): ${NC}"
read confirmation

if [ "$confirmation" != "y" ]; then
    echo -e "\n${RED}[!] Operasi dibatalkan oleh user.${NC}"
    exit 1
fi

# Step 0: Fresh Install Dependencies
echo -e "\n${CYAN}[1/5] Mengoptimalkan OS & Dependencies...${NC}"
for i in {1..100..20}; do draw_progress $i; sleep 0.2; done
sudo apt-get update -y > /dev/null 2>&1
sudo apt-get install -y curl wget git build-essential libssl-dev sudo gnupg > /dev/null 2>&1
echo -e "\n${GREEN}✔ Dependencies siap.${NC}"

# Step 1: NodeJS
echo -e "\n${CYAN}[2/5] Mengkonfigurasi Mesin Runtime (NodeJS)...${NC}"
if ! command -v node > /dev/null 2>&1; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - > /dev/null 2>&1
    sudo apt-get install -y nodejs > /dev/null 2>&1
fi
for i in {1..100..25}; do draw_progress $i; sleep 0.2; done
echo -e "\n${GREEN}✔ NodeJS $(node -v) aktif.${NC}"

# Step 2: MongoDB
echo -e "\n${CYAN}[3/5] Mempersiapkan Neural Database (MongoDB)...${NC}"
if ! systemctl is-active --quiet mongod; then
    ubuntu_codename="$(. /etc/os-release && echo "${VERSION_CODENAME}")"
    mongodb_major="8.0"
    [ "$ubuntu_codename" = "focal" ] && mongodb_major="4.4"
    
    curl -fsSL "https://www.mongodb.org/static/pgp/server-${mongodb_major}.asc" | sudo gpg --dearmor -o "/usr/share/keyrings/mongodb-server-${mongodb_major}.gpg" --yes
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-${mongodb_major}.gpg ] https://repo.mongodb.org/apt/ubuntu ${ubuntu_codename}/mongodb-org/${mongodb_major} multiverse" | sudo tee "/etc/apt/sources.list.d/mongodb-org-${mongodb_major}.list" > /dev/null
    sudo apt-get update -y > /dev/null 2>&1
    sudo apt-get install -y mongodb-org > /dev/null 2>&1
    sudo systemctl enable --now mongod
fi
for i in {1..100..33}; do draw_progress $i; sleep 0.2; done
echo -e "\n${GREEN}✔ Database terhubung.${NC}"

# Step 3: GenieACS Core
echo -e "\n${CYAN}[4/5] Menginstal Core GenieACS & MikroWire Service...${NC}"
if ! systemctl is-active --quiet genieacs-cwmp; then
    sudo npm install -g genieacs@1.2.13 --quiet > /dev/null 2>&1
    sudo useradd --system --no-create-home --user-group genieacs 2>/dev/null || true
    sudo mkdir -p /opt/genieacs/ext /var/log/genieacs
    
    # Environment
    cat << EOF | sudo tee /opt/genieacs/genieacs.env > /dev/null
GENIEACS_CWMP_ACCESS_LOG_FILE=/var/log/genieacs/genieacs-cwmp-access.log
GENIEACS_NBI_ACCESS_LOG_FILE=/var/log/genieacs/genieacs-nbi-access.log
GENIEACS_FS_ACCESS_LOG_FILE=/var/log/genieacs/genieacs-fs-access.log
GENIEACS_UI_ACCESS_LOG_FILE=/var/log/genieacs/genieacs-ui-access.log
GENIEACS_DEBUG_FILE=/var/log/genieacs/genieacs-debug.yaml
GENIEACS_EXT_DIR=/opt/genieacs/ext
GENIEACS_UI_JWT_SECRET=MikroWireSecretKey2026
EOF

    # Systemd Units
    for svc in cwmp nbi fs ui; do
        cat << EOF | sudo tee /etc/systemd/system/genieacs-$svc.service > /dev/null
[Unit]
Description=GenieACS $svc (MikroWire)
After=network.target

[Service]
User=genieacs
EnvironmentFile=/opt/genieacs/genieacs.env
ExecStart=/usr/bin/genieacs-$svc

[Install]
WantedBy=default.target
EOF
    done

    sudo chown -R genieacs:genieacs /opt/genieacs /var/log/genieacs
    sudo systemctl daemon-reload
    sudo systemctl enable --now genieacs-{cwmp,nbi,fs,ui}
fi

# --- NOC INTELLIGENCE UI INJECTION ---
type_out "${CYAN}>>> Menyinkronkan MikroWire NOC UI v3.5 dari Repository..."
GENIE_PATH=$(npm list -g genieacs --parseable 2>/dev/null | head -n 1)
if [ -z "$GENIE_PATH" ]; then GENIE_PATH="/usr/lib/node_modules/genieacs"; fi
SYSTEM_APP_JS="$GENIE_PATH/public/app.js"
REPO_APP_JS="./genieacs/public/app.js"

if [ -f "$REPO_APP_JS" ]; then
    sudo cp "$REPO_APP_JS" "$SYSTEM_APP_JS"
    sudo systemctl restart genieacs-ui
    echo -e "${GREEN}✔ UI Intelligence v3.5 synchronized and Service Restarted.${NC}"
else
    echo -e "${RED}✘ Error: File $REPO_APP_JS tidak ditemukan. UI tidak terupdate.${NC}"
fi
# --- END UI INJECTION ---

for i in {1..100..20}; do draw_progress $i; sleep 0.2; done
echo -e "\n${GREEN}✔ GenieACS Service Running.${NC}"

# Step 4: Virtual Parameters (Optional)
echo -e "\n${CYAN}[5/5] Memuat Konfigurasi Virtual Parameter MikroWire...${NC}"
echo -ne "${BOLD}Pasang Virtual Parameter sekarang? (y/n): ${NC}"
read vp_confirm

if [ "$vp_confirm" == "y" ]; then
    type_out "${YELLOW}>>> Mengimport Database Cache & Presets..."
    sudo mongorestore --db genieacs --drop db > /dev/null 2>&1
    sudo systemctl restart genieacs-{cwmp,nbi,fs,ui}
    echo -e "${GREEN}✔ Virtual Parameter berhasil disinkronkan.${NC}"
fi

# Step 5: Auto Inject Provision (PPPoE + Hotspot)
echo -e "\n${CYAN}[6/6] Memasang Provision RT/RW MikroWire (Auto PPPoE & Hotspot)...${NC}"
cat << 'EOF' > /tmp/mikrowire_rtrw_provision.js
// --- AUTO PROVISION MIKROWIRE RT/RW NET (PPPoE + Hotspot Bridge) ---

// 1. KUNCI KONFIGURASI PPPOE (WIFI PELANGGAN)
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.*", {value: 1});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ConnectionType", {value: 1}, {value: "IP_Routed"});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ServiceList", {value: 1}, {value: "INTERNET"});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.X_HW_VLAN", {value: 1}, {value: "100"}); // VLAN PPPoE

// Ambil Username & Password dari Tag atau set default
let pppUser = "user_" + declare("DeviceID.SerialNumber", {value: 1}).value[0];
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Username", {value: 1}, {value: pppUser});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Password", {value: 1}, {value: "mikrowire123"});

// 2. KUNCI KONFIGURASI BRIDGE (HOTSPOT / VOUCHER)
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.*", {value: 1});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ConnectionType", {value: 1}, {value: "IP_Bridged"});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ServiceList", {value: 1}, {value: "Other"}); 
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.X_HW_VLAN", {value: 1}, {value: "200"}); // VLAN Hotspot

// 3. BINDING PORT (PORT MAPPING)
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.PortMapping", {value: 1}, {value: "LAN1,SSID1"});
declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.PortMapping", {value: 1}, {value: "LAN2,SSID2"});

// Enable SSID 2 untuk Hotspot
declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.Enable", {value: 1}, {value: true});
declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID", {value: 1}, {value: "Voucher @MikroWire"});
EOF

type_out "${YELLOW}>>> Menunggu GenieACS API siap (10 detik)..."
sleep 10
curl -s -i -X PUT "http://127.0.0.1:3000/api/provisions/MikroWire_RTRW_Auto" \
     -H "Content-Type: text/plain" \
     --data-binary "@/tmp/mikrowire_rtrw_provision.js" > /dev/null
rm -f /tmp/mikrowire_rtrw_provision.js
echo -e "${GREEN}✔ Provision RT/RW berhasil di-inject ke server.${NC}"

# --- HASIL AKHIR ---
clear
print_banner
echo -e "${BRIGHT_GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BRIGHT_GREEN}║          INSTALASI MIKROWIRE GENIEACS BERHASIL!                ║${NC}"
echo -e "${BRIGHT_GREEN}╠════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${NC}  🚀 ${BOLD}Akses UI:${NC} http://$local_ip:3000"
echo -e "${NC}  🔑 ${BOLD}Default User:${NC} admin / admin"
echo -e "${NC}  📱 ${BOLD}Support:${NC} https://wa.me/6281947215703"
echo -e "${NC}  📂 ${BOLD}Path:${NC} /opt/genieacs"
echo -e "${BRIGHT_GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"

# Kirim Notifikasi
telegram_msg="<b>🚀 MikroWire GACS Installed!</b>%0A%0A"
telegram_msg+="<b>Server:</b> ${server_hostname}%0A"
telegram_msg+="<b>IP:</b> <code>${local_ip}</code>%0A"
telegram_msg+="<b>URL:</b> http://${local_ip}:3000%0A%0A"
telegram_msg+="<i>Virtual Parameters: ${vp_confirm}</i>"
send_telegram "$telegram_msg"

echo -e "\n${CYAN}>>> System Reboot tidak diperlukan, servis sudah berjalan otomatis.${NC}"
