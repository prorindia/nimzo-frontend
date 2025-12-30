import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Clock, Package, Truck, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const currentStep = getStatusStep(order.status);

  return (
    <div className="min-h-screen pb-24" data-testid="order-success-page">
      {/* Success Header */}
      <div className="bg-[#CCFF00] py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#2D0036] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Order Confirmed!
        </h1>
        <p className="text-[#2D0036]/70">Order #{order.id}</p>
      </div>

      <main className="max-w-md mx-auto md:max-w-2xl px-4 py-6">
        {/* Delivery Time */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 text-center mb-6">
          <Clock size={24} className="mx-auto text-[#CCFF00] mb-2" />
          <p className="text-sm text-gray-500">Estimated Delivery</p>
          <p className="text-xl font-bold text-[#2D0036]">10-15 Minutes</p>
        </div>

        {/* Order Tracking */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <h2 className="font-bold text-[#2D0036] mb-6">Order Status</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200" />
            <div 
              className="absolute left-6 top-6 w-0.5 bg-[#CCFF00] transition-all duration-500"
              style={{ height: `${(currentStep / 3) * 100}%` }}
            />

            {/* Steps */}
            <div className="space-y-6">
              {[
                { icon: CheckCircle, label: 'Order Confirmed', desc: 'Your order has been placed' },
                { icon: Package, label: 'Preparing', desc: 'Packing your items' },
                { icon: Truck, label: 'Out for Delivery', desc: 'On the way to you' },
                { icon: Home, label: 'Delivered', desc: 'Enjoy your groceries!' },
              ].map((step, index) => {
                const isActive = index <= currentStep;
                const isCurrent = index === currentStep;
                return (
                  <div key={step.label} className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                      isActive ? 'bg-[#CCFF00]' : 'bg-gray-100'
                    } ${isCurrent ? 'ring-4 ring-[#CCFF00]/30' : ''}`}>
                      <step.icon size={20} className={isActive ? 'text-[#2D0036]' : 'text-gray-400'} />
                    </div>
                    <div>
                      <p className={`font-semibold ${isActive ? 'text-[#2D0036]' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      <p className={`text-sm ${isActive ? 'text-gray-500' : 'text-gray-300'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <h2 className="font-bold text-[#2D0036] mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">₹{item.subtotal}</span>
              </div>
            ))}
            <div className="border-t pt-3 mt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <h2 className="font-bold text-[#2D0036] mb-3">Delivery Address</h2>
          <p className="font-medium">{order.address.full_name}</p>
          <p className="text-sm text-gray-500">
            {order.address.address_line1}
            {order.address.address_line2 && `, ${order.address.address_line2}`}
          </p>
          <p className="text-sm text-gray-500">
            {order.address.city}, {order.address.state} - {order.address.pincode}
          </p>
          <p className="text-sm text-gray-500">{order.address.phone}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/')}
            className="flex-1 bg-[#CCFF00] text-[#2D0036] hover:bg-[#B3E600] font-bold py-6 rounded-full"
            data-testid="continue-shopping-btn"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => navigate('/orders')}
            variant="outline"
            className="flex-1 border-2 border-[#2D0036] text-[#2D0036] font-bold py-6 rounded-full"
            data-testid="view-orders-btn"
          >
            View Orders
          </Button>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccessPage;
