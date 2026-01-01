import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, updateCartItem, getItemQuantity } = useCart();
  const [loading, setLoading] = useState(false);

  const quantity = getItemQuantity(product.id);

  const handleAdd = async () => {
    try {
      setLoading(true);
      await addToCart(product.id, 1);
    } catch (error) {
      console.error("ADD TO CART FAILED", error);
      alert("Add to cart failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (newQty) => {
    try {
      setLoading(true);
      await updateCartItem(product.id, newQty);
    } catch (error) {
      console.error("UPDATE CART FAILED", error);
      alert("Update cart failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-product">
      {/* Image */}
      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-50">
        <img
          src={product.image || product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <h3 className="text-sm font-semibold">{product.name}</h3>
      <p className="text-sm font-bold">₹{product.price}</p>

      {/* Cart Buttons */}
      {quantity === 0 ? (
        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full mt-2 py-2 bg-[#CCFF00] rounded-lg font-bold"
        >
          {loading ? 'ADDING...' : 'ADD'}
        </button>
      ) : (
        <div className="flex items-center justify-between mt-2 bg-[#CCFF00] rounded-lg">
          <button
            onClick={() => handleUpdate(quantity - 1)}
            disabled={loading}
            className="px-3 py-2"
          >
            <Minus size={16} />
          </button>

          <span className="font-bold">{quantity}</span>

          <button
            onClick={() => handleUpdate(quantity + 1)}
            disabled={loading}
            className="px-3 py-2"
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
