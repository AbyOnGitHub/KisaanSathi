from fastapi import APIRouter

router = APIRouter(tags=["Health"])

@router.get("/api/health")
@router.get("/health")
def health_check():
    """Simple health check endpoint to verify backend availability."""
    return {"status": "ok"}
