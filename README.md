# Power Consumption Forecasting and Analytics System

A production-grade power consumption forecasting and analytics system providing telemetry data cleaning, statistical modeling, probability distributions, hypothesis testing, visualization, and machine learning load prediction.

---

## ⚡ System Capabilities

- **Data Ingestion & Inspection:** Loads historical power load logs and inspects attributes, nulls, and schema characteristics.
- **Data Cleaning & Preprocessing:** Handles missing values via median imputation, removes duplicates, and caps outliers via the Interquartile Range (IQR).
- **Descriptive & Inferential Statistics:** Computes total load, percentiles, moments (skewness, kurtosis), normal distribution fitting, 95% Confidence Intervals, and One-Sample Student's t-tests.
- **Central Limit Theorem Simulation:** Empirically demonstrates the convergence of 500 sample means into a Gaussian distribution.
- **Web Scraping & Enrichment:** Parses external meteorological records from HTML tables using BeautifulSoup4 and merges them with load records.
- **Machine Learning Forecasting:** Fits an interpretable Scikit-learn Linear Regression model ($R^2 \approx 82\%$, MAE $\approx 7.0$ kWh), serialized with Python's built-in `pickle` module.
- **Persistent Storage Operations:** Search, add, and delete records on CSV, manage MySQL relational operations via PyMySQL, and maintain persistent activity logs.

---

## 🚀 Quick Start & How to Run

### 1. Requirements
Ensure dependencies are installed:
```bash
pip install -r requirements.txt
```
*(Dependencies: numpy, pandas, scipy, matplotlib, seaborn, scikit-learn, beautifulsoup4, openpyxl, pymysql)*

### 2. Run the Full Pipeline
```bash
python main.py
```
This automatically:
1. Verifies the dataset (`data/power_consumption.csv`).
2. Cleans data and caps outliers.
3. Trains the Scikit-learn Linear Regression model and serializes it to `models/power_model.pkl`.
4. Renders 6 scientific plots into `static/plots/`.
5. Starts the web server on `http://localhost:3000/`.

---

## 🧭 Navigation & Web Interface
- **Dashboard:** Summary cards, dataset KPIs, model evaluation metrics, and feature coefficients.
- **Data Inspection:** Head inspection, column datatypes, null counts, duplicate checks, and BeautifulSoup scraping demo.
- **Preprocessing:** Missing value imputation, IQR outlier capping metrics, and feature engineering.
- **Statistics & Inference:** NumPy percentiles, SciPy moments, normal PDF/CDF, 95% Confidence Interval, CLT simulation, and t-test.
- **Visualizations:** Gallery of 6 Matplotlib/Seaborn plots with an interactive "Regenerate All Plots" engine.
- **ML Forecast:** Interactive forecasting form predicting hourly power demand from temperature and temporal inputs.
- **Records & Storage:** CSV search/add/delete, MySQL relational status, and audit log viewing.
