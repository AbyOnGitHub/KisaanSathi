import os
import sys
from pathlib import Path

# Ensure the api directory is in sys.path so 'app' package is found directly inside the Lambda bundle
api_dir = Path(__file__).resolve().parent
if str(api_dir) not in sys.path:
    sys.path.insert(0, str(api_dir))

root_dir = api_dir.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

# Expose the native FastAPI instance directly for Vercel Serverless ASGI detection
from app.main import app
