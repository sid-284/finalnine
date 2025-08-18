import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser } from './UserContext';
import { apiFetch } from '../utils/api';

const CartContext = createContext();

const getInitialCart = () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Initial cart loaded:', cart);
    return cart;
  } catch {
    console.log('Error loading cart from localStorage, starting with empty cart');
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getInitialCart());
  const [loading, setLoading] = useState(false);
  const { backendAuthenticated } = useUser();

  // Sync cart with backend when user is authenticated
  const syncCartWithBackend = useCallback(async () => {
    if (!backendAuthenticated) return;
    
    try {
      setLoading(true);
      const backendCart = await apiFetch('/cart/get', { method: 'POST' });
      
      if (backendCart && backendCart.items) {
        setCart(backendCart.items);
        localStorage.setItem('cart', JSON.stringify(backendCart.items));
      }
    } catch (error) {
      console.error('Failed to sync cart with backend:', error);
    } finally {
      setLoading(false);
    }
  }, [backendAuthenticated]);

  // Load cart from backend when user authenticates
  useEffect(() => {
    if (backendAuthenticated) {
      syncCartWithBackend();
    }
  }, [backendAuthenticated, syncCartWithBackend]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart updated:', cart);
  }, [cart]);

  const addToCart = useCallback(async (item) => {
    console.log('Adding to cart:', item);
    
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      );
      if (existing) {
        console.log('Item already exists, updating quantity');
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      console.log('Adding new item to cart');
      return [...prev, { ...item }];
    });

    // Sync with backend if authenticated
    if (backendAuthenticated) {
      try {
        await apiFetch('/cart/add', {
          method: 'POST',
          body: JSON.stringify(item),
        });
      } catch (error) {
        console.error('Failed to sync cart with backend:', error);
      }
    }
  }, [backendAuthenticated]);

  const removeFromCart = useCallback(async (itemId, size, color) => {
    console.log('Removing from cart:', { itemId, size, color });
    
    setCart((prev) => prev.filter((i) => !(i.id === itemId && i.size === size && i.color === color)));

    // Sync with backend if authenticated
    if (backendAuthenticated) {
      try {
        await apiFetch('/cart/update', {
          method: 'POST',
          body: JSON.stringify({
            action: 'remove',
            itemId,
            size,
            color,
          }),
        });
      } catch (error) {
        console.error('Failed to sync cart with backend:', error);
      }
    }
  }, [backendAuthenticated]);

  const updateQuantity = useCallback(async (itemId, size, color, quantity) => {
    console.log('Updating quantity:', { itemId, size, color, quantity });
    
    setCart((prev) =>
      prev.map((i) =>
        i.id === itemId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      )
    );

    // Sync with backend if authenticated
    if (backendAuthenticated) {
      try {
        await apiFetch('/cart/update', {
          method: 'POST',
          body: JSON.stringify({
            action: 'update',
            itemId,
            size,
            color,
            quantity,
          }),
        });
      } catch (error) {
        console.error('Failed to sync cart with backend:', error);
      }
    }
  }, [backendAuthenticated]);

  const clearCart = useCallback(async () => {
    console.log('Clearing cart');
    setCart([]);

    // Sync with backend if authenticated
    if (backendAuthenticated) {
      try {
        await apiFetch('/cart/update', {
          method: 'POST',
          body: JSON.stringify({
            action: 'clear',
          }),
        });
      } catch (error) {
        console.error('Failed to sync cart with backend:', error);
      }
    }
  }, [backendAuthenticated]);

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCartWithBackend,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 