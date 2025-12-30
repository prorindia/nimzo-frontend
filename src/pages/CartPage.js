import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

const CartPage = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" data-testid="cart-page">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-[#2D0036] mb-2">Login to view cart</h2>
        <p className="text-gray-500 mb-6 text-center">Please login to add items to your cart</p>
        <Button
          onClick={() => navigate('/auth')}
          className="bg-[#CCFF00] text-[#2D0036] hover:bg-[#B3E600] font-bold px-8 py-3 rounded-full"
          data-testid="login-btn"
        >
          Login
        </Button>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" data-testid="cart-page">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-[#2D0036] mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items to get started</p>
        <Button
          onClick={() => navigate('/')}
          className="bg-[#CCFF00] text-[#2D0036] hover:bg-[#B3E600] font-bold px-8 py-3 rounded-full"
          data-testid="shop-now-btn"
        >
          Shop Now
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40" data-testid="cart-page">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto md:max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-[#2D0036]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Cart ({cart.item_count} items)
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto md:max-w-2xl px-4 py-6">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cart.items.map((item) => (
            <div key={item.product_id} className="bg-white rounded-xl p-4 border border-gray-100 flex gap-4" data-testid={`cart-item-${item.product_id}`}>
              <img 
                src={item.image_url} 
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#2D0036] truncate">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.unit}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-[#2D0036]">₹{item.price}</span>
                  {item.mrp > item.price && (
                    <span className="text-xs text-gray-400 line-through">₹{item.mrp}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button 
                  onClick={() => removeFromCart(item.product_id)}
                  className="p-1.5 text-gray-400 hover:text-red-500"
                  data-testid={`remove-${item.product_id}`}
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartItem(item.product_id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[#2D0036] hover:bg-gray-200"
                    data-testid={`decrease-${item.product_id}`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateCartItem(item.product_id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-[#CCFF00] flex items-center justify-center text-[#2D0036] hover:bg-[#B3E600]"
                    data-testid={`increase-${item.product_id}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Savings Banner */}
        {cart.savings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-green-700 font-medium">
              You're saving ₹{cart.savings.toFixed(0)} on this order! 🎉
            </p>
          </div>
        )}
      </main>

      {/* Bottom Checkout Bar */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg">
        <div className="max-w-md mx-auto md:max-w-2xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">{cart.item_count} items</p>
              <p className="text-xl font-bold text-[#2D0036]">₹{cart.total.toFixed(0)}</p>
            </div>
            <Button
              onClick={() => navigate('/checkout')}
              className="bg-[#CCFF00] text-[#2D0036] hover:bg-[#B3E600] font-bold px-8 py-3 rounded-full"
              data-testid="checkout-btn"
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
