from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health")
def health_check():
    """Simple health check endpoint to verify backend availability."""
    return {"status": "ok"}
