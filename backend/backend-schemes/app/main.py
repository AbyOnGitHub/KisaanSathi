from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.auth import get_current_user
from app.api.recommendations import router as recommendations_router

app = FastAPI(
    title="KisanSathi Scheme Recommendation API",
    description="Backend API for KisanSathi Government Scheme Recommendations",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to KisanSathi Scheme Recommendation API", "status": "running"}

@app.get("/api/protected")
def protected_route(current_user=Depends(get_current_user)):
    return {"message": "You have accessed a protected route", "user_id": current_user.id}

app.include_router(recommendations_router)
