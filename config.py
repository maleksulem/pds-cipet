"""
Configuration module for Power Consumption Forecasting and Analytics System.

This module defines directory paths, database settings, and constant parameters
used across the application.
"""

from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
STATIC_DIR = BASE_DIR / "static"
PLOTS_DIR = STATIC_DIR / "plots"
TEMPLATES_DIR = BASE_DIR / "templates"
REPORTS_DIR = BASE_DIR / "reports"
DATABASE_DIR = BASE_DIR / "database"

# File paths
DATA_FILE = DATA_DIR / "power_consumption.csv"
SAMPLE_WEATHER_HTML = DATA_DIR / "sample_weather.html"
MODEL_FILE = MODELS_DIR / "power_model.pkl"
ACTIVITY_LOG_FILE = REPORTS_DIR / "activity_log.txt"
SCHEMA_FILE = DATABASE_DIR / "schema.sql"

# Server configuration (Port 3000 is required for external container routing)
SERVER_HOST = "0.0.0.0"
SERVER_PORT = 3000

# Machine Learning configuration
FEATURE_COLUMNS = ["hour", "day_of_week", "month", "temperature", "previous_consumption"]
TARGET_COLUMN = "consumption"
RANDOM_STATE = 42
TEST_SIZE = 0.2

# Hypothesis testing benchmark (national hourly benchmark in kWh)
BENCHMARK_CONSUMPTION = 250.0

# MySQL configuration defaults
# Set these to your local MySQL credentials when MySQL server is running
MYSQL_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "power_analytics_db",
    "port": 3306,
}
