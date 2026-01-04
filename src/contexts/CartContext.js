import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import API from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

// ✅ TOKEN HELPER
const getValidToken = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") {
    return null;
  }
  return token;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [cart, setCart] = useState({
    items: [],
    total: 0,
    item_count: 0,
    savings: 0
  });

  const [loading, setLoading] = useState(false);

  // 🔥 RESET CART
  const resetCartState = () => {
    setCart({
      items: [],
      total: 0,
      item_count: 0,
      savings: 0
    });
  };

  // 🔹 FETCH CART
  const fetchCart = useCallback(async () => {
    const token = getValidToken();
    if (!token) return;

    try {
      setLoading(true);
      const res = await API.get("/cart");
      setCart(res.data);
      return res.data;
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ AUTH SYNC
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      resetCartState();
      return;
    }

    fetchCart();
  }, [isAuthenticated, authLoading, fetchCart]);

  // ➕ ADD TO CART (GUARDED)
  const addToCart = async (productId, quantity = 1, product = null) => {
    if (quantity <= 0) return true;

    const token = getValidToken();

    if (!token) {
      setCart((prev) => {
        const existing = prev.items.find(
          (i) => i.product_id === productId
        );

        let updatedItems;
        if (existing) {
          updatedItems = prev.items.map((i) =>
            i.product_id === productId
              ? {
                  ...i,
                  quantity: i.quantity + quantity,
                  product: i.product || (product
                    ? {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image || product.image_url
                      }
                    : null)
                }
              : i
          );
        } else {
          updatedItems = [
            ...prev.items,
            {
              product_id: productId,
              quantity,
              product: product
                ? {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image || product.image_url
                  }
                : null
            }
          ];
        }

        const total = updatedItems.reduce(
          (sum, i) =>
            sum + Math.max(i.quantity, 0) * (i.product?.price || 0),
          0
        );

        return {
          ...prev,
          items: updatedItems,
          item_count: updatedItems.reduce(
            (sum, i) => sum + Math.max(i.quantity, 0),
            0
          ),
          total
        };
      });

      return true;
    }

    try {
      await API.post("/cart/add", {
        product_id: productId,
        quantity
      });
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Add to cart error:", err);
      throw err;
    }
  };

  // 🔄 UPDATE ITEM (🔥 HARD GUARD ADDED)
  const updateCartItem = async (productId, quantity) => {
    const token = getValidToken();

    // 🔒 GLOBAL GUARD
    if (quantity <= 0) {
      await removeFromCart(productId);
      return true;
    }

    // 🧑‍🦱 GUEST CART
    if (!token) {
      setCart((prev) => {
        const updatedItems = prev.items.map((i) =>
          i.product_id === productId
            ? { ...i, quantity }
            : i
        );

        const total = updatedItems.reduce(
          (sum, i) =>
            sum + Math.max(i.quantity, 0) * (i.product?.price || 0),
          0
        );

        return {
          ...prev,
          items: updatedItems,
          item_count: updatedItems.reduce(
            (sum, i) => sum + Math.max(i.quantity, 0),
            0
          ),
          total
        };
      });

      return true;
    }

    // 🔐 AUTH USER
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

  // ❌ REMOVE ITEM
  const removeFromCart = async (productId) => {
    const token = getValidToken();

    if (!token) {
      setCart((prev) => {
        const updatedItems = prev.items.filter(
          (i) => i.product_id !== productId
        );

        const total = updatedItems.reduce(
          (sum, i) =>
            sum + Math.max(i.quantity, 0) * (i.product?.price || 0),
          0
        );

        return {
          ...prev,
          items: updatedItems,
          item_count: updatedItems.reduce(
            (sum, i) => sum + Math.max(i.quantity, 0),
            0
          ),
          total
        };
      });

      return true;
    }

    try {
      await API.delete(`/cart/remove/${productId}`);
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Remove cart item error:", err);
      throw err;
    }
  };

  // 🧹 CLEAR CART
  const clearCart = async ({ silent = false } = {}) => {
    if (silent) {
      resetCartState();
      return true;
    }

    try {
      await API.delete("/cart/clear");
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Clear cart error:", err);
      throw err;
    }
  };

  // 🔍 GET ITEM QUANTITY
  const getItemQuantity = (productId) => {
    const item = cart.items.find(
      (item) => item.product_id === productId
    );
    return item ? Math.max(item.quantity, 0) : 0;
  };

  // 🔄 SYNC GUEST CART AFTER LOGIN
  useEffect(() => {
    if (!isAuthenticated) return;
    if (cart.items.length === 0) return;

    const syncGuestCart = async () => {
      try {
        for (const item of cart.items) {
          if (item.quantity > 0) {
            await API.post("/cart/add", {
              product_id: item.product_id,
              quantity: item.quantity
            });
          }
        }
        await fetchCart();
      } catch (err) {
        console.error("Guest cart sync error:", err);
      }
    };

    syncGuestCart();
    // eslint-disable-next-line
  }, [isAuthenticated]);

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
