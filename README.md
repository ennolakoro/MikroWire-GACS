# 🛠️ MikroWire GACS - NOC Intelligence Edition v3.0

![Logo](logo.svg)

**MikroWire GACS** adalah solusi kustomisasi **GenieACS** tercanggih yang dirancang khusus untuk ISP, RT-RW Net, dan Network Operations Center (NOC). Proyek ini mengubah standar GenieACS menjadi dashboard monitoring yang intuitif, indah, dan otomatis.

---

## ✨ Fitur Unggulan

### 📊 NOC Intelligence Dashboard
Antarmuka pengguna (UI) yang telah direvolusi dengan estetika **Cyber-Modern**:
- **Glassmorphism UI**: Tampilan transparan yang elegan dengan efek blur dan pendar (glow).
- **Smart Tab System**: Navigasi parameter perangkat yang panjang kini dikelompokkan secara otomatis ke dalam kategori (Summary, WAN, WLAN, dll).
- **Deep Monitoring**: Pantau Uptime Device, PPPoE Uptime, RX Power, dan Suhu secara real-time dengan tampilan yang rapi.

### 🤖 Integrated Telegram Bot
Kelola ribuan perangkat langsung dari genggaman Anda:
- **Status Check**: Kirim SN/Username ke bot untuk melihat kondisi koneksi pelanggan.
- **Quick Actions**: Reboot device, ganti nama WiFi (SSID), dan ganti Password WiFi hanya dalam satu klik.
- **Customer Self-Service**: Pelanggan bisa melakukan reset password WiFi mandiri tanpa mengganggu admin.

### ⚡ Cyber-Installer (Full Automation)
Sistem instalasi **Zero-Config**:
- **Native-Hard Injection**: Skrip instalasi otomatis menyuntikkan (inject) tema kustom langsung ke kode produksi GenieACS.
- **Auto-Provision Ready**: Sudah termasuk preset untuk Auto RT/RW (PPPoE + Hotspot Bridge) untuk berbagai manufaktur (ZTE, Huawei, FiberHome).
- **One-Click Deploy**: Cukup jalankan satu skrip, server siap digunakan.

---

## 📸 Tampilan Dashboard

| Summary Overview | Connection Details |
| :---: | :---: |
| ![Summary](https://github.com/user-attachments/assets/d2689a26-9eed-4449-a0d3-2edffddd7bc6) | ![Details](https://github.com/user-attachments/assets/c13ed312-d007-4cc2-987d-e82f171dd7ce) |

| Multi-Tab Interface | WiFi Management |
| :---: | :---: |
| ![Tabs](https://github.com/user-attachments/assets/fdf7acae-cd32-404d-a50e-d77b59156ea5) | ![WiFi](https://github.com/user-attachments/assets/2d530df8-beb3-493e-ad04-8bafbc39ad3f) |

---

## 🚀 Cara Instalasi (Fresh OS)

Mendukung OS: **Ubuntu 20.04 / 22.04 / 24.04**

1. **Update & Install Dependencies**
```bash
sudo apt update && sudo apt install git curl -y
```

2. **Clone Repository**
```bash
git clone https://github.com/ennolakoro/MikroWire-GACS.git
cd MikroWire-GACS
```

3. **Jalankan Cyber-Installer**
```bash
chmod +x darkmode.sh
sudo ./darkmode.sh
```

---

## ⚙️ Akses Default

- **Web UI**: `http://ip-server:3000`
- **Username**: `admin`
- **Password**: `admin`
- **API Port**: `7557`
- **CWMP (TR-069)**: `http://ip-server:7547`

---

## ⚠️ Catatan Penting
- Instalasi ini akan menimpa database `genieacs` yang sudah ada. 
- Jika Anda memiliki konfigurasi kustom, silakan backup database MongoDB Anda terlebih dahulu.
- Untuk mengaktifkan fitur Bot, silakan konfigurasi API Token di folder `telebot-acs-main/config.js`.

---

## 🤝 Kontribusi & Dukungan

Dibuat dengan ❤️ oleh **MikroWire Digital Network**.

- **WhatsApp**: [+62 819-4721-5703](https://wa.me/6281947215703)
- **Telegram Group**: [@mikrowireAcs](https://t.me/mikrowireAcs)
- **Donasi Uang Kopi**: [PayPal.me/warnetmikrowireID](https://paypal.me/warnetmikrowireID)

---
*© 2026 MikroWire Digital Network. All Rights Reserved.*
