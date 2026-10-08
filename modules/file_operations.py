"""
File Operations Module for Power Consumption Forecasting System.
- Practical 8: Text-file CRUD operations (Activity log create, read, update, delete)
- Practical 9: CSV-file CRUD operations (Power records add, display, search, update, delete)

Written with simple, transparent functions and clear error handling.
"""

import csv
import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional

import config


# =====================================================================
# 1. TEXT-FILE CRUD OPERATIONS (Practical 8)
# Demonstrates: Create, Read, Update (Append), Delete on text files
# =====================================================================

def log_activity(action: str, details: str = "") -> str:
    """
    CREATE / UPDATE (Append) text file operation.
    Appends a timestamped activity entry to reports/activity_log.txt.
    """
    config.REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"[{timestamp}] ACTION: {action} | DETAILS: {details}\n"

    try:
        with open(config.ACTIVITY_LOG_FILE, mode="a", encoding="utf-8") as f:
            f.write(entry)
        return f"Logged action: {action}"
    except Exception as e:
        return f"Error writing to activity log: {str(e)}"


def read_activity_logs(limit: int = 50) -> List[str]:
    """
    READ text file operation.
    Reads and returns the lines from reports/activity_log.txt in reverse order.
    """
    if not config.ACTIVITY_LOG_FILE.exists():
        return ["No activity logs recorded yet."]

    try:
        with open(config.ACTIVITY_LOG_FILE, mode="r", encoding="utf-8") as f:
            lines = [line.strip() for line in f.readlines() if line.strip()]
        # Return most recent first
        return lines[-limit:][::-1]
    except Exception as e:
        return [f"Error reading activity log: {str(e)}"]


def clear_activity_logs() -> bool:
    """
    DELETE text file operation.
    Clears the activity log file.
    """
    try:
        if config.ACTIVITY_LOG_FILE.exists():
            with open(config.ACTIVITY_LOG_FILE, mode="w", encoding="utf-8") as f:
                f.write(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Log reset.\n")
        return True
    except Exception:
        return False


# =====================================================================
# 2. CSV CRUD OPERATIONS (Practical 9)
# Demonstrates: Add, Display, Search, Update, Delete on CSV dataset
# =====================================================================

CSV_FIELDNAMES = [
    "date", "time", "hour", "day", "month", "day_of_week",
    "temperature", "previous_consumption", "consumption"
]


def read_csv_records(limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
    """
    DISPLAY / READ CSV operation.
    Reads records from data/power_consumption.csv.
    """
    if not config.DATA_FILE.exists():
        return []

    records = []
    with open(config.DATA_FILE, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            if idx >= offset and len(records) < limit:
                # Add row index for UI reference
                row["_row_id"] = idx
                records.append(row)
    return records


def get_csv_total_count() -> int:
    """Returns the total number of data rows in the CSV file."""
    if not config.DATA_FILE.exists():
        return 0
    with open(config.DATA_FILE, mode="r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader, None)
        return sum(1 for _ in reader)


def add_csv_record(date: str, time: str, hour: int, day: int, month: int,
                   day_of_week: int, temperature: float,
                   previous_consumption: float, consumption: float) -> bool:
    """
    ADD / CREATE CSV operation.
    Appends a new power consumption record to the CSV file.
    """
    config.DATA_DIR.mkdir(parents=True, exist_ok=True)
    file_exists = config.DATA_FILE.exists()

    new_row = {
        "date": str(date).strip(),
        "time": str(time).strip(),
        "hour": int(hour),
        "day": int(day),
        "month": int(month),
        "day_of_week": int(day_of_week),
        "temperature": round(float(temperature), 2),
        "previous_consumption": round(float(previous_consumption), 2),
        "consumption": round(float(consumption), 2)
    }

    with open(config.DATA_FILE, mode="a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDNAMES)
        if not file_exists:
            writer.writeheader()
        writer.writerow(new_row)

    log_activity("CSV_ADD_RECORD", f"Added record for date={date} hour={hour} consumption={consumption}")
    return True


def search_csv_records(query_date: str = "", min_consumption: Optional[float] = None,
                       max_consumption: Optional[float] = None) -> List[Dict[str, Any]]:
    """
    SEARCH CSV operation.
    Filters records by matching date string or consumption value range.
    """
    if not config.DATA_FILE.exists():
        return []

    results = []
    with open(config.DATA_FILE, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            match = True
            # Search by date substring
            if query_date and query_date not in row.get("date", ""):
                match = False

            # Search by consumption range
            try:
                c_val = float(row.get("consumption", 0))
                if min_consumption is not None and c_val < min_consumption:
                    match = False
                if max_consumption is not None and c_val > max_consumption:
                    match = False
            except (ValueError, TypeError):
                if min_consumption is not None or max_consumption is not None:
                    match = False

            if match:
                row["_row_id"] = idx
                results.append(row)
                if len(results) >= 100:  # Cap results for safety
                    break

    log_activity("CSV_SEARCH", f"Query date='{query_date}', range=[{min_consumption}, {max_consumption}], found={len(results)}")
    return results


def update_csv_record(row_id: int, updated_fields: Dict[str, Any]) -> bool:
    """
    UPDATE CSV operation.
    Modifies an existing record by row index in the CSV file.
    """
    if not config.DATA_FILE.exists():
        return False

    all_rows = []
    with open(config.DATA_FILE, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        all_rows = list(reader)

    if row_id < 0 or row_id >= len(all_rows):
        return False

    for key, val in updated_fields.items():
        if key in CSV_FIELDNAMES:
            all_rows[row_id][key] = str(val)

    with open(config.DATA_FILE, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDNAMES)
        writer.writeheader()
        writer.writerows(all_rows)

    log_activity("CSV_UPDATE_RECORD", f"Updated row_id={row_id}")
    return True


def delete_csv_record(row_id: int) -> bool:
    """
    DELETE CSV operation.
    Removes a record at the specified row index from the CSV file.
    """
    if not config.DATA_FILE.exists():
        return False

    all_rows = []
    with open(config.DATA_FILE, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        all_rows = list(reader)

    if row_id < 0 or row_id >= len(all_rows):
        return False

    deleted_row = all_rows.pop(row_id)

    with open(config.DATA_FILE, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDNAMES)
        writer.writeheader()
        writer.writerows(all_rows)

    log_activity("CSV_DELETE_RECORD", f"Deleted row_id={row_id}, date={deleted_row.get('date')}")
    return True
