"""
Crop Yield Prediction - Crop-Aware Machine Learning Pipeline
Trains a Gradient Boosting Regressor pipeline with crop identity as a categorical feature,
incorporating agronomic profiles for 10 key Indian agricultural crops.
"""

import os
import json
import shutil
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, KFold, cross_validate
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error, root_mean_squared_error

# Define the 10 candidate crops and their agronomic response profiles
CROP_PROFILES = {
    "Rice": {
        "display": "Rice (Paddy)",
        "rainfall_mean": 1400, "rainfall_std": 300, "rainfall_min": 800, "rainfall_max": 2500,
        "temp_mean": 28, "temp_std": 3, "temp_min": 20, "temp_max": 38,
        "fert_mean": 110, "fert_std": 20, "fert_min": 60, "fert_max": 200,
        "n_mean": 100, "n_std": 20, "n_min": 60, "n_max": 160,
        "p_mean": 40, "p_std": 10, "p_min": 20, "p_max": 70,
        "k_mean": 40, "k_std": 10, "k_min": 20, "k_max": 70,
        "yield_base": 19.5, "yield_std": 2.8, "yield_min": 12.0, "yield_max": 28.0,
        "rf_weight": 0.003, "temp_opt": 28, "n_weight": 0.03
    },
    "Wheat": {
        "display": "Wheat",
        "rainfall_mean": 450, "rainfall_std": 120, "rainfall_min": 250, "rainfall_max": 800,
        "temp_mean": 20, "temp_std": 3.5, "temp_min": 12, "temp_max": 29,
        "fert_mean": 100, "fert_std": 20, "fert_min": 50, "fert_max": 180,
        "n_mean": 110, "n_std": 20, "n_min": 60, "n_max": 160,
        "p_mean": 45, "p_std": 10, "p_min": 20, "p_max": 75,
        "k_mean": 35, "k_std": 10, "k_min": 15, "k_max": 65,
        "yield_base": 18.0, "yield_std": 2.5, "yield_min": 12.0, "yield_max": 26.0,
        "rf_weight": 0.004, "temp_opt": 20, "n_weight": 0.035
    },
    "Maize": {
        "display": "Maize",
        "rainfall_mean": 700, "rainfall_std": 180, "rainfall_min": 400, "rainfall_max": 1200,
        "temp_mean": 26, "temp_std": 3.5, "temp_min": 18, "temp_max": 35,
        "fert_mean": 115, "fert_std": 25, "fert_min": 60, "fert_max": 200,
        "n_mean": 110, "n_std": 22, "n_min": 60, "n_max": 170,
        "p_mean": 45, "p_std": 12, "p_min": 20, "p_max": 75,
        "k_mean": 40, "k_std": 12, "k_min": 18, "k_max": 70,
        "yield_base": 20.0, "yield_std": 3.0, "yield_min": 13.0, "yield_max": 30.0,
        "rf_weight": 0.0035, "temp_opt": 25, "n_weight": 0.03
    },
    "Bajra": {
        "display": "Bajra (Pearl Millet)",
        "rainfall_mean": 420, "rainfall_std": 100, "rainfall_min": 200, "rainfall_max": 700,
        "temp_mean": 32, "temp_std": 4, "temp_min": 22, "temp_max": 42,
        "fert_mean": 60, "fert_std": 15, "fert_min": 30, "fert_max": 110,
        "n_mean": 65, "n_std": 15, "n_min": 35, "n_max": 105,
        "p_mean": 30, "p_std": 8, "p_min": 15, "p_max": 55,
        "k_mean": 25, "k_std": 7, "k_min": 10, "k_max": 50,
        "yield_base": 10.2, "yield_std": 1.9, "yield_min": 5.5, "yield_max": 16.0,
        "rf_weight": 0.004, "temp_opt": 31, "n_weight": 0.025
    },
    "Jowar": {
        "display": "Jowar (Sorghum)",
        "rainfall_mean": 550, "rainfall_std": 130, "rainfall_min": 300, "rainfall_max": 900,
        "temp_mean": 29, "temp_std": 3.5, "temp_min": 20, "temp_max": 38,
        "fert_mean": 75, "fert_std": 18, "fert_min": 35, "fert_max": 130,
        "n_mean": 75, "n_std": 16, "n_min": 40, "n_max": 120,
        "p_mean": 35, "p_std": 9, "p_min": 18, "p_max": 60,
        "k_mean": 30, "k_std": 8, "k_min": 15, "k_max": 55,
        "yield_base": 11.0, "yield_std": 2.1, "yield_min": 6.0, "yield_max": 17.5,
        "rf_weight": 0.0035, "temp_opt": 29, "n_weight": 0.025
    },
    "Cotton": {
        "display": "Cotton",
        "rainfall_mean": 750, "rainfall_std": 180, "rainfall_min": 450, "rainfall_max": 1300,
        "temp_mean": 29, "temp_std": 3.5, "temp_min": 21, "temp_max": 38,
        "fert_mean": 95, "fert_std": 22, "fert_min": 45, "fert_max": 170,
        "n_mean": 90, "n_std": 20, "n_min": 50, "n_max": 140,
        "p_mean": 38, "p_std": 10, "p_min": 18, "p_max": 65,
        "k_mean": 38, "k_std": 10, "k_min": 18, "k_max": 65,
        "yield_base": 9.5, "yield_std": 1.8, "yield_min": 5.0, "yield_max": 15.0,
        "rf_weight": 0.0025, "temp_opt": 29, "n_weight": 0.02
    },
    "Soybean": {
        "display": "Soybean",
        "rainfall_mean": 800, "rainfall_std": 180, "rainfall_min": 500, "rainfall_max": 1300,
        "temp_mean": 26, "temp_std": 3, "temp_min": 18, "temp_max": 34,
        "fert_mean": 65, "fert_std": 15, "fert_min": 30, "fert_max": 120,
        "n_mean": 35, "n_std": 10, "n_min": 15, "n_max": 60,
        "p_mean": 55, "p_std": 12, "p_min": 25, "p_max": 85,
        "k_mean": 42, "k_std": 10, "k_min": 20, "k_max": 70,
        "yield_base": 10.5, "yield_std": 2.0, "yield_min": 5.5, "yield_max": 16.5,
        "rf_weight": 0.003, "temp_opt": 26, "n_weight": 0.02
    },
    "Groundnut": {
        "display": "Groundnut",
        "rainfall_mean": 650, "rainfall_std": 150, "rainfall_min": 400, "rainfall_max": 1100,
        "temp_mean": 28, "temp_std": 3.2, "temp_min": 20, "temp_max": 36,
        "fert_mean": 60, "fert_std": 15, "fert_min": 25, "fert_max": 110,
        "n_mean": 30, "n_std": 8, "n_min": 15, "n_max": 55,
        "p_mean": 50, "p_std": 12, "p_min": 22, "p_max": 80,
        "k_mean": 45, "k_std": 11, "k_min": 20, "k_max": 75,
        "yield_base": 12.0, "yield_std": 2.2, "yield_min": 6.5, "yield_max": 18.5,
        "rf_weight": 0.003, "temp_opt": 28, "n_weight": 0.02
    },
    "Chickpea": {
        "display": "Chickpea (Gram)",
        "rainfall_mean": 380, "rainfall_std": 90, "rainfall_min": 200, "rainfall_max": 650,
        "temp_mean": 21, "temp_std": 3.5, "temp_min": 13, "temp_max": 30,
        "fert_mean": 50, "fert_std": 12, "fert_min": 20, "fert_max": 95,
        "n_mean": 25, "n_std": 7, "n_min": 12, "n_max": 48,
        "p_mean": 48, "p_std": 10, "p_min": 22, "p_max": 75,
        "k_mean": 32, "k_std": 8, "k_min": 15, "k_max": 55,
        "yield_base": 8.5, "yield_std": 1.6, "yield_min": 4.5, "yield_max": 13.5,
        "rf_weight": 0.0035, "temp_opt": 21, "n_weight": 0.02
    },
    "Mustard": {
        "display": "Mustard",
        "rainfall_mean": 360, "rainfall_std": 80, "rainfall_min": 180, "rainfall_max": 600,
        "temp_mean": 19, "temp_std": 3.2, "temp_min": 11, "temp_max": 27,
        "fert_mean": 70, "fert_std": 16, "fert_min": 30, "fert_max": 120,
        "n_mean": 70, "n_std": 15, "n_min": 35, "n_max": 110,
        "p_mean": 38, "p_std": 9, "p_min": 18, "p_max": 65,
        "k_mean": 28, "k_std": 7, "k_min": 12, "k_max": 50,
        "yield_base": 7.8, "yield_std": 1.5, "yield_min": 4.2, "yield_max": 12.8,
        "rf_weight": 0.0035, "temp_opt": 19, "n_weight": 0.025
    }
}


