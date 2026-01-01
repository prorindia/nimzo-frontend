import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import API from "../api/api";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
    item_count: 0,
    savings: 0
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch cart
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/cart");
      setCart(res.data);
      return res.data;
    } catch (err) {
      console.error("Fetch cart error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart().catch(() => {});
  }, [fetchCart]);

  // ➕ Add to cart (FIXED)
  const addToCart = async (productId, quantity = 1) => {
    try {
      await API.post("/cart/add", {
        product_id: productId,
        quantity
      });

      await fetchCart(); // 🔥 MUST await
      return true;
    } catch (err) {
      console.error("Add to cart error:", err);
      throw err; // 🔥 IMPORTANT
    }
  };

  // 🔄 Update quantity (FIXED)
  const updateCartItem = async (productId, quantity) => {
    try {
      await API.put("/cart/update", {
        product_id: productId,
        quantity
      });

      await fetchCart();
      return true;
    } catch (err) {
      console.error("Update cart error:", err);
      throw err;
    }
  };

  // ❌ Remove item
  const removeFromCart = async (productId) => {
    try {
      await API.delete(`/cart/remove/${productId}`);
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Remove cart item error:", err);
      throw err;
    }
  };

  // 🧹 Clear cart
  const clearCart = async () => {
    try {
      await API.delete("/cart/clear");
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Clear cart error:", err);
      throw err;
    }
  };

  // 🔍 Get quantity of product
  const getItemQuantity = (productId) => {
    const item = cart.items.find(
      (item) => item.product_id === productId
    );
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getItemQuantity,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
