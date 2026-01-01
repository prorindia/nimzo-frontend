import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Orders fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">
          Start shopping to see your orders here
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#CCFF00] px-6 py-3 rounded-full font-bold"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 bg-white border-b shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold">My Orders</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white rounded-xl p-4 border"
          >
            <div className="flex justify-between mb-2">
              <p className="font-bold">Order #{order.order_id}</p>
              <span className="text-sm text-green-600">
                {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-2">
              {order.items.length} items
            </p>

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default OrdersPage;
