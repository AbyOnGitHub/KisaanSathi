from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from ml_service import predict_image

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

app = FastAPI(title="KisaanSathi Crop Disease API")

# Configure CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    token = credentials.credentials
    try:
        res = supabase.auth.get_user(token)
        if res.user:
            return res.user
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )

@app.get("/")
def read_root():
    return {"message": "Welcome to KisaanSathi Crop Disease API"}

@app.post("/api/predict-disease")
async def predict_disease_route(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image")
    
    # Read image bytes
    image_bytes = await file.read()
    
    try:
        # Run TFLite inference
        predicted_class_name, confidence = predict_image(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

    # Fetch treatment description from Supabase
    if supabase:
        try:
            response = supabase.table("disease_descriptions").select("*").eq("disease_name", predicted_class_name).single().execute()
            treatment_data = response.data
        except Exception as e:
            print(f"Database lookup failed: {e}")
            treatment_data = {"error": "Treatment data not found in database for this disease."}
    else:
        treatment_data = {"error": "Supabase not connected"}

    return {
        "disease": predicted_class_name,
        "confidence": float(confidence),
        "treatment_data": treatment_data
    }
