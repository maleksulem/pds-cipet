import React, { useState } from 'react';
import { LineChart, RefreshCw, ZoomIn, Info } from 'lucide-react';

export const VisualizationsView: React.FC = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [isRegenerating, setIsRegenerating] = useState(false);

  const plots = [
    {
      id: 'time-series',
      title: '1. Historical Power Demand Timeline (Time Series)',
      filename: 'consumption_time_series.png',
      description: 'Continuous hourly load sequence illustrating baseline load, cyclic peaks, and mean reference threshold.'
    },
    {
      id: 'dist',
      title: '2. Univariate Consumption Distribution (Hist + KDE)',
      filename: 'consumption_distribution.png',
      description: 'Histogram with Kernel Density Estimation (KDE) curve, contrasting mean and median central tendencies.'
    },
    {
      id: 'bivariate',
      title: '3. Bivariate Relationship: Temperature vs. Load',
      filename: 'temperature_vs_consumption.png',
      description: 'Scatter plot with fitted linear regression trend line depicting direct thermal correlation with electrical load.'
    },
    {
      id: 'diurnal',
      title: '4. Diurnal Pattern: Average Consumption by Hour',
      filename: 'hourly_consumption_pattern.png',
      description: '24-hour load profile showcasing nighttime minimums (01:00-05:00) and evening peak hours (18:00-21:00).'
    },
    {
      id: 'heatmap',
      title: '5. Correlation Heatmap (Seaborn)',
      filename: 'correlation_heatmap.png',
      description: 'Pearson correlation coefficient grid evaluating collinearity between temporal, environmental, and load variables.'
    },
    {
      id: 'clt',
      title: '6. Central Limit Theorem (CLT) Gaussian Distribution',
      filename: 'clt_sampling_distribution.png',
      description: 'Empirical distribution of 500 repeated sample means (n=30) demonstrating normal convergence.'
    }
  ];

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setCacheBuster(Date.now());
      setIsRegenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Matplotlib & Seaborn Visualizations</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Exploratory data analysis plots, probability distributions, bivariate regressions, diurnal patterns, and correlation matrices.
          </p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
          <span>{isRegenerating ? 'Re-rendering Figures...' : 'Regenerate All Plots'}</span>
        </button>
      </div>

      {/* Grid of 6 Plots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plots.map((plot) => (
          <div key={plot.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors flex flex-col">
            <div className="p-2.5 bg-slate-50 border-b border-slate-100 relative group">
              <img
                src={`/static/plots/${plot.filename}?t=${cacheBuster}`}
                alt={plot.title}
                className="w-full h-auto rounded object-contain max-h-[300px] cursor-pointer"
                onClick={() => setSelectedImg(`/static/plots/${plot.filename}?t=${cacheBuster}`)}
                onError={(e) => {
                  // Fallback to static folder
                  (e.target as HTMLImageElement).src = `/static/plots/${plot.filename}`;
                }}
              />
              <button
                onClick={() => setSelectedImg(`/static/plots/${plot.filename}?t=${cacheBuster}`)}
                className="absolute right-4 bottom-4 p-1.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-md text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn size={13} />
                <span>Enlarge</span>
              </button>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{plot.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{plot.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enlarge Modal */}
      {selectedImg && (
        <div 
          className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl p-2 shadow-2xl">
            <img src={selectedImg} alt="Enlarged visualization" className="max-h-[85vh] w-auto rounded object-contain" />
            <div className="text-center text-xs text-slate-500 mt-1">Click anywhere to close</div>
          </div>
        </div>
      )}
    </div>
  );
};
