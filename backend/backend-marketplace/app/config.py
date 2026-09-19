"""
Configuration settings for AgriMart Marketplace API.
Uses pydantic-settings to load environment variables from .env file or system environment.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Supabase credentials
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # Application settings
    PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"

    # External APIs
    DATA_GOV_API_KEY: str = ""

    # Payment integration
    PAYMENT_MODE: str = "testing"

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
