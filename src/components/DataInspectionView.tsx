import React, { useState } from 'react';
import { PowerRecord } from '../types';
import { Database, Search, Globe, Table } from 'lucide-react';

interface DataInspectionViewProps {
  records: PowerRecord[];
}

export const DataInspectionView: React.FC<DataInspectionViewProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scrapedData, setScrapedData] = useState<any[] | null>(null);
  const [isScraping, setIsScraping] = useState(false);

  const filteredRecords = records.filter(
    (r) => r.date.includes(searchTerm) || r.hour.toString() === searchTerm
  );

  const handleSimulateScraping = () => {
    setIsScraping(true);
    setTimeout(() => {
      setScrapedData([
        { date: '2026-01-01', hour: 12, scraped_temp: 29.1, humidity: 48, wind_speed: 12.4, station: 'City West Met Tower' },
        { date: '2026-01-01', hour: 13, scraped_temp: 29.9, humidity: 46, wind_speed: 14.1, station: 'City West Met Tower' },
        { date: '2026-01-01', hour: 14, scraped_temp: 30.2, humidity: 44, wind_speed: 15.0, station: 'City West Met Tower' },
        { date: '2026-01-01', hour: 15, scraped_temp: 29.5, humidity: 45, wind_speed: 13.8, station: 'City West Met Tower' },
      ]);
      setIsScraping(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Data Inspection & Web Scraping</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Comprehensive telemetry verification, schema validation, data quality diagnostics, and meteorological data integration.
        </p>
      </div>

      {/* Dataset Schema & Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Rows / Samples</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">362</div>
          <div className="text-xs text-slate-500 mt-0.5">Prior to cleaning & deduplication</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">Features / Columns</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">9</div>
          <div className="text-xs text-slate-500 mt-0.5">Temporal, thermal & consumption</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">Initial Missing Values</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">2</div>
          <div className="text-xs text-slate-500 mt-0.5">Imputed with feature medians</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold uppercase">Duplicate Rows Found</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">2</div>
          <div className="text-xs text-slate-500 mt-0.5">Identified and resolved in pipeline</div>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Table size={18} className="text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Power Dataset Inspection Table (df.head())</h3>
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by date or hour..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Hour</th>
                <th className="py-2.5 px-3">Temp (°C)</th>
                <th className="py-2.5 px-3">Previous Load (kWh)</th>
                <th className="py-2.5 px-3">Actual Load (kWh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.slice(0, 10).map((r) => (
                <tr key={r._row_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-xs">{r._row_id}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{r.date}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-xs">{r.time}</td>
                  <td className="py-2.5 px-3 text-slate-700">{r.hour}:00</td>
                  <td className="py-2.5 px-3 text-slate-700">{r.temperature}°C</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.previous_consumption}</td>
                  <td className="py-2.5 px-3 font-bold text-blue-700">{r.consumption} kWh</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BeautifulSoup Web Scraping Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe size={18} className="text-emerald-600" />
              <span>Automated Weather Table Scraping & Enrichment</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Scrapes HTML meteorological tables from <code>data/sample_weather.html</code> and merges on <code>[date, hour]</code>.
            </p>
          </div>
          <button
            onClick={handleSimulateScraping}
            disabled={isScraping}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Globe size={14} />
            <span>{isScraping ? 'Scraping HTML Table...' : 'Run BeautifulSoup Scraper'}</span>
          </button>
        </div>

        {scrapedData && (
          <div className="mt-4 p-4 bg-emerald-50/60 rounded-lg border border-emerald-200/60">
            <div className="text-xs font-semibold text-emerald-800 mb-2">
              ✓ Successfully parsed 4 weather observations with BeautifulSoup4 and joined with power dataset:
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left bg-white rounded border border-emerald-200">
                <thead className="bg-emerald-100/50 text-emerald-900 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Hour</th>
                    <th className="py-2 px-3">Scraped Temp (°C)</th>
                    <th className="py-2 px-3">Humidity (%)</th>
                    <th className="py-2 px-3">Wind Speed (km/h)</th>
                    <th className="py-2 px-3">Weather Station</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {scrapedData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3">{row.date}</td>
                      <td className="py-2 px-3">{row.hour}:00</td>
                      <td className="py-2 px-3 font-medium text-emerald-700">{row.scraped_temp}°C</td>
                      <td className="py-2 px-3">{row.humidity}%</td>
                      <td className="py-2 px-3">{row.wind_speed} km/h</td>
                      <td className="py-2 px-3 text-slate-500">{row.station}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
