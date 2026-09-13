# 🤖 Kanojo AI - Professional Smart Assistant & Roleplay Persona Chat

Aplikasi AI Chat modern, elegan, dan profesional yang mendukung dua mode utama:
1. **🤖 Mode AI Standar**: Asisten AI cerdas serbaguna untuk membantu tugas, ide, penulisan dokumen, dan diskusi umum.
2. **🌸 Airi-chan (Anime Romcom Roleplay)**: Persona karakter cewek anime romcom Jepang yang imut, centil, dan suka menjahili dengan cara menggemaskan.

---

## ✨ Fitur Utama
- 🎨 **Desain Profesional & Simetris**: Antarmuka responsif mobile-first yang bersih, modern, dan nyaman digunakan.
- 🔀 **Multi-Persona Switcher**: Bebas beralih antara Asisten AI Standar dan Persona Airi-chan dari menu dropdown di header secara instan.
- ⚡ **WebLLM In-Browser & Local Fallback Engine**: AI berjalan langsung di browser tanpa memerlukan API Key pihak ketiga.
- 💬 **Bantuan Cepat (Feature Cards)**: Opsi kartu pertanyaan cepat untuk memulai obrolan dengan 1 klik.
- 📱 **100% Mobile Ready**: Didesain khusus untuk layar HP & tablet.

---

## 🚀 Cara Deploy ke Cloudflare Pages (Gratis & Bebas API Key)

Dideploy dengan mudah lewat browser HP dalam 2 menit:

1. Buka [github.com](https://github.com) dan fork/simpan repositori ini.
2. Buka Dashboard Cloudflare: **[dash.cloudflare.com](https://dash.cloudflare.com)**.
3. Klik **Workers & Pages** -> **Create Application** -> tab **Pages** -> **Connect to Git**.
4. Pilih repository `kanojo-ai-chat`.
5. Pengaturan Build:
   - **Framework preset**: `None`
   - **Build command**: *(Biarkan kosong)*
   - **Build output directory**: `public`
6. Klik **Save and Deploy**.

---

## 📁 Struktur File Project

```text
├── public/
│   ├── index.html      # Tampilan UI Chat Profesional Multi-Mode
│   ├── style.css       # Styling Modern & Tema Dynamic Switcher
│   ├── app.js          # Logika Persona Switcher & Engine Integration
│   └── worker.js       # Background Web Worker AI Engine
├── wrangler.toml       # Konfigurasi Cloudflare Pages
└── README.md           # Dokumen resmi project
```
