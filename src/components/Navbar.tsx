import React from 'react';
import { ActiveTab } from '../types';
import { 
  LayoutDashboard, 
  Database, 
  Wrench, 
  BarChart2, 
  LineChart, 
  Zap, 
  FileText 
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'data', label: 'Data Inspection', icon: <Database size={16} /> },
    { id: 'preprocessing', label: 'Preprocessing', icon: <Wrench size={16} /> },
    { id: 'statistics', label: 'Statistics & Inference', icon: <BarChart2 size={16} /> },
    { id: 'visualizations', label: 'Visualizations', icon: <LineChart size={16} /> },
    { id: 'forecast', label: 'ML Forecast', icon: <Zap size={16} /> },
    { id: 'records', label: 'Records & Storage', icon: <FileText size={16} /> },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center shadow-inner">
            <Zap size={22} className="text-yellow-300 fill-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">Power Consumption Forecasting</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-mono">
                Active System
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Intelligent Grid Load Analytics & Predictive Forecasting Engine
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>HTTP Server: 0.0.0.0:3000</span>
        </div>
      </div>

      <nav className="bg-slate-950 border-b border-slate-800/80 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
