import tensorflow as tf
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "crop-diseasemodel", "crop_disease_model.tflite")

interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()

print("Input Details:")
print(interpreter.get_input_details())

print("Output Details:")
print(interpreter.get_output_details())
