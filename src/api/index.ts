// src/api/index.ts

const API_BASE_URL = 'http://localhost:3000/api'; 

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

async function fetchApi<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    headers: HeadersInit = {}
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    if (token) {
        headers = {
            ...headers,
            'Authorization': `Bearer ${token}`
        };
    }

    try {
        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Something went wrong' };
        }

        return { success: true, data: data as T };
    } catch (error: any) {
        console.error('API call error:', error);
        return { success: false, error: error.message || 'Network error' };
    }
}


export const authApi = {
    login: (credentials: any) => fetchApi('/auth/login', 'POST', credentials),
    registerUser: (userData: any) => fetchApi('/users/register-user', 'POST', userData),
    registerProvider: (providerData: any) => fetchApi('/users/register-provider', 'POST', providerData),
};


export const usersApi = {
    getCurrentUser: () => fetchApi('/users/me'),
    getUserById: (id: string) => fetchApi(`/users/${id}`),
};


export const propertiesApi = {
    getAllProperties: (filters?: any) => fetchApi('/properties', 'GET', undefined, filters ? { 'x-filters': JSON.stringify(filters) } : {}),
    getPropertyById: (id: string) => fetchApi(`/properties/${id}`),
    createProperty: (propertyData: any) => fetchApi('/properties', 'POST', propertyData),
    updateProperty: (id: string, propertyData: any) => fetchApi(`/properties/${id}`, 'PATCH', propertyData),
};


export const bookingsApi = {
    createBooking: (bookingData: any) => fetchApi('/bookings', 'POST', bookingData),
    getUserBookings: (userId: string) => fetchApi(`/bookings/user/${userId}`),
    getProviderBookings: (providerId: string) => fetchApi(`/bookings/provider/${providerId}`),
    updateBookingStatus: (id: string, status: string) => fetchApi(`/bookings/${id}/status`, 'PATCH', { status }),
};


export const workCreditsApi = {
    createWorkCredit: (data: any) => fetchApi('/work-credits', 'POST', data),
    getUserWorkCredits: (userId: string) => fetchApi(`/work-credits/user/${userId}`),
};
