import React from 'react';
import { Wrench, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

export const PreprocessingView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Data Preprocessing & Cleaning</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Automated missing value imputation, duplicate removal, Interquartile Range (IQR) outlier capping, and feature scaling.
        </p>
      </div>

      {/* Preprocessing Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">Missing Imputed</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">2</div>
          <div className="text-xs text-slate-500 mt-0.5">Median strategy (robust to skew)</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">Duplicates Removed</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">2</div>
          <div className="text-xs text-slate-500 mt-0.5">Exact redundant rows dropped</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">IQR Outliers Capped</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">2</div>
          <div className="text-xs text-slate-500 mt-0.5">Sensor spikes capped at fence</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">Clean Samples Produced</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">360</div>
          <div className="text-xs text-slate-500 mt-0.5">Clean dataset passed to ML</div>
        </div>
      </div>

      {/* IQR Outlier Methodology & Mathematical Fences */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
          <ShieldAlert size={18} className="text-amber-600" />
          <span>Interquartile Range (IQR) Outlier Fences</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Power meters can record extreme transient spikes due to lightning strikes or sensor communication dropouts. 
          To prevent these physical artifacts from distorting model training, values outside the 1.5 &times; IQR fences are capped (Winsorized).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-slate-500">First Quartile (Q1 - 25%):</div>
            <div className="text-base font-bold text-slate-900 mt-1">178.4 kWh</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-slate-500">Third Quartile (Q3 - 75%):</div>
            <div className="text-base font-bold text-slate-900 mt-1">252.1 kWh</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-blue-700">Calculated IQR (Q3 - Q1):</div>
            <div className="text-base font-bold text-blue-900 mt-1">73.7 kWh</div>
          </div>
        </div>

        <div className="mt-4 p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 font-mono">
          <div>&bull; Lower Fence = Q1 - 1.5 &times; IQR = 178.4 - 110.55 = <strong>67.85 kWh</strong> (No observations below)</div>
          <div className="mt-1">&bull; Upper Fence = Q3 + 1.5 &times; IQR = 252.1 + 110.55 = <strong>362.65 kWh</strong> (Outlier 420.0 kWh capped to fence)</div>
        </div>
      </div>

      {/* Feature Engineering & Scaling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-indigo-600" />
            <span>Feature Engineering Added</span>
          </h3>
          <ul className="text-xs text-slate-600 space-y-2 mt-3">
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <div><strong>is_weekend:</strong> Binary indicator flag (1 if Saturday/Sunday, 0 for weekdays).</div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <div><strong>is_peak_hour:</strong> Binary indicator flag (1 for 08:00-11:00 and 18:00-21:00, else 0).</div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <div><strong>temperature_delta:</strong> Difference between ambient temperature and 22°C baseline room comfort.</div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Wrench size={18} className="text-blue-600" />
            <span>Feature Scaling Comparison</span>
          </h3>
          <div className="space-y-3 mt-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="font-semibold text-slate-800">Min-Max Normalization [0, 1]</div>
              <div className="font-mono text-slate-600 mt-0.5">X_norm = (X - X_min) / (X_max - X_min)</div>
              <div className="text-slate-500 mt-1">Preserves zero entries and maps bounded ranges.</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="font-semibold text-slate-800">Standardization (Z-Score) [&mu;=0, &sigma;=1]</div>
              <div className="font-mono text-slate-600 mt-0.5">Z = (X - &mu;) / &sigma;</div>
              <div className="text-slate-500 mt-1">Zero-centers distributions for gradient-based learners.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
