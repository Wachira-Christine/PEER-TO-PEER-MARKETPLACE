
// Authentication Functions

// Logs in a user with email and password
async function login(email, password) {
    try {
        const user = await apiCall('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        currentUser = user; // Store logged-in user
        return true;
    } catch (error) {
        throw new Error(error.message); // Pass error to caller
    }
}

// Signs up a new user with email, password, and name
async function signup(email, password, name) {
    try {
        await apiCall('/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        });
        return true;
    } catch (error) {
        throw new Error(error.message); // Pass error to caller
    }
}

// Logs out the current user
async function logout() {
    try {
        await apiCall('/logout', { method: 'POST' });
        currentUser = null; // Clear user data
        window.location.href = 'index.html'; // Redirect to landing page
    } catch (error) {
        console.error('Error logging out:', error);
        window.location.href = 'index.html'; // Ensure redirect even on error
    }
}

// Updates the user's profile with new data
async function updateProfile(data) {
    try {
        await apiCall('/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        currentUser = { ...currentUser, ...data }; // Merge new data into currentUser
        return true;
    } catch (error) {
        throw new Error(error.message); // Pass error to caller
    }
}
