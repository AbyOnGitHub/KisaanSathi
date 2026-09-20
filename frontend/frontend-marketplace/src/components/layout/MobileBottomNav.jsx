/**
 * Fixed Mobile Bottom Navigation Bar.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, MessageSquareQuote, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useBargainSessions } from '../../hooks/useBargainSessions';

export const MobileBottomNav = () => {
  const { totalItems } = useCart();
  const { sessions } = useBargainSessions();
  const activeBargains = (sessions || []).filter((s) => s.status === 'open').length;

  const navItemClass = ({ isActive }) =>
    `flex flex-col items-center justify-center flex-1 py-2 text-[10px] font-medium transition ${
      isActive ? 'text-agri-primary font-bold' : 'text-gray-600 hover:text-gray-900'
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-agri-border shadow-lg flex items-center justify-around">
      <NavLink to="/" className={navItemClass}>
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/products" className={navItemClass}>
        <Grid className="w-5 h-5 mb-0.5" />
        <span>Categories</span>
      </NavLink>

      <NavLink to="/bargains" className={navItemClass}>
        <div className="relative">
          <MessageSquareQuote className="w-5 h-5 mb-0.5" />
          {activeBargains > 0 && (
            <span className="absolute -top-1 -right-2 bg-agri-accent text-gray-900 font-extrabold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {activeBargains}
            </span>
          )}
        </div>
        <span>Bargains</span>
      </NavLink>

      <NavLink to="/cart" className={navItemClass}>
        <div className="relative">
          <ShoppingCart className="w-5 h-5 mb-0.5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-agri-hot text-white font-extrabold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <span>Cart</span>
      </NavLink>

      <NavLink to="/orders" className={navItemClass}>
        <User className="w-5 h-5 mb-0.5" />
        <span>Account</span>
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav;
