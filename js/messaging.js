// Messaging functions
async function loadConversations() {
    if (!currentUser) return [];
    try {
        state.conversations = await apiCall('/conversations');
        return state.conversations;
    } catch (error) {
        console.error('Error loading conversations:', error);
        return [];
    }
}

async function loadMessages(userId) {
    if (!userId || !currentUser) return;
    try {
        state.messages = await apiCall(`/messages?user_id=${userId}`);
        currentChatUser = userId;

        // Re-render messages if the function exists
        if (typeof renderMessages === 'function') {
            renderMessages();
        }

        return state.messages;
    } catch (error) {
        console.error('Error loading messages:', error);
        return [];
    }
}

async function sendMessage(receiverId, message) {
    try {
        await apiCall('/messages', {
            method: 'POST',
            body: JSON.stringify({ receiver_id: receiverId, message })
        });

        // Reload messages to show the new one
        await loadMessages(receiverId);

        // Reload conversations to update last message
        await loadConversations();
        if (typeof renderConversations === 'function') {
            renderConversations();
        }

        return true;
    } catch (error) {
        alert(error.message);
        return false;
    }
}