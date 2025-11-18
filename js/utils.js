const API_URL = 'http://localhost:5000/api';

// Global state
const state = {
    services: [],
    conversations: [],
    messages: [],
    myServices: [],
    requestedServices: [],
    serviceRequests: [],
    newRequestsCount: 0,
    requestedServicesFilter: 'all',
    userEarnings: 0,
    searchQuery: '',
    selectedCategory: 'all'
};

let currentUser = null;
let currentService = null;
let currentChatUser = null;

// API call utility
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Request failed');
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Check if user is logged in
async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/me`, { credentials: 'include' });
        if (response.ok) {
            currentUser = await response.json();
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

// Redirect to login if not authenticated
async function requireAuth() {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Filter services for browse page
function filterServices() {
    const searchQuery = state.searchQuery.toLowerCase();
    const categoryFilter = state.selectedCategory;

    return state.services.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchQuery) ||
                             service.description.toLowerCase().includes(searchQuery) ||
                             service.seller_name.toLowerCase().includes(searchQuery);
        const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });
}

// Close modal
function closeModal() {
    document.querySelector('.modal-overlay')?.remove();
}

// Show rating modal
function showRatingModal(serviceId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <h2>Rate this Service</h2>
            <div class="star-rating">
                ${[1,2,3,4,5].map(i => `<span class="star" data-rating="${i}">⭐</span>`).join('')}
            </div>
            <div class="form-group">
                <label>Review (optional)</label>
                <textarea id="reviewText" rows="3" placeholder="Share your experience..."></textarea>
            </div>
            <button class="btn-primary" onclick="submitRating(${serviceId})">Submit Rating</button>
            <button class="btn-primary" style="background: #6b7280; margin-top: 10px;" onclick="closeModal()">Cancel</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            document.querySelectorAll('.star').forEach((s, i) => {
                s.classList.toggle('active', i < rating);
            });
        });
    });
}

// Submit rating
async function submitRating(serviceId) {
    const rating = document.querySelectorAll('.star.active').length;
    const review = document.getElementById('reviewText').value;

    if (rating === 0) {
        alert('Please select a rating');
        return;
    }

    try {
        await apiCall('/rate-service', {
            method: 'POST',
            body: JSON.stringify({ service_id: serviceId, rating, review })
        });
        alert('Rating submitted!');
        closeModal();
        // Reload services to show updated ratings
        if (typeof loadServices === 'function') {
            await loadServices();
        }
    } catch (error) {
        alert(error.message);
    }
}