"""
Probability and Inference Module for Power Consumption Forecasting System.
- Practical 18: Normal distribution, Probability Density Function (PDF) and Cumulative Distribution Function (CDF)
- Practical 19: Sampling, 95% Confidence Interval, and Central Limit Theorem (CLT)
- Practical 20: Hypothesis testing using One-Sample t-Test

Provides probability modeling and inferential statistics using scipy.stats.
"""

from typing import Dict, Any, List, Optional
import numpy as np
import pandas as pd
from scipy import stats

import config
from modules.file_operations import log_activity


# =====================================================================
# PROBABILITY & NORMAL DISTRIBUTION (Practical 18)
# Demonstrates: PDF, CDF, tail probability on consumption
# =====================================================================

def calculate_probability_distribution(df: pd.DataFrame, test_value: Optional[float] = None) -> Dict[str, Any]:
    """
    Fits a normal distribution N(mu, sigma^2) to the consumption data:
    - Calculates PDF at test_value (default: mean consumption)
    - Calculates CDF: P(X <= test_value)
    - Calculates Tail Probability: P(X > test_value) = 1 - CDF
    """
    arr = df["consumption"].dropna().values
    mu = float(np.mean(arr))
    sigma = float(np.std(arr, ddof=1))

    # Evaluate at benchmark or median if test_value is None
    eval_val = float(test_value) if test_value is not None else round(mu + 0.5 * sigma, 1)

    # Scipy Normal PDF & CDF
    pdf_val = float(stats.norm.pdf(eval_val, loc=mu, scale=sigma))
    cdf_val = float(stats.norm.cdf(eval_val, loc=mu, scale=sigma))
    tail_prob = float(1.0 - cdf_val)

    prob_metrics = {
        "fitted_mean_mu": round(mu, 2),
        "fitted_std_sigma": round(sigma, 2),
        "evaluated_value": round(eval_val, 2),
        "pdf_density": round(pdf_val, 6),
        "cdf_probability_less_than_x": round(cdf_val, 4),
        "cdf_percentage_less": round(cdf_val * 100.0, 2),
        "probability_exceeds_threshold": round(tail_prob, 4),
        "percentage_exceeds_threshold": round(tail_prob * 100.0, 2),
        "explanation": (
            f"Assuming power consumption follows a Normal Distribution N({round(mu, 1)}, {round(sigma, 1)}^2), "
            f"the probability that any random hour consumes MORE than {eval_val} kWh is "
            f"{round(tail_prob * 100.0, 2)}%."
        )
    }
    return prob_metrics


# =====================================================================
# SAMPLING, CONFIDENCE INTERVAL & CLT (Practical 19)
# Demonstrates: Random sampling, 95% Confidence Interval, CLT simulation
# =====================================================================

def perform_sampling_and_clt(df: pd.DataFrame, sample_size: int = 50,
                             num_simulations: int = 500) -> Dict[str, Any]:
    """
    Demonstrates:
    1. Drawing a random sample from population and calculating sample mean
    2. 95% Confidence Interval for the population mean
    3. Central Limit Theorem (CLT) simulation: repeated sampling showing
       distribution of sample means converges to normal.
    """
    pop_arr = df["consumption"].dropna().values
    pop_mean = float(np.mean(pop_arr))
    pop_std = float(np.std(pop_arr, ddof=1))

    # 1. Random sample
    n = min(sample_size, len(pop_arr))
    sample = np.random.choice(pop_arr, size=n, replace=False)
    sample_mean = float(np.mean(sample))
    sample_std = float(np.std(sample, ddof=1))
    sample_sem = float(stats.sem(sample))

    # 2. 95% Confidence Interval using Student's t distribution
    ci_low, ci_high = stats.t.interval(0.95, df=n - 1, loc=sample_mean, scale=sample_sem)

    # 3. Central Limit Theorem (CLT) Simulation
    sim_means = []
    sub_size = 30
    for _ in range(num_simulations):
        sub_sample = np.random.choice(pop_arr, size=sub_size, replace=True)
        sim_means.append(float(np.mean(sub_sample)))

    clt_mean = float(np.mean(sim_means))
    clt_std = float(np.std(sim_means, ddof=1))
    theoretical_se = pop_std / np.sqrt(sub_size)

    sampling_results = {
        "population_size": len(pop_arr),
        "population_mean": round(pop_mean, 2),
        "population_std": round(pop_std, 2),
        "sample_size": n,
        "sample_mean": round(sample_mean, 2),
        "sample_std": round(sample_std, 2),
        "standard_error_of_mean": round(sample_sem, 3),
        "ci_95_lower": round(float(ci_low), 2),
        "ci_95_upper": round(float(ci_high), 2),
        "ci_margin_of_error": round(float(sample_mean - ci_low), 2),
        "clt_simulation": {
            "num_samples_drawn": num_simulations,
            "sample_size_per_draw": sub_size,
            "simulated_mean_of_means": round(clt_mean, 2),
            "simulated_std_of_means": round(clt_std, 3),
            "theoretical_standard_error": round(float(theoretical_se), 3),
            "clt_verified": abs(clt_mean - pop_mean) < 2.0
        },
        "interpretation": (
            f"We are 95% confident that the true average hourly power consumption lies "
            f"between {round(float(ci_low), 2)} kWh and {round(float(ci_high), 2)} kWh."
        )
    }
    return sampling_results


