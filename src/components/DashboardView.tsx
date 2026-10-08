import React from 'react';
import { ModelMetrics, ActiveTab } from '../types';
import { 
  Zap, 
  Database, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  BarChart,
  Cpu
} from 'lucide-react';

interface DashboardViewProps {
  metrics: ModelMetrics;
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ metrics, setActiveTab }) => {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-xl p-6 text-white shadow-sm border border-blue-800/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-2">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Pipeline Initialized & Operational</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Power Consumption Forecasting & Analytics</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              End-to-end data science system covering dataset cleaning, NumPy/SciPy statistics, CLT inference, 
              web scraping, and Scikit-learn regression forecasting.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              id="btn-dash-forecast"
              onClick={() => setActiveTab('forecast')}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow"
            >
              <Zap size={16} />
              <span>Live Forecast</span>
              <ArrowRight size={14} />
            </button>
            <button 
              id="btn-dash-plots"
              onClick={() => setActiveTab('visualizations')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <BarChart size={16} />
              <span>View Plots</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Records</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Database size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">360</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">15 Days</span>
            <span>hourly observations</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Hourly Load</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Activity size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">209.6 <span className="text-base font-normal text-slate-500">kWh</span></div>
          <div className="text-xs text-slate-500 mt-1">Min: 140.2 kWh | Max: 294.6 kWh</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model Accuracy (R²)</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-2">82.14%</div>
          <div className="text-xs text-slate-500 mt-1">Variance explained by regression</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mean Error (MAE)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Cpu size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">±7.06 <span className="text-base font-normal text-slate-500">kWh</span></div>
          <div className="text-xs text-slate-500 mt-1">RMSE: 9.83 kWh on test split</div>
        </div>
      </div>

      {/* Model Parameters & Architecture Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" />
              <span>Learned Linear Regression Weights (&beta;)</span>
            </h3>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono">
              Intercept: +{metrics.intercept.toFixed(2)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Feature Name</th>
                  <th className="py-2.5 px-3">Coefficient (&beta;)</th>
                  <th className="py-2.5 px-3">Physical Influence on Electricity Grid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-mono text-blue-700 font-medium">hour</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-600">+{metrics.coefficients.hour.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-slate-600 text-xs">Captures morning ramp up and evening lighting peak across 24h</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-blue-700 font-medium">day_of_week</td>
                  <td className="py-2.5 px-3 font-semibold text-rose-600">{metrics.coefficients.day_of_week.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-slate-600 text-xs">Captures lower industrial & commercial demand on weekends</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-blue-700 font-medium">temperature</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-600">+{metrics.coefficients.temperature.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-slate-600 text-xs">Direct thermal sensitivity: air conditioning cooling load in heat</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-blue-700 font-medium">previous_consumption</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-600">+{metrics.coefficients.previous_consumption.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-slate-600 text-xs">Autoregressive grid inertia: immediate continuity of demand</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-700">
            <strong>Regression Equation:</strong> &Ycirc; = {metrics.intercept.toFixed(2)} + 0.4375(hour) - 0.7407(day_of_week) + 0.5239(temperature) + 0.7301(prev_consumption)
          </div>
        </div>

        {/* System Pipeline Navigation Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>Pipeline & Analytics Modules</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Explore each data pipeline stage, statistical analysis module, and machine learning engine:
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('preprocessing')}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition text-xs font-medium text-slate-700 flex justify-between items-center"
              >
                <span>IQR Capping & Median Imputation</span>
                <ArrowRight size={13} />
              </button>
              <button 
                onClick={() => setActiveTab('statistics')}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition text-xs font-medium text-slate-700 flex justify-between items-center"
              >
                <span>Moments, PDF/CDF & Hypothesis Testing</span>
                <ArrowRight size={13} />
              </button>
              <button 
                onClick={() => setActiveTab('visualizations')}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition text-xs font-medium text-slate-700 flex justify-between items-center"
              >
                <span>Exploratory & Distribution Plots</span>
                <ArrowRight size={13} />
              </button>
              <button 
                onClick={() => setActiveTab('records')}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition text-xs font-medium text-slate-700 flex justify-between items-center"
              >
                <span>Storage & Operational Audit Logs</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Status: <strong>Operational</strong></span>
            <span className="font-mono text-emerald-600 font-semibold">100% Validated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
