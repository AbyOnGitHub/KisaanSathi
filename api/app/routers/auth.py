from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.database import get_supabase

router = APIRouter()

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup", status_code=201)
async def signup(user: SignupRequest):
    supabase = get_supabase()
    try:
        res = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "full_name": user.name
                }
            }
        })
        return {"user": res.user, "session": res.session}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(user: LoginRequest):
    supabase = get_supabase()
    try:
        res = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {"user": res.user, "session": res.session, "token": res.session.access_token if res.session else None}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")
