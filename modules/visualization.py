"""
Visualization Module for Power Consumption Forecasting System.
- Practical 16: Matplotlib and Seaborn data visualization
- Practical 17: Univariate and Bivariate analysis
- Practical 18: Distribution curves
- Practical 19: Central Limit Theorem sampling distribution visualization

Generates clear, high-resolution scientific plots saved to static/plots/.
"""

from pathlib import Path
from typing import List, Dict, Any
import numpy as np
import pandas as pd

# Set headless backend before importing pyplot to prevent display errors
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

import config
from modules.file_operations import log_activity


def setup_plot_style():
    """Configures clean, consistent styling for all generated figures."""
    sns.set_theme(style="whitegrid")
    plt.rcParams.update({
        "font.size": 11,
        "axes.labelsize": 12,
        "axes.titlesize": 13,
        "xtick.labelsize": 10,
        "ytick.labelsize": 10,
        "figure.titlesize": 14,
        "figure.autolayout": True
    })


def generate_all_plots(df: pd.DataFrame) -> List[Dict[str, str]]:
    """
    Generates all required analytical visualizations and saves them to static/plots/:
    1. Time Series of Power Consumption
    2. Univariate Distribution (Histogram + KDE)
    3. Bivariate Relationship (Temperature vs. Consumption)
    4. Hourly Demand Profile
    5. Correlation Heatmap
    6. Central Limit Theorem (CLT) Sampling Distribution
    """
    config.PLOTS_DIR.mkdir(parents=True, exist_ok=True)
    setup_plot_style()

    plot_info = []

    # 1. TIME SERIES: Hourly Power Consumption
    p1 = config.PLOTS_DIR / "consumption_time_series.png"
    plt.figure(figsize=(10, 4.5))
    plt.plot(df.index, df["consumption"], color="#2563eb", linewidth=1.2, label="Power Consumption (kWh)")
    plt.title("Time Series Analysis: Historical Hourly Power Consumption", pad=12, fontweight="bold")
    plt.xlabel("Observation Timeline (Hourly Index)")
    plt.ylabel("Power Consumption (kWh)")
    plt.axhline(df["consumption"].mean(), color="#dc2626", linestyle="--", linewidth=1.5,
                label=f"Mean ({df['consumption'].mean():.1f} kWh)")
    plt.legend(loc="upper right")
    plt.savefig(p1, dpi=120)
    plt.close()
    plot_info.append({
        "filename": "consumption_time_series.png",
        "title": "Historical Power Consumption Timeline",
        "description": "Univariate time series illustrating cyclical peaks, baseline troughs, and continuous fluctuations across all hourly intervals."
    })

    # 2. UNIVARIATE ANALYSIS: Distribution with Histogram & KDE
    p2 = config.PLOTS_DIR / "consumption_distribution.png"
    plt.figure(figsize=(8, 4.5))
    mean_val = float(df["consumption"].mean())
    median_val = float(df["consumption"].median())
    sns.histplot(df["consumption"], kde=True, color="#0284c7", bins=25, edgecolor="black", alpha=0.6)
    plt.axvline(mean_val, color="#dc2626", linestyle="--", linewidth=1.8, label=f"Mean: {mean_val:.1f} kWh")
    plt.axvline(median_val, color="#16a34a", linestyle=":", linewidth=2.0, label=f"Median: {median_val:.1f} kWh")
    plt.title("Univariate Analysis: Power Consumption Distribution", pad=12, fontweight="bold")
    plt.xlabel("Power Consumption (kWh)")
    plt.ylabel("Frequency (Hour Count)")
    plt.legend()
    plt.savefig(p2, dpi=120)
    plt.close()
    plot_info.append({
        "filename": "consumption_distribution.png",
        "title": "Consumption Frequency Distribution (Univariate)",
        "description": "Histogram and Kernel Density Estimate (KDE) demonstrating central tendency (mean and median) and dispersion of energy demand."
    })

    # 3. BIVARIATE ANALYSIS: Temperature vs Consumption Scatter with Regression Line
    p3 = config.PLOTS_DIR / "temperature_vs_consumption.png"
    plt.figure(figsize=(8, 4.5))
    sns.regplot(
        data=df, x="temperature", y="consumption",
        scatter_kws={"alpha": 0.5, "color": "#0d9488", "s": 35},
        line_kws={"color": "#b91c1c", "linewidth": 2.0}
    )
    plt.title("Bivariate Analysis: Ambient Temperature vs. Power Consumption", pad=12, fontweight="bold")
    plt.xlabel("Ambient Temperature (°C)")
    plt.ylabel("Power Consumption (kWh)")
    plt.savefig(p3, dpi=120)
    plt.close()
    plot_info.append({
        "filename": "temperature_vs_consumption.png",
        "title": "Temperature vs. Power Demand (Bivariate)",
        "description": "Scatter plot with fitted linear regression trend line indicating the positive correlation between warmer temperatures and electrical load."
    })

    # 4. HOURLY LOAD PROFILE: Average Consumption by Hour
    p4 = config.PLOTS_DIR / "hourly_consumption_pattern.png"
    plt.figure(figsize=(9, 4.5))
    hourly_avg = df.groupby("hour")["consumption"].mean().reset_index()
    palette = ["#93c5fd" if (h < 7 or h > 22) else "#2563eb" if (18 <= h <= 21) else "#60a5fa" for h in hourly_avg["hour"]]
    bars = plt.bar(hourly_avg["hour"], hourly_avg["consumption"], color=palette, edgecolor="#1e40af")
    plt.title("Diurnal Pattern: Average Power Consumption by Hour of Day", pad=12, fontweight="bold")
    plt.xlabel("Hour of the Day (0 to 23)")
    plt.ylabel("Average Consumption (kWh)")
    plt.xticks(range(0, 24))
    plt.grid(axis="y", linestyle="--", alpha=0.7)
    plt.savefig(p4, dpi=120)
    plt.close()
    plot_info.append({
        "filename": "hourly_consumption_pattern.png",
        "title": "Hourly Consumption Profile (24-Hour Cycle)",
        "description": "Bar chart highlighting morning baseline, afternoon steady state, and darker blue evening peak demand periods (18:00–21:00)."
    })

    # 5. CORRELATION HEATMAP
    p5 = config.PLOTS_DIR / "correlation_heatmap.png"
    plt.figure(figsize=(7, 5))
    num_cols = ["hour", "temperature", "previous_consumption", "consumption"]
    corr_matrix = df[num_cols].corr()
    sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", vmin=-1, vmax=1, fmt=".2f", linewidths=0.8, cbar_kws={"shrink": 0.8})
    plt.title("Correlation Matrix of Numerical Features", pad=12, fontweight="bold")
    plt.savefig(p5, dpi=120)
    plt.close()
    plot_info.append({
        "filename": "correlation_heatmap.png",
        "title": "Feature Correlation Heatmap",
        "description": "Seaborn heatmap visualizing pairwise Pearson correlation coefficients between features and the target variable."
    })

    # 6. CENTRAL LIMIT THEOREM (CLT) SAMPLING DISTRIBUTION
    p6 = config.PLOTS_DIR / "clt_sampling_distribution.png"
    plt.figure(figsize=(8, 4.5))
    pop_arr = df["consumption"].dropna().values
    sub_means = [float(np.mean(np.random.choice(pop_arr, size=30, replace=True))) for _ in range(500)]
    sns.histplot(sub_means, kde=True, color="#7c3aed", bins=25, edgecolor="black", alpha=0.6)
    plt.axvline(np.mean(sub_means), color="#dc2626", linestyle="--", linewidth=1.8,
                label=f"Mean of Means: {np.mean(sub_means):.1f} kWh")
    plt.title("Central Limit Theorem: Distribution of 500 Sample Means (n=30)", pad=12, fontweight="bold")
    plt.xlabel("Sample Mean Consumption (kWh)")
    plt.ylabel("Frequency")
    plt.legend()
    plt.savefig(p6, dpi=120)
    plt.close()
    plot_info.append({
        "filename": "clt_sampling_distribution.png",
        "title": "Central Limit Theorem Sampling Bell Curve",
        "description": "Empirical demonstration showing that the distribution of sample means follows a Gaussian normal curve as predicted by CLT."
    })

    log_activity("PLOTS_GENERATED", f"Generated {len(plot_info)} analytical plots in {config.PLOTS_DIR}")
    return plot_info
