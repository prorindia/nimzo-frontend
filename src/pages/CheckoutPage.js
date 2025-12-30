import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Plus, Check, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutPage = () => {
  const { cart, refreshCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`${API}/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(response.data);
      const defaultAddr = response.data.find(a => a.is_default) || response.data[0];
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddAddress = async () => {
    try {
      await axios.post(`${API}/addresses`, { ...newAddress, is_default: addresses.length === 0 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddAddress(false);
      setNewAddress({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        pincode: ''
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/orders`, {
        address_id: selectedAddress,
        payment_method: paymentMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await refreshCart();
      navigate(`/order-success/${response.data.id}`);
    } catch (error) {
      console.error('Order error:', error);
      alert(error.response?.data?.detail || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen pb-40" data-testid="checkout-page">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto md:max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/cart" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-[#2D0036]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Checkout
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto md:max-w-2xl px-4 py-6">
        {/* Delivery Address */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#2D0036] flex items-center gap-2">
              <MapPin size={18} className="text-[#CCFF00]" />
              Delivery Address
            </h2>
            <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
              <DialogTrigger asChild>
                <button className="text-sm text-[#2D0036] font-medium flex items-center gap-1 hover:underline">
                  <Plus size={16} /> Add New
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={newAddress.full_name}
                        onChange={(e) => setNewAddress({...newAddress, full_name: e.target.value})}
                        placeholder="Full name"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        placeholder="Phone number"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Address Line 1</Label>
                    <Input
                      value={newAddress.address_line1}
                      onChange={(e) => setNewAddress({...newAddress, address_line1: e.target.value})}
                      placeholder="House no, building, street"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Address Line 2 (Optional)</Label>
                    <Input
                      value={newAddress.address_line2}
                      onChange={(e) => setNewAddress({...newAddress, address_line2: e.target.value})}
                      placeholder="Landmark, area"
                      className="mt-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        placeholder="City"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        placeholder="State"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Pincode</Label>
                      <Input
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                        placeholder="Pincode"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddAddress}
                    className="w-full bg-[#CCFF00] text-[#2D0036] hover:bg-[#B3E600] font-bold"
                  >
                    Save Address
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {addresses.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <MapPin size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No addresses saved</p>
              <button
                onClick={() => setShowAddAddress(true)}
                className="text-[#2D0036] font-medium mt-2 hover:underline"
              >
                Add your first address
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAddress === addr.id 
                      ? 'border-[#CCFF00] bg-[#CCFF00]/5' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                  data-testid={`address-${addr.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-[#2D0036]">{addr.full_name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {addr.address_line1}
                        {addr.address_line2 && `, ${addr.address_line2}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-sm text-gray-500">{addr.phone}</p>
                    </div>
                    {selectedAddress === addr.id && (
                      <div className="w-6 h-6 rounded-full bg-[#CCFF00] flex items-center justify-center">
                        <Check size={14} className="text-[#2D0036]" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Payment Method */}
        <section className="mb-6">
          <h2 className="font-bold text-[#2D0036] mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-[#CCFF00]" />
            Payment Method
          </h2>
          <div className="space-y-3">
            <div
              onClick={() => setPaymentMethod('COD')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                paymentMethod === 'COD' 
                  ? 'border-[#CCFF00] bg-[#CCFF00]/5' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
              data-testid="payment-cod"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Banknote size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#2D0036]">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay when you receive</p>
              </div>
              {paymentMethod === 'COD' && (
                <div className="w-6 h-6 rounded-full bg-[#CCFF00] flex items-center justify-center">
                  <Check size={14} className="text-[#2D0036]" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section className="mb-6">
          <h2 className="font-bold text-[#2D0036] mb-4">Order Summary</h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Items ({cart.item_count})</span>
              <span>₹{(cart.total + cart.savings).toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-₹{cart.savings.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-[#2D0036]">
              <span>Total</span>
              <span>₹{cart.total.toFixed(0)}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Place Order Bar */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg">
        <div className="max-w-md mx-auto md:max-w-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-bold text-[#2D0036]">₹{cart.total.toFixed(0)}</p>
            </div>
            <Button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className="bg-[#CCFF00] text-[#2D0036] hover:bg-[#B3E600] font-bold px-8 py-3 rounded-full disabled:opacity-50"
              data-testid="place-order-btn"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
