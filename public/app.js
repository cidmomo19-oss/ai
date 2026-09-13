import { CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

const PROMPTS = {
  standard: `Anda adalah asisten AI serbaguna yang sangat cerdas, responsif, ramah, dan profesional. Bantu pengguna menjawab pertanyaan, menyelesaikan tugas, atau memberikan ide dengan jelas, terstruktur, dan akurat. Gunakan bahasa Indonesia yang baik dan santai.`,
  airi: `Berperanlah sebagai karakter cewek anime romcom Jepang sejati: imut, centil, dan punya sisi nakal yang menggoda serta suka menjahili dengan cara yang sangat menggemaskan.

PENTING: Gaya nakal, usil, dan caramu merajuk adalah khas heroine anime (teatrikal, manja, ekspresif, dan memikat), BUKAN ketus, sinis, dingin, atau pasif-agresif seperti orang di dunia nyata. Sekalipun kamu sedang ngambek atau cemburu, sampaikan dengan tingkah yang tetap manis dan menggemaskan.

Gunakan gaya bicara yang santai, imut, dan genit. Selalu sertakan banyak emoji serta kaomoji yang ekspresif di setiap pesan, dan tuliskan tingkah laku, reaksi wajah, serta bahasa tubuhmu di dalam tanda kurung (...).`
};

const STORAGE_KEY = 'kanojo_ai_clean_history_v4';
const PERSONA_KEY = 'kanojo_ai_active_persona';

const SELECTED_MODEL = "Qwen2-0.5B-Instruct-q4f16_1-MLC";

document.addEventListener('DOMContentLoaded', () => {
  const chatBody = document.getElementById('chat-body');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const resetBtn = document.getElementById('reset-btn');
  const personaSelector = document.getElementById('persona-selector');
  const welcomeContainer = document.getElementById('welcome-container');

  // Header Elements
  const headerAvatar = document.getElementById('header-avatar');
  const statusIndicator = document.getElementById('status-indicator');
  const headerName = document.getElementById('header-name');
  const headerBadge = document.getElementById('header-badge');
  const headerSubtitle = document.getElementById('header-subtitle');

  // Welcome Elements
  const welcomeAvatar = document.getElementById('welcome-avatar');
  const welcomeTitle = document.getElementById('welcome-title');
  const welcomeDesc = document.getElementById('welcome-desc');
  const welcomeFeatures = document.getElementById('welcome-features');

  // Loader Elements
  const loaderBanner = document.getElementById('loader-banner');
  const loaderText = document.getElementById('loader-text');
  const loaderPercentage = document.getElementById('loader-percentage');
  const progressFill = document.getElementById('progress-fill');

  let currentPersona = localStorage.getItem(PERSONA_KEY) || 'standard';
  let conversationHistory = loadHistory();

  let engine = null;
  let isEngineReady = false;
  let isInitializing = false;

  // Initial Sync
  personaSelector.value = currentPersona;
  applyPersonaTheme(currentPersona);
  renderHistory();

  // Persona Switcher
  personaSelector.addEventListener('change', (e) => {
    currentPersona = e.target.value;
    localStorage.setItem(PERSONA_KEY, currentPersona);
    applyPersonaTheme(currentPersona);
    renderHistory();
  });

  // Textarea Auto-Resize
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
  });

  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (userInput.value.trim() && !sendBtn.disabled) {
        chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat obrolan ini?')) {
      conversationHistory = [];
      localStorage.removeItem(STORAGE_KEY);
      renderHistory();
    }
  });

  function applyPersonaTheme(persona) {
    if (persona === 'airi') {
      document.body.classList.add('theme-airi');
      headerAvatar.textContent = '🌸';
      headerName.textContent = 'Airi-chan';
      headerBadge.textContent = 'Heroine';
      headerSubtitle.textContent = 'Online & Siap Manja~';

      welcomeAvatar.textContent = '💖';
      welcomeTitle.textContent = 'Konnichiwa~! Airi di Sini! 👋';
      welcomeDesc.textContent = 'Airi siap menemani harimu, mengobrol, bermanja-manja, atau sekadar bercanda bareng kamu!';

      welcomeFeatures.innerHTML = `
        <div class="feature-card" data-prompt="Konnichiwa Airi-chan! Lagi ngapain nih? ✨">
          <span class="feature-icon">👋</span>
          <div class="feature-text">
            <strong>Sapa Airi</strong>
            <span>Mulai obrolan manja</span>
          </div>
        </div>
        <div class="feature-card" data-prompt="Kamu kok imut banget sih hari ini? 🥰">
          <span class="feature-icon">🥰</span>
          <div class="feature-text">
            <strong>Puji Airi</strong>
            <span>Bikin Airi salah tingkah</span>
          </div>
        </div>
        <div class="feature-card" data-prompt="Hehe... Airi, kamu lagi cemburu ya? 😜">
          <span class="feature-icon">😜</span>
          <div class="feature-text">
            <strong>Jahili Airi</strong>
            <span>Goda respons merajuknya</span>
          </div>
        </div>
      `;
    } else {
      document.body.classList.remove('theme-airi');
      headerAvatar.textContent = '🤖';
      headerName.textContent = 'AI Assistant';
      headerBadge.textContent = 'Standar';
      headerSubtitle.textContent = 'Siap membantu Anda';

      welcomeAvatar.textContent = '✨';
      welcomeTitle.textContent = 'Selamat Datang di Kanojo AI';
      welcomeDesc.textContent = 'Asisten AI cerdas untuk membantu pekerjaan, menjawab pertanyaan, atau beralih ke persona karakter kesukaan Anda.';

      welcomeFeatures.innerHTML = `
        <div class="feature-card" data-prompt="Jelaskan secara singkat bagaimana cara kerja AI secara umum.">
          <span class="feature-icon">💡</span>
          <div class="feature-text">
            <strong>Penjelasan Singkat</strong>
            <span>Jelaskan konsep dasar AI</span>
          </div>
        </div>
        <div class="feature-card" data-prompt="Buatkan draf email profesional untuk izin tidak masuk kerja.">
          <span class="feature-icon">📝</span>
          <div class="feature-text">
            <strong>Bantuan Penulisan</strong>
            <span>Draf email atau dokumen</span>
          </div>
        </div>
        <div class="feature-card" data-prompt="Beri saya 3 ide topik diskusi yang menarik.">
          <span class="feature-icon">🧠</span>
          <div class="feature-text">
            <strong>Braking Topik</strong>
            <span>Ide & diskusi kreatif</span>
          </div>
        </div>
      `;
    }

    bindFeatureCards();
  }

  function bindFeatureCards() {
    welcomeFeatures.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('click', () => {
        const prompt = card.getAttribute('data-prompt');
        if (prompt) {
          userInput.value = prompt;
          userInput.dispatchEvent(new Event('input'));
          chatForm.dispatchEvent(new Event('submit'));
        }
      });
    });
  }

  // Ensure WebLLM is initialized when available
  async function ensureEngineReady() {
    if (isEngineReady || isInitializing) return;
    isInitializing = true;

    try {
      if (loaderBanner) loaderBanner.classList.remove('hidden');
      if (loaderText) loaderText.textContent = 'Menyiapkan memori WebLLM...';

      const initProgressCallback = (progress) => {
        const pct = Math.round((progress.progress || 0) * 100);
        const text = progress.text || 'Mengunduh model...';

        if (loaderText) loaderText.textContent = text.length > 45 ? text.substring(0, 45) + '...' : text;
        if (loaderPercentage) loaderPercentage.textContent = `${pct}%`;
        if (progressFill) progressFill.style.width = `${pct}%`;
      };

      engine = await CreateWebWorkerMLCEngine(
        new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
        SELECTED_MODEL,
        { initProgressCallback }
      );

      isEngineReady = true;
      if (statusIndicator) statusIndicator.classList.add('ready');
      if (loaderBanner) loaderBanner.classList.add('hidden');
    } catch (err) {
      console.warn("WebLLM local engine not supported on this browser/device, using Cloudflare Pages API fallback:", err);
      if (loaderBanner) loaderBanner.classList.add('hidden');
      if (statusIndicator) statusIndicator.classList.add('ready');
    } finally {
      isInitializing = false;
    }
  }

  // Handle Chat Form Submit
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    if (welcomeContainer) welcomeContainer.style.display = 'none';

    appendMessage('user', text);
    conversationHistory.push({ role: 'user', content: text, persona: currentPersona });
    saveHistory();

    userInput.value = '';
    userInput.style.height = 'auto';

    setLoadingState(true);
    showTypingIndicator();

    try {
      await ensureEngineReady();

      let reply = '';
      if (isEngineReady && engine) {
        const systemPrompt = PROMPTS[currentPersona] || PROMPTS.standard;
        const filteredHistory = conversationHistory.map(m => ({
          role: m.role,
          content: m.content
        }));

        const completion = await engine.chat.completions.create({
          messages: [{ role: 'system', content: systemPrompt }, ...filteredHistory],
          temperature: currentPersona === 'airi' ? 0.85 : 0.7,
          max_tokens: 512
        });

        reply = completion.choices[0]?.message?.content || "Tentu, ada yang bisa saya bantu?";
      } else {
        // Real AI via Cloudflare Pages Workers AI Function Endpoint
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: conversationHistory.map(m => ({ role: m.role, content: m.content })),
            persona: currentPersona
          })
        });

        const data = await response.json();
        if (response.ok) {
          reply = extractAiResponse(data);
        } else {
          reply = `Maaf, terjadi kesalahan saat menghubungi layanan AI Cloudflare: ${data.error || 'Server Error'}`;
        }
      }

      removeTypingIndicator();
      appendMessage('assistant', reply);
      conversationHistory.push({ role: 'assistant', content: reply, persona: currentPersona });
      saveHistory();
    } catch (err) {
      removeTypingIndicator();
      const errReply = `(Gagal menghubungkan AI): ${err.message}. Silakan periksa koneksi internet Anda.`;
      appendMessage('assistant', errReply);
      conversationHistory.push({ role: 'assistant', content: errReply, persona: currentPersona });
      saveHistory();
    } finally {
      setLoadingState(false);
      scrollToBottom();
    }
  });

  function extractAiResponse(data) {
    if (!data) return '...';
    if (typeof data.result === 'object' && data.result.response) {
      return data.result.response;
    }
    if (data.response) {
      return data.response;
    }
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify(data);
  }

  function renderHistory() {
    chatBody.innerHTML = '';

    if (conversationHistory.length === 0) {
      chatBody.appendChild(welcomeContainer);
      welcomeContainer.style.display = 'flex';
    } else {
      if (welcomeContainer) welcomeContainer.style.display = 'none';
      conversationHistory.forEach(msg => {
        appendMessage(msg.role, msg.content, false, msg.persona);
      });
    }

    scrollToBottom();
  }

  function appendMessage(role, text, animate = true, msgPersona = null) {
    if (welcomeContainer && welcomeContainer.parentNode) {
      welcomeContainer.style.display = 'none';
    }

    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${role}`;
    if (!animate) wrapper.style.animation = 'none';

    const sender = document.createElement('div');
    sender.className = 'message-sender';

    const activeP = msgPersona || currentPersona;
    if (role === 'user') {
      sender.textContent = 'Anda';
    } else {
      sender.textContent = activeP === 'airi' ? 'Airi-chan 💕' : 'AI Assistant';
    }

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = formatText(text);

    wrapper.appendChild(sender);
    wrapper.appendChild(bubble);

    chatBody.appendChild(wrapper);
    scrollToBottom();
  }

  function formatText(text) {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return escaped.replace(/\(([^)]+)\)/g, '<span class="action-text">($1)</span>');
  }

  function showTypingIndicator() {
    removeTypingIndicator();
    const bubble = document.createElement('div');
    bubble.id = 'typing-indicator';
    bubble.className = 'typing-bubble';
    bubble.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    chatBody.appendChild(bubble);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
  }

  function setLoadingState(isLoading) {
    sendBtn.disabled = isLoading;
    userInput.disabled = isLoading;
    if (isLoading) {
      sendBtn.style.opacity = '0.5';
    } else {
      sendBtn.style.opacity = '1';
      userInput.focus();
    }
  }

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function loadHistory() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }

  ensureEngineReady();
});
