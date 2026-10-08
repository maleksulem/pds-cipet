"""
Dataset Generator Script for Power Consumption Forecasting & Analytics.

Generates a realistic, offline dataset with:
- Hourly power consumption (kWh)
- Ambient temperature (°C)
- Lagged consumption (previous_consumption)
- Temporal features (date, time, hour, day, month, day_of_week)
- Deliberate minor anomalies (missing values, duplicates, outliers)
  for transparent data preprocessing demonstrations.
"""

import csv
import math
import random
from pathlib import Path

random.seed(42)

DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
CSV_PATH = DATA_DIR / "power_consumption.csv"

# Start date: Jan 1, 2026 for 15 days (360 hourly records)
DAYS = 15
HOURS_PER_DAY = 24

records = []
base_consumption = 200.0

prev_c = 195.0

day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

for d in range(1, DAYS + 1):
    day_of_week = (3 + d - 1) % 7  # 0=Monday, Jan 1 2026 is Thursday (day 3)
    day_name = day_names[day_of_week]
    is_weekend = 1 if day_of_week in [5, 6] else 0

    # Base ambient temperature seasonal variation
    base_temp = 16.0 + 3.0 * math.sin(d / 2.0)

    for h in range(HOURS_PER_DAY):
        date_str = f"2026-01-{d:02d}"
        time_str = f"{h:02d}:00:00"

        # Diurnal temperature cycle: coolest at 4am, warmest at 2pm (14:00)
        temp_cycle = 7.0 * math.sin((h - 8) * math.pi / 12.0)
        temperature = round(base_temp + temp_cycle + random.uniform(-0.8, 0.8), 1)

        # Diurnal consumption cycle:
        # Low at night (01:00 - 05:00)
        # Morning peak (08:00 - 11:00)
        # Evening peak (18:00 - 21:00)
        hour_factor = (
            -40.0 if h in [1, 2, 3, 4, 5]
            else 25.0 if h in [8, 9, 10, 11]
            else 10.0 if h in [12, 13, 14, 15, 16]
            else 45.0 if h in [18, 19, 20, 21]
            else 0.0
        )

        # Temperature effect: higher AC / cooling or heating
        temp_factor = 2.5 * max(0.0, temperature - 22.0) + 1.8 * max(0.0, 15.0 - temperature)

        # Weekend effect: slight industrial drop, higher residential morning
        weekend_factor = -15.0 if is_weekend else 0.0

        # Physical auto-regressive continuity with previous hour
        noise = random.uniform(-6.0, 6.0)
        consumption = round(
            0.65 * prev_c + 0.35 * (base_consumption + hour_factor + temp_factor + weekend_factor) + noise,
            2
        )

        records.append({
            "date": date_str,
            "time": time_str,
            "hour": h,
            "day": d,
            "month": 1,
            "day_of_week": day_of_week,
            "temperature": temperature,
            "previous_consumption": round(prev_c, 2),
            "consumption": consumption
        })

        prev_c = consumption

# 1. Missing values (e.g. at index 25 and index 80)
records[25]["temperature"] = ""  # Missing temperature
records[80]["consumption"] = ""  # Missing consumption

# 2. Duplicate rows (duplicate index 40 and 120 appended)
records.append(dict(records[40]))
records.append(dict(records[120]))

# 3. Extreme Outliers (sensor glitch spike: index 150 and 210)
records[150]["consumption"] = 999.00  # Extreme high spike
records[210]["consumption"] = 5.00    # Extreme low sensor drop

# Write to CSV
fieldnames = ["date", "time", "hour", "day", "month", "day_of_week", "temperature", "previous_consumption", "consumption"]
with open(CSV_PATH, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(records)

print(f"Generated {len(records)} sample records in {CSV_PATH}")
