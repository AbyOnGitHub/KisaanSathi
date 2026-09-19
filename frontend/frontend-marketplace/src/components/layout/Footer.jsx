/**
 * Multi-column commercial footer inspired by Flipkart & Amazon India.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#111827] text-gray-300 text-xs mt-16">
      {/* Top Value Strip */}
      <div className="border-b border-gray-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-900/40 text-agri-primary rounded-full border border-green-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">100% Genuine Products</p>
              <p className="text-gray-400 text-xs">Direct from verified brands & dealers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-900/40 text-agri-accent rounded-full border border-amber-800">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Price Negotiation</p>
              <p className="text-gray-400 text-xs">Bargain directly for bulk farm orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-900/40 text-blue-400 rounded-full border border-blue-800">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Village Doorstep Delivery</p>
              <p className="text-gray-400 text-xs">Serving 50,000+ PIN codes across India</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-900/40 text-purple-400 rounded-full border border-purple-800">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Farmer Support Helpline</p>
              <p className="text-gray-400 text-xs">Call toll-free: 1800-AGRI-MART</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Multi-Column Section */}
      <div className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-gray-200">
              About AgriMart
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Marketplace Catalog</Link></li>
              <li><Link to="/bargains" className="hover:text-white transition">How Bargaining Works</Link></li>
              <li><a href="#" className="hover:text-white transition">AgriMart Wholesale</a></li>
              <li><a href="#" className="hover:text-white transition">Careers at KisaanSathi</a></li>
            </ul>
          </div>

          {/* Column 2: Help & Customer Support */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-gray-200">
              Help & Support
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/orders" className="hover:text-white transition">Track Order</Link></li>
              <li><a href="#" className="hover:text-white transition">Shipping Rates & Policies</a></li>
              <li><a href="#" className="hover:text-white transition">Returns & Replacements</a></li>
              <li><a href="#" className="hover:text-white transition">Payment Options</a></li>
              <li><a href="#" className="hover:text-white transition">Farmer Helpdesk FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: Sell on AgriMart */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-gray-200">
              Make Money with Us
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/seller/dashboard" className="text-agri-accent font-semibold hover:underline">Seller Central Login</Link></li>
              <li><a href="#" className="hover:text-white transition">Sell Farm Inputs</a></li>
              <li><a href="#" className="hover:text-white transition">Dealer Verification Requirements</a></li>
              <li><a href="#" className="hover:text-white transition">Fulfillment by AgriMart</a></li>
              <li><a href="#" className="hover:text-white transition">Advertise Your Products</a></li>
            </ul>
          </div>

          {/* Column 4: Trust & Regional Presence */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-gray-200">
              Registered Office
            </h4>
            <p className="text-gray-400 leading-relaxed mb-3">
              AgriMart Technologies India Pvt. Ltd.<br />
              Kisaan Bhavan, APMC Mandi Road,<br />
              Nagpur, Maharashtra - 440001, India<br />
              CIN: U01100MH2024PTC123456
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <span>Supported Payments:</span>
              <span className="font-semibold text-white">UPI • COD • Cards • NetBanking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-gray-800 py-6 px-4 sm:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400">
          <p className="flex items-center gap-1">
            © 2026 AgriMart — Empowering Indian Farmers with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition">Conditions of Use</a>
            <a href="#" className="hover:text-white transition">Privacy Notice</a>
            <a href="#" className="hover:text-white transition">Interest-Based Ads</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
