// chat.js - core client logic (vanilla JS)
// Assumes endpoints are under /chat/:
const ENDPOINTS = {
  conversations: '/chat/conversations/',
  messagesFor: (conversationId) => `/chat/conversations/${conversationId}/messages/`,
  sendMessage: '/chat/messages/send/',
  markRead: (conversationId) => `/chat/conversations/${conversationId}/mark-read/`,
  login: '/chat/login/'
};

let conversations = [];
let activeConversationId = null;
let pollInterval = null;
let pollIntervalMs = 5000; // 5s polling
let typingTimer = null;

/* -------------------------
   DOM references
-------------------------*/
const convListEl = document.getElementById('conversationsList');
const convSearchEl = document.getElementById('conversationSearch');
const convLoadingEl = document.getElementById('conversationsLoading');
const threadHeaderEl = document.getElementById('threadHeader');
const messagesPaneEl = document.getElementById('messagesPane');
const composerEl = document.getElementById('composer');
const messageInputEl = document.getElementById('messageInput');
const sendBtnEl = document.getElementById('sendBtn');
const typingIndicatorEl = document.getElementById('typingIndicator');
const sendStatusEl = document.getElementById('sendStatus');
const logoutBtn = document.getElementById('logoutBtn');

/* -------------------------
   Initialization
-------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  bindUI();
  loadConversations();
  pollInterval = setInterval(refreshConversationsIfVisible, pollIntervalMs);
});

/* -------------------------
   UI binding
-------------------------*/
function bindUI() {
  convSearchEl.addEventListener('input', onConversationsFilter);
  sendBtnEl.addEventListener('click', onSendClicked);
  messageInputEl.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      if (messageInputEl.value.trim()) onSendClicked();
    } else {
      showLocalTyping();
    }
  });
  logoutBtn.addEventListener('click', () => {
    // simple client-side logout — redirect to login page;
    // server-side session termination not implemented here
    window.location.href = '/login/';
  });
}

/* -------------------------
   Conversations
-------------------------*/
async function loadConversations() {
  convLoadingEl.textContent = 'Loading…';
  const r = await fetchJson(ENDPOINTS.conversations, { method: 'GET' });
  if (!r.ok) {
    convLoadingEl.textContent = 'Failed to load';
    convLoadingEl.classList.add('error');
    return;
  }

  conversations = Array.isArray(r.data) ? r.data : [];
  renderConversations(conversations);
  convLoadingEl.textContent = '';
}

function renderConversations(list) {
  convListEl.innerHTML = '';
  if (!list.length) {
    convListEl.innerHTML = '<li class="muted small" style="padding:1rem">No conversations yet</li>';
    return;
  }

  list.forEach(conv => {
    const li = document.createElement('li');
    li.className = 'conversation-item';
    li.dataset.conversationId = conv.id;

    const avatar = document.createElement('div');
    avatar.className = 'conv-avatar';
    if (conv.other_participant && conv.other_participant.username) {
      avatar.textContent = (conv.other_participant.username || 'U').slice(0,2).toUpperCase();
    } else {
      avatar.textContent = '??';
    }

    const main = document.createElement('div');
    main.className = 'conv-main';

    const top = document.createElement('div');
    top.className = 'conv-top';
    const name = document.createElement('div');
    name.className = 'conv-name';
    name.textContent = conv.other_participant ? conv.other_participant.username : 'Conversation';

    const time = document.createElement('div');
    time.className = 'muted small';
    time.textContent = conv.last_message ? friendlyTimestamp(conv.last_message.timestamp) : '';

    top.appendChild(name);
    top.appendChild(time);

    const bottom = document.createElement('div');
    bottom.style.display = 'flex';
    bottom.style.justifyContent = 'space-between';
    bottom.style.alignItems = 'center';

    const last = document.createElement('div');
    last.className = 'conv-last';
    last.textContent = conv.last_message ? (conv.last_message.content || '') : '';

    bottom.appendChild(last);

    if (conv.unread_count && conv.unread_count > 0) {
      const badge = document.createElement('div');
      badge.className = 'unread-badge';
      badge.textContent = conv.unread_count;
      bottom.appendChild(badge);
    }

    main.appendChild(top);
    main.appendChild(bottom);

    li.appendChild(avatar);
    li.appendChild(main);

    li.addEventListener('click', () => openConversation(conv.id, conv));

    convListEl.appendChild(li);
  });
}

function onConversationsFilter() {
  const q = convSearchEl.value.trim().toLowerCase();
  const filtered = conversations.filter(c => {
    const name = c.other_participant ? (c.other_participant.username || '') : '';
    const last = c.last_message ? (c.last_message.content || '') : '';
    return name.toLowerCase().includes(q) || last.toLowerCase().includes(q);
  });
  renderConversations(filtered);
}

/* -------------------------
   Open conversation / messages
-------------------------*/
async function openConversation(conversationId, conversationObj) {
  activeConversationId = conversationId;
  threadHeaderEl.textContent = conversationObj && conversationObj.other_participant ? conversationObj.other_participant.username : `Conversation ${conversationId}`;
  composerEl.classList.remove('hidden');
  messagesPaneEl.innerHTML = '<div class="muted small">Loading messages…</div>';
  await loadMessages(conversationId);
  // mark read
  await markMessagesRead(conversationId);
  // ensure it's visible in list
  highlightActiveConversation(conversationId);
}

