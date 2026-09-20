# KisaanSathi - AgriMart Marketplace

AgriMart is an agricultural e-commerce marketplace empowering Indian farmers to purchase certified high-yield seeds, fertilizers, pesticides, and farm equipment directly from licensed APMC & CIB registered dealers with direct price bargaining and seamless online payments.

---

## Razorpay Payment Integration (Test Mode)

The AgriMart checkout system integrates Razorpay Test Mode payments in a simulated sandbox.

### Environment Configuration

#### 1. Backend (`backend/backend-marketplace/.env`)
```env
PAYMENT_MODE=testing
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

#### 2. Frontend (`frontend/frontend-marketplace/.env`)
```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### Razorpay Test Credentials (Fake Money Sandbox)
- **Test Card Number**: `4111 1111 1111 1111`
- **Expiry Date**: Any future month & year (e.g., `12/28`)
- **CVV**: Any 3-digit number (e.g., `123`)
- **OTP**: Any numeric OTP (e.g., `123456`) or click **Success** in Razorpay test modal
- **UPI**: Test VPA handles simulated approval via Razorpay test interface

### Checkout & Payment Architecture
1. **Cart to Order (`POST /api/payments/create-order`)**:
   - Calculates total amount using negotiated bargained prices or standard discounts.
   - Inserts order into database with `status='pending'` and `payment_status='pending'`.
   - Generates Razorpay Order ID and returns amount in Indian paise (`1 INR = 100 paise`).
   - Cart items are preserved in the database until payment verification succeeds.
2. **Cryptographic Verification (`POST /api/payments/verify`)**:
   - Validates the HMAC-SHA256 signature using the official Razorpay SDK utility.
   - On valid signature: marks order `payment_status='paid'`, `status='confirmed'`, records payment ID and signature, clears active cart items, and decrements product inventory stock.
   - On invalid signature: marks order `payment_status='failed'` and returns HTTP 400 Bad Request.
3. **Order Status Polling (`GET /api/payments/{order_id}/status`)**:
   - Returns real-time order status and payment status (`paid`, `pending`, `failed`).
