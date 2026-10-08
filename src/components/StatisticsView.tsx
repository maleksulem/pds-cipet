import React, { useState } from 'react';
import { BarChart2, Activity, CheckCircle, HelpCircle } from 'lucide-react';

export const StatisticsView: React.FC = () => {
  const [calcKwh, setCalcKwh] = useState(250);

  // Normal Distribution metrics
  const mu = 209.6;
  const sigma = 38.4;

  // Simple PDF calculation
  const z = (calcKwh - mu) / sigma;
  const pdfVal = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
  
  // Approximate standard normal CDF using error function approximation
  const erf = (x: number) => {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return sign * y;
  };
  const cdfVal = 0.5 * (1 + erf(z / Math.sqrt(2)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Statistical Analysis & Inferential Testing</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Parametric distributions, moment estimations, normal PDF/CDF modeling, Central Limit Theorem simulation, and hypothesis testing.
        </p>
      </div>

      {/* NumPy & SciPy Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">Mean Consumption (&mu;)</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">209.6 <span className="text-xs font-normal text-slate-500">kWh</span></div>
          <div className="text-xs text-slate-500 mt-0.5">Standard Deviation: &sigma; = 38.4 kWh</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">SciPy Skewness</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">+0.284</div>
          <div className="text-xs text-slate-500 mt-0.5">Slight right skew from evening peak</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">SciPy Kurtosis</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">-0.412</div>
          <div className="text-xs text-slate-500 mt-0.5">Platykurtic (flatter shoulders)</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">Standard Error (SEM)</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">2.02 <span className="text-xs font-normal text-slate-500">kWh</span></div>
          <div className="text-xs text-slate-500 mt-0.5">&sigma; / &radic;n (sample precision)</div>
        </div>
      </div>

      {/* Normal Distribution PDF & CDF Live Calculator */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Activity size={18} className="text-blue-600" />
          <span>Normal Distribution Probability Calculator</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Gaussian model fitted to historical consumption with &mu; = 209.6 kWh and &sigma; = 38.4 kWh.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Consumption Threshold (x):
            </label>
            <input
              type="range"
              min="140"
              max="300"
              value={calcKwh}
              onChange={(e) => setCalcKwh(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center font-bold text-lg text-blue-700 mt-1">{calcKwh} kWh</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div className="text-slate-500 font-semibold uppercase">PDF: f({calcKwh})</div>
            <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{pdfVal.toFixed(5)}</div>
            <div className="text-slate-500 mt-1">Relative likelihood density at this exact point</div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs">
            <div className="text-blue-700 font-semibold uppercase">CDF: P(X &le; {calcKwh})</div>
            <div className="text-lg font-bold text-blue-900 font-mono mt-0.5">{(cdfVal * 100).toFixed(1)}%</div>
            <div className="text-blue-600 mt-1">Probability consumption does not exceed {calcKwh} kWh</div>
          </div>
        </div>
      </div>

      {/* Central Limit Theorem & 95% Confidence Interval */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h3 className="text-base font-bold text-slate-900 mb-2">95% Confidence Interval (Population Mean)</h3>
          <p className="text-xs text-slate-500 mb-3">
            Using Student's t-distribution for n = 360 observations:
          </p>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
            <div className="text-xs font-semibold text-emerald-800 uppercase">95% Population Mean Interval</div>
            <div className="text-xl font-bold text-emerald-950 mt-1 font-mono">
              [205.62 kWh &mdash; 213.58 kWh]
            </div>
            <div className="text-xs text-emerald-700 mt-1">
              Margin of Error: &plusmn;3.98 kWh (t<sub>crit</sub> = 1.966)
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            <strong>Interpretation:</strong> We are 95% confident that the true population mean hourly electricity load of this grid lies between 205.62 kWh and 213.58 kWh.
          </p>
        </div>

        {/* One-Sample Student's t-Test */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h3 className="text-base font-bold text-slate-900 mb-2">One-Sample Hypothesis Test (t-Test)</h3>
          <div className="space-y-2 text-xs text-slate-600 mb-3">
            <div><strong>H<sub>0</sub> (Null):</strong> &mu; = 250.0 kWh (Equals regional grid baseline)</div>
            <div><strong>H<sub>1</sub> (Alternative):</strong> &mu; &ne; 250.0 kWh (Significantly differs)</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono mb-3">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500">t-statistic:</span>
              <div className="font-bold text-slate-800 text-sm mt-0.5">-19.96</div>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500">p-value:</span>
              <div className="font-bold text-rose-600 text-sm mt-0.5">2.31 &times; 10<sup>-62</sup></div>
            </div>
          </div>
          <div className="p-2.5 bg-rose-50 rounded border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <CheckCircle size={16} className="text-rose-600 shrink-0" />
            <div>
              <strong>Conclusion:</strong> Reject H<sub>0</sub> (p &lt; 0.05). Power consumption is statistically significantly lower than 250 kWh.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
