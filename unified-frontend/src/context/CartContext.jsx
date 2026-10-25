/**
 * Cart Context.
 * Manages cart state, line items, calculated savings, and synchronization with backend API.
 * Purely backend-driven — no static fallback mock items.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend API
  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      setTotalItems(0);
      setTotalAmount(0);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get('/cart/');
      if (res.data) {
        setItems(res.data.items || []);
        setTotalItems(res.data.total_items || 0);
        setTotalAmount(res.data.total_amount || 0);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setItems([]);
      setTotalItems(0);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Add item to cart
  const addToCart = async (product, quantity = 1, bargainedPrice = null) => {
    try {
      const payload = {
        product_id: product.id,
        quantity: quantity,
        bargained_price: bargainedPrice,
      };
      
      const res = await api.post('/cart/add', payload);
      if (res.data) {
        setItems(res.data.items || []);
        setTotalItems(res.data.total_items || 0);
        setTotalAmount(res.data.total_amount || 0);
      }
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to add item to cart';
      toast.error(detail);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    try {
      const res = await api.put('/cart/update', {
        product_id: productId,
        quantity: quantity,
      });
      if (res.data) {
        setItems(res.data.items || []);
        setTotalItems(res.data.total_items || 0);
        setTotalAmount(res.data.total_amount || 0);
      }
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to update quantity';
      toast.error(detail);
    }
  };

  // Remove single item
  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      if (res.data) {
        setItems(res.data.items || []);
        setTotalItems(res.data.total_items || 0);
        setTotalAmount(res.data.total_amount || 0);
      }
      toast.success('Item removed from cart');
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to remove item';
      toast.error(detail);
    }
  };

  // Empty cart
  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setItems([]);
      setTotalItems(0);
      setTotalAmount(0);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setItems([]);
      setTotalItems(0);
      setTotalAmount(0);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalAmount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
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

export default CartContext;
