"""
Forecasting and Machine Learning Module for Power Consumption System.
- Practical 7: Pickle model serialization and deserialization
- Practical 21: Scikit-learn Machine Learning (Linear Regression, Train/Test Split, MAE, RMSE, R2)

Trains, evaluates, serializes, and serves predictions for power consumption.
"""

import pickle
from pathlib import Path
from typing import Dict, Any, Tuple, Optional
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

import config
from modules.file_operations import log_activity


# =====================================================================
# MACHINE LEARNING TRAINING & EVALUATION (Practical 21)
# Demonstrates: Linear Regression, train_test_split, MAE, RMSE, R2
# =====================================================================

def train_forecasting_model(df: pd.DataFrame) -> Tuple[Any, Dict[str, Any]]:
    """
    Trains a Scikit-learn Linear Regression model to forecast power consumption.
    Features: hour, day_of_week, month, temperature, previous_consumption
    Target: consumption
    """
    features = config.FEATURE_COLUMNS
    target = config.TARGET_COLUMN

    # Ensure clean numeric data
    clean_df = df.dropna(subset=features + [target]).copy()

    X = clean_df[features].values
    y = clean_df[target].values

    # Train-test split (80% training, 20% testing)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=config.TEST_SIZE, random_state=config.RANDOM_STATE
    )

    # Initialize and fit Linear Regression model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Predictions on test set
    y_pred = model.predict(X_test)

    # Evaluation metrics
    mae = float(mean_absolute_error(y_test, y_pred))
    mse = float(mean_squared_error(y_test, y_pred))
    rmse = float(np.sqrt(mse))
    r2 = float(r2_score(y_test, y_pred))

    coefficients = {
        feature: round(float(coef), 4)
        for feature, coef in zip(features, model.coef_)
    }

    metrics = {
        "features": features,
        "target": target,
        "total_samples": len(clean_df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "r2_score": round(r2, 4),
        "accuracy_percentage": round(max(0.0, r2 * 100.0), 2),
        "intercept": round(float(model.intercept_), 4),
        "coefficients": coefficients
    }

    # Save model using pickle (Practical 7)
    save_model_to_pickle(model, metrics)

    log_activity(
        "MODEL_TRAINED",
        f"Samples={len(clean_df)}, MAE={mae:.2f}, RMSE={rmse:.2f}, R2={r2:.4f}"
    )

    return model, metrics


# =====================================================================
# MODEL SERIALIZATION WITH PICKLE (Practical 7)
# Demonstrates: pickle.dump and pickle.load
# =====================================================================

def save_model_to_pickle(model: Any, metrics: Dict[str, Any], filepath: Optional[Path] = None) -> bool:
    """
    Saves the trained model along with its evaluation metrics into a pickle file.
    """
    target_path = filepath or config.MODEL_FILE
    target_path.parent.mkdir(parents=True, exist_ok=True)

    package = {
        "model": model,
        "metrics": metrics,
        "features": config.FEATURE_COLUMNS,
    }

    with open(target_path, mode="wb") as f:
        pickle.dump(package, f)

    log_activity("MODEL_SAVED_PICKLE", f"Saved model to {target_path.name}")
    return True


def load_model_from_pickle(filepath: Optional[Path] = None) -> Tuple[Optional[Any], Optional[Dict[str, Any]]]:
    """
    Loads the trained model and its metadata from a pickle file.
    """
    target_path = filepath or config.MODEL_FILE

    if not Path(target_path).exists():
        return None, None

    try:
        with open(target_path, mode="rb") as f:
            package = pickle.load(f)
        return package.get("model"), package.get("metrics")
    except Exception as e:
        log_activity("MODEL_LOAD_ERROR", str(e))
        return None, None


# =====================================================================
# INFERENCE / PREDICTION FUNCTION
# =====================================================================

def predict_power_consumption(hour: int, day_of_week: int, month: int,
                             temperature: float, previous_consumption: float) -> Dict[str, Any]:
    """
    Loads the trained model and predicts expected power consumption (kWh)
    for user-supplied conditions.
    """
    model, metrics = load_model_from_pickle()

    if model is None:
        return {
            "success": False,
            "error": "Model not found. Please train the model before running predictions."
        }

    # Prepare input array matching feature columns
    input_features = np.array([[hour, day_of_week, month, temperature, previous_consumption]], dtype=np.float64)

    # Predict consumption
    prediction = float(model.predict(input_features)[0])
    prediction = max(0.0, prediction)  # Consumption cannot be negative

    day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    day_name = day_names[day_of_week] if 0 <= day_of_week <= 6 else f"Day {day_of_week}"

    result = {
        "success": True,
        "predicted_consumption_kwh": round(prediction, 2),
        "inputs": {
            "hour": hour,
            "day_of_week": day_of_week,
            "day_name": day_name,
            "month": month,
            "temperature": round(temperature, 1),
            "previous_consumption": round(previous_consumption, 1)
        },
        "model_performance": {
            "mae": metrics.get("mae", 0.0) if metrics else 0.0,
            "rmse": metrics.get("rmse", 0.0) if metrics else 0.0,
            "r2_score": metrics.get("r2_score", 0.0) if metrics else 0.0,
        },
        "note": "Forecast generated via Scikit-Learn Linear Regression model trained on historical observations."
    }

    log_activity(
        "PREDICTION_MADE",
        f"Input: hour={hour}, temp={temperature}, prev={previous_consumption} => Pred={prediction:.2f} kWh"
    )

    return result
