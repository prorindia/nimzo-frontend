import React from "react";
import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const BottomNav = () => {
  const { cart } = useCart();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/categories", icon: LayoutGrid, label: "Categories" },
    { path: "/cart", icon: ShoppingCart, label: "Cart", badge: cart.item_count },
    { path: "/profile", icon: User, label: "Profile" }, // ✅ ALWAYS /profile
  ];

  return (
    <nav className="bottom-nav" data-testid="bottom-nav">
      <div className="max-w-md mx-auto md:max-w-7xl flex justify-around">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <div className="relative">
              <Icon size={22} />
              {badge > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF4D4D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {badge > 9 ? "9+" : badge}
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
