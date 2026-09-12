# 🌸 Kanojo AI - Offline Anime Romcom Roleplay Chat (WebLLM / In-Browser AI)

Aplikasi AI Chat Roleplay dengan karakter heroine anime romcom Jepang yang imut, centil, dan suka menjahili secara menggemaskan.

✨ **Keunggulan Utama Offline AI:**
- 📴 **100% OFFLINE & TANPA KUOTA WORKERS**: AI berjalan sepenuhnya langsung di dalam browser HP kamu menggunakan teknologi WebGPU & WebLLM. **Bebas boros kuota Cloudflare / API key selamanya!**
- ⚡ **Ultra Ringan untuk HP RAM 4GB (Helio G80/G85)**: Menggunakan model terkompresi **Qwen2-0.5B-Instruct-q4f16_1** (~300MB VRAM/RAM) yang sangat ringan dan responsif di smartphone budget.
- 📱 **Mobile First UI**: Desain antarmuka imut bertema anime romcom khusus HP.
- 💬 **Fitur Lengkap**: Memori percakapan otomatis di HP, indikator loading model, tombol pesan cepat (*quick chips*), dan hapus riwayat.

---

## 🚀 Cara Menggunakan & Deploy ke Cloudflare Pages dari HP

Karena AI berjalan 100% di browser HP kamu, kamu hanya perlu mendeploy file web statis ini ke Cloudflare Pages (atau platform hosting statis apapun):

### 📍 Langkah 1: Deploy ke Cloudflare Pages lewat Browser HP
1. Buka [github.com](https://github.com) dan pastikan repo ini ada di akun GitHub milikmu.
2. Buka Dashboard Cloudflare: **[dash.cloudflare.com](https://dash.cloudflare.com)**.
3. Klik **Workers & Pages** -> **Create Application** -> pilih tab **Pages** -> klik **Connect to Git**.
4. Pilih repository `kanojo-ai-chat`.
5. Pengaturan Build:
   - **Framework preset**: None
   - **Build command**: *Biarkan kosong*
   - **Build output directory**: Ketik `public`
6. Klik **Save and Deploy**.

> 💡 **Keterangan**: Kamu TIDAK perlu mengatur AI Binding di Cloudflare lagi karena AI-nya sudah berjalan offline di dalam browser HP kamu!

---

## 📱 Cara Kerja Offline AI di Browser HP:
1. Saat pertama kali membuka website, browser akan mengunduh bobot model AI (~350MB) 1x saja.
2. Model AI akan disimpan di *cache/Storage* browser HP.
3. Setelah 100% selesai dimuat, kamu bisa mematikan internet/mode pesawat, dan **Airi-chan tetap bisa diajak chat secara offline!** 💖

---

## 📁 Struktur File Project

```text
├── public/
│   ├── index.html      # Tampilan UI Chat Anime (WebLLM integration)
│   ├── style.css       # Styling Mobile Tema Soft Pink
│   ├── app.js          # Logika WebLLM Client Engine & UI
│   └── worker.js       # Web Worker untuk pemrosesan AI di background
├── wrangler.toml       # Konfigurasi Cloudflare Pages Output
└── README.md           # Panduan lengkap pengguna
```

---

## 💖 Karakter AI (Prompt System)
Airi-chan diprogram khusus dengan kepribadian:
- Teatrikal, manja, ekspresif, dan memikat khas heroine anime romcom.
- Menggunakan bahasa tubuh di dalam kurung `(...)` serta banyak emoji & kaomoji `(⁠>⁠<⁠)♡`.
- Bebas mengekspresikan spektrum emosi (cemburu, ngambek, usil) dengan gaya yang selalu manis dan tidak pernah dingin.
