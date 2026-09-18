from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Use Service Role Key for backend admin tasks if needed, or Anon Key

app = FastAPI(title="KisaanSathi API")

# Configure CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        # Verify token using Supabase Auth
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

@app.get("/")
def read_root():
    return {"message": "Welcome to KisaanSathi API"}

@app.get("/api/protected")
def protected_route(current_user = Depends(get_current_user)):
    return {"message": "You have accessed a protected route", "user_id": current_user.id}