def generate_agronomic_dataset(samples_per_crop=120, seed=42):
    """
    Generates a realistic, agronomically sound dataset for the 10 crops.
    Features and columns match the KisaanSathi schema:
    ['Crop', 'Rain Fall (mm)', 'Fertilizer', 'Temperatue', 'Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)', 'Yeild (Q/acre)']
    """
    np.random.seed(seed)
    records = []

    for crop, prof in CROP_PROFILES.items():
        for _ in range(samples_per_crop):
            rf = np.clip(np.random.normal(prof["rainfall_mean"], prof["rainfall_std"]), prof["rainfall_min"], prof["rainfall_max"])
            temp = np.clip(np.random.normal(prof["temp_mean"], prof["temp_std"]), prof["temp_min"], prof["temp_max"])
            fert = np.clip(np.random.normal(prof["fert_mean"], prof["fert_std"]), prof["fert_min"], prof["fert_max"])
            n = np.clip(np.random.normal(prof["n_mean"], prof["n_std"]), prof["n_min"], prof["n_max"])
            p = np.clip(np.random.normal(prof["p_mean"], prof["p_std"]), prof["p_min"], prof["p_max"])
            k = np.clip(np.random.normal(prof["k_mean"], prof["k_std"]), prof["k_min"], prof["k_max"])

            # Agronomic yield response: base yield + climate fitness + nutrient response + noise
            rf_dev = (rf - prof["rainfall_mean"]) * prof["rf_weight"]
            temp_penalty = -0.12 * ((temp - prof["temp_opt"]) ** 2) / 4.0
            n_response = (n - prof["n_mean"]) * prof["n_weight"]
            p_response = (p - prof["p_mean"]) * 0.015
            k_response = (k - prof["k_mean"]) * 0.015
            fert_response = (fert - prof["fert_mean"]) * 0.01
            noise = np.random.normal(0, 0.45)

            y = prof["yield_base"] + rf_dev + temp_penalty + n_response + p_response + k_response + fert_response + noise
            y = np.clip(y, prof["yield_min"], prof["yield_max"])

            records.append({
                "Crop": crop,
                "Rain Fall (mm)": round(float(rf), 1),
                "Fertilizer": round(float(fert), 1),
                "Temperatue": round(float(temp), 1),
                "Nitrogen (N)": round(float(n), 1),
                "Phosphorus (P)": round(float(p), 1),
                "Potassium (K)": round(float(k), 1),
                "Yeild (Q/acre)": round(float(y), 2)
            })

    df = pd.DataFrame(records)
    return df


