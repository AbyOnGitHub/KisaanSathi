"""
Configuration settings for AgriMart Marketplace API.
Uses pydantic-settings to load environment variables from .env file or system environment.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Supabase credentials
    SUPABASE_URL: str = "https://pxzikfwejlncbwcrsujv.supabase.co"
    SUPABASE_ANON_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emlrZndlamxuY2J3Y3JzdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NDc1NzQsImV4cCI6MjEwNTMyMzU3NH0.ltZjZ5KjEVS02VVP_KxENB0QB4XymnC5WGcU8XteJYs"
    SUPABASE_SERVICE_ROLE_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emlrZndlamxuY2J3Y3JzdWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTc0NzU3NCwiZXhwIjoyMTA1MzIzNTc0fQ.Ig9Gzof3ol10hl5qjyjLdwCpGtOiSQf_Fs_2tgk_XHI"

    # Application settings
    PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"

    # External APIs
    DATA_GOV_API_KEY: str = ""

    # Payment integration (Razorpay Test Mode)
    PAYMENT_MODE: str = "testing"
    RAZORPAY_KEY_ID: str = "rzp_test_placeholder"
    RAZORPAY_KEY_SECRET: str = "placeholder_secret"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    """Returns cached instance of the application settings."""
    return Settings()


settings = get_settings()
