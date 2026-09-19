"""
Database module for initializing and exposing the Supabase client.
Uses SUPABASE_SERVICE_ROLE_KEY to perform backend operations that bypass RLS.
"""

from supabase import create_client, Client
from app.config import settings

# Global Supabase client instance initialized with Service Role Key
supabase: Client = None

if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
    try:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Supabase client: {e}")
else:
    # If keys are not set yet (e.g. initial setup), we create a dummy/lazy initialized client or warn
    print("Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.")


def get_supabase() -> Client:
    """
    Returns the initialized Supabase client instance.
    If not initialized, attempts to re-initialize from current settings.
    """
    global supabase
    if supabase is None:
        if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
            supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        else:
            raise RuntimeError(
                "Supabase client is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
            )
    return supabase