def train_crop_model(df):
    """Trains and rigorously evaluates the crop-aware Gradient Boosting pipeline."""
    feature_cols = ["Crop", "Rain Fall (mm)", "Fertilizer", "Temperatue", "Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"]
    target_col = "Yeild (Q/acre)"

    X = df[feature_cols]
    y = df[target_col]

    # Preprocessing: OneHotEncoder for Crop, SimpleImputer + StandardScaler for numeric
    categorical_cols = ["Crop"]
    numeric_cols = ["Rain Fall (mm)", "Fertilizer", "Temperatue", "Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(categories=[list(CROP_PROFILES.keys())], sparse_output=False, handle_unknown="ignore"), categorical_cols),
            ("num", Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler())
            ]), numeric_cols)
        ]
    )

    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", GradientBoostingRegressor(
            n_estimators=250,
            learning_rate=0.06,
            max_depth=4,
            loss="huber",
            random_state=42
        ))
    ])

    # 1. 5-Fold Cross Validation
    cv = KFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_validate(
        pipeline, X, y, cv=cv,
        scoring={"r2": "r2", "neg_mae": "neg_mean_absolute_error", "neg_rmse": "neg_root_mean_squared_error"}
    )

    cv_r2_mean = float(np.mean(cv_scores["test_r2"]))
    cv_r2_std = float(np.std(cv_scores["test_r2"]))
    cv_mae_mean = float(-np.mean(cv_scores["test_neg_mae"]))
    cv_rmse_mean = float(-np.mean(cv_scores["test_neg_rmse"]))

    # 2. Held-out Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=X["Crop"])
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)

    test_r2 = float(r2_score(y_test, y_pred))
    test_mae = float(mean_absolute_error(y_test, y_pred))
    test_rmse = float(root_mean_squared_error(y_test, y_pred))

    # Evaluate per-crop metrics on test set
    test_df = X_test.copy()
    test_df["actual"] = y_test
    test_df["pred"] = y_pred

    crop_metrics = {}
    for crop in CROP_PROFILES.keys():
        sub = test_df[test_df["Crop"] == crop]
        if len(sub) > 0:
            c_r2 = float(r2_score(sub["actual"], sub["pred"])) if np.var(sub["actual"]) > 1e-6 else 1.0
            c_mae = float(mean_absolute_error(sub["actual"], sub["pred"]))
            c_rmse = float(root_mean_squared_error(sub["actual"], sub["pred"]))
            crop_metrics[crop] = {
                "sample_count": len(sub),
                "mean_actual_yield": round(float(sub["actual"].mean()), 2),
                "mean_pred_yield": round(float(sub["pred"].mean()), 2),
                "r2": round(c_r2, 4),
                "mae": round(c_mae, 3),
                "rmse": round(c_rmse, 3)
            }

    # Re-fit pipeline on full dataset for maximum generalization in production
    pipeline.fit(X, y)

    metrics = {
        "model_type": "GradientBoostingRegressor (Crop-Aware Pipeline)",
        "supported_crops": list(CROP_PROFILES.keys()),
        "total_dataset_rows": len(df),
        "features": feature_cols,
        "target": target_col,
        "cv_5fold": {
            "r2_mean": round(cv_r2_mean, 4),
            "r2_std": round(cv_r2_std, 4),
            "mae_mean_q_per_acre": round(cv_mae_mean, 3),
            "rmse_mean_q_per_acre": round(cv_rmse_mean, 3)
        },
        "heldout_test": {
            "test_size": 0.2,
            "test_r2": round(test_r2, 4),
            "test_mae_q_per_acre": round(test_mae, 3),
            "test_rmse_q_per_acre": round(test_rmse, 3)
        },
        "per_crop_metrics": crop_metrics
    }

    return pipeline, metrics


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    dataset_path = os.path.join(models_dir, "crop_yield_dataset.csv")
    model_path = os.path.join(models_dir, "crop_yield_model_cropwise.pkl")
    metrics_path = os.path.join(models_dir, "model_metrics.json")

    print("[1/4] Generating agronomic dataset for 10 candidate crops...")
    df = generate_agronomic_dataset(samples_per_crop=120, seed=42)
    df.to_csv(dataset_path, index=False)
    print(f"      Saved dataset to: {dataset_path} ({len(df)} rows)")

    print("[2/4] Training crop-aware Gradient Boosting pipeline...")
    pipeline, metrics = train_crop_model(df)
    print(f"      5-Fold CV R2: {metrics['cv_5fold']['r2_mean']} +/- {metrics['cv_5fold']['r2_std']}")
    print(f"      5-Fold CV MAE: {metrics['cv_5fold']['mae_mean_q_per_acre']} Q/acre")
    print(f"      Test Set R2: {metrics['heldout_test']['test_r2']}")
    print(f"      Test Set MAE: {metrics['heldout_test']['test_mae_q_per_acre']} Q/acre")

    print("[3/4] Saving model artifact and metrics...")
    joblib.dump(pipeline, model_path)
    print(f"      Model saved to: {model_path}")

    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    print(f"      Metrics saved to: {metrics_path}")

    print("\nTraining and artifact generation complete!")


if __name__ == "__main__":
    main()
