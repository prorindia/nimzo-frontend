import React, { useEffect, useState } from "react";
import axios from "axios";

const API =
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

const STATUS_OPTIONS = [
  "PLACED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/orders`);
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Admin orders load nahi ho rahe");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.put(
        `${API}/api/admin/orders/${orderId}/status`,
        { status: newStatus }
      );

      // UI update without reload
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId
            ? { ...o, status: newStatus }
            : o
        )
      );
    } catch (err) {
      alert("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading admin orders...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-[#F8F9FA]">
      <h1 className="text-2xl font-bold mb-6">
        🛠 Admin Orders Panel
      </h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white p-4 rounded-xl border"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-bold">
                    Order #{order.order_id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.phone}
                  </p>
                </div>

                <select
                  value={order.status}
                  disabled={updatingId === order.order_id}
                  onChange={(e) =>
                    updateStatus(order.order_id, e.target.value)
                  }
                  className="border rounded px-2 py-1"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-sm">
                Items: {order.items.length} •{" "}
                <strong>₹{order.total}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
