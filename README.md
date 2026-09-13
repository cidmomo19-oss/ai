# 🌸 Kanojo AI - Offline Anime Romcom Roleplay Chat (WebLLM / In-Browser AI)

Aplikasi AI Chat Roleplay dengan karakter heroine anime romcom Jepang yang imut, centil, dan suka menjahili secara menggemaskan.

✨ **Keunggulan Utama Offline AI:**
- 📴 **100% OFFLINE & TANPA KUOTA WORKERS**: AI berjalan sepenuhnya langsung di dalam browser HP kamu. **Bebas boros kuota Cloudflare / API key selamanya!**
- 📁 **Fitur Impor & Mirror Model Manual**: Jika download online bawaan terasa lambat, kamu dapat mengklik tombol **📁** di kanan atas header aplikasi untuk:
  - Menggunakan **Mode Engine Instant Ringan** (tanpa download, langsung bisa chat, hemat RAM HP 4GB).
  - Memasukkan **Tautan/URL Mirror Kustom** pilihanmu (misal HuggingFace mirror lokal terdekat).
  - Mengimpor file model AI lokal dari penyimpanan HP.
- 📱 **Mobile First UI**: Desain antarmuka imut bertema anime romcom khusus HP.
- 💬 **Fitur Lengkap**: Memori percakapan otomatis di HP, tombol pesan cepat (*quick chips*), dan hapus riwayat.

---

## 🚀 Cara Menggunakan & Deploy ke Cloudflare Pages dari HP

Karena AI berjalan 100% di browser HP kamu, kamu hanya perlu mendeploy file web statis ini ke Cloudflare Pages:

### 📍 Langkah Deploy:
1. Buka [github.com](https://github.com) dan pastikan repo ini ada di akun GitHub milikmu.
2. Buka Dashboard Cloudflare: **[dash.cloudflare.com](https://dash.cloudflare.com)** di browser HP.
3. Klik **Workers & Pages** -> **Create Application** -> pilih tab **Pages** -> klik **Connect to Git**.
4. Pilih repository `kanojo-ai-chat`.
5. Pengaturan Build:
   - **Framework preset**: None
   - **Build command**: *Biarkan kosong*
   - **Build output directory**: Ketik `public`
6. Klik **Save and Deploy**. Selesai!

---

## 📁 Struktur File Project

```text
├── public/
│   ├── index.html      # Tampilan UI Chat Anime + Dialog Impor Model (📁)
│   ├── style.css       # Styling Mobile & Modal UI Soft Pink
│   ├── app.js          # Logika WebLLM Client Engine, Model Switcher & Persona
│   └── worker.js       # Web Worker pemrosesan AI di background
├── wrangler.toml       # Konfigurasi Cloudflare Pages Output
└── README.md           # Panduan lengkap pengguna
```

---

## 💖 Karakter AI (Prompt System)
Airi-chan diprogram khusus dengan kepribadian:
- Teatrikal, manja, ekspresif, dan memikat khas heroine anime romcom.
- Menggunakan bahasa tubuh di dalam kurung `(...)` serta banyak emoji & kaomoji `(⁠>⁠<⁠)♡`.
- Bebas mengekspresikan spektrum emosi (cemburu, ngambek, usil) dengan gaya yang selalu manis dan tidak pernah dingin.
