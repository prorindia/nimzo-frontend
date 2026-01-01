import React, { useEffect, useState } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ORDER_STATUSES = [
  "PLACED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED"
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/admin/orders`);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Admin orders fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`${API}/admin/orders/${orderId}/status`, {
        status
      });
      fetchOrders();
    } catch (err) {
      alert("Status update failed");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading admin orders...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

      {orders.length === 0 && <p>No orders found</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white border rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-bold">
                  Order #{order.order_id}
                </p>
                <p className="text-sm text-gray-500">
                  Phone: {order.phone}
                </p>
              </div>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order.order_id, e.target.value)
                }
                className="border px-3 py-1 rounded"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              Address: {order.address}
            </div>

            <div className="flex justify-between font-bold">
              <span>{order.items.length} items</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
