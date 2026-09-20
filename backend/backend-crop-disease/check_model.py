import tensorflow as tf
import sys

interpreter = tf.lite.Interpreter(model_path='../models/crop_disease_model.tflite')
interpreter.allocate_tensors()
print('INPUT:', interpreter.get_input_details())
print('OUTPUT:', interpreter.get_output_details())
