import os
from pathlib import Path
from pydantic_settings import BaseSettings

# Resolve base directories
APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent
DEFAULT_MODEL_PATH = PROJECT_ROOT / "models" / "crop_yield_model.pkl"

class Settings(BaseSettings):
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    MODEL_PATH: str = str(DEFAULT_MODEL_PATH)

    class Config:
        env_file = str(BACKEND_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
