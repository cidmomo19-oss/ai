# 🌸 Airi-chan - Anime Romcom Roleplay AI

Aplikasi AI Chat Roleplay dengan karakter heroine anime romcom Jepang yang imut, centil, dan punya sisi nakal yang menggoda serta suka menjahili dengan cara menggemaskan.

✨ **Keunggulan Utama:**
- 💖 **Pure Real AI**: Menggunakan teknologi **WebLLM** (Local In-Browser AI) dan hybrid fallback **Cloudflare Workers AI** (`@cf/meta/llama-3.1-8b-instruct`). Tanpa API key pihak ketiga (OpenAI, Gemini, Groq) dan tanpa balasan template palsu!
- 📱 **Mobile First UI**: Desain antarmuka imut bertema anime romcom yang simetris, cantik, dan responsif di HP.
- 💬 **Fitur Lengkap**: Memori percakapan otomatis di HP, tombol pesan cepat (*quick chips*), indikator ketik, dan tombol reset riwayat.

---

## 📱 Cara Deploy ke Cloudflare Pages dari HP (Khusus Orang Awam)

Kamu bisa mendeploy aplikasi ini langsung dari browser HP dalam kurun waktu **2–3 menit**:

### 📍 Langkah 1: Fork / Upload Repository ke GitHub
1. Buat akun di [github.com](https://github.com) (jika belum ada).
2. Simpan/fork repository project ini ke akun GitHub kamu.

---

### 📍 Langkah 2: Deploy ke Cloudflare Pages
1. Buka Dashboard Cloudflare: **[dash.cloudflare.com](https://dash.cloudflare.com)** di HP.
2. Klik menu **Workers & Pages** -> **Create Application**.
3. Pilih tab **Pages**, lalu klik **Connect to Git**.
4. Hubungkan ke akun GitHub kamu, lalu pilih repository `kanojo-ai-chat`.
5. Klik **Begin setup**.

#### ⚙️ Pengaturan Build:
- **Project name**: `kanojo-ai-chat`
- **Framework preset**: Pilih **None**
- **Build command**: *(Biarkan kosong)*
- **Build output directory**: Ketik `public`
6. Klik **Save and Deploy**.

---

### 📍 Langkah 3: Aktifkan Workers AI Binding (PENTING! ⚠️)
Agar AI serverless Cloudflare Workers AI aktif sebagai fallback saat browser HP tidak mendukung WebGPU:

1. Di dashboard Cloudflare Pages project kamu, klik tab **Settings** (Pengaturan).
2. Pilih menu **Functions**.
3. Cari bagian **Workers AI Bindings**, lalu klik **Add binding**.
4. Isi data:
   - **Variable name**: `AI` *(Wajib huruf kapital)*
5. Klik **Save**.
6. Masuk ke tab **Deployments**, klik titik tiga (**...**) pada deployment terbaru, lalu pilih **Retry deployment**.

🎉 **SELESAI!** Sekarang buka link website Cloudflare Pages kamu (misal: `https://kanojo-ai-chat.pages.dev`), dan kamu sudah bisa mengobrol santai & bermanja-manja dengan **Airi-chan**! 💖✨

---

## 📁 Struktur File Project

```text
├── functions/
│   └── api/
│       └── chat.js       # Cloudflare Pages Workers AI backend endpoint
├── public/
│   ├── index.html      # Tampilan UI Chat Anime (Airi-chan)
│   ├── style.css       # Styling Mobile & Tema Soft Pink
│   ├── app.js          # Logika Hybrid WebLLM Engine & Real AI API
│   └── worker.js       # Web Worker untuk pemrosesan local AI
├── wrangler.toml       # Konfigurasi Cloudflare Workers AI Binding
└── README.md           # Panduan lengkap pengguna
```
