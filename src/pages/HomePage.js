import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';

// ✅ dummy products (renamed to avoid clash)
import productList from '../data/products';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState(localStorage.getItem('nimzo_pincode') || '');
  const [pincodeValid, setPincodeValid] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        axios.get(`${API}/categories`),
        axios.get(`${API}/products?limit=20`)
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
      setActiveCategory(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CATEGORY FILTER
  const fetchProductsByCategory = async (categoryName) => {
    try {
      setLoading(true);
      setActiveCategory(categoryName);
      const res = await axios.get(
        `${API}/products?category=${encodeURIComponent(categoryName)}`
      );
      setProducts(res.data);
      setSearchQuery('');
    } catch (err) {
      console.error('Category filter error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${API}/products?search=${encodeURIComponent(searchQuery)}`
      );
      setProducts(response.data);
      setActiveCategory(null);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPincode = async (code) => {
    if (code.length !== 6) {
      setPincodeValid(null);
      return;
    }
    try {
      const response = await axios.post(`${API}/pincode/check`, { pincode: code });
      setPincodeValid(response.data.is_serviceable);
      if (response.data.is_serviceable) {
        localStorage.setItem('nimzo_pincode', code);
      }
    } catch (error) {
      setPincodeValid(false);
    }
  };

  const finalProducts = products.length > 0 ? products : productList;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-md mx-auto md:max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#CCFF00] flex items-center justify-center">
                <span className="text-lg font-extrabold text-[#2D0036]">N</span>
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-[#2D0036]">Nimzo</h1>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>Delivery in 10-15 mins</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#CCFF00]" />
              <input
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setPincode(val);
                  checkPincode(val);
                }}
                className="w-20 text-sm px-2 py-1 rounded-lg border"
              />
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-2 w-full rounded-lg border"
            />
          </form>
        </div>
      </header>

      {/* Banner */}
      <div className="max-w-md mx-auto md:max-w-7xl px-4 py-4">
        <img
          src="/banners/banner1.jpg.webp"
          alt="Nimzo Offer"
          className="w-full h-40 md:h-56 object-cover rounded-2xl shadow-md"
        />
      </div>

      {/* Main */}
      <main className="max-w-md mx-auto md:max-w-7xl px-4 py-6">
        {/* Categories */}
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">Shop by Category</h3>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
            {categories.slice(0, 7).map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={fetchProductsByCategory}
              />
            ))}
          </div>
        </section>

        {/* Products */}
        <section>
          <h3 className="text-lg font-bold mb-4">
            {activeCategory
              ? activeCategory
              : searchQuery
              ? `Results for "${searchQuery}"`
              : 'Popular Products'}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array(12).fill(0).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl skeleton" />
              ))
            ) : finalProducts.length > 0 ? (
              finalProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No products found
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
