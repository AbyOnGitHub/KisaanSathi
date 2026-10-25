from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.database import get_supabase
from app.services.ml_service import predict_image

router = APIRouter(prefix="/api/crop-disease", tags=["Crop Disease"])

@router.post("/predict")
def predict_disease_route(file: UploadFile = File(...)):
    """
    Endpoint to process an uploaded leaf image and return the predicted disease 
    and matching treatment details from Supabase.
    """

    image_bytes = file.file.read()
    
    try:
        # Run TFLite inference (runs in FastAPI threadpool implicitly)
        predicted_class_name, confidence = predict_image(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

    supabase = get_supabase()
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
