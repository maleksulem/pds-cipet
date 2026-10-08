"""
Statistical Analysis Module for Power Consumption Forecasting System.
- Practical 11: NumPy arrays, total, percentage and percentile operations
- Practical 12: SciPy statistical analysis (describe, skewness, kurtosis, SEM)
- Practical 13: Pandas descriptive statistics and grouping/aggregation

Performs comprehensive mathematical and statistical calculations on
power consumption records using NumPy, SciPy, and Pandas.
"""

from typing import Dict, Any
import numpy as np
import pandas as pd
from scipy import stats

from modules.file_operations import log_activity


# =====================================================================
# NUMPY NUMERICAL OPERATIONS (Practical 11)
# Demonstrates: NumPy array conversion, total, percentage, percentile
# =====================================================================

def calculate_numpy_metrics(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Converts consumption column into a NumPy array and calculates:
    - Array shape, dimensions, and data type
    - Total power consumption (np.sum)
    - Average / Mean consumption (np.mean)
    - Minimum and Maximum consumption (np.min, np.max)
    - Percentiles: 10th, 25th, 50th, 75th, 90th, 95th, 99th (np.percentile)
    - Percentage analysis: Peak hours vs Off-peak hours consumption share
    """
    # 1. Convert to 1D NumPy array
    consumption_array = np.array(df["consumption"].dropna().values, dtype=np.float64)

    total_consumption = float(np.sum(consumption_array))
    mean_consumption = float(np.mean(consumption_array))
    median_consumption = float(np.median(consumption_array))
    std_consumption = float(np.std(consumption_array, ddof=1))
    var_consumption = float(np.var(consumption_array, ddof=1))
    min_consumption = float(np.min(consumption_array))
    max_consumption = float(np.max(consumption_array))

    # 2. Percentile calculations
    percentiles_to_calc = [10, 25, 50, 75, 90, 95, 99]
    percentile_results = {
        f"p{p}": round(float(np.percentile(consumption_array, p)), 2)
        for p in percentiles_to_calc
    }

    # 3. Percentage calculations: Daytime (06:00 to 18:00) vs Nighttime (18:00 to 06:00)
    day_mask = (df["hour"] >= 6) & (df["hour"] < 18)
    day_total = float(np.sum(df.loc[day_mask, "consumption"].dropna().values))
    night_total = total_consumption - day_total

    day_pct = round((day_total / total_consumption) * 100.0, 2) if total_consumption > 0 else 0.0
    night_pct = round((night_total / total_consumption) * 100.0, 2) if total_consumption > 0 else 0.0

    numpy_metrics = {
        "array_size": int(consumption_array.size),
        "array_dtype": str(consumption_array.dtype),
        "total_kwh": round(total_consumption, 2),
        "mean_kwh": round(mean_consumption, 2),
        "median_kwh": round(median_consumption, 2),
        "std_kwh": round(std_consumption, 2),
        "variance": round(var_consumption, 2),
        "min_kwh": round(min_consumption, 2),
        "max_kwh": round(max_consumption, 2),
        "percentiles": percentile_results,
        "percentages": {
            "daytime_pct": day_pct,
            "nighttime_pct": night_pct,
            "daytime_kwh": round(day_total, 2),
            "nighttime_kwh": round(night_total, 2)
        }
    }
    return numpy_metrics


# =====================================================================
# SCIPY STATISTICAL ANALYSIS (Practical 12)
# Demonstrates: scipy.stats.describe, skew, kurtosis, sem
# =====================================================================

def calculate_scipy_metrics(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Uses scipy.stats to calculate:
    - Full descriptive statistics tuple (nobs, minmax, mean, variance, skewness, kurtosis)
    - Standard Error of the Mean (SEM)
    - Geometric mean and Harmonic mean
    """
    arr = df["consumption"].dropna().values

    desc = stats.describe(arr)
    skewness = float(stats.skew(arr))
    kurtosis_val = float(stats.kurtosis(arr))
    sem_val = float(stats.sem(arr))

    # Mode calculation using scipy or pandas
    mode_res = stats.mode(np.round(arr, 0), keepdims=True)
    mode_val = float(mode_res.mode[0]) if len(mode_res.mode) > 0 else float(np.median(arr))

    scipy_metrics = {
        "nobs": int(desc.nobs),
        "min_val": round(float(desc.minmax[0]), 2),
        "max_val": round(float(desc.minmax[1]), 2),
        "mean": round(float(desc.mean), 2),
        "variance": round(float(desc.variance), 2),
        "skewness": round(skewness, 4),
        "kurtosis": round(kurtosis_val, 4),
        "sem": round(sem_val, 4),
        "mode": round(mode_val, 2),
        "distribution_shape": (
            "Positively skewed (right-tailed)" if skewness > 0.5
            else "Negatively skewed (left-tailed)" if skewness < -0.5
            else "Approximately symmetric"
        )
    }
    return scipy_metrics


# =====================================================================
# PANDAS DESCRIPTIVE STATISTICS & GROUPING (Practical 13)
# Demonstrates: mean, median, mode, std, var, skew, groupby, agg
# =====================================================================

def calculate_pandas_metrics(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Calculates Pandas summary statistics and aggregations:
    - Summary series: mean, median, mode, std, var, quantiles
    - Hourly consumption aggregation (groupby hour)
    - Day of week consumption aggregation (groupby day_of_week)
    - Correlation matrix between numeric features
    """
    c_series = df["consumption"]

    mode_val = float(c_series.mode()[0]) if not c_series.mode().empty else float(c_series.median())

    summary_stats = {
        "count": int(c_series.count()),
        "mean": round(float(c_series.mean()), 2),
        "std": round(float(c_series.std()), 2),
        "variance": round(float(c_series.var()), 2),
        "min": round(float(c_series.min()), 2),
        "q25": round(float(c_series.quantile(0.25)), 2),
        "median": round(float(c_series.median()), 2),
        "q75": round(float(c_series.quantile(0.75)), 2),
        "max": round(float(c_series.max()), 2),
        "mode": round(mode_val, 2),
        "skew": round(float(c_series.skew()), 4),
        "kurt": round(float(c_series.kurt()), 4)
    }

    # Groupby Hour
    hourly_group = df.groupby("hour")["consumption"].agg(["mean", "min", "max", "std"]).reset_index()
    hourly_stats = [
        {
            "hour": int(row["hour"]),
            "mean": round(float(row["mean"]), 2),
            "min": round(float(row["min"]), 2),
            "max": round(float(row["max"]), 2),
        }
        for _, row in hourly_group.iterrows()
    ]

    # Groupby Day of Week
    day_labels = {0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri", 5: "Sat", 6: "Sun"}
    daily_group = df.groupby("day_of_week")["consumption"].agg(["mean", "count"]).reset_index()
    daily_stats = [
        {
            "day_code": int(row["day_of_week"]),
            "day_name": day_labels.get(int(row["day_of_week"]), f"Day {int(row['day_of_week'])}"),
            "mean_consumption": round(float(row["mean"]), 2),
            "count": int(row["count"])
        }
        for _, row in daily_group.iterrows()
    ]

    # Correlation Matrix
    numeric_cols = ["hour", "temperature", "previous_consumption", "consumption"]
    corr_df = df[numeric_cols].corr()
    corr_dict = {
        col1: {col2: round(float(corr_df.loc[col1, col2]), 3) for col2 in numeric_cols}
        for col1 in numeric_cols
    }

    log_activity("STATS_CALCULATED", f"Calculated NumPy, SciPy and Pandas metrics for {len(df)} records.")

    return {
        "summary": summary_stats,
        "hourly_breakdown": hourly_stats,
        "daily_breakdown": daily_stats,
        "correlation_matrix": corr_dict
    }
