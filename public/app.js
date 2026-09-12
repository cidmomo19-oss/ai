document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const resetBtn = document.getElementById('reset-btn');
  const chips = document.querySelectorAll('.chip');

  const STORAGE_KEY = 'kanojo_ai_chat_history_v1';
  let conversationHistory = loadHistory();

  // Initial setup: load history
  renderHistory();

  // Auto-resize textarea
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 100) + 'px';
  });

  // Handle Enter key (without Shift)
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

  // Handle Form Submit
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    // Append User Message
    appendMessage('user', text);
    conversationHistory.push({ role: 'user', content: text });
    saveHistory();

    // Reset input
    userInput.value = '';
    userInput.style.height = 'auto';

    // Disable input while loading
    setLoadingState(true);
    showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: conversationHistory
        })
      });

      const data = await response.json();
      removeTypingIndicator();

      if (!response.ok) {
        let errDesc = data.error || 'Gagal tersambung ke Airi-chan.';
        appendMessage('ai', `(Airi tampak kebingungan...) Uww~ Maaf ya, sepertinya ada gangguan sinyal/sistem 🥺💦\n\n[Sistem]: ${errDesc}`);
      } else {
        const aiReply = extractAiResponse(data);
        appendMessage('ai', aiReply);
        conversationHistory.push({ role: 'assistant', content: aiReply });
        saveHistory();
      }
    } catch (err) {
      removeTypingIndicator();
      appendMessage('ai', `(Airi memegang keningnya dengan khawatir...) Uww~ Koneksimu terputus ya? Coba periksa koneksi internetmu ya! 💖\n\n[Detail]: ${err.message}`);
    } finally {
      setLoadingState(false);
      scrollToBottom();
    }
  });

  // Extract response text from Workers AI standard payload
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

  // Render History
  function renderHistory() {
    chatMessages.innerHTML = '';

    // Welcome Card
    const welcomeCard = document.createElement('div');
    welcomeCard.className = 'welcome-card';
    welcomeCard.innerHTML = `
      <div class="welcome-icon">💖✨</div>
      <h3>Konichiwa~! 👋</h3>
      <p>Airi di sini! Kamu siap menemani Airi hari ini kan? Jangan cuekin Airi lho ya! (⁠>⁠<⁠)♡</p>
    `;
    chatMessages.appendChild(welcomeCard);

    conversationHistory.forEach(msg => {
      appendMessage(msg.role === 'assistant' ? 'ai' : 'user', msg.content, false);
    });

    scrollToBottom();
  }

  // Append single message to DOM
  function appendMessage(sender, text, animate = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    if (!animate) messageDiv.style.animation = 'none';

    const senderSpan = document.createElement('div');
    senderSpan.className = 'msg-sender';
    senderSpan.textContent = sender === 'user' ? 'Kamu' : 'Airi-chan 💕';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'msg-bubble';

    // Highlight action text in parentheses format e.g. (tersenyum manis)
    bubbleDiv.innerHTML = formatMessageContent(text);

    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(bubbleDiv);

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // Highlight actions inside parentheses (tingkah laku)
  function formatMessageContent(text) {
    // Escape HTML first to prevent XSS
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Replace (actions inside parentheses) with italic styled span
    return escaped.replace(/\(([^)]+)\)/g, '<span class="action-text">($1)</span>');
  }

  // Show / Remove typing indicator
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
});
