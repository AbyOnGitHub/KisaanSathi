import pandas as pd
import joblib
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import os

print("Loading dataset...")
df = pd.read_csv('dataset.csv')

X = df[['Rain Fall (mm)', 'Fertilizer', 'Temperatue', 'Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)']]
y = df['Yeild (Q/acre)']

print("Creating pipeline...")
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', GradientBoostingRegressor(random_state=42))
])

print("Training model...")
pipeline.fit(X, y)

print("Saving model to crop_yield_model.pkl...")
joblib.dump(pipeline, 'crop_yield_model.pkl')
print("Model retrained and saved successfully!")
