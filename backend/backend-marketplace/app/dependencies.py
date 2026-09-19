"""
Authentication and authorization dependencies for AgriMart Marketplace API.
Verifies Supabase JWT tokens and fetches user profiles with role-based checks.
"""

from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database import get_supabase

# HTTP Bearer scheme for parsing 'Authorization: Bearer <token>'
security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Dict[str, Any]:
    """
    Extracts and validates Supabase JWT token from Authorization header.
    Fetches and returns the user's profile from the 'profiles' database table.
    Raises 401 Unauthorized if the token is missing or invalid.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing or invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    supabase = get_supabase()

    try:
        # Verify token with Supabase Auth service
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication session",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_id = user_response.user.id
        
        # Fetch user's profile from profiles table
        profile_res = supabase.table("profiles").select("*").eq("id", user_id).execute()
        
        if not profile_res.data or len(profile_res.data) == 0:
            # Fallback if profile row is not yet created
            raw_meta = user_response.user.user_metadata or {}
            profile = {
                "id": user_id,
                "role": raw_meta.get("role", "farmer"),
                "full_name": raw_meta.get("full_name") or raw_meta.get("name", "User"),
                "phone_number": raw_meta.get("phone_number"),
                "is_verified": False,
                "business_name": raw_meta.get("business_name"),
                "gstin_or_license": raw_meta.get("gstin_or_license"),
                "avatar_url": raw_meta.get("avatar_url"),
                "email": user_response.user.email
            }
            return profile

        profile = profile_res.data[0]
        profile["email"] = user_response.user.email
        return profile

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[Dict[str, Any]]:
    """
    Optional user dependency. Returns user profile if valid token provided, else None.
    Useful for public endpoints that can optionally provide tailored data.
    """
    if not credentials or not credentials.credentials:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None


async def require_seller(
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Ensures the authenticated user has the 'seller' role.
    Raises 403 Forbidden if user is not a seller.
    """
    role = current_user.get("role")
    if role != "seller" and role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Seller permissions required",
        )
    return current_user


async def require_farmer(
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Ensures the authenticated user has the 'farmer' role.
    Raises 403 Forbidden if user is not a farmer.
    """
    role = current_user.get("role")
    if role != "farmer" and role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Farmer permissions required",
        )
    return current_user
