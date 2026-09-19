import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from supabase import create_client, Client
from dotenv import load_dotenv

from app.routers import health, crop_yield
from app.services.crop_yield_predictor import predictor_service

# Load environment variables
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("kisaansathi")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model once on startup."""
    logger.info("Initializing KisaanSathi backend service...")
    try:
        predictor_service.load_model()
        logger.info("Crop Yield prediction model loaded successfully at startup.")
    except Exception as e:
        logger.warning(f"Warning: Could not pre-load model at startup: {e}")
    yield
    logger.info("KisaanSathi backend service shutting down.")

app = FastAPI(title="KisaanSathi API", lifespan=lifespan)

# Configure CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# Security Scheme
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Dependency to verify the JWT token with Supabase and return the user.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    token = credentials.credentials
    try:
        res = supabase.auth.get_user(token)
        if res.user:
            return res.user
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )

# Register routers
app.include_router(health.router)
app.include_router(crop_yield.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to KisaanSathi API",
        "services": ["Authentication", "Crop Yield Prediction", "Health Check"],
        "docs": "/docs"
    }

@app.get("/api/protected")
def protected_route(current_user = Depends(get_current_user)):
    return {"message": "You have accessed a protected route", "user_id": current_user.id}