# =====================================================================
# HYPOTHESIS TESTING: ONE-SAMPLE T-TEST (Practical 20)
# Demonstrates: H0, H1, t-statistic, p-value, alpha, and decision
# =====================================================================

def perform_hypothesis_test(df: pd.DataFrame,
                            benchmark: float = config.BENCHMARK_CONSUMPTION,
                            alpha: float = 0.05) -> Dict[str, Any]:
    """
    Executes a One-Sample Two-Tailed Student's t-test:
    Null Hypothesis H0: The population mean consumption is equal to benchmark (mu == benchmark).
    Alternative Hypothesis H1: The population mean consumption is not equal to benchmark (mu != benchmark).
    """
    arr = df["consumption"].dropna().values
    n = len(arr)
    mean_val = float(np.mean(arr))
    std_val = float(np.std(arr, ddof=1))

    # scipy.stats one sample t-test
    t_stat, p_val = stats.ttest_1samp(arr, popmean=benchmark)

    t_stat = float(t_stat)
    p_val = float(p_val)

    reject_null = p_val < alpha
    decision = "Reject the Null Hypothesis (H0)" if reject_null else "Fail to Reject the Null Hypothesis (H0)"

    if reject_null:
        explanation = (
            f"Since the p-value ({p_val:.5f}) is less than the significance level alpha ({alpha}), "
            f"we reject H0. There is statistically significant evidence that the average power "
            f"consumption ({mean_val:.2f} kWh) is significantly different from the benchmark ({benchmark} kWh)."
        )
    else:
        explanation = (
            f"Since the p-value ({p_val:.5f}) is greater than or equal to alpha ({alpha}), "
            f"we fail to reject H0. There is insufficient statistical evidence to claim that the average "
            f"power consumption ({mean_val:.2f} kWh) differs from the benchmark ({benchmark} kWh)."
        )

    test_result = {
        "null_hypothesis_h0": f"Average hourly power consumption is equal to {benchmark} kWh (mu = {benchmark})",
        "alternative_hypothesis_h1": f"Average hourly power consumption is not equal to {benchmark} kWh (mu != {benchmark})",
        "benchmark_value": benchmark,
        "sample_mean": round(mean_val, 2),
        "sample_std": round(std_val, 2),
        "sample_size": n,
        "degrees_of_freedom": n - 1,
        "significance_level_alpha": alpha,
        "t_statistic": round(t_stat, 4),
        "p_value": round(p_val, 6),
        "decision": decision,
        "reject_h0": reject_null,
        "explanation": explanation
    }

    log_activity(
        "HYPOTHESIS_TEST_COMPLETED",
        f"Benchmark={benchmark}, t={t_stat:.2f}, p={p_val:.5f}, Decision={decision}"
    )

    return test_result
