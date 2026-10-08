import React, { useState } from 'react';
import { ActiveTab, PowerRecord } from './types';
import { INITIAL_METRICS, INITIAL_RECORDS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DataInspectionView } from './components/DataInspectionView';
import { PreprocessingView } from './components/PreprocessingView';
import { StatisticsView } from './components/StatisticsView';
import { VisualizationsView } from './components/VisualizationsView';
import { ForecastView } from './components/ForecastView';
import { RecordsView } from './components/RecordsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [records, setRecords] = useState<PowerRecord[]>(INITIAL_RECORDS);
  const [metrics] = useState(INITIAL_METRICS);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView metrics={metrics} setActiveTab={setActiveTab} />
        )}
        {activeTab === 'data' && (
          <DataInspectionView records={records} />
        )}
        {activeTab === 'preprocessing' && (
          <PreprocessingView />
        )}
        {activeTab === 'statistics' && (
          <StatisticsView />
        )}
        {activeTab === 'visualizations' && (
          <VisualizationsView />
        )}
        {activeTab === 'forecast' && (
          <ForecastView metrics={metrics} />
        )}
        {activeTab === 'records' && (
          <RecordsView records={records} setRecords={setRecords} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-slate-700">
            Power Consumption Forecasting and Analytics System
          </p>
          <p className="mt-0.5 text-slate-400">
            Automated Telemetry Ingestion, Statistical Modeling & Machine Learning Forecasting Engine
          </p>
        </div>
      </footer>
    </div>
  );
}
