import React, { useState } from 'react';
import { ModelMetrics } from '../types';
import { Zap, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ForecastViewProps {
  metrics: ModelMetrics;
}

export const ForecastView: React.FC<ForecastViewProps> = ({ metrics }) => {
  const [hour, setHour] = useState(14);
  const [dayOfWeek, setDayOfWeek] = useState(3);
  const [temperature, setTemperature] = useState(28.5);
  const [prevConsumption, setPrevConsumption] = useState(215.0);

  // Compute live prediction from trained linear model weights
  const { intercept, coefficients } = metrics;
  const predictedKwh = Math.max(
    50,
    intercept +
      coefficients.hour * hour +
      coefficients.day_of_week * dayOfWeek +
      coefficients.temperature * temperature +
      coefficients.previous_consumption * prevConsumption
  );

  const getDemandStatus = (kwh: number) => {
    if (kwh > 260) {
      return { label: 'High Peak Demand Alert', color: 'bg-rose-500 text-white', note: 'Higher risk of grid stress. Additional peaking generation required.' };
    }
    if (kwh < 170) {
      return { label: 'Low Off-Peak Baseline', color: 'bg-blue-600 text-white', note: 'Nominal baseload operational regime.' };
    }
    return { label: 'Nominal Load Regime', color: 'bg-emerald-600 text-white', note: 'Standard operating load well within grid capacity margin.' };
  };

  const status = getDemandStatus(predictedKwh);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Machine Learning Load Forecasting</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Multiple Linear Regression model with trained thermal and autoregressive coefficients for interactive demand prediction.
        </p>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">Algorithm</div>
          <div className="text-xl font-bold text-slate-900 mt-1">Linear Regression</div>
          <div className="text-xs text-slate-500 mt-0.5">Scikit-learn OLS estimator</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">R² Accuracy Score</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">82.14%</div>
          <div className="text-xs text-slate-500 mt-0.5">Evaluated on 20% unseen test split</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">Mean Absolute Error (MAE)</div>
          <div className="text-xl font-bold text-slate-900 mt-1">7.06 <span className="text-xs font-normal text-slate-500">kWh</span></div>
          <div className="text-xs text-slate-500 mt-0.5">Average prediction error margin</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">Root Mean Squared Error</div>
          <div className="text-xl font-bold text-slate-900 mt-1">9.83 <span className="text-xs font-normal text-slate-500">kWh</span></div>
          <div className="text-xs text-slate-500 mt-0.5">RMSE penalty on larger deviations</div>
        </div>
      </div>

      {/* Main Forecasting Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap size={18} className="text-blue-600" />
            <span>Forecasting Input Parameters</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hour of the Day (0 to 23):
            </label>
            <select
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="w-full text-sm rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {Array.from({ length: 24 }).map((_, h) => (
                <option key={h} value={h}>
                  {h.toString().padStart(2, '0')}:00{' '}
                  {h >= 8 && h <= 11
                    ? '(Morning Peak)'
                    : h >= 18 && h <= 21
                    ? '(Evening Peak)'
                    : h >= 1 && h <= 5
                    ? '(Night Base)'
                    : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Day of the Week:</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="w-full text-sm rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={0}>Monday (Weekday)</option>
              <option value={1}>Tuesday (Weekday)</option>
              <option value={2}>Wednesday (Weekday)</option>
              <option value={3}>Thursday (Weekday)</option>
              <option value={4}>Friday (Weekday)</option>
              <option value={5}>Saturday (Weekend - lower industrial load)</option>
              <option value={6}>Sunday (Weekend - lower industrial load)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Ambient Temperature (°C):</label>
              <span className="font-mono text-sm font-bold text-blue-700">{temperature.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="0.5"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10°C (Cold)</span>
              <span>25°C (Mild)</span>
              <span>45°C (Extreme Heat)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Previous Hour Load (kWh):</label>
              <span className="font-mono text-sm font-bold text-blue-700">{prevConsumption.toFixed(1)} kWh</span>
            </div>
            <input
              type="range"
              min="100"
              max="350"
              step="1"
              value={prevConsumption}
              onChange={(e) => setPrevConsumption(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>100 kWh (Low)</span>
              <span>220 kWh (Average)</span>
              <span>350 kWh (Heavy Load)</span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                setHour(14);
                setDayOfWeek(3);
                setTemperature(28.5);
                setPrevConsumption(215.0);
              }}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg flex items-center gap-1"
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Prediction Output Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 text-center border-t-4 border-t-blue-600">
            <div className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
              Predicted Electricity Consumption
            </div>
            <div className="text-5xl font-extrabold text-blue-700 my-3 font-mono">
              {predictedKwh.toFixed(1)} <span className="text-2xl font-bold text-slate-500">kWh</span>
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-3 shadow-xs">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                {status.label}
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {status.note} Estimated confidence bounds: <strong>&plusmn;7.06 kWh</strong>.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs font-mono space-y-1.5 text-slate-700">
            <div className="font-bold text-slate-900 mb-1">Mathematical Breakdown:</div>
            <div>&bull; Intercept (&beta;<sub>0</sub>) = +{intercept.toFixed(2)}</div>
            <div>&bull; Hour term: 0.4375 &times; {hour} = +{(0.4375 * hour).toFixed(2)}</div>
            <div>&bull; Day term: -0.7407 &times; {dayOfWeek} = {( -0.7407 * dayOfWeek).toFixed(2)}</div>
            <div>&bull; Thermal term: 0.5239 &times; {temperature.toFixed(1)} = +{(0.5239 * temperature).toFixed(2)}</div>
            <div>&bull; Lag term: 0.7301 &times; {prevConsumption.toFixed(1)} = +{(0.7301 * prevConsumption).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
