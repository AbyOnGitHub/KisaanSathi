import os
import joblib
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor

# Ensure models directory exists
os.makedirs('models', exist_ok=True)

# Create some dummy training data
data = {
    "Rain Fall (mm)": [100, 200, 150, 50, 300],
    "Fertilizer": [50, 60, 55, 40, 70],
    "Temperatue": [25, 28, 22, 35, 20],  # spelling as expected by predictor
    "Nitrogen (N)": [30, 40, 35, 20, 50],
    "Phosphorus (P)": [20, 25, 22, 15, 30],
    "Potassium (K)": [20, 25, 22, 15, 30],
    "Yield (Q/acre)": [15.5, 18.2, 16.0, 10.5, 20.1]
}

df = pd.DataFrame(data)

X = df.drop(columns=["Yield (Q/acre)"])
y = df["Yield (Q/acre)"]

# Train a simple model
model = GradientBoostingRegressor(random_state=42)
model.fit(X, y)

# Save the model
model_path = 'models/crop_yield_model.pkl'
joblib.dump(model, model_path)
print(f"Successfully generated new model at {model_path}")
