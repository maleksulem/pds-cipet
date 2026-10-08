"""
Data Loader Module for Power Consumption Forecasting System.
- Practical 1: Python environment and commonly used libraries
- Practical 7: Custom exceptions and modules
- Practical 13: Pandas read CSV, inspection (head, shape, columns)
- Practical 14: BeautifulSoup web scraping and DataFrame merging

Loads, inspects, and merges power consumption datasets.
"""

from pathlib import Path
from typing import Dict, Any, Tuple, Optional
import pandas as pd
from bs4 import BeautifulSoup

import config
from modules.file_operations import log_activity


# =====================================================================
# CUSTOM EXCEPTIONS (Practical 7)
# =====================================================================

class DatasetError(Exception):
    """Base custom exception for dataset-related operational failures."""
    pass


class DatasetNotFoundError(DatasetError):
    """Raised when the expected power consumption CSV dataset does not exist."""
    pass


class InvalidDataFormatError(DatasetError):
    """Raised when the dataset is missing mandatory columns or possesses corrupt data."""
    pass


# =====================================================================
# DATA LOADING & INSPECTION (Practicals 1, 13)
# =====================================================================

REQUIRED_COLUMNS = [
    "date", "time", "hour", "day", "month", "day_of_week",
    "temperature", "previous_consumption", "consumption"
]


def load_dataset(filepath: Optional[Path] = None) -> pd.DataFrame:
    """
    Loads the historical power consumption CSV into a Pandas DataFrame.
    Validates presence of required columns and handles file errors.
    """
    target_path = filepath or config.DATA_FILE

    if not Path(target_path).exists():
        log_activity("LOAD_DATASET_FAILED", f"File not found: {target_path}")
        raise DatasetNotFoundError(f"Dataset file could not be found at: {target_path}")

    try:
        # Load CSV using pandas
        df = pd.read_csv(target_path)
    except Exception as err:
        log_activity("LOAD_DATASET_ERROR", str(err))
        raise DatasetError(f"Error parsing CSV file {target_path}: {err}")

    # Check for required columns
    missing_cols = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing_cols:
        log_activity("LOAD_DATASET_INVALID", f"Missing columns: {missing_cols}")
        raise InvalidDataFormatError(
            f"Dataset is missing required columns: {missing_cols}. Expected columns: {REQUIRED_COLUMNS}"
        )

    log_activity("LOAD_DATASET_SUCCESS", f"Loaded {len(df)} rows from {target_path.name}")
    return df


def inspect_dataset(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Performs initial dataset inspection using Pandas methods:
    - shape, columns, head(5), dtypes, missing values, duplicates, memory usage.
    """
    inspection_info = {
        "num_rows": int(df.shape[0]),
        "num_columns": int(df.shape[1]),
        "column_names": list(df.columns),
        "column_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "head_sample": df.head(5).to_dict(orient="records"),
        "missing_counts": {col: int(cnt) for col, cnt in df.isnull().sum().items()},
        "total_missing": int(df.isnull().sum().sum()),
        "duplicate_rows": int(df.duplicated().sum()),
        "memory_usage_kb": round(float(df.memory_usage(deep=True).sum()) / 1024.0, 2),
    }
    return inspection_info


# =====================================================================
# WEB SCRAPING & MERGING (Practical 14)
# Demonstrates BeautifulSoup parsing of HTML table & merging with DataFrame
# =====================================================================

def scrape_weather_data(html_path: Optional[Path] = None) -> pd.DataFrame:
    """
    Scrapes meteorological observation table from sample_weather.html
    using BeautifulSoup, parsing HTML tags into a clean Pandas DataFrame.
    """
    target_path = html_path or config.SAMPLE_WEATHER_HTML

    if not Path(target_path).exists():
        raise FileNotFoundError(f"Weather HTML source file not found at: {target_path}")

    with open(target_path, mode="r", encoding="utf-8") as f:
        html_content = f.read()

    # Parse HTML with BeautifulSoup
    soup = BeautifulSoup(html_content, "html.parser")

    # Locate the table and rows
    table = soup.find("table", class_="weather-table")
    if not table:
        raise ValueError("Could not find table with class 'weather-table' in HTML source.")

    rows = table.find("tbody").find_all("tr")
    scraped_records = []

    for tr in rows:
        date_val = tr.find("td", class_="obs-date").get_text(strip=True)
        hour_val = int(tr.find("td", class_="obs-hour").get_text(strip=True))
        temp_val = float(tr.find("td", class_="obs-temp").get_text(strip=True))
        hum_val = float(tr.find("td", class_="obs-humidity").get_text(strip=True))
        wind_val = float(tr.find("td", class_="obs-wind").get_text(strip=True))
        cond_val = tr.find("td", class_="obs-condition").get_text(strip=True)

        scraped_records.append({
            "date": date_val,
            "hour": hour_val,
            "scraped_temp": temp_val,
            "humidity_percent": hum_val,
            "wind_speed_kmh": wind_val,
            "weather_condition": cond_val
        })

    weather_df = pd.DataFrame(scraped_records)
    log_activity("WEB_SCRAPING_SUCCESS", f"Scraped {len(weather_df)} weather rows using BeautifulSoup.")
    return weather_df


def merge_power_and_weather(power_df: pd.DataFrame, weather_df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Merges power consumption DataFrame with scraped weather DataFrame
    using common join keys: 'date' and 'hour'.
    Demonstrates Pandas DataFrame merging (pd.merge).
    """
    # Ensure types match before merge
    p_df = power_df.copy()
    w_df = weather_df.copy()

    p_df["date"] = p_df["date"].astype(str)
    p_df["hour"] = pd.to_numeric(p_df["hour"], errors="coerce")

    w_df["date"] = w_df["date"].astype(str)
    w_df["hour"] = pd.to_numeric(w_df["hour"], errors="coerce")

    # Left merge to retain all power consumption records
    merged_df = pd.merge(p_df, w_df, on=["date", "hour"], how="left")

    merge_summary = {
        "power_rows_before": len(power_df),
        "scraped_rows": len(weather_df),
        "merged_rows": len(merged_df),
        "matched_rows": int(merged_df["scraped_temp"].notnull().sum()),
        "new_columns_added": [c for c in weather_df.columns if c not in ["date", "hour"]]
    }
    log_activity("MERGE_DATAFRAMES", f"Merged power and weather data ({merge_summary['matched_rows']} matched)")
    return merged_df, merge_summary
