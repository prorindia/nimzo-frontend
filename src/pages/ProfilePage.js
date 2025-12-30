import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Package, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

const ProfilePage = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen pb-24" data-testid="profile-page">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto md:max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-[#2D0036]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Profile
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto md:max-w-2xl px-4 py-6">
        {/* User Info */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#CCFF00] flex items-center justify-center">
              <span className="text-2xl font-bold text-[#2D0036]">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2D0036]">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
              <p className="text-sm text-gray-400">{user?.phone}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          <Link to="/orders" className="flex items-center gap-4 p-4 hover:bg-gray-50">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Package size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#2D0036]">My Orders</p>
              <p className="text-sm text-gray-500">View order history & track</p>
            </div>
          </Link>

          <Link to="/addresses" className="flex items-center gap-4 p-4 hover:bg-gray-50">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <MapPin size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#2D0036]">Saved Addresses</p>
              <p className="text-sm text-gray-500">Manage delivery addresses</p>
            </div>
          </Link>

          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-4 p-4 hover:bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Shield size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#2D0036]">Admin Dashboard</p>
                <p className="text-sm text-gray-500">Manage products & orders</p>
              </div>
            </Link>
          )}
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full mt-6 border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold py-6 rounded-full"
          data-testid="logout-btn"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </main>
    </div>
  );
};

export default ProfilePage;
