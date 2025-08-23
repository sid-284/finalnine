import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { apiFetch } from '../utils/api';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendAuthenticated, setBackendAuthenticated] = useState(false);
  const [backendUser, setBackendUser] = useState(null);

  const authenticateWithBackend = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setBackendAuthenticated(false);
      setBackendUser(null);
      return;
    }

    try {
      console.log('Attempting backend authentication for:', firebaseUser.email);
      console.log('Firebase user data:', {
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });
      
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: firebaseUser.email,
          firebaseUid: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          avatar: firebaseUser.photoURL || '',
        }),
      });
      console.log('Backend authentication successful:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'No response');
      
      // Store the token if it's in the response (for cross-origin scenarios)
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        console.log('Token stored for cross-origin authentication:', response.token.substring(0, 20) + '...');
      } else {
        console.log('No token found in response');
      }
      
      setBackendAuthenticated(true);
      setBackendUser(response);
    } catch (error) {
      console.error('Backend authentication failed:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        data: error.data
      });
      setBackendAuthenticated(false);
      setBackendUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Logout from backend
      await apiFetch('/auth/logout', { method: 'GET' });
    } catch (error) {
      console.error('Backend logout failed:', error);
    }
    
    // Clear stored token
    localStorage.removeItem('authToken');
    
    // Logout from Firebase
    await signOut(auth);
    
    setBackendAuthenticated(false);
    setBackendUser(null);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser ? `User: ${firebaseUser.email}` : 'No user');
      setUser(firebaseUser);
      
      if (firebaseUser) {
        console.log('Firebase user authenticated, attempting backend authentication...');
        await authenticateWithBackend(firebaseUser);
      } else {
        console.log('No Firebase user, clearing backend authentication');
        setBackendAuthenticated(false);
        setBackendUser(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [authenticateWithBackend]);

  const value = {
    user,
    loading,
    backendAuthenticated,
    backendUser,
    logout,
    authenticateWithBackend,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 