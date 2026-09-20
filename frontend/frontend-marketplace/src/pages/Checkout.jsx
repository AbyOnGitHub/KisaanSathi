/**
 * Multi-step Checkout Page.
 * 3-Step checkout: Shipping Address -> Order Summary -> Payment confirmation.
 * Connected to FastAPI POST /orders/create.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MapPin,
  CheckCircle2,
  Package,
  CreditCard,
  Building,
  Home,
  Tractor,
  AlertCircle,
  Truck,
} from 'lucide-react';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import Button from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getEstimatedDeliveryDate } from '../utils/formatters';
import api from '../utils/api';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { profile } = useAuth();

  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Summary, 3: Payment
  const [address, setAddress] = useState({
    fullName: profile?.full_name || '',
    phoneNumber: profile?.phone_number || '',
    pincode: '440001',
    houseStreet: '',
    villageTown: '',
    city: 'Nagpur',
    state: 'Maharashtra',
    type: 'farm', // 'home', 'farm', 'office'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryDate = getEstimatedDeliveryDate(3);

  const handlePlaceOrder = async () => {
    if (!items || items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/products');
      return;
    }

    if (!address.fullName || !address.phoneNumber || !address.houseStreet || !address.city || !address.state || !address.pincode) {
      toast.error('Please complete all required address fields');
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    const orderPayload = {
      shipping_address: `${address.houseStreet}, ${address.villageTown}`.trim(),
      shipping_city: address.city,
      shipping_state: address.state,
      shipping_pincode: address.pincode,
    };

    try {
      const res = await api.post('/orders/create', orderPayload);
      const newOrder = res.data;
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${newOrder.id}/success`, { state: { order: newOrder } });
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to place order. Please try again.';
      toast.error(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Marketplace', href: '/products' },
    { label: 'Shopping Cart', href: '/cart' },
    { label: 'Checkout' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 space-y-6">
      <Breadcrumbs items={breadcrumbs} />

      {/* 3-Step Progress Bar */}
      <div className="bg-white rounded-lg border border-agri-border p-4 shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep >= 1 ? 'bg-agri-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              1
            </div>
            <span className={`text-xs font-bold ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
              Farm Address
            </span>
          </div>

          <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-agri-primary' : 'bg-gray-200'}`} />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep >= 2 ? 'bg-agri-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              2
            </div>
            <span className={`text-xs font-bold ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
              Order Summary
            </span>
          </div>

          <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 3 ? 'bg-agri-primary' : 'bg-gray-200'}`} />

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep >= 3 ? 'bg-agri-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              3
            </div>
            <span className={`text-xs font-bold ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
              Payment
            </span>
          </div>
        </div>
      </div>

      {/* Main Checkout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* STEP 1: Delivery Address */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg border border-agri-border p-5 space-y-4 shadow-xs text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-agri-primary" />
                  <span>1. Enter Delivery Location</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={address.phoneNumber}
                    onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">City / District *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    House / Building / Farm Plot Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.houseStreet}
                    onChange={(e) => setAddress({ ...address, houseStreet: e.target.value })}
                    placeholder="e.g. Survey No. 42, Gat No. 15, Near Canal"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    Village / Town & Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.villageTown}
                    onChange={(e) => setAddress({ ...address, villageTown: e.target.value })}
                    placeholder="e.g. Village Borgaon, Behind Primary Health Centre"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary"
                  />
                </div>

                {/* Address Type Chips */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Address Type</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'farm', label: 'Farm / Khet', icon: <Tractor className="w-3.5 h-3.5" /> },
                      { id: 'home', label: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
                      { id: 'office', label: 'Godown / Office', icon: <Building className="w-3.5 h-3.5" /> },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setAddress({ ...address, type: t.id })}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                          address.type === t.id
                            ? 'bg-agri-primary text-white border-agri-primary'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {t.icon}
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <Button
                  variant="accent"
                  size="md"
                  disabled={!address.fullName || !address.phoneNumber || !address.houseStreet}
                  onClick={() => setCurrentStep(2)}
                >
                  Continue to Order Summary
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Order Summary Review */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg border border-agri-border p-5 space-y-4 shadow-xs text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-agri-primary" />
                  <span>2. Review Order Line Items</span>
                </h3>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-agri-primary font-semibold hover:underline"
                >
                  Change Address
                </button>
              </div>

              {/* Selected Address Strip */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">{address.fullName} • {address.phoneNumber}</span>
                  <p className="text-gray-600 mt-0.5">
                    {address.houseStreet}, {address.villageTown}, {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  {address.type}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {items.map((it) => (
                  <div key={it.id || it.product_id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.product?.image_urls?.[0] || 'https://images.unsplash.com/photo-1594488518002-390919246193?w=100&auto=format&fit=crop&q=80'}
                        alt={it.product?.name}
                        className="w-12 h-12 rounded object-cover border border-gray-200"
                      />
                      <div>
                        <span className="font-bold text-gray-900 text-xs block">{it.product?.name}</span>
                        <span className="text-gray-500 text-[11px]">
                          Qty: <strong>{it.quantity}</strong> × {formatPrice(it.effective_unit_price || it.product?.price)}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">
                      {formatPrice((it.effective_unit_price || it.product?.price || 0) * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-between">
                <Button variant="secondary" size="md" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button variant="accent" size="md" onClick={() => setCurrentStep(3)}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Options (Cash on Delivery / Testing) */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg border border-agri-border p-5 space-y-4 shadow-xs text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-agri-primary" />
                  <span>3. Payment Selection</span>
                </h3>
              </div>

              {/* Notice Banner */}
              <div className="p-3.5 bg-green-50 rounded-lg border border-green-300 text-green-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Payment upon Dispatch / Delivery</h4>
                  <p className="text-[11px] text-green-800 mt-0.5">
                    Orders are placed directly in the database with status <strong>'pending'</strong>. You can view, track, and update order status in real time.
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-agri-primary bg-green-50/50 cursor-pointer">
                  <input type="radio" checked readOnly className="w-4 h-4 text-agri-primary accent-agri-primary" />
                  <div className="flex-1">
                    <span className="font-bold text-gray-800 block">Cash on Farm Delivery (COD) / Direct UPI</span>
                    <span className="text-[11px] text-gray-500">Pay cash or UPI upon receiving supplies at your farm</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                <Button variant="secondary" size="md" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  onClick={handlePlaceOrder}
                  leftIcon={<CheckCircle2 className="w-5 h-5" />}
                >
                  Place Order ({formatPrice(totalAmount)})
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-agri-border p-5 space-y-3 text-xs shadow-xs sticky top-24">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider pb-2 border-b border-gray-100">
            Order Total
          </h3>

          <div className="space-y-2 py-2 text-gray-600 border-b border-gray-100">
            <div className="flex justify-between">
              <span>Items Total ({items.length})</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-agri-primary font-bold">FREE</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="text-sm font-bold text-gray-900">Amount Payable</span>
            <span className="text-xl font-black text-gray-900">{formatPrice(totalAmount)}</span>
          </div>

          <div className="p-3 bg-green-50 rounded text-[11px] text-green-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-agri-primary flex-shrink-0" />
            <span>Estimated delivery by <strong>{deliveryDate}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
