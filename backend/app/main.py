from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.auth import get_current_user

app = FastAPI(
    title="KisanSathi API",
    description="Backend API for KisanSathi MVP",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to KisanSathi API"}


@app.get("/api/protected")
def protected_route(current_user=Depends(get_current_user)):
    return {"message": "You have accessed a protected route", "user_id": current_user.id}


from app.api.recommendations import router as recommendations_router
app.include_router(recommendations_router)
