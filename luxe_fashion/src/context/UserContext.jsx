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
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: firebaseUser.email,
          firebaseUid: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          avatar: firebaseUser.photoURL || '',
        }),
      });
      setBackendAuthenticated(true);
      setBackendUser(response);
    } catch (error) {
      console.error('Backend authentication failed:', error);
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
    
    // Logout from Firebase
    await signOut(auth);
    
    setBackendAuthenticated(false);
    setBackendUser(null);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await authenticateWithBackend(firebaseUser);
      } else {
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