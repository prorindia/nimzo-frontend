import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, item_count: 0, savings: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Cart fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) return false;
    try {
      await axios.post(`${API}/cart/add`, 
        { product_id: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Add to cart error:', error);
      return false;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) return false;
    try {
      await axios.put(`${API}/cart/update`,
        { product_id: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Update cart error:', error);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return false;
    try {
      await axios.delete(`${API}/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Remove from cart error:', error);
      return false;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return false;
    try {
      await axios.delete(`${API}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Clear cart error:', error);
      return false;
    }
  };

  const getItemQuantity = (productId) => {
    const item = cart.items.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getItemQuantity,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
