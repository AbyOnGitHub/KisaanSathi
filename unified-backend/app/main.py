import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

# Import services that need startup/shutdown lifecycle
from app.services.crop_yield_predictor import predictor_service

from app.routers import auth, products, categories, orders, cart, bargain, payments, sellers, schemes, crop_yield, ml_disease, health

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("kisaansathi")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events for the FastAPI application."""
    logger.info("Starting up KisaanSathi Unified API...")
    try:
        predictor_service.load_model()
        logger.info("Crop Yield model loaded.")
    except Exception as e:
        logger.warning(f"Failed to load crop yield model: {e}")
    
    yield
    logger.info("Shutting down KisaanSathi Unified API...")

app = FastAPI(title="KisaanSathi Unified API", version="1.0.0", lifespan=lifespan)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Validation Exception Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join([str(loc) for loc in err["loc"] if loc != "body"])
        msg = err["msg"]
        errors.append(f"{field}: {msg}" if field else msg)

    friendly_msg = "Validation Error: " + "; ".join(errors)
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": friendly_msg,
            "details": exc.errors()
        }
    )

# Include Routers
app.include_router(auth.router)
# Assuming marketplace routers were named properly, we will fix them next
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(bargain.router)
app.include_router(payments.router)
app.include_router(sellers.router)

# ML Routes
app.include_router(crop_yield.router)
app.include_router(ml_disease.router)

# Schemes Routes
app.include_router(schemes.router)

# Health Check Route
app.include_router(health.router)

@app.get("/")
@app.get("/api")
def read_root():
    return {"message": "Welcome to KisaanSathi Unified API", "docs": "/docs"}
