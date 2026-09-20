import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import health, crop_yield
from app.services.crop_yield_predictor import predictor_service
from app.api.recommendations import router as recommendations_router
from app.auth import get_current_user

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("kisaansathi")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML models on startup."""
    logger.info("Initializing KisaanSathi backend services...")
    try:
        predictor_service.load_model()
        logger.info("Crop Yield prediction model loaded successfully at startup.")
    except Exception as e:
        logger.warning(f"Warning: Could not pre-load crop yield model at startup: {e}")
    yield
    logger.info("KisaanSathi backend services shutting down.")

app = FastAPI(
    title="KisaanSathi API",
    description="Backend API for KisaanSathi with Crop Yield Prediction & Scheme Recommendation engines.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
allowed_origins = [
    settings.FRONTEND_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(allowed_origins)),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom validation error handler for farmer-friendly messages
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join([str(loc) for loc in err["loc"] if loc != "body"])
        msg = err["msg"]
        errors.append(f"{field}: {msg}" if field else msg)

    friendly_msg = "Please check the entered values: " + "; ".join(errors)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": friendly_msg,
            "details": exc.errors()
        }
    )

# Include routers
app.include_router(health.router)
app.include_router(crop_yield.router)
app.include_router(recommendations_router)

@app.get("/", tags=["Root"])
def root():
    return {
        "app": "KisaanSathi Combined Backend API",
        "modules": ["Crop Yield Prediction", "Government Scheme Recommendation"],
        "status": "running",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.get("/api/protected", tags=["Auth"])
def protected_route(current_user=Depends(get_current_user)):
    return {"message": "You have accessed a protected route", "user_id": current_user.id}
