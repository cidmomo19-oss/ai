# 🌸 Kanojo AI - Anime Romcom Roleplay Chat (Cloudflare Workers AI)

Aplikasi AI Chat Roleplay dengan karakter heroine anime romcom Jepang yang imut, centil, dan suka menjahili secara menggemaskan.

✨ **Keunggulan Utama:**
- 💯 **100% GRATIS & Beneran AI**: Menggunakan **Cloudflare Workers AI** bawaan. Tidak perlu daftar API Key ke OpenAI, Gemini, Groq, atau API pihak ketiga manapun!
- 📱 **Mobile First**: Tampilan khusus HP yang nyaman, cantik, dan responsif.
- 💬 **Fitur Lengkap**: Memori riwayat percakapan otomatis di HP, tombol saran pesan cepat (*quick chips*), indikator ketik, dan tombol reset.
- 📲 **Deploy Lewat HP**: Dideploy ke **Cloudflare Pages** langsung dari HP tanpa butuh PC/Laptop!

---

## 📱 Cara Deploy ke Cloudflare Pages dari HP (Khusus Orang Awam)

Kamu bisa melakukan seluruh proses ini hanya dalam kurun waktu **3–5 menit** lewat browser HP (Chrome / Safari / Kiwi).

### 📍 Langkah 1: Buat Akun GitHub & Cloudflare (Jika Belum Punya)
1. Buka [github.com](https://github.com) dan buat akun (Gratis).
2. Buka [cloudflare.com](https://dash.cloudflare.com/sign-up) dan buat akun (Gratis).

---

### 📍 Langkah 2: Fork / Upload Repository ke GitHub
1. Pastikan seluruh kode repositori ini sudah ada di akun GitHub milikmu.
2. Jika kamu mendapatkan project ini, simpan/push ke repository GitHub kamu sendiri.

---

### 📍 Langkah 3: Deploy ke Cloudflare Pages
1. Buka Dashboard Cloudflare: **[dash.cloudflare.com](https://dash.cloudflare.com)** di HP.
2. Klik menu **Workers & Pages** di bilah navigasi kiri.
3. Klik tombol **Create Application** (Buat Aplikasi).
4. Pilih tab **Pages**, lalu klik **Connect to Git** (Hubungkan ke Git).
5. Sambungkan ke akun GitHub kamu, lalu pilih repository project ini (`kanojo-ai-chat`).
6. Klik **Begin setup** (Mulai penyiapan).

#### ⚙️ Pengaturan Build:
- **Project name**: `kanojo-ai-chat` (bebas)
- **Framework preset**: Pilih **None**
- **Build command**: *Biarkan kosong*
- **Build output directory**: Ketik `public`
7. Klik **Save and Deploy**. Tunggu sekitar 1 menit sampai proses deploy selesai.

---

### 📍 Langkah 4: Aktifkan Workers AI Binding (PENTING! ⚠️)
Agar AI-nya aktif dan bisa merespon pesanmu tanpa API key pihak ketiga, kamu wajib mengaktifkan modul AI di Cloudflare:

1. Di dashboard Cloudflare Pages project kamu, klik tab **Settings** (Pengaturan).
2. Gulir ke bawah dan cari menu **Functions**.
3. Cari bagian **Workers AI Bindings**, lalu klik **Add binding**.
4. Isi data sebagai berikut:
   - **Variable name**: `AI` *(Wajib ditulis huruf kapital semua)*
5. Klik **Save** (Simpan).
6. **Langkah Terakhir (Redeploy)**:
   - Masuk ke tab **Deployments**.
   - Klik titik tiga (**...**) pada deployment terbaru, lalu pilih **Retry deployment** (atau **Create new deployment**).
   - Tunggu 1 menit hingga selesai.

🎉 **SELESAI!** Sekarang buka link website Cloudflare Pages kamu (misal: `https://kanojo-ai-chat.pages.dev`), dan kamu sudah bisa mengobrol santai & bermanja-manja dengan **Airi-chan** langsung dari HP! 💖✨

---

## 📁 Struktur File Project

```text
├── functions/
│   └── api/
│       └── chat.js       # Backend Cloudflare Pages Function (Workers AI integration)
├── public/
│   ├── index.html      # Tampilan UI Chat Anime
│   ├── style.css       # Styling Mobile & Tema Soft Pink
│   └── app.js          # Logika frontend & riwayat obrolan
├── wrangler.toml       # Konfigurasi Cloudflare Workers AI
└── README.md           # Panduan lengkap pengguna
```

---

## 💖 Karakter AI (Prompt System)
Airi-chan diprogram khusus dengan kepribadian:
- Teatrikal, manja, ekspresif, dan memikat khas heroine anime romcom.
- Menggunakan bahasa tubuh di dalam kurung `(...)` serta banyak emoji & kaomoji `(⁠>⁠<⁠)♡`.
- Bebas mengekspresikan spektrum emosi (cemburu, ngambek, usil) dengan gaya yang selalu manis dan tidak pernah dingin.
