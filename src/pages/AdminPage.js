import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, ShoppingCart, Users, Plus, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPage = () => {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    mrp: '',
    unit: '',
    category_id: '',
    image_url: '',
    stock: '100'
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAdmin, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      
      if (activeTab === 'products') {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API}/products?limit=100`),
          axios.get(`${API}/categories`)
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } else if (activeTab === 'orders') {
        const response = await axios.get(`${API}/admin/orders`, { headers });
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    try {
      setLoading(true);
      await axios.post(`${API}/admin/seed`);
      alert('Database seeded successfully!');
      fetchData();
    } catch (error) {
      console.error('Seed error:', error);
      alert('Failed to seed database');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
        mrp: parseFloat(productForm.mrp),
        stock: parseInt(productForm.stock),
        is_available: true
      };
      
      if (editingProduct) {
        await axios.put(`${API}/admin/products/${editingProduct.id}`, data, { headers });
      } else {
        await axios.post(`${API}/admin/products`, data, { headers });
      }
      
      setShowAddProduct(false);
      setEditingProduct(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API}/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API}/admin/orders/${orderId}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      mrp: '',
      unit: '',
      category_id: '',
      image_url: '',
      stock: '100'
    });
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      mrp: product.mrp.toString(),
      unit: product.unit,
      category_id: product.category_id,
      image_url: product.image_url,
      stock: product.stock.toString()
    });
    setShowAddProduct(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-yellow-100 text-yellow-700';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen pb-24" data-testid="admin-page">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto md:max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/profile" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-bold text-[#2D0036]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Admin Dashboard
              </h1>
            </div>
            <Button
              onClick={handleSeedData}
              variant="outline"
              size="sm"
              className="text-xs"
              data-testid="seed-btn"
            >
              Seed Data
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto md:max-w-7xl px-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'products' 
                  ? 'border-[#CCFF00] text-[#2D0036]' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              <Package size={18} />
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'orders' 
                  ? 'border-[#CCFF00] text-[#2D0036]' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              <ShoppingCart size={18} />
              Orders ({orders.length})
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto md:max-w-7xl px-4 py-6">
        {activeTab === 'products' && (
          <>
            {/* Add Product Button */}
            <Dialog open={showAddProduct} onOpenChange={(open) => {
              setShowAddProduct(open);
              if (!open) {
                setEditingProduct(null);
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button className="mb-6 bg-[#CCFF00] text-[#2D0036] hover:bg-[#B3E600] font-bold">
                  <Plus size={18} className="mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Product Name</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      placeholder="Product name"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      placeholder="Product description"
                      className="mt-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price (₹)</Label>
                      <Input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        placeholder="Selling price"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>MRP (₹)</Label>
                      <Input
                        type="number"
                        value={productForm.mrp}
                        onChange={(e) => setProductForm({...productForm, mrp: e.target.value})}
                        placeholder="Maximum retail price"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Unit</Label>
                      <Input
                        value={productForm.unit}
                        onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                        placeholder="e.g. 1 kg, 500 g"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        placeholder="Stock quantity"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select 
                      value={productForm.category_id} 
                      onValueChange={(value) => setProductForm({...productForm, category_id: value})}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={productForm.image_url}
                      onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                      placeholder="Product image URL"
                      className="mt-1.5"
                    />
                  </div>
                  <Button
                    onClick={handleSaveProduct}
                    className="w-full bg-[#CCFF00] text-[#2D0036] hover:bg-[#B3E600] font-bold"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-24 rounded-xl skeleton" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-xl p-4 border border-gray-100 flex gap-4"
                    data-testid={`admin-product-${product.id}`}
                  >
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#2D0036] truncate">{product.name}</h3>
                      <p className="text-xs text-gray-500">{product.category_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-[#2D0036]">₹{product.price}</span>
                        <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => openEditProduct(product)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-32 rounded-xl skeleton" />
              ))
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-xl p-4 border border-gray-100"
                  data-testid={`admin-order-${order.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-[#2D0036]">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className={`w-40 ${getStatusColor(order.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium">{order.address.full_name}</p>
                    <p className="text-xs text-gray-500">
                      {order.address.address_line1}, {order.address.city} - {order.address.pincode}
                    </p>
                    <p className="text-xs text-gray-500">{order.address.phone}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      {order.items.length} items • {order.payment_method}
                    </div>
                    <p className="font-bold text-[#2D0036]">₹{order.total}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
