"""
Main Application Entry Point for Power Consumption Forecasting System.

Workflow orchestrated by main.py:
1. Data verification (ensures data/power_consumption.csv exists)
2. Data preprocessing & cleaning (imputation, duplicate removal, IQR outlier capping)
3. Model training & serialization (trains Scikit-learn model, saves to models/power_model.pkl)
4. Visualization engine (generates all 6 static analytical plots to static/plots/)
5. Boots pure Python HTTP server on port 3000 (0.0.0.0:3000)

Usage:
    python main.py             # Full initialization & starts web server
    python main.py --train     # Train model and generate plots only
    python main.py --server    # Start server directly
"""

import sys
import argparse
from pathlib import Path

import config
from modules import data_loader
from modules import preprocessing
from modules import forecasting
from modules import visualization
from modules import statistics_analysis
from modules import file_operations


def initialize_project_pipeline():
    """
    Executes the initial data and ML preparation steps before web server launch.
    """
    print("\n[Step 1/4] Checking power consumption dataset...")
    if not config.DATA_FILE.exists():
        print("Dataset not found. Generating sample power consumption dataset...")
        import generate_dataset  # will generate dataset
    
    df = data_loader.load_dataset()
    print(f"Loaded raw dataset with {len(df)} records and {len(df.columns)} columns.")

    print("\n[Step 2/4] Executing preprocessing & data cleaning pipeline...")
    clean_df, prep_summary = preprocessing.preprocess_data(df)
    print(f"Cleaned records: {prep_summary['final_clean_records']} "
          f"(imputed: {prep_summary['missing_values_imputed']}, "
          f"duplicates removed: {prep_summary['duplicates_removed']}, "
          f"outliers treated: {prep_summary['outliers_detected']})")

    print("\n[Step 3/4] Training Scikit-learn Linear Regression model...")
    model, metrics = forecasting.train_forecasting_model(clean_df)
    print(f"Model trained and serialized to {config.MODEL_FILE.name}")
    print(f"Evaluation Metrics: R² = {metrics['r2_score']:.4f} "
          f"({metrics['accuracy_percentage']}%), MAE = {metrics['mae']:.2f} kWh, "
          f"RMSE = {metrics['rmse']:.2f} kWh")

    print("\n[Step 4/4] Generating Matplotlib & Seaborn analytical visualizations...")
    plots = visualization.generate_all_plots(clean_df)
    print(f"Generated {len(plots)} scientific figures in {config.PLOTS_DIR}/")

    file_operations.log_activity("SYSTEM_INITIALIZED", "Pipeline executed and server prepared.")
    print("\n[✓] System pipeline initialization complete!")
    return clean_df


def main():
    parser = argparse.ArgumentParser(description="Power Consumption Forecasting & Analytics System")
    parser.add_argument("--train", action="store_true", help="Train model and render plots without launching server")
    parser.add_argument("--server", action="store_true", help="Launch server without regenerating plots")
    parser.add_argument("--port", type=int, default=config.SERVER_PORT, help="Port to bind server (default: 3000)")
    args = parser.parse_args()

    if args.train:
        initialize_project_pipeline()
        print("\nModel trained and plots generated successfully. Exiting (--train flag passed).")
        return

    # Default flow: initialize and start server
    if not args.server:
        initialize_project_pipeline()

    from server import run_server
    run_server(host=config.SERVER_HOST, port=args.port)


if __name__ == "__main__":
    main()
