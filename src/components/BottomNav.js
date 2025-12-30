import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const BottomNav = () => {
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/categories', icon: LayoutGrid, label: 'Categories' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: cart.item_count },
    { path: isAuthenticated ? '/profile' : '/auth', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bottom-nav" data-testid="bottom-nav">
      <div className="max-w-md mx-auto md:max-w-7xl flex justify-around">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            data-testid={`nav-${label.toLowerCase()}`}
          >
            <div className="relative">
              <Icon size={22} />
              {badge > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF4D4D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
