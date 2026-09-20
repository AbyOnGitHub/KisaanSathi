# AgriMart Marketplace Frontend (React + Vite + Tailwind CSS)

AgriMart is an e-commerce marketplace frontend designed for Indian agriculture, connecting farmers directly with verified sellers. Inspired by **Amazon India** and **Flipkart**, it features dense product grids, a 3-row sticky header, live APMC Mandi price comparison widgets, an interactive multi-round price bargaining system, a 3-step checkout process, and a full Seller Central dashboard.

---

## 🎨 Design System

- **Primary Brand**: `#16a34a` (Green) & `#15803d` (Hover)
- **Accent Deals & CTAs**: `#f59e0b` (Amber)
- **Discount Hot Badges**: `#dc2626` (Red)
- **Background**: `#f3f4f6` (Light grey marketplace surface)
- **Card Background**: `#ffffff`
- **Currency & Formatting**: Indian Rupee (`₹1,00,000`) formatting throughout

---

## 📁 Project Structure

```
frontend/frontend-marketplace/
├── src/
│   ├── assets/                      # SVG logo and assets
│   ├── components/
│   │   ├── layout/                  # 3-row Header, Footer, MobileNav, Breadcrumbs
│   │   ├── common/                  # Button, Badge, Loader, Modal, EmptyState, StarRating
│   │   ├── product/                 # ProductCard, Grid, Filters, SortBar, Gallery, PriceDisplay, MarketPriceBadge
│   │   ├── bargain/                 # BargainModal, BargainCard, ChatBubble, StatusBadge
│   │   ├── cart/                    # CartItem, CartSummary, EmptyCart
│   │   ├── seller/                  # SellerCard, ProductFormModal, SellerOrderRow, SellerBargainCard, DashboardStats
│   │   └── home/                    # HeroCarousel, CategoryTiles, DealsOfTheDay, TopSellers, TrustBadges
│   ├── context/
│   │   ├── AuthContext.jsx          # Supabase auth & Role switcher
│   │   └── CartContext.jsx          # Shopping cart state & API sync
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useProducts.js           # Catalog fetching & client filtering
│   │   └── useBargainSessions.js    # Negotiation session actions
│   ├── pages/
│   │   ├── Home.jsx                 # Commercial homepage
│   │   ├── ProductCatalog.jsx       # Flipkart-style filterable catalog
│   │   ├── ProductDetail.jsx        # 3-column Amazon product details
│   │   ├── Cart.jsx                 # 2-column cart with bargained savings
│   │   ├── Checkout.jsx             # 3-step checkout (Address -> Summary -> Payment)
│   │   ├── OrderSuccess.jsx         # Animated order placed confirmation
│   │   ├── OrderHistory.jsx         # Amazon order tracking timeline
│   │   ├── BargainList.jsx          # Negotiation sessions hub
│   │   ├── BargainDetail.jsx        # Real-time negotiation chat
│   │   └── seller/
│   │       ├── SellerDashboard.jsx  # Seller central overview & metrics
│   │       ├── SellerProducts.jsx   # Inventory management table
│   │       ├── SellerOrders.jsx     # Received orders table
│   │       └── SellerBargains.jsx   # Pending buyer negotiation requests
│   ├── utils/
│   │   ├── api.js                   # Axios client with JWT interceptor & toast handlers
│   │   ├── supabaseClient.js        # Supabase JS client
│   │   └── formatters.js            # Indian Rupee format (₹), date, and relative time
│   ├── App.jsx                      # Main router & context wrapper
│   ├── main.jsx                     # Application entry point
│   └── index.css                    # Tailwind setup & Swiper imports
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── index.html
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Run Instructions

### 1. Navigate to the frontend directory
```bash
cd frontend/frontend-marketplace
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase credentials and backend API URL:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:8000/api
```

### 4. Start the development server
```bash
npm run dev
```
The application will be live at: **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Key Features

1. **Role Switching in Header**: A quick mode toggle in the top utility bar lets you test both **Farmer** and **Seller** perspectives seamlessly.
2. **Interactive Price Bargaining**: Test direct negotiations on products with the `💬 Bargain` badge, complete with turn validation, discount suggestions, and WhatsApp-style offer chat.
3. **Mandi Price Intelligence**: Live government benchmark integration comparing product prices with mandi rates.
4. **Seller Central**: Full product management with add/edit modals, order status fulfillment progression, and incoming negotiation response cards.
