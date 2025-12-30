import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        axios.get(`${API}/categories`),
        axios.get(`${API}/products${categoryId ? `?category_id=${categoryId}` : ''}`)
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
      if (categoryId) {
        const cat = catRes.data.find(c => c.id === categoryId);
        setCategory(cat);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24" data-testid="category-page">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto md:max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-[#2D0036]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {category ? category.name : 'All Categories'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto md:max-w-7xl px-4 py-6">
        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <Link
            to="/categories"
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !categoryId 
                ? 'bg-[#CCFF00] text-[#2D0036]' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoryId === cat.id 
                  ? 'bg-[#CCFF00] text-[#2D0036]' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
            Array(12).fill(0).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl skeleton" />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No products in this category
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
