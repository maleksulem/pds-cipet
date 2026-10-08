"""
Web Server for Power Consumption Forecasting and Analytics System.

Backend Architecture:
- 100% PURE PYTHON standard-library HTTP server (http.server.ThreadingHTTPServer)
- No Flask, no Django, no FastAPI, no Node.js
- Serves lightweight HTML5 / CSS3 web templates
- Provides JSON API routes for data processing, statistics, and ML predictions
- Binds to 0.0.0.0:3000 as required by the execution environment
"""

import json
import mimetypes
import urllib.parse
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from typing import Dict, Any

import config
from modules import data_loader
from modules import preprocessing
from modules import statistics_analysis
from modules import probability_analysis
from modules import forecasting
from modules import visualization
from modules import file_operations
from modules import database


class PowerAnalyticsHandler(BaseHTTPRequestHandler):
    """
    Standard library HTTP Request Handler routing HTML views,
    static assets, and RESTful analytical API requests.
    """

    def _set_headers(self, status_code: int = 200, content_type: str = "text/html; charset=utf-8"):
        """Sends HTTP status code and standard headers."""
        self.send_response(status_code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def _send_json(self, data: Dict[str, Any], status_code: int = 200):
        """Helper to serialize and transmit a JSON response."""
        json_bytes = json.dumps(data, indent=2).encode("utf-8")
        self._set_headers(status_code=status_code, content_type="application/json; charset=utf-8")
        self.wfile.write(json_bytes)

    def _serve_file(self, filepath: Path, content_type: str = None):
        """Streams a static asset or HTML file from disk."""
        if not filepath.exists() or not filepath.is_file():
            self._set_headers(404, "text/plain; charset=utf-8")
            self.wfile.write(b"404 Not Found: The requested resource does not exist.")
            return

        if not content_type:
            content_type, _ = mimetypes.guess_type(str(filepath))
            content_type = content_type or "application/octet-stream"

        try:
            with open(filepath, mode="rb") as f:
                content = f.read()
            self._set_headers(200, content_type)
            self.wfile.write(content)
        except Exception as e:
            self._set_headers(500, "text/plain; charset=utf-8")
            self.wfile.write(f"500 Internal Server Error: {e}".encode("utf-8"))

    def do_OPTIONS(self):
        """Handles CORS preflight requests."""
        self._set_headers(204)

    def do_GET(self):
        """Dispatches GET requests for HTML templates, static files, and APIs."""
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query_params = urllib.parse.parse_qs(parsed_url.query)

        # -------------------------------------------------------------
        # 1. HTML VIEW & CORE STATIC ASSET ROUTES
        # -------------------------------------------------------------
        if path == "/" or path == "/index.html":
            index_path = config.BASE_DIR / "index.html"
            if not index_path.exists():
                index_path = config.TEMPLATES_DIR / "index.html"
            return self._serve_file(index_path, "text/html; charset=utf-8")

        elif path == "/style.css":
            css_path = config.BASE_DIR / "style.css"
            if not css_path.exists():
                css_path = config.STATIC_DIR / "style.css"
            return self._serve_file(css_path, "text/css; charset=utf-8")

        elif path == "/app.js":
            js_path = config.BASE_DIR / "app.js"
            return self._serve_file(js_path, "application/javascript; charset=utf-8")

        elif path == "/data":
            return self._serve_file(config.TEMPLATES_DIR / "analysis.html")

        elif path == "/preprocessing":
            return self._serve_file(config.TEMPLATES_DIR / "preprocessing.html")

        elif path == "/statistics":
            return self._serve_file(config.TEMPLATES_DIR / "statistics.html")

        elif path == "/visualizations":
            return self._serve_file(config.TEMPLATES_DIR / "visualizations.html")

        elif path == "/forecast":
            return self._serve_file(config.TEMPLATES_DIR / "forecast.html")

        elif path == "/records":
            return self._serve_file(config.TEMPLATES_DIR / "records.html")

        # -------------------------------------------------------------
        # 2. STATIC ASSETS (/static/*)
        # -------------------------------------------------------------
        elif path.startswith("/static/"):
            relative_subpath = path[len("/static/"):]
            target_asset = config.STATIC_DIR / relative_subpath
            return self._serve_file(target_asset)

        # -------------------------------------------------------------
        # 3. ANALYTICAL JSON APIS
        # -------------------------------------------------------------
        elif path == "/api/dashboard-summary":
            try:
                df = data_loader.load_dataset()
                # Ensure model is trained
                model, metrics = forecasting.load_model_from_pickle()
                if not model or not metrics:
                    clean_df, _ = preprocessing.preprocess_data(df)
                    model, metrics = forecasting.train_forecasting_model(clean_df)

                summary = {
                    "success": True,
                    "total_records": len(df),
                    "average_consumption": round(float(df["consumption"].mean()), 2),
                    "min_consumption": round(float(df["consumption"].min()), 2),
                    "max_consumption": round(float(df["consumption"].max()), 2),
                    "model_r2": metrics.get("r2_score", 0.0),
                    "model_mae": metrics.get("mae", 0.0),
                    "model_rmse": metrics.get("rmse", 0.0),
                    "model_coefficients": metrics.get("coefficients", {})
                }
                return self._send_json(summary)
            except Exception as e:
                return self._send_json({"success": False, "error": str(e)}, status_code=500)

        elif path == "/api/data-inspection":
            try:
                df = data_loader.load_dataset()
                inspection = data_loader.inspect_dataset(df)
                inspection["success"] = True
                return self._send_json(inspection)
            except Exception as e:
                return self._send_json({"success": False, "error": str(e)}, status_code=500)

        elif path == "/api/preprocessing-summary":
            try:
                df = data_loader.load_dataset()
                clean_df, summary = preprocessing.preprocess_data(df)
                return self._send_json({
                    "success": True,
                    "summary": summary,
                    "clean_sample": clean_df.head(6).to_dict(orient="records")
                })
            except Exception as e:
                return self._send_json({"success": False, "error": str(e)}, status_code=500)

        elif path == "/api/statistics-summary":
            try:
                df = data_loader.load_dataset()
                clean_df, _ = preprocessing.preprocess_data(df)

                np_metrics = statistics_analysis.calculate_numpy_metrics(clean_df)
                sp_metrics = statistics_analysis.calculate_scipy_metrics(clean_df)
                pd_metrics = statistics_analysis.calculate_pandas_metrics(clean_df)
                prob_metrics = probability_analysis.calculate_probability_distribution(clean_df)
                samp_metrics = probability_analysis.perform_sampling_and_clt(clean_df)
                hypo_res = probability_analysis.perform_hypothesis_test(clean_df)

                return self._send_json({
                    "success": True,
                    "numpy_metrics": np_metrics,
                    "scipy_metrics": sp_metrics,
                    "pandas_metrics": pd_metrics,
                    "probability_metrics": prob_metrics,
                    "sampling_metrics": samp_metrics,
                    "hypothesis_test": hypo_res
                })
            except Exception as e:
                return self._send_json({"success": False, "error": str(e)}, status_code=500)

        elif path == "/api/records":
            try:
                date_filter = query_params.get("date", [""])[0]
                min_c = float(query_params.get("min", [""])[0]) if query_params.get("min", [""])[0] else None
                max_c = float(query_params.get("max", [""])[0]) if query_params.get("max", [""])[0] else None

                if date_filter or min_c is not None or max_c is not None:
                    records = file_operations.search_csv_records(date_filter, min_c, max_c)
                else:
                    records = file_operations.read_csv_records(limit=100)

                total_count = file_operations.get_csv_total_count()

                return self._send_json({
                    "success": True,
                    "total_records": total_count,
                    "returned_count": len(records),
                    "records": records
                })
            except Exception as e:
                return self._send_json({"success": False, "error": str(e)}, status_code=500)

        elif path == "/api/mysql-records":
            status = database.check_mysql_status()
            if status["connected"]:
                ok, recs, msg = database.read_power_records(limit=50)
                return self._send_json({
                    "connected": True,
                    "message": msg,
                    "database": status["database"],
                    "host": status["host"],
                    "records": recs
                })
            else:
                return self._send_json({
                    "connected": False,
                    "message": status["message"],
                    "database": status["database"],
                    "host": status["host"],
                    "records": []
                })

        elif path == "/api/activity-logs":
            logs = file_operations.read_activity_logs(limit=50)
            return self._send_json({"success": True, "logs": logs})

        elif path == "/api/scrape-weather":
            try:
                power_df = data_loader.load_dataset()
                weather_df = data_loader.scrape_weather_data()
                merged_df, summary = data_loader.merge_power_and_weather(power_df, weather_df)
                sample = merged_df[merged_df["scraped_temp"].notnull()].head(6).to_dict(orient="records")
                return self._send_json({
                    "success": True,
                    "summary": summary,
                    "sample": sample
                })
            except Exception as e:
                return self._send_json({"success": False, "error": str(e)}, status_code=500)

        else:
            self._set_headers(404, "text/plain; charset=utf-8")
            self.wfile.write(b"404 Not Found")

    def do_POST(self):
        """Handles POST requests for forecasts, CRUD inserts/deletions, and model training."""
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        # Read JSON body
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)
        payload = {}
        if post_data:
            try:
                payload = json.loads(post_data.decode("utf-8"))
            except Exception:
                payload = {}

        if path in ["/api/forecast", "/api/predict"]:
            try:
                hour = int(payload.get("hour", 14))
                day_of_week = int(payload.get("day_of_week", 3))
                month = int(payload.get("month", 1))
                temperature = float(payload.get("temperature", 25.0))
                previous_consumption = float(payload.get("previous_consumption", 200.0))

                result = forecasting.predict_power_consumption(
                    hour, day_of_week, month, temperature, previous_consumption
                )
                return self._send_json(result)
            except Exception as e:
                return self._send_json({"success": False, "error": str(e)}, status_code=400)

        elif path == "/api/records/add":
            try:
                success = file_operations.add_csv_record(
                    date=payload["date"],
                    time=payload["time"],
                    hour=int(payload["hour"]),
                    day=int(payload["day"]),
                    month=int(payload["month"]),
                    day_of_week=int(payload["day_of_week"]),
                    temperature=float(payload["temperature"]),
                    previous_consumption=float(payload["previous_consumption"]),
                    consumption=float(payload["consumption"])
                )
                return self._send_json({"success": success})
            except Exception as e:
                return self._send_json({"success": False, "error": str(e)}, status_code=400)

        elif path == "/api/records/delete":
            try:
                row_id = int(payload.get("row_id", -1))
                success = file_operations.delete_csv_record(row_id)
                return self._send_json({"success": success})
            except Exception as e:
                return self._send_json({"success": False, "error": str(e)}, status_code=400)

        elif path == "/api/train-model":
            try:
                df = data_loader.load_dataset()
                clean_df, _ = preprocessing.preprocess_data(df)
                model, metrics = forecasting.train_forecasting_model(clean_df)
                return self._send_json({"success": True, "metrics": metrics})
            except Exception as e:
                return self._send_json({"success": False, "error": str(e)}, status_code=500)

        elif path == "/api/generate-plots":
            try:
                df = data_loader.load_dataset()
                clean_df, _ = preprocessing.preprocess_data(df)
                plots = visualization.generate_all_plots(clean_df)
                return self._send_json({"success": True, "plots": plots})
            except Exception as e:
                return self._send_json({"success": False, "error": str(e)}, status_code=500)

        elif path == "/api/clear-logs":
            success = file_operations.clear_activity_logs()
            return self._send_json({"success": success})

        else:
            self._set_headers(404, "text/plain; charset=utf-8")
            self.wfile.write(b"404 Not Found")

    def log_message(self, format, *args):
        """Suppress noisy default request console logging for cleaner output."""
        return


def run_server(host: str = config.SERVER_HOST, port: int = config.SERVER_PORT):
    """
    Initializes and starts the ThreadingHTTPServer.
    """
    server_address = (host, port)
    httpd = ThreadingHTTPServer(server_address, PowerAnalyticsHandler)
    print("=" * 65)
    print("⚡ POWER CONSUMPTION FORECASTING & ANALYTICS SYSTEM ⚡")
    print("=" * 65)
    print(f"[*] Pure Python HTTP Server running at http://{host}:{port}/")
    print("[*] Web interface routes active:")
    print("    - Dashboard:          /")
    print("    - Data Inspection:    /data")
    print("    - Preprocessing:      /preprocessing")
    print("    - Statistics:         /statistics")
    print("    - Visualizations:     /visualizations")
    print("    - Load Forecast (ML): /forecast")
    print("    - CRUD Records:       /records")
    print("=" * 65)
    print("[*] Press Ctrl+C to terminate.")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server gracefully shutting down...")
        httpd.server_close()
        print("[*] Server stopped.")


if __name__ == "__main__":
    run_server()
