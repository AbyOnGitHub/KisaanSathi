import io
import json
import logging
from pathlib import Path
from typing import Tuple, List
import numpy as np
from PIL import Image

logger = logging.getLogger("kisaansathi.ml")

interpreter = None
input_details = None
output_details = None
class_names: List[str] = [
    "Corn___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn___Common_rust",
    "Corn___Northern_Leaf_Blight",
    "Corn___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___healthy"
]


def load_disease_model():
    """Loads the TFLite ResNet50 model weights and allocates tensors once in memory."""
    global interpreter, input_details, output_details, class_names

    if interpreter is not None:
        return interpreter

    candidate_model_paths = [
        Path(__file__).resolve().parent.parent.parent / "models" / "crop-diseasemodel" / "crop_disease_model.tflite",
        Path(__file__).resolve().parent.parent.parent.parent / "models" / "crop-diseasemodel" / "crop_disease_model.tflite",
        Path("api/models/crop-diseasemodel/crop_disease_model.tflite"),
        Path("unified-backend/models/crop-diseasemodel/crop_disease_model.tflite"),
        Path("models/crop-diseasemodel/crop_disease_model.tflite"),
    ]

    candidate_label_paths = [
        Path(__file__).resolve().parent.parent.parent / "models" / "crop-diseasemodel" / "class-names.json",
        Path(__file__).resolve().parent.parent.parent.parent / "models" / "crop-diseasemodel" / "class-names.json",
        Path("api/models/crop-diseasemodel/class-names.json"),
        Path("unified-backend/models/crop-diseasemodel/class-names.json"),
        Path("models/crop-diseasemodel/class-names.json"),
    ]

    model_path = next((p for p in candidate_model_paths if p.exists() and p.is_file()), None)
    labels_path = next((p for p in candidate_label_paths if p.exists() and p.is_file()), None)

    if labels_path:
        try:
            with open(labels_path, "r", encoding="utf-8") as f:
                class_names = json.load(f)
        except Exception as e:
            logger.warning(f"Error reading class-names.json: {e}")

    if not model_path:
        raise FileNotFoundError("ResNet50 crop_disease_model.tflite weights file not found on disk.")

    Interpreter = None
    try:
        from ai_edge_litert.interpreter import Interpreter
        logger.info("Using ai-edge-litert runtime.")
    except ImportError:
        try:
            from tflite_runtime.interpreter import Interpreter
            logger.info("Using tflite_runtime.")
        except ImportError:
            try:
                import tensorflow as tf
                Interpreter = tf.lite.Interpreter
                logger.info("Using tensorflow.lite runtime.")
            except ImportError as e:
                raise RuntimeError(f"TFLite inference engine (ai-edge-litert) not found: {e}")

    logger.info(f"Loading ResNet50 TFLite model from {model_path}...")
    interpreter = Interpreter(model_path=str(model_path))
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    logger.info("ResNet50 model weights loaded and tensors allocated successfully.")
    return interpreter


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Preprocesses input image bytes to 224x224 RGB float32 array."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image, dtype=np.float32)
    # Match batch dimension: (1, 224, 224, 3)
    image_array = np.expand_dims(image_array, axis=0)
    return image_array


def predict_image(image_bytes: bytes) -> Tuple[str, float]:
    """Runs actual ResNet50 model weights inference on the input image."""
    global interpreter, input_details, output_details, class_names

    if interpreter is None:
        load_disease_model()

    input_data = preprocess_image(image_bytes)

    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])[0]

    predicted_class_idx = int(np.argmax(output_data))
    confidence = float(output_data[predicted_class_idx])
    predicted_class_name = class_names[predicted_class_idx]

    return predicted_class_name, confidence
