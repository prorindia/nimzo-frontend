import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart, updateCartItem, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const quantity = getItemQuantity(product.id);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setLoading(true);
    await addToCart(product.id, 1);
    setLoading(false);
  };

  const handleUpdate = async (newQty) => {
    setLoading(true);
    await updateCartItem(product.id, newQty);
    setLoading(false);
  };

  return (
    <div className="card-product" data-testid={`product-${product.id}`}>
      {/* Discount Badge */}
      {product.discount_percent > 0 && (
        <span className="badge-discount">
          {product.discount_percent}% OFF
        </span>
      )}
      
      {/* Image */}
      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-[#2D0036] line-clamp-2 leading-tight min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500">{product.unit}</p>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#2D0036]">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
          )}
        </div>
      </div>

      {/* Add to Cart */}
      <div className="mt-3">
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-[#CCFF00] text-[#2D0036] font-semibold text-sm 
                       hover:bg-[#B3E600] active:scale-95 transition-all flex items-center justify-center gap-1
                       disabled:opacity-50"
            data-testid={`add-btn-${product.id}`}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#2D0036] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus size={16} />
                ADD
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center justify-between bg-[#CCFF00] rounded-lg overflow-hidden">
            <button
              onClick={() => handleUpdate(quantity - 1)}
              disabled={loading}
              className="w-10 h-9 flex items-center justify-center text-[#2D0036] hover:bg-[#B3E600] transition-colors"
              data-testid={`decrease-btn-${product.id}`}
            >
              <Minus size={16} />
            </button>
            <span className="font-bold text-[#2D0036] min-w-[2rem] text-center">
              {loading ? (
                <span className="w-4 h-4 border-2 border-[#2D0036] border-t-transparent rounded-full animate-spin inline-block" />
              ) : (
                quantity
              )}
            </span>
            <button
              onClick={() => handleUpdate(quantity + 1)}
              disabled={loading}
              className="w-10 h-9 flex items-center justify-center text-[#2D0036] hover:bg-[#B3E600] transition-colors"
              data-testid={`increase-btn-${product.id}`}
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
