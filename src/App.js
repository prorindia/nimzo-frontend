import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/sonner';
import BottomNav from './components/BottomNav';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import AuthPage from './pages/AuthPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

import './App.css';

/* 🔐 PROTECTED ROUTE (UPDATED – SAME FILE) */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return children;
};

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token'); // ✅ SAME KEY EVERYWHERE
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="App min-h-screen bg-[#F8F9FA]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />

              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />

              {/* 🔐 USER PROTECTED */}
              <Route path="/cart" element={
                <ProtectedRoute><CartPage /></ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute><CheckoutPage /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><OrdersPage /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />
              <Route path="/order-success/:orderId" element={
                <ProtectedRoute><OrderSuccessPage /></ProtectedRoute>
              } />

              {/* 🔐 ADMIN */}
              <Route path="/admin" element={
                <ProtectedRoute><AdminPage /></ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute><AdminOrdersPage /></ProtectedRoute>
              } />
            </Routes>

            <BottomNav />
            <Toaster position="top-center" />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
