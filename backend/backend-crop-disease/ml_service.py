import io
import json
import numpy as np
from PIL import Image
import tensorflow as tf
import os

# Define paths relative to the project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "crop_disease_model.tflite")
LABELS_PATH = os.path.join(BASE_DIR, "models", "class-names.json")

# Load interpreter
interpreter = None
class_names = []

try:
    interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    
    with open(LABELS_PATH, "r") as f:
        class_names = json.load(f)
    print("TFLite Model and classes loaded successfully.")
except Exception as e:
    print(f"Warning: Failed to load TFLite model or class names. Ensure they exist in the models/ directory. Error: {e}")

# pyrefly: ignore [missing-import]
from tensorflow.keras.applications.resnet50 import preprocess_input

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    # ResNet50 typically expects 224x224 RGB image
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image, dtype=np.float32)
    
    # Expand dims to match batch size: (1, 224, 224, 3)
    image_array = np.expand_dims(image_array, axis=0)
    
    # Since your model architecture includes `tf.keras.applications.resnet50.preprocess_input`
    # INSIDE the model graph itself, we must NOT apply it externally! 
    # Feeding raw [0.0, 255.0] RGB values here directly.
    return image_array

def predict_image(image_bytes: bytes):
    if interpreter is None:
        raise RuntimeError("Model is not loaded.")
        
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    # Preprocess
    input_data = preprocess_image(image_bytes)
    
    # Run inference
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])[0]
    
    # Get highest confidence prediction
    predicted_class_idx = np.argmax(output_data)
    confidence = output_data[predicted_class_idx]
    
    predicted_class_name = class_names[predicted_class_idx]
    
    return predicted_class_name, confidence
