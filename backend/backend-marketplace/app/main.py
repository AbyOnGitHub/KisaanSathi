"""
AgriMart Marketplace API - Main Application Entrypoint.
FastAPI application with CORS middleware, router registrations, and global error handlers.
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.routes import (
    categories,
    products,
    cart,
    orders,
    bargain,
    market_prices,
    sellers,
)

# Initialize FastAPI application
app = FastAPI(
    title="AgriMart Marketplace API",
    description="Agricultural E-commerce Marketplace backend allowing farmers to browse, bargain, and purchase supplies directly from verified sellers.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure Cross-Origin Resource Sharing (CORS)
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

# Clean list and remove duplicates
origins = list(set([o.strip() for o in origins if o and o.strip()]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers ensuring consistent JSON responses: {"detail": "..."}
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handles standard HTTP exceptions and formats uniform response."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handles Pydantic request validation errors."""
    error_messages = []
    for error in exc.errors():
        field = " -> ".join([str(loc) for loc in error["loc"]])
        msg = error.get("msg", "Invalid value")
        error_messages.append(f"{field}: {msg}")
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "; ".join(error_messages)},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Catches unhandled server exceptions."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"An unexpected server error occurred: {str(exc)}"},
    )


# Register Feature Routers
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(bargain.router)
app.include_router(market_prices.router)
app.include_router(sellers.router)


# Root and Health Check Endpoints
@app.get(
    "/",
    tags=["Health"],
    summary="Root health status",
)
async def root():
    """Returns application status and welcome message."""
    return {
        "status": "online",
        "app": "AgriMart Marketplace API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get(
    "/health",
    tags=["Health"],
    summary="Health check endpoint",
)
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "service": "marketplace-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
