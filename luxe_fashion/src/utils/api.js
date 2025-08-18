// Utility for making API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function apiFetch(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Prepare headers - don't set Content-Type for FormData
    let headers = {};
    
    // Only set Content-Type if it's not FormData and not already set
    if (!(options.body instanceof FormData) && !options.headers?.['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Merge with any provided headers
    headers = {
      ...headers,
      ...(options.headers || {}),
    };

    const response = await fetch(url, {
      ...options,
      credentials: 'include', // for cookies/auth
      headers,
    });
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (!response.ok) {
      const errorMessage = data?.message || data || `HTTP ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server');
    }
    
    console.error('API Fetch Error:', error);
    throw error;
  }
}

// Helper function for common API operations
export const apiHelpers = {
  get: (endpoint) => apiFetch(endpoint),
  
  post: (endpoint, data) => apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint, data) => apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint) => apiFetch(endpoint, {
    method: 'DELETE',
  }),
}; 