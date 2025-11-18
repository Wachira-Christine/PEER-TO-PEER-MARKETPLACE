// Service-related functions
async function loadServices() {
    try {
        state.services = await apiCall('/services');
        return state.services;
    } catch (error) {
        console.error('Error loading services:', error);
        return [];
    }
}

async function loadMyServices() {
    if (!currentUser) return [];
    try {
        state.myServices = await apiCall('/my-services');
        return state.myServices;
    } catch (error) {
        console.error('Error loading my services:', error);
        return [];
    }
}

async function loadRequestedServices() {
    if (!currentUser) return [];
    try {
        state.requestedServices = await apiCall('/requested-services');
        return state.requestedServices;
    } catch (error) {
        console.error('Error loading requested services:', error);
        return [];
    }
}

async function loadServiceRequests() {
    if (!currentUser) return [];
    try {
        state.serviceRequests = await apiCall('/service-requests');
        state.newRequestsCount = state.serviceRequests.filter(r => r.status === 'pending').length;
        return state.serviceRequests;
    } catch (error) {
        console.error('Error loading service requests:', error);
        return [];
    }
}

async function loadUserEarnings() {
    if (!currentUser) return 0;
    try {
        const earningsData = await apiCall('/user-earnings');
        state.userEarnings = earningsData.total_earnings || 0;
        return state.userEarnings;
    } catch (error) {
        console.error('Error loading earnings:', error);
        state.userEarnings = 0;
        return 0;
    }
}

async function requestService(serviceId) {
    try {
        await apiCall('/request-service', {
            method: 'POST',
            body: JSON.stringify({ service_id: serviceId })
        });
        alert('Service requested successfully!');
        return true;
    } catch (error) {
        alert(error.message);
        return false;
    }
}

async function loadServiceDetail(serviceId) {
    try {
        currentService = await apiCall(`/services/${serviceId}`);
        return currentService;
    } catch (error) {
        console.error('Error loading service detail:', error);
        return null;
    }
}

async function createService(title, description, price, category) {
    try {
        await apiCall('/services', {
            method: 'POST',
            body: JSON.stringify({ title, description, price, category })
        });
        alert('Service created successfully!');
        return true;
    } catch (error) {
        alert(error.message);
        return false;
    }
}

async function deleteService(serviceId) {
    if (confirm('Are you sure you want to delete this service?')) {
        try {
            await apiCall(`/services/${serviceId}`, { method: 'DELETE' });
            alert('Service deleted successfully!');
            return true;
        } catch (error) {
            alert(error.message);
            return false;
        }
    }
    return false;
}

async function markServiceComplete(requestId) {
    try {
        await apiCall('/complete-service', {
            method: 'POST',
            body: JSON.stringify({ request_id: requestId })
        });
        alert('Service marked as complete!');
        return true;
    } catch (error) {
        alert(error.message);
        return false;
    }
}