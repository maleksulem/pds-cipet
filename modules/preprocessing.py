"""
Data Preprocessing Module for Power Consumption Forecasting System.
- Practical 15: Data cleaning and preprocessing
  - Missing-value handling
  - Duplicate detection & removal
  - Outlier detection via Interquartile Range (IQR) & handling
  - Normalization and standardization
  - Feature engineering (is_weekend, is_peak_hour)

Produces a clean DataFrame ready for analysis and ML, along with a transparent
before/after audit summary.
"""

from typing import Dict, Any, Tuple
import pandas as pd
import numpy as np

import config
from modules.file_operations import log_activity


def preprocess_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Executes the complete data cleaning and preprocessing pipeline:
    1. Records audit before cleaning
    2. Convert types to numeric
    3. Handles missing values
    4. Removes duplicates
    5. Detects and handles outliers using IQR
    6. Feature engineering (is_weekend, is_peak_hour)
    7. Computes normalization (MinMax & Z-Score) for demonstration
    """
    cleaned_df = df.copy()
    initial_row_count = len(cleaned_df)

    # 1. Type coercion to numeric for calculation columns
    num_cols = ["temperature", "previous_consumption", "consumption", "hour", "day", "month", "day_of_week"]
    for col in num_cols:
        if col in cleaned_df.columns:
            cleaned_df[col] = pd.to_numeric(cleaned_df[col], errors="coerce")

    # 2. Missing Value Analysis & Handling
    missing_before = int(cleaned_df.isnull().sum().sum())
    missing_by_col = {col: int(cnt) for col, cnt in cleaned_df.isnull().sum().items() if cnt > 0}

    # Impute missing temperature with median; impute missing previous_consumption with consumption or median
    if "temperature" in cleaned_df.columns and cleaned_df["temperature"].isnull().sum() > 0:
        med_temp = cleaned_df["temperature"].median()
        cleaned_df["temperature"] = cleaned_df["temperature"].fillna(med_temp)

    if "previous_consumption" in cleaned_df.columns and cleaned_df["previous_consumption"].isnull().sum() > 0:
        med_prev = cleaned_df["previous_consumption"].median()
        cleaned_df["previous_consumption"] = cleaned_df["previous_consumption"].fillna(med_prev)

    # For the target variable 'consumption', drop rows where consumption is null (or impute)
    null_target_count = int(cleaned_df["consumption"].isnull().sum())
    if null_target_count > 0:
        # Impute with median of the respective hour to preserve continuity
        hour_grouped = cleaned_df.groupby("hour")["consumption"].transform("median")
        cleaned_df["consumption"] = cleaned_df["consumption"].fillna(hour_grouped)
        # If any remain, use global median
        cleaned_df["consumption"] = cleaned_df["consumption"].fillna(cleaned_df["consumption"].median())

    # 3. Duplicate Detection and Removal
    duplicates_detected = int(cleaned_df.duplicated().sum())
    cleaned_df = cleaned_df.drop_duplicates().reset_index(drop=True)
    post_duplicates_count = len(cleaned_df)

    # 4. Outlier Detection using Interquartile Range (IQR) on consumption
    q1 = float(cleaned_df["consumption"].quantile(0.25))
    q3 = float(cleaned_df["consumption"].quantile(0.75))
    iqr = q3 - q1
    lower_bound = round(q1 - 1.5 * iqr, 2)
    upper_bound = round(q3 + 1.5 * iqr, 2)

    outlier_mask = (cleaned_df["consumption"] < lower_bound) | (cleaned_df["consumption"] > upper_bound)
    outliers_detected = int(outlier_mask.sum())

    # Cap outliers at boundary values (Winsorization) to avoid data loss while preserving distribution
    cleaned_df["consumption_raw"] = cleaned_df["consumption"]  # keep original for reference
    cleaned_df["consumption"] = cleaned_df["consumption"].clip(lower=lower_bound, upper=upper_bound)

    # 5. Feature Engineering
    # - is_weekend: Saturday (5) or Sunday (6)
    cleaned_df["is_weekend"] = cleaned_df["day_of_week"].apply(lambda d: 1 if d in [5, 6] else 0)

    # - is_peak_hour: morning peak (8-11) or evening peak (18-21)
    cleaned_df["is_peak_hour"] = cleaned_df["hour"].apply(
        lambda h: 1 if h in [8, 9, 10, 11, 18, 19, 20, 21] else 0
    )

    # 6. Min-Max Normalization and Z-Score Standardization (Practical 15 demonstration)
    c_min = float(cleaned_df["consumption"].min())
    c_max = float(cleaned_df["consumption"].max())
    c_mean = float(cleaned_df["consumption"].mean())
    c_std = float(cleaned_df["consumption"].std()) if float(cleaned_df["consumption"].std()) > 0 else 1.0

    # Min-Max: (x - min) / (max - min)
    cleaned_df["consumption_minmax"] = (cleaned_df["consumption"] - c_min) / (c_max - c_min + 1e-9)
    # Z-Score: (x - mean) / std
    cleaned_df["consumption_zscore"] = (cleaned_df["consumption"] - c_mean) / c_std

    final_row_count = len(cleaned_df)

    summary = {
        "initial_records": initial_row_count,
        "missing_values_imputed": missing_before,
        "missing_by_column": missing_by_col,
        "duplicates_removed": duplicates_detected,
        "outliers_detected": outliers_detected,
        "outlier_iqr_stats": {
            "q1_25th": round(q1, 2),
            "q3_75th": round(q3, 2),
            "iqr": round(iqr, 2),
            "lower_bound": lower_bound,
            "upper_bound": upper_bound
        },
        "final_clean_records": final_row_count,
        "scaling_summary": {
            "min_val": round(c_min, 2),
            "max_val": round(c_max, 2),
            "mean_val": round(c_mean, 2),
            "std_val": round(c_std, 2)
        }
    }

    log_activity(
        "PREPROCESSING_COMPLETE",
        f"Initial: {initial_row_count}, Missing: {missing_before}, Dups: {duplicates_detected}, Outliers: {outliers_detected}, Final: {final_row_count}"
    )

    return cleaned_df, summary
