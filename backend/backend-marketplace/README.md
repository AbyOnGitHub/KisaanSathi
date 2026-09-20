# AgriMart Marketplace Backend (FastAPI)

AgriMart is an agricultural e-commerce marketplace API built with **FastAPI** and **Supabase (PostgreSQL)**. It connects farmers directly with verified sellers to purchase agricultural supplies such as seeds, fertilizers, pesticides, tools, and farming equipment, featuring interactive price bargaining and live government Mandi market price comparison.

---

## Features

- **Product Catalog & Discovery**: Filter by category slug, search by product title, price range filters, sorting (price, rating, date), and pagination.
- **Shopping Cart**: Real-time user cart with stock checks, automatic quantity adjustments, and bargained price lock-in.
- **Direct Orders Flow**: Instant conversion from cart to line-item orders with address details and fulfillment status tracking (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`).
- **Interactive Price Bargaining**: Turn-based negotiation engine allowing farmers to submit offers (50%-99% of original price), counter-offers (up to 10 rounds), deal settlement, and rejection.
- **Live Mandi Market Rates (data.gov.in)**: Seamless integration with government market data, 24-hour intelligent database caching, and automatic price fairness verdict evaluation.
- **Verified Seller Profiles**: Public seller store profiles and catalog listings.
- **Role-Based Access Control**: Strict `farmer` and `seller` role protections powered by Supabase JWTs.

---

## Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
- **Settings & Validation**: [Pydantic v2](https://docs.pydantic.dev/) & [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- **HTTP Client**: [HTTPX](https://www.python-httpx.org/) (for asynchronous external Mandi API calls)
- **Server**: [Uvicorn](https://www.uvicorn.org/)

---

## Project Structure

```
backend/backend-marketplace/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app entry, CORS & exception handling
│   ├── config.py                  # Pydantic Settings (.env loader)
│   ├── database.py                # Supabase client initialization (Service Role Key)
│   ├── dependencies.py            # Auth JWT verification & role checkers
│   │
│   ├── models/                    # Pydantic request & response schemas
│   │   ├── __init__.py
│   │   ├── category.py            # Category models
│   │   ├── product.py             # Product models & pagination
│   │   ├── cart.py                # Cart & CartItem models
│   │   ├── order.py               # Order & OrderItem models
│   │   ├── bargain.py             # Bargain session & offer models
│   │   └── market_price.py        # Market price & comparison models
│   │
│   ├── routes/                    # API route endpoints
│   │   ├── __init__.py
│   │   ├── categories.py          # /api/categories
│   │   ├── products.py            # /api/products
│   │   ├── cart.py                # /api/cart
│   │   ├── orders.py              # /api/orders
│   │   ├── bargain.py             # /api/bargain
│   │   ├── market_prices.py       # /api/market-prices
│   │   └── sellers.py             # /api/sellers
│   │
│   └── services/                  # Business logic & external API clients
│       ├── __init__.py
│       ├── supabase_service.py    # Supabase table queries & joins
│       └── market_price_service.py# data.gov.in integration & caching
│
├── .env.example                   # Template for environment variables
├── .gitignore                     # Git ignore rules
├── requirements.txt               # Project dependencies
└── README.md                      # Documentation & instructions
```

---

## Setup & Installation

### 1. Create and Activate a Virtual Environment

From the `backend/` directory:

```bash
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r backend-marketplace/requirements.txt
```

### 3. Configure Environment Variables

Navigate to `backend/backend-marketplace/` and create your `.env` file from the `.env.example` template:

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase project credentials and optional Data.gov API key:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
PORT=8000
FRONTEND_URL=http://localhost:5173
DATA_GOV_API_KEY=your-data-gov-in-api-key
PAYMENT_MODE=testing
```

---

## Running the Server

Start the development server with live reload:

```bash
cd backend/backend-marketplace
uvicorn app.main:app --reload --port 8000
```

- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## Authentication Notes

Authentication is managed through Supabase Auth (handled by the teammate's separate login system). 

When making requests to protected endpoints:
1. Include the JWT access token in the `Authorization` header:
   ```http
   Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
   ```
2. The `get_current_user` dependency automatically verifies the token against Supabase Auth and fetches the user profile from the `profiles` table.
3. Endpoints use `require_farmer` or `require_seller` to ensure role authorization.

---

## API Endpoints Reference

### 1. Categories (`/api/categories`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/categories/` | Public | List all categories |

### 2. Products (`/api/products`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products/` | Public | List products with search, filters (`category`, `search`, `min_price`, `max_price`, `sort_by`), and pagination |
| `GET` | `/api/products/{product_id}` | Public | Get single product details |
| `POST` | `/api/products/` | Seller | Create a new product listing |
| `PUT` | `/api/products/{product_id}` | Seller (Owner) | Update an existing product |
| `DELETE` | `/api/products/{product_id}` | Seller (Owner) | Soft delete (deactivate) a product |
| `GET` | `/api/products/seller/{seller_id}` | Public | List all products by a specific seller |

### 3. Cart (`/api/cart`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/cart/` | User | Get current user's shopping cart |
| `POST` | `/api/cart/add` | User | Add an item to cart (upsert quantity) |
| `PUT` | `/api/cart/update` | User | Update quantity of a cart item |
| `DELETE` | `/api/cart/remove/{product_id}` | User | Remove item from cart |
| `DELETE` | `/api/cart/clear` | User | Clear entire cart |

### 4. Orders (`/api/orders`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/orders/create` | User | Create order from cart items |
| `GET` | `/api/orders/` | User | View current user's order history |
| `GET` | `/api/orders/{order_id}` | User / Seller | View details of a specific order |
| `GET` | `/api/orders/seller/received` | Seller | View all orders containing seller's products |
| `PUT` | `/api/orders/{order_id}/status` | Seller | Update order status (`confirmed`, `shipped`, `delivered`, `cancelled`) |

### 5. Bargaining (`/api/bargain`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/bargain/start` | Farmer | Start bargain session (50%-99% of price) |
| `GET` | `/api/bargain/sessions` | User | Get all bargain sessions (as farmer or seller) |
| `GET` | `/api/bargain/session/{id}` | User | Get single bargain session with offer history |
| `POST` | `/api/bargain/offer` | Farmer / Seller | Submit counter-offer (alternate turns, max 10 offers) |
| `POST` | `/api/bargain/accept/{session_id}` | Farmer / Seller | Accept latest offer and lock settled price |
| `POST` | `/api/bargain/reject/{session_id}` | Farmer / Seller | Reject and close negotiation |
| `GET` | `/api/bargain/seller/pending` | Seller | Get seller's pending bargains awaiting response |

### 6. Market Prices (`/api/market-prices`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/market-prices/{commodity}` | Public | Get latest market price (auto-caches, refreshes via data.gov.in) |
| `GET` | `/api/market-prices/compare/{product_id}` | Public | Compare product price against Mandi rates (`fair`/`high`/`low`) |
| `POST` | `/api/market-prices/sync` | Admin / Dev | Trigger manual commodity price sync |

### 7. Sellers (`/api/sellers`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/sellers/` | Public | List all verified sellers |
| `GET` | `/api/sellers/{seller_id}` | Public | Get seller profile with active products |

---

## Response Formats

- **Paginated Lists**:
  ```json
  {
    "data": [...],
    "page": 1,
    "limit": 20,
    "total": 45
  }
  ```

- **Error Responses**:
  ```json
  {
    "detail": "Error message explanation"
  }
  ```
