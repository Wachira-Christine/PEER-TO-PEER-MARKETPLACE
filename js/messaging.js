
// Messaging Functions

// Loads all conversations for the current user
async function loadConversations() {
    if (!currentUser) return []; // Exit if no user is logged in
    try {
        state.conversations = await apiCall('/conversations'); // Fetch conversations from API
        return state.conversations;
    } catch (error) {
        console.error('Error loading conversations:', error);
        return []; // Return empty array on error
    }
}

// Loads all messages for a specific conversation/user
async function loadMessages(userId) {
    if (!userId || !currentUser) return; // Exit if invalid user or not logged in
    try {
        state.messages = await apiCall(`/messages?user_id=${userId}`); // Fetch messages
        currentChatUser = userId; // Set current chat user

        // Re-render messages if a render function exists
        if (typeof renderMessages === 'function') {
            renderMessages();
        }

        return state.messages;
    } catch (error) {
        console.error('Error loading messages:', error);
        return []; // Return empty array on error
    }
}

// Sends a message to a specific user
async function sendMessage(receiverId, message) {
    try {
        await apiCall('/messages', {
            method: 'POST',
            body: JSON.stringify({ receiver_id: receiverId, message })
        });

        // Refresh messages to display the new message
        await loadMessages(receiverId);

        // Refresh conversations to update the last message preview
        await loadConversations();
        if (typeof renderConversations === 'function') {
            renderConversations();
        }

        return true;
    } catch (error) {
        alert(error.message); // Show error to user
        return false;
    }
}
