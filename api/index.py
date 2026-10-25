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

# Import the core FastAPI instance
from app.main import app as fastapi_app

# ASGI entrypoint with universal path normalization for Vercel Serverless
async def app(scope, receive, send):
    if scope["type"] == "http":
        path = scope.get("path", "")
        # Normalize /api/index.py or /index.py prefixes from Vercel edge rewrites
        if path.startswith("/api/index.py"):
            sub = path[len("/api/index.py"):]
            scope["path"] = "/api" + sub if not sub.startswith("/api") else sub
        elif path.startswith("/index.py"):
            sub = path[len("/index.py"):]
            scope["path"] = "/api" + sub if not sub.startswith("/api") else sub
        elif not path.startswith("/api") and path not in ("/", "/docs", "/openapi.json", "/redoc"):
            # If Vercel stripped /api/, prepend /api so it matches FastAPI routers
            scope["path"] = "/api" + path

    await fastapi_app(scope, receive, send)
