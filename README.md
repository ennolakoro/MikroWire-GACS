# 🛠️ MikroWire GACS - NOC Intelligence Final Edition v18.0

![Logo](logo.svg)

**MikroWire GACS v18.0** adalah mahakarya final dalam kustomisasi **GenieACS**, yang dirancang khusus untuk stabilitas tingkat tinggi (Enterprise-Grade) pada infrastruktur ISP, RT-RW Net, dan NOC. Versi ini mengakhiri semua masalah UI/UX dan sinkronisasi data yang ada pada versi sebelumnya.

---

## ✨ Fitur Unggulan v18.0 (Final Absolute)

### 📊 NOC Intelligence Dashboard
Antarmuka pengguna yang telah direvolusi dengan estetika **Quantum-Hacker**:
- **Total Color Harmony**: Seluruh sistem (Header, Body, Navigasi) kini memiliki sinkronisasi warna gelap MikroWire yang sempurna tanpa ada sisa warna default.
- **V-DOM Mastermind Sync**: Menggunakan teknologi `MutationObserver` untuk menjamin tampilan tetap sinkron dan stabil meskipun framework asli melakukan update data real-time.
- **Smart Tab System**: Navigasi parameter perangkat yang panjang diringkas ke dalam kategori elit: **NETWORK**, **WIRELESS**, dan **SYSTEM**.
- **ISP-Grade HUD**: Bar statistik (IP, Uptime, Inform) yang melayang di atas, tetap sinkron secara real-time dengan modem.

### 🤖 Network Transparency & Protection
- **Fault Immunity**: Pesan kesalahan sistem (Connection Request Timeout, dll) tidak akan pernah tersembunyi, memberikan kejujuran total saat Anda melakukan `Commit`.
- **VPS NAT Optimized**: Dilengkapi dengan panduan teknis (`solusi_offline.txt`) untuk menangani masalah modem di belakang NAT/STUN saat diinstall di VPS.

### ⚡ Ultra-Stable Hunter Patcher
- **Deep-System Injection**: Skrip installer secara cerdas menyisir seluruh file sistem (termasuk file yang di-hash oleh sistem) untuk memastikan tema MikroWire terpasang secara permanen.
- **Zero-Blank Guarantee**: Arsitektur non-destruktif menjamin tidak akan ada lagi masalah "Blank Page" atau menu hilang secara tiba-tiba.

---

## 🚀 Cara Instalasi (Fresh OS)

Mendukung OS: **Ubuntu 20.04 / 22.04 / 24.04**

1. **Persiapan Dependencies**
```bash
sudo apt update && sudo apt install git curl -y
```

2. **Clone & Deploy**
```bash
git clone https://github.com/ennolakoro/MikroWire-GACS.git
cd MikroWire-GACS
chmod +x darkmode.sh
sudo ./darkmode.sh
```

---

## 🛠️ Panduan Pemeliharaan
- **Hapus Total & Install Ulang**: Lihat file `caraapus.txt`.
- **Solusi Modem Offline (NAT)**: Lihat file `solusi_offline.txt`.

---

## 🤝 Kontribusi & Dukungan

Dibuat dengan dedikasi penuh oleh **MikroWire Digital Network**.

- **WhatsApp**: [+62 819-4721-5703](https://wa.me/6281947215703)
- **Telegram Group**: [@mikrowireAcs](https://t.me/mikrowireAcs)
- **Donasi Uang Kopi**: [PayPal.me/warnetmikrowireID](https://paypal.me/warnetmikrowireID)

---
*© 2026 MikroWire Digital Network. All Rights Reserved. "Built for Network Masters."*
