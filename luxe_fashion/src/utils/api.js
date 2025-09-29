// Utility for making API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get stored token for cross-origin requests
const getStoredToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

// Store token for cross-origin requests
const storeToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Temporary workaround: Since the backend doesn't return tokens in response body yet,
// we'll use a different approach. For now, let's implement a simple session-based approach
const getSessionToken = () => {
  // Try to get from localStorage first
  const storedToken = getStoredToken();
  if (storedToken) {
    return storedToken;
  }
  
  // For now, we'll use a simple approach - store a session identifier
  // This is a temporary workaround until the backend is updated
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export async function apiFetch(endpoint, options = {}) {
  try {
    if (!API_BASE_URL) {
      throw new Error('API base URL is not configured. Set VITE_API_BASE_URL in your environment.');
    }
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Prepare headers - don't set Content-Type for FormData
    let headers = {};
    
    // Only set Content-Type if it's not FormData and not already set
    if (!(options.body instanceof FormData) && !options.headers?.['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Add Authorization header if we have a stored token (for cross-origin requests)
    const storedToken = getStoredToken();
    if (storedToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${storedToken}`;
    }
    
    // Merge with any provided headers
    headers = {
      ...headers,
      ...(options.headers || {}),
    };
    
    // Note: We rely on HTTP-only cookies for authentication, not Authorization headers
    // The backend middleware (isAuth.js) checks for tokens in cookies first, then Authorization headers

    const response = await fetch(url, {
      ...options,
      credentials: 'include', // This is crucial for sending cookies with requests
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
    
    // Store token if it's in the response (for cross-origin scenarios)
    if (data && typeof data === 'object' && data.token) {
      storeToken(data.token);
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