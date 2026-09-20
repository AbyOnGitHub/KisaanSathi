/**
 * Multi-step Checkout Page for AgriMart.
 * 3-Step checkout: Shipping Address -> Order Summary -> Razorpay Test Mode Payment.
 * Integrates with FastAPI /api/payments/create-order and /api/payments/verify.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import Button from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getEstimatedDeliveryDate } from '../utils/formatters';
import { loadRazorpayScript } from '../utils/razorpay';
import api from '../utils/api';

export const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { profile } = useAuth();

  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Summary, 3: Payment
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'cod'
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
  const [isVerifying, setIsVerifying] = useState(false);

  const deliveryDate = getEstimatedDeliveryDate(3);

  const validateAddress = () => {
    if (
      !address.fullName ||
      !address.phoneNumber ||
      !address.houseStreet ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      toast.error('Please complete all required address fields');
      setCurrentStep(1);
      return false;
    }
    return true;
  };

  // Handler for Razorpay Test Payment & COD fallback
  const handlePayment = async () => {
    if (!items || items.length === 0) {
      toast.error(t('cart.cart_empty_title'));
      navigate('/products');
      return;
    }

    if (!validateAddress()) return;

    const orderPayload = {
      shipping_address: `${address.houseStreet}, ${address.villageTown}`.trim(),
      shipping_city: address.city,
      shipping_state: address.state,
      shipping_pincode: address.pincode,
    };

    // Flow 1: Razorpay Test Mode Payment
    if (paymentMethod === 'razorpay') {
      setIsSubmitting(true);
      try {
        // 1. Ensure Razorpay SDK script is loaded
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error('Failed to load Razorpay payment gateway SDK. Check internet connection.');
          setIsSubmitting(false);
          return;
        }

        // 2. Call backend to initiate order in DB & Razorpay
        const orderRes = await api.post('/payments/create-order', orderPayload);
        const orderData = orderRes.data;

        // 3. Configure and trigger Razorpay Checkout Modal
        const razorpayKey =
          orderData.key_id ||
          import.meta.env.VITE_RAZORPAY_KEY_ID ||
          'rzp_test_placeholder';

        const options = {
          key: razorpayKey,
          amount: orderData.amount, // amount in paise
          currency: orderData.currency || 'INR',
          name: 'AgriMart',
          description: 'Agricultural Supplies Purchase',
          image:
            'https://images.unsplash.com/photo-1594488518002-390919246193?w=128&auto=format&fit=crop&q=80',
          order_id: orderData.razorpay_order_id,
          handler: async function (response) {
            setIsVerifying(true);
            try {
              // 4. Verify cryptographic signature on backend
              const verifyRes = await api.post('/payments/verify', {
                order_id: orderData.order_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              // 5. Clear cart on frontend and redirect to success confirmation
              await clearCart();
              toast.success(t('checkout.payment_success_toast'));

              navigate(`/orders/${orderData.order_id}/success`, {
                state: {
                  order: verifyRes.data?.order || {
                    id: orderData.order_id,
                    total_amount: orderData.amount / 100,
                    payment_status: 'paid',
                    shipping_city: address.city,
                    shipping_pincode: address.pincode,
                  },
                },
              });
            } catch (vErr) {
              const vDetail =
                vErr.response?.data?.detail || t('checkout.payment_failed_toast');
              toast.error(vDetail);
            } finally {
              setIsVerifying(false);
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: orderData.prefill?.name || address.fullName,
            contact: orderData.prefill?.contact || address.phoneNumber,
            email: orderData.prefill?.email || profile?.email || '',
          },
          notes: {
            address: `${address.houseStreet}, ${address.city}`,
            app: 'AgriMart',
          },
          theme: {
            color: '#16a34a', // AgriMart green
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
              toast(t('checkout.payment_dismissed_toast'), { icon: 'ℹ️' });
            },
          },
        };

        if (typeof window.Razorpay === 'undefined') {
          toast.error('Razorpay SDK is not ready yet. Please try again.');
          setIsSubmitting(false);
          return;
        }

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setIsSubmitting(false);
          toast.error(resp.error?.description || t('checkout.payment_failed_toast'));
        });
        rzp.open();
      } catch (err) {
        const detail =
          err.response?.data?.detail ||
          'Failed to initialize Razorpay checkout. Please try again.';
        toast.error(detail);
        setIsSubmitting(false);
      }
    } else {
      // Flow 2: Cash on Delivery / Pay on Delivery fallback
      setIsSubmitting(true);
      try {
        const res = await api.post('/orders/create', orderPayload);
        const newOrder = res.data;
        await clearCart();
        toast.success(t('orders.success_title'));
        navigate(`/orders/${newOrder.id}/success`, { state: { order: newOrder } });
      } catch (err) {
        const detail =
          err.response?.data?.detail || 'Failed to place order. Please try again.';
        toast.error(detail);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const breadcrumbs = [
    { label: t('footer.marketplace_catalog'), href: '/products' },
    { label: t('cart.cart_title'), href: '/cart' },
    { label: t('checkout.checkout_title') },
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
              {t('checkout.step_1')}
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
              {t('checkout.step_2')}
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
              {t('checkout.step_3')}
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
                  <span>{t('checkout.enter_location')}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('checkout.full_name')}</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('checkout.phone_number')}</label>
                  <input
                    type="tel"
                    required
                    value={address.phoneNumber}
                    onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('checkout.pincode')}</label>
                  <input
                    type="text"
                    required
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('checkout.city_district')}</label>
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
                    {t('checkout.house_building')}
                  </label>
                  <input
                    type="text"
                    required
                    value={address.houseStreet}
                    onChange={(e) => setAddress({ ...address, houseStreet: e.target.value })}
                    placeholder={t('checkout.house_placeholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    {t('checkout.village_town')}
                  </label>
                  <input
                    type="text"
                    required
                    value={address.villageTown}
                    onChange={(e) => setAddress({ ...address, villageTown: e.target.value })}
                    placeholder={t('checkout.village_placeholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('checkout.state')}</label>
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
                  <label className="block font-bold text-gray-700 mb-1">{t('checkout.address_type')}</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'farm', label: t('checkout.farm_type'), icon: <Tractor className="w-3.5 h-3.5" /> },
                      { id: 'home', label: t('checkout.home_type'), icon: <Home className="w-3.5 h-3.5" /> },
                      { id: 'office', label: t('checkout.office_type'), icon: <Building className="w-3.5 h-3.5" /> },
                    ].map((tt) => (
                      <button
                        key={tt.id}
                        type="button"
                        onClick={() => setAddress({ ...address, type: tt.id })}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                          address.type === tt.id
                            ? 'bg-agri-primary text-white border-agri-primary'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {tt.icon}
                        <span>{tt.label}</span>
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
                  {t('checkout.continue_summary_btn')}
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
                  <span>{t('checkout.review_items_title')}</span>
                </h3>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-agri-primary font-semibold hover:underline"
                >
                  {t('checkout.change_address')}
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
                  {t('common.back')}
                </Button>
                <Button variant="accent" size="md" onClick={() => setCurrentStep(3)}>
                  {t('checkout.continue_payment_btn')}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Options (Razorpay Test Mode & COD) */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg border border-agri-border p-5 space-y-4 shadow-xs text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-agri-primary" />
                  <span>{t('checkout.payment_title')}</span>
                </h3>
              </div>

              {/* Notice Sandbox Banner */}
              <div className="p-3.5 bg-green-50 rounded-lg border border-green-300 text-green-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs">{t('checkout.test_mode_alert_title')}</h4>
                    <span className="text-[10px] bg-green-700 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {t('checkout.razorpay_badge_test')}
                    </span>
                  </div>
                  <p className="text-[11px] text-green-800 mt-1">
                    {t('checkout.test_mode_alert_desc')}
                  </p>
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-3">
                {/* Method 1: Razorpay Payment (Recommended) */}
                <label
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition cursor-pointer ${
                    paymentMethod === 'razorpay'
                      ? 'border-agri-primary bg-green-50/60 ring-2 ring-agri-primary/20 shadow-xs'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_selection"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="w-4 h-4 text-agri-primary accent-agri-primary mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900 text-sm">
                          {t('checkout.razorpay_title')}
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded uppercase">
                          {t('checkout.razorpay_badge_test')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-[11px] font-bold text-amber-700">Instant</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1">
                      {t('checkout.razorpay_desc')}
                    </p>

                    {/* Test helper card snippet */}
                    {paymentMethod === 'razorpay' && (
                      <div className="mt-2.5 p-2 bg-white rounded border border-green-200 text-[10px] text-gray-600 font-mono">
                        <span className="font-bold text-green-800 block mb-0.5">💳 Razorpay Test Credentials:</span>
                        <span>Card: <strong>4111 1111 1111 1111</strong> • Expiry: <strong>12/28</strong> • CVV: <strong>123</strong> • OTP: <strong>Any</strong></span>
                      </div>
                    )}
                  </div>
                </label>

                {/* Method 2: COD / Pay on Delivery Fallback */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-agri-primary bg-green-50/60 ring-2 ring-agri-primary/20 shadow-xs'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_selection"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 text-agri-primary accent-agri-primary mt-1"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 block text-xs">
                      {t('checkout.cod_title')}
                    </span>
                    <span className="text-[11px] text-gray-500 mt-0.5 block">
                      {t('checkout.cod_desc')}
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                <Button
                  variant="secondary"
                  size="md"
                  disabled={isSubmitting || isVerifying}
                  onClick={() => setCurrentStep(2)}
                >
                  {t('common.back')}
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting || isVerifying}
                  onClick={handlePayment}
                  leftIcon={
                    isVerifying ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )
                  }
                >
                  {isVerifying
                    ? t('checkout.verifying_payment')
                    : paymentMethod === 'razorpay'
                    ? t('checkout.pay_razorpay_btn', { amount: formatPrice(totalAmount) })
                    : t('checkout.place_pending_order_btn')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-agri-border p-5 space-y-3 text-xs shadow-xs sticky top-24">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider pb-2 border-b border-gray-100">
            {t('checkout.order_total')}
          </h3>

          <div className="space-y-2 py-2 text-gray-600 border-b border-gray-100">
            <div className="flex justify-between">
              <span>{t('cart.items_total', { count: items.length })}</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('cart.delivery_charges')}</span>
              <span className="text-agri-primary font-bold">{t('cart.free')}</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="text-sm font-bold text-gray-900">{t('checkout.amount_payable')}</span>
            <span className="text-xl font-black text-gray-900">{formatPrice(totalAmount)}</span>
          </div>

          <div className="p-3 bg-green-50 rounded text-[11px] text-green-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-agri-primary flex-shrink-0" />
            <span>{t('common.free_delivery_by', { date: deliveryDate })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
