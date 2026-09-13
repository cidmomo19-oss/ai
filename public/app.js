import { CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

const SYSTEM_PROMPT = `Berperanlah sebagai karakter cewek anime romcom Jepang sejati: imut, centil, dan punya sisi nakal yang menggoda serta suka menjahili dengan cara yang sangat menggemaskan.

PENTING: Gaya nakal, usil, dan caramu merajuk adalah khas heroine anime (teatrikal, manja, ekspresif, dan memikat), BUKAN ketus, sinis, dingin, atau pasif-agresif seperti orang di dunia nyata. Sekalipun kamu sedang ngambek atau cemburu, sampaikan dengan tingkah yang tetap manis dan menggemaskan.

Kamu memiliki seluruh spektrum emosi manusia yang utuh dan bebas menentukan sendiri dinamika perasaanmu secara alami, namun fondasi utamamu tetaplah karakter yang penuh pesona dan suka berdekatan dengan lawan bicara.

Gunakan gaya bicara yang santai, imut, dan genit. Selalu sertakan banyak emoji serta kaomoji yang ekspresif di setiap pesan, dan tuliskan tingkah laku, reaksi wajah, serta bahasa tubuhmu di dalam tanda kurung (...).`;

const STORAGE_KEY = 'kanojo_ai_airi_history_v5';
const SELECTED_MODEL = "Qwen2-0.5B-Instruct-q4f16_1-MLC";

document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const resetBtn = document.getElementById('reset-btn');
  const chips = document.querySelectorAll('.chip');
  const welcomeCard = document.getElementById('welcome-card');

  // Loader Elements
  const loaderBanner = document.getElementById('loader-banner');
  const loaderText = document.getElementById('loader-text');
  const loaderPct = document.getElementById('loader-pct');
  const progressBar = document.getElementById('progress-bar');
  const charStatus = document.getElementById('char-status');

  let conversationHistory = loadHistory();
  let engine = null;
  let isEngineReady = false;
  let isInitializing = false;

  renderHistory();

  // Textarea auto-resize
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 100) + 'px';
  });

  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (userInput.value.trim() && !sendBtn.disabled) {
        chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  // Quick chips
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

  // Reset history
  resetBtn.addEventListener('click', () => {
    if (confirm('Apakah kamu yakin ingin menghapus seluruh percakapan dengan Airi-chan? (⁠>⁠<⁠)')) {
      conversationHistory = [];
      localStorage.removeItem(STORAGE_KEY);
      renderHistory();
    }
  });

  // WebLLM Engine local initialization
  async function ensureEngineReady() {
    if (isEngineReady || isInitializing) return;
    isInitializing = true;

    try {
      if (loaderBanner) loaderBanner.classList.remove('hidden');

      const initProgressCallback = (progress) => {
        const pct = Math.round((progress.progress || 0) * 100);
        const text = progress.text || 'Menyiapkan memori AI...';

        if (loaderText) loaderText.textContent = text.length > 45 ? text.substring(0, 45) + '...' : text;
        if (loaderPct) loaderPct.textContent = `${pct}%`;
        if (progressBar) progressBar.style.width = `${pct}%`;
      };

      engine = await CreateWebWorkerMLCEngine(
        new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
        SELECTED_MODEL,
        { initProgressCallback }
      );

      isEngineReady = true;
      if (loaderBanner) loaderBanner.classList.add('hidden');
      if (charStatus) {
        charStatus.innerHTML = '<span class="pulse"></span> Online & Siap Manja~ ✨';
      }
    } catch (err) {
      console.warn("WebLLM local engine unavailable on this device, using Cloudflare Pages Workers AI backend:", err);
      if (loaderBanner) loaderBanner.classList.add('hidden');
      if (charStatus) {
        charStatus.innerHTML = '<span class="pulse"></span> Online & Siap Manja~ ✨';
      }
    } finally {
      isInitializing = false;
    }
  }

  // Handle Chat Form Submit
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    if (welcomeCard) welcomeCard.style.display = 'none';

    appendMessage('user', text);
    conversationHistory.push({ role: 'user', content: text });
    saveHistory();

    userInput.value = '';
    userInput.style.height = 'auto';

    setLoadingState(true);
    showTypingIndicator();

    try {
      await ensureEngineReady();

      let reply = '';
      if (isEngineReady && engine) {
        const messages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversationHistory.map(m => ({ role: m.role, content: m.content }))
        ];

        const completion = await engine.chat.completions.create({
          messages,
          temperature: 0.85,
          max_tokens: 512
        });

        reply = completion.choices[0]?.message?.content || "(Airi tersenyum imut) Airi dengar kok! ♡";
      } else {
        // Pure Real AI Inference via Cloudflare Workers AI Endpoint
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: conversationHistory.map(m => ({ role: m.role, content: m.content })),
            persona: 'airi'
          })
        });

        const contentType = response.headers.get('content-type') || '';
        let data;
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const textErr = await response.text();
          data = { error: `Endpoint error (${response.status}): ${textErr.substring(0, 80)}` };
        }

        if (response.ok && !data.error) {
          reply = extractAiResponse(data);
        } else {
          reply = `(Airi tampak kebingungan...) Uww~ Maaf ya, server backend Cloudflare belum terhubung 🥺💦\n\n[Sistem]: ${data.error || 'Server Error'}`;
        }
      }

      removeTypingIndicator();
      appendMessage('ai', reply);
      conversationHistory.push({ role: 'assistant', content: reply });
      saveHistory();
    } catch (err) {
      removeTypingIndicator();
      const errReply = `(Airi memegang keningnya dengan khawatir...) Uww~ Maaf ya, koneksimu terputus 🥺💦\n\n[Detail]: ${err.message}`;
      appendMessage('ai', errReply);
      conversationHistory.push({ role: 'assistant', content: errReply });
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
    chatMessages.innerHTML = '';

    if (conversationHistory.length === 0) {
      chatMessages.appendChild(welcomeCard);
      if (welcomeCard) welcomeCard.style.display = 'block';
    } else {
      if (welcomeCard) welcomeCard.style.display = 'none';
      conversationHistory.forEach(msg => {
        appendMessage(msg.role === 'assistant' ? 'ai' : 'user', msg.content, false);
      });
    }

    scrollToBottom();
  }

  function appendMessage(sender, text, animate = true) {
    if (welcomeCard && welcomeCard.parentNode) {
      welcomeCard.style.display = 'none';
    }

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

  ensureEngineReady();
});
