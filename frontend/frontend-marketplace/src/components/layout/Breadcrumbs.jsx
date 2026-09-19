/**
 * Dynamic breadcrumbs component for catalog and product detail pages.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center text-xs text-gray-500 py-3 overflow-x-auto whitespace-nowrap">
      <Link to="/" className="flex items-center gap-1 hover:text-agri-primary transition">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 mx-1 text-gray-400 flex-shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-[350px]">
                {item.label}
              </span>
            ) : (
              <Link to={item.href} className="hover:text-agri-primary transition">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