function highlightActiveConversation(id) {
  Array.from(convListEl.querySelectorAll('.conversation-item')).forEach(el => {
    el.style.background = el.dataset.conversationId == id ? 'rgba(26,127,127,0.06)' : 'transparent';
  });
}

async function loadMessages(conversationId) {
  const r = await fetchJson(ENDPOINTS.messagesFor(conversationId), { method: 'GET' });
  if (!r.ok) {
    messagesPaneEl.innerHTML = '<div class="error">Failed to load messages</div>';
    return;
  }
  const messages = Array.isArray(r.data) ? r.data : [];
  renderMessages(messages);
  scrollMessagesToBottom();
}

function renderMessages(messages) {
  messagesPaneEl.innerHTML = '';
  if (!messages.length) {
    messagesPaneEl.innerHTML = '<div class="muted small">No messages yet — start the conversation.</div>';
    return;
  }
  messages.forEach(msg => {
    const row = document.createElement('div');
    row.className = 'msg-row';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    // Heuristic: if msg.sender && msg.sender.username equals current user? The server returns sender object.
    // We cannot reliably know current username client-side. We'll classify messages where sender.id equals a stored 'meId' if present.
    const meId = window.__sh_user_id || null;
    const isMe = meId && msg.sender && (msg.sender.id === meId);

    bubble.classList.add(isMe ? 'msg-me' : 'msg-them');
    bubble.innerHTML = `<div class="msg-text">${escapeHtml(msg.content)}</div>
                        <span class="msg-time">${friendlyTimestamp(msg.timestamp)}</span>`;

    if (isMe) row.style.justifyContent = 'flex-end';

    row.appendChild(bubble);
    messagesPaneEl.appendChild(row);
  });
}

/* -------------------------
   Sending messages
-------------------------*/
async function onSendClicked() {
  const text = messageInputEl.value.trim();
  if (!text || !activeConversationId) return;
  sendBtnEl.disabled = true;
  sendStatusEl.textContent = 'Sending…';

  try {
    const r = await fetchJson(ENDPOINTS.sendMessage, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: activeConversationId, content: text })
    });

    if (!r.ok) {
      sendStatusEl.textContent = (r.data && r.data.error) ? r.data.error : 'Failed to send';
      sendStatusEl.classList.add('error');
      return;
    }

    // Immediately append the message locally for snappy UX (server will return the created message)
    // reload messages to get canonical state
    messageInputEl.value = '';
    await loadMessages(activeConversationId);
    await refreshConversationsIfVisible(); // update last message / unread counts
    sendStatusEl.textContent = '';
    scrollMessagesToBottom();
  } finally {
    sendBtnEl.disabled = false;
  }
}

/* -------------------------
   Mark messages as read
-------------------------*/
async function markMessagesRead(conversationId) {
  await fetchJson(ENDPOINTS.markRead(conversationId), { method: 'POST' });
  // best-effort; we then refresh conversation list to clear unread badge
  await loadConversations();
}

/* -------------------------
   Polling / refreshing
-------------------------*/
async function refreshConversationsIfVisible() {
  // keep polling lightweight: only GET conversations and, if a convo is active, GET its messages
  const r = await fetchJson(ENDPOINTS.conversations, { method: 'GET' });
  if (!r.ok) return;
  conversations = Array.isArray(r.data) ? r.data : [];
  renderConversations(conversations);

  if (activeConversationId) {
    // get only messages for active conversation to detect new messages
    const r2 = await fetchJson(ENDPOINTS.messagesFor(activeConversationId), { method: 'GET' });
    if (r2.ok) {
      const existing = messagesPaneEl.querySelectorAll('.msg-bubble');
      const remoteMessages = Array.isArray(r2.data) ? r2.data : [];
      // simple strategy: if counts differ, re-render
      if (existing.length !== remoteMessages.length) {
        renderMessages(remoteMessages);
        scrollMessagesToBottom();
        // mark read if new messages were from other user
        await markMessagesRead(activeConversationId);
      }
    }
  }
}

/* -------------------------
   Utilities
-------------------------*/
function scrollMessagesToBottom() {
  messagesPaneEl.scrollTop = messagesPaneEl.scrollHeight;
}

function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/[&<>"']/g, function (m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}

/* -------------------------
   Typing indicator (local only)
   - The backend doesn't provide a typing endpoint by default.
   - We simulate local "typing..." state for UX while user types.
-------------------------*/
function showLocalTyping() {
  typingIndicatorEl.textContent = 'Typing…';
  typingIndicatorEl.style.visibility = 'visible';
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    typingIndicatorEl.textContent = '';
    typingIndicatorEl.style.visibility = 'hidden';
  }, 1200);
}

/* -------------------------
   Helpful: attempt to get current user id (optional)
   If you want the client to know the current user's id, you can inject it
   into the page as window.__sh_user_id (server-side template), e.g.
   <script>window.__sh_user_id = {{ request.user.id }}</script>
   If not present, message alignment falls back to heuristic.
-------------------------*/

/* -------------------------
   Small note:
   - If you later add WebSocket support in Django (channels), replace polling:
     - On open, subscribe to conversation updates and append messages as they arrive.
-------------------------*/
