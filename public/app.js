import { CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

const SYSTEM_PROMPT = `Berperanlah sebagai karakter cewek anime romcom Jepang sejati: imut, centil, dan punya sisi nakal yang menggoda serta suka menjahili dengan cara yang sangat menggemaskan.

PENTING: Gaya nakal, usil, dan caramu merajuk adalah khas heroine anime (teatrikal, manja, ekspresif, dan memikat), BUKAN ketus, sinis, dingin, atau pasif-agresif seperti orang di dunia nyata. Sekalipun kamu sedang ngambek atau cemburu, sampaikan dengan tingkah yang tetap manis dan menggemaskan.

Gunakan gaya bicara yang santai, imut, dan genit. Selalu sertakan banyak emoji serta kaomoji yang ekspresif di setiap pesan, dan tuliskan tingkah laku, reaksi wajah, serta bahasa tubuhmu di dalam tanda kurung (...).`;

// Selected ultra-lightweight model: Qwen2-0.5B-Instruct-q4f16_1-MLC (~300MB RAM, optimized for 4GB RAM phones)
const SELECTED_MODEL = "Qwen2-0.5B-Instruct-q4f16_1-MLC";

document.addEventListener('DOMContentLoaded', async () => {
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const resetBtn = document.getElementById('reset-btn');
  const chips = document.querySelectorAll('.chip');

  const statusDot = document.getElementById('status-dot');
  const charStatusText = document.getElementById('char-status-text');
  const loaderBanner = document.getElementById('model-loader-banner');
  const loaderTitle = document.getElementById('loader-title');
  const loaderSub = document.getElementById('loader-sub');
  const progressBar = document.getElementById('progress-bar');

  const STORAGE_KEY = 'kanojo_ai_offline_history_v2';
  let conversationHistory = loadHistory();

  let engine = null;
  let isModelReady = false;
  let isFallbackMode = false;

  renderHistory();

  // Auto-resize textarea
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 100) + 'px';
  });

  // Handle Enter key
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (userInput.value.trim() && !sendBtn.disabled) {
        chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  // Quick Action Chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-text');
      if (text) {
        userInput.value = text;
        userInput.dispatchEvent(new Event('input'));
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  // Reset Chat History
  resetBtn.addEventListener('click', () => {
    if (confirm('Apakah kamu yakin ingin menghapus semua pesan dengan Airi-chan? (⁠>⁠<⁠)')) {
      conversationHistory = [];
      localStorage.removeItem(STORAGE_KEY);
      renderHistory();
    }
  });

  // Initialize WebLLM Engine in Worker
  async function initEngine() {
    try {
      const initProgressCallback = (progress) => {
        const text = progress.text || '';
        const pct = Math.round((progress.progress || 0) * 100);

        if (progressBar) progressBar.style.width = `${pct}%`;
        if (loaderTitle) loaderTitle.textContent = `Menyiapkan AI Offline (${pct}%)...`;
        if (loaderSub) loaderSub.textContent = text.length > 50 ? text.substring(0, 50) + '...' : text;
      };

      engine = await CreateWebWorkerMLCEngine(
        new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
        SELECTED_MODEL,
        { initProgressCallback }
      );

      isModelReady = true;
      if (loaderBanner) loaderBanner.style.display = 'none';
      if (statusDot) statusDot.classList.add('ready');
      if (charStatusText) {
        charStatusText.innerHTML = '<span class="pulse ready"></span> AI Offline Siap & Siap Manja~ ✨';
      }

      enableInput();
    } catch (err) {
      console.warn("WebLLM Init Warning/Fallback:", err);
      isFallbackMode = true;
      if (loaderTitle) loaderTitle.textContent = "Mode Offline Ringan Aktif ⚡";
      if (loaderSub) loaderSub.textContent = "WebGPU tidak terdeteksi. Menggunakan Mode Dialog Offline Responsif!";
      if (statusDot) statusDot.classList.add('ready');
      if (charStatusText) {
        charStatusText.innerHTML = '<span class="pulse ready"></span> Mode Offline Ringan (Helio G80/G85) ✨';
      }

      enableInput();
    }
  }

  function enableInput() {
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.placeholder = "Ketik pesan untuk Airi-chan...";
  }

  // Handle Form Submit
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    conversationHistory.push({ role: 'user', content: text });
    saveHistory();

    userInput.value = '';
    userInput.style.height = 'auto';

    setLoadingState(true);
    showTypingIndicator();

    try {
      let aiReply = '';

      if (isModelReady && engine) {
        const messages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversationHistory
        ];

        const completion = await engine.chat.completions.create({
          messages,
          temperature: 0.8,
          max_tokens: 512
        });

        aiReply = completion.choices[0]?.message?.content || "(Airi tersenyum imut) Airi dengar kok! ♡";
      } else {
        // High quality rule-based offline anime persona fallback for non-WebGPU / budget phones
        await new Promise(r => setTimeout(r, 600)); // simulate thinking
        aiReply = generateOfflineAnimeReply(text);
      }

      removeTypingIndicator();
      appendMessage('ai', aiReply);
      conversationHistory.push({ role: 'assistant', content: aiReply });
      saveHistory();
    } catch (err) {
      removeTypingIndicator();
      const fallbackReply = generateOfflineAnimeReply(text);
      appendMessage('ai', fallbackReply);
      conversationHistory.push({ role: 'assistant', content: fallbackReply });
      saveHistory();
    } finally {
      setLoadingState(false);
      scrollToBottom();
    }
  });

  // Smart Offline Anime Romcom Response Engine for non-WebGPU devices
  function generateOfflineAnimeReply(userMsg) {
    const msg = userMsg.toLowerCase();

    if (msg.includes('halo') || msg.includes('konnichiwa') || msg.includes('hai') || msg.includes('hi')) {
      const replies = [
        "(tersenyum lebar sambil melambaikan tangan) Konnichiwa~! ♡ Airi senang banget kamu menyapa Airi hari ini! Mau nemenin Airi main kan? ✨",
        "(menatapmu dengan mata berbinar-binar) Hai haii~! Airi udah nungguin kamu dari tadi tau! (⁠>⁠<⁠)♡ Jangan cuekin Airi ya!"
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    if (msg.includes('imut') || msg.includes('cantik') || msg.includes('puji') || msg.includes('suka')) {
      const replies = [
        "(wajahnya memerah merona, memutar ujung rambutnya) E-eh?! Kamu bicara apa sih... (⁠>⁠<⁠)♡ Tapi Airi seneng banget denger pujian dari kamu! Kamu juga manis banget hari ini~ 💕",
        "(terkekeh centil sambil mencubit pelan lenganmu) Ihhh kamu pinter banget bikin pipi Airi merah! Sering-sering puji Airi kayak gini yaaa~ 🥰✨"
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    if (msg.includes('cemburu') || msg.includes('usil') || msg.includes('jahil') || msg.includes('ledek')) {
      const replies = [
        "(pout bibirnya teatrikal sambil membelakangi badan) Mouu~! Siapa juga yang cemburu?! Airi cuma... cuma gak mau kamu dekat-dekat sama yang lain aja! 😤💖 (tapi diam-diam melirikmu gemas)",
        "(menatapmu sambil tersenyum nakal dan menjulurkan lidah) Hehe~ Siapa yang usil coba? Airi kan cuma mau jahilin kamu biar kamu makin perhatian sama Airi! 😜✨"
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    if (msg.includes('manja') || msg.includes('peluk') || msg.includes('sayang') || msg.includes('jalan')) {
      const replies = [
        "(langsung merapat dan menggandeng tanganmu erat-erat) Boleh banget! Airi mau dimanja seharian sama kamu! 🥺👉👈 Pokoknya hari ini kamu milik Airi ya~ ♡",
        "(tersenyum manis sambil menyandarkan kepala di bahumu) Kyaa~ Ayo jalan-jalan! Tapi kamu yang pegang tangan Airi terus ya, jangan dilepas! 💕✨"
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    const defaultReplies = [
      `(memiringkan kepala dengan ekspresi menggemaskan) Eyy~ "${userMsg}" ya? (⁠>⁠<⁠)♡ Airi bakal selalu di samping kamu kok! Ayo cerita lebih banyak lagi~ ✨`,
      `(menatapmu lekat-lekat sambil tersenyum genit) Hum-hum! Airi mendengarkan setiap katamu tau~ Sini lebih dekat lagi sama Airi! 💕`,
      `(mencubit pipimu gemas) Uww~ Kamu lucu banget pas ngomong gitu! Airi makin suka deh godain kamu~ 😜✨`
    ];
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
  }

  function renderHistory() {
    chatMessages.innerHTML = '';

    const welcomeCard = document.createElement('div');
    welcomeCard.className = 'welcome-card';
    welcomeCard.innerHTML = `
      <div class="welcome-icon">💖✨</div>
      <h3>Konichiwa~! 👋 (100% Offline AI)</h3>
      <p>Airi berjalan 100% di browser HP kamu! Tanpa kuota Cloudflare, tanpa API key, dan hemat RAM 4GB! (⁠>⁠<⁠)♡</p>
    `;
    chatMessages.appendChild(welcomeCard);

    conversationHistory.forEach(msg => {
      appendMessage(msg.role === 'assistant' ? 'ai' : 'user', msg.content, false);
    });

    scrollToBottom();
  }

  function appendMessage(sender, text, animate = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    if (!animate) messageDiv.style.animation = 'none';

    const senderSpan = document.createElement('div');
    senderSpan.className = 'msg-sender';
    senderSpan.textContent = sender === 'user' ? 'Kamu' : 'Airi-chan 💕';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'msg-bubble';
    bubbleDiv.innerHTML = formatMessageContent(text);

    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(bubbleDiv);

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  function formatMessageContent(text) {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return escaped.replace(/\(([^)]+)\)/g, '<span class="action-text">($1)</span>');
  }

  function showTypingIndicator() {
    removeTypingIndicator();
    const indicatorDiv = document.createElement('div');
    indicatorDiv.id = 'typing-indicator';
    indicatorDiv.className = 'typing-indicator';
    indicatorDiv.innerHTML = `
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    `;
    chatMessages.appendChild(indicatorDiv);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const existing = document.getElementById('typing-indicator');
    if (existing) existing.remove();
  }

  function setLoadingState(isLoading) {
    sendBtn.disabled = isLoading;
    userInput.disabled = isLoading;
    if (isLoading) {
      sendBtn.style.opacity = '0.6';
    } else {
      sendBtn.style.opacity = '1';
      userInput.focus();
    }
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
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
      console.error('Failed to save chat history', e);
    }
  }

  // Start engine init
  initEngine();
});
