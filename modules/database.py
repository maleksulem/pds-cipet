"""
Database Operations Module for Power Consumption Forecasting System.
- Practical 10: MySQL CRUD operations (CREATE, READ, UPDATE, DELETE)

Uses PyMySQL (or mysql.connector) to interact with a MySQL database.
Implements graceful fallback and transparent error reporting so the
application never crashes if a MySQL service is not currently running locally.
"""

from typing import List, Dict, Any, Optional, Tuple
import config
from modules.file_operations import log_activity


def get_mysql_connection():
    """
    Attempts to establish a connection to the MySQL database using PyMySQL.
    Returns the connection object if successful, or raises an informative Exception.
    """
    try:
        import pymysql
        conn = pymysql.connect(
            host=config.MYSQL_CONFIG["host"],
            user=config.MYSQL_CONFIG["user"],
            password=config.MYSQL_CONFIG["password"],
            database=config.MYSQL_CONFIG["database"],
            port=config.MYSQL_CONFIG["port"],
            cursorclass=pymysql.cursors.DictCursor,
            connect_timeout=3
        )
        return conn
    except ImportError:
        try:
            import mysql.connector
            conn = mysql.connector.connect(
                host=config.MYSQL_CONFIG["host"],
                user=config.MYSQL_CONFIG["user"],
                password=config.MYSQL_CONFIG["password"],
                database=config.MYSQL_CONFIG["database"],
                port=config.MYSQL_CONFIG["port"],
                connection_timeout=3
            )
            return conn
        except ImportError:
            raise RuntimeError("Neither 'pymysql' nor 'mysql-connector-python' is installed.")
    except Exception as err:
        raise ConnectionError(
            f"MySQL Connection Error: Unable to connect to MySQL server at {config.MYSQL_CONFIG['host']}:{config.MYSQL_CONFIG['port']}. "
            f"Ensure MySQL is running and database '{config.MYSQL_CONFIG['database']}' exists. Details: {err}"
        )


def check_mysql_status() -> Dict[str, Any]:
    """
    Checks if the MySQL database is reachable and configured.
    Returns a dictionary describing the connection status.
    """
    try:
        conn = get_mysql_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1 AS test;")
            result = cursor.fetchone()
        conn.close()
        return {
            "connected": True,
            "message": "Connected to MySQL server successfully.",
            "database": config.MYSQL_CONFIG["database"],
            "host": config.MYSQL_CONFIG["host"]
        }
    except Exception as e:
        return {
            "connected": False,
            "message": str(e),
            "database": config.MYSQL_CONFIG["database"],
            "host": config.MYSQL_CONFIG["host"]
        }


def initialize_mysql_table() -> Tuple[bool, str]:
    """
    Executes the DDL statements in database/schema.sql to create database and table.
    """
    try:
        # Connect without database first to create database if not exists
        import pymysql
        conn = pymysql.connect(
            host=config.MYSQL_CONFIG["host"],
            user=config.MYSQL_CONFIG["user"],
            password=config.MYSQL_CONFIG["password"],
            port=config.MYSQL_CONFIG["port"],
            connect_timeout=3
        )
        with conn.cursor() as cursor:
            if config.SCHEMA_FILE.exists():
                with open(config.SCHEMA_FILE, mode="r", encoding="utf-8") as f:
                    sql_commands = f.read().split(";")
                    for cmd in sql_commands:
                        clean_cmd = cmd.strip()
                        if clean_cmd:
                            cursor.execute(clean_cmd)
                conn.commit()
        conn.close()
        log_activity("MYSQL_INIT", "Database and power_records table initialized.")
        return True, "MySQL database initialized from schema.sql successfully."
    except Exception as e:
        return False, f"Failed to initialize MySQL schema: {e}"


def insert_power_record(record_date: str, record_time: str, hour: int,
                        temperature: float, previous_consumption: float,
                        consumption: float) -> Tuple[bool, str]:
    """
    CREATE operation in MySQL.
    Inserts a new power consumption record into power_records table.
    """
    try:
        conn = get_mysql_connection()
        query = """
            INSERT INTO power_records 
            (record_date, record_time, hour, temperature, previous_consumption, consumption)
            VALUES (%s, %s, %s, %s, %s, %s);
        """
        with conn.cursor() as cursor:
            cursor.execute(query, (record_date, record_time, hour, temperature, previous_consumption, consumption))
            conn.commit()
            new_id = cursor.lastrowid
        conn.close()
        log_activity("MYSQL_CREATE", f"Inserted record id={new_id} date={record_date} consumption={consumption}")
        return True, f"Record inserted successfully with ID {new_id}."
    except Exception as e:
        return False, f"MySQL Insert Error: {e}"


def read_power_records(limit: int = 50) -> Tuple[bool, List[Dict[str, Any]], str]:
    """
    READ operation in MySQL.
    Fetches the most recent power consumption records.
    """
    try:
        conn = get_mysql_connection()
        query = "SELECT * FROM power_records ORDER BY id DESC LIMIT %s;"
        with conn.cursor() as cursor:
            cursor.execute(query, (limit,))
            records = cursor.fetchall()
        conn.close()
        return True, records, "Records fetched successfully."
    except Exception as e:
        return False, [], f"MySQL Read Error: {e}"


def update_power_record(record_id: int, temperature: float,
                        previous_consumption: float, consumption: float) -> Tuple[bool, str]:
    """
    UPDATE operation in MySQL.
    Updates temperature, previous_consumption, and consumption for a specific ID.
    """
    try:
        conn = get_mysql_connection()
        query = """
            UPDATE power_records 
            SET temperature = %s, previous_consumption = %s, consumption = %s
            WHERE id = %s;
        """
        with conn.cursor() as cursor:
            cursor.execute(query, (temperature, previous_consumption, consumption, record_id))
            conn.commit()
            affected = cursor.rowcount
        conn.close()
        log_activity("MYSQL_UPDATE", f"Updated record id={record_id}, rows_affected={affected}")
        if affected > 0:
            return True, f"Record ID {record_id} updated successfully."
        else:
            return False, f"No record found with ID {record_id}."
    except Exception as e:
        return False, f"MySQL Update Error: {e}"


def delete_power_record(record_id: int) -> Tuple[bool, str]:
    """
    DELETE operation in MySQL.
    Deletes a power consumption record by ID.
    """
    try:
        conn = get_mysql_connection()
        query = "DELETE FROM power_records WHERE id = %s;"
        with conn.cursor() as cursor:
            cursor.execute(query, (record_id,))
            conn.commit()
            affected = cursor.rowcount
        conn.close()
        log_activity("MYSQL_DELETE", f"Deleted record id={record_id}, rows_affected={affected}")
        if affected > 0:
            return True, f"Record ID {record_id} deleted successfully."
        else:
            return False, f"No record found with ID {record_id}."
    except Exception as e:
        return False, f"MySQL Delete Error: {e}"
