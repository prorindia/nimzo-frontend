import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, ChevronRight, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrdersPage = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-yellow-100 text-yellow-700';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen pb-24" data-testid="orders-page">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto md:max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-[#2D0036]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              My Orders
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto md:max-w-2xl px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 rounded-xl skeleton" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-[#2D0036] mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link
              to="/"
              className="inline-block bg-[#CCFF00] text-[#2D0036] font-bold px-8 py-3 rounded-full hover:bg-[#B3E600]"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/order-success/${order.id}`}
                className="block bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow"
                data-testid={`order-${order.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-[#2D0036]">Order #{order.id}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Clock size={12} />
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">{order.items.length} items</p>
                    <p className="font-bold text-[#2D0036]">₹{order.total}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersPage;
