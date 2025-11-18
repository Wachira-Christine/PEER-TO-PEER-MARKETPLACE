// Authentication functions
async function login(email, password) {
    try {
        const user = await apiCall('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        currentUser = user;
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function signup(email, password, name) {
    try {
        await apiCall('/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        });
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function logout() {
    try {
        await apiCall('/logout', { method: 'POST' });
        currentUser = null;
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging out:', error);
        window.location.href = 'index.html';
    }
}

async function updateProfile(data) {
    try {
        await apiCall('/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        currentUser = { ...currentUser, ...data };
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}