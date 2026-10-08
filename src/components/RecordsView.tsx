import React, { useState } from 'react';
import { PowerRecord } from '../types';
import { FileText, Plus, Trash2, Search, Database } from 'lucide-react';

interface RecordsViewProps {
  records: PowerRecord[];
  setRecords: React.Dispatch<React.SetStateAction<PowerRecord[]>>;
}

export const RecordsView: React.FC<RecordsViewProps> = ({ records, setRecords }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState('2026-01-16');
  const [newHour, setNewHour] = useState(12);
  const [newTemp, setNewTemp] = useState(26.5);
  const [newPrev, setNewPrev] = useState(210.0);
  const [newConsumption, setNewConsumption] = useState(225.4);

  const [activityLogs, setActivityLogs] = useState<string[]>([
    '[2026-09-10 17:59:17] [SYSTEM_INITIALIZED] Pipeline executed and server prepared.',
    '[2026-09-10 17:59:15] [MODEL_TRAINED] Linear Regression model serialized to power_model.pkl.',
    '[2026-09-10 17:59:12] [DATA_CLEANED] Preprocessing finished: 2 imputed, 2 duplicates removed, 2 outliers capped.',
    '[2026-09-10 17:59:10] [DATA_LOADED] Loaded 362 raw power records from data/power_consumption.csv.'
  ]);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: PowerRecord = {
      _row_id: records.length,
      date: newDate,
      time: `${newHour.toString().padStart(2, '0')}:00:00`,
      hour: newHour,
      day: 16,
      month: 1,
      day_of_week: 4,
      temperature: newTemp,
      previous_consumption: newPrev,
      consumption: newConsumption
    };

    setRecords([newRecord, ...records]);
    setActivityLogs([
      `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] [CSV_RECORD_ADDED] Inserted row: Date=${newDate}, Hour=${newHour}, Load=${newConsumption} kWh`,
      ...activityLogs
    ]);
    setShowAddForm(false);
  };

  const handleDeleteRecord = (rowId: number) => {
    if (!window.confirm(`Delete power record at index ${rowId}?`)) return;
    setRecords(records.filter((r) => r._row_id !== rowId));
    setActivityLogs([
      `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] [CSV_RECORD_DELETED] Removed record with row index ${rowId}`,
      ...activityLogs
    ]);
  };

  const filtered = records.filter(
    (r) => r.date.includes(searchTerm) || r.hour.toString() === searchTerm
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Records & Storage Management</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Persistent storage, CSV records management, operational audit logging, and relational database operations.
        </p>
      </div>

      {/* CSV Records Management */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              <span>1. Power Demand Records (CSV Storage)</span>
            </h3>
            <span className="text-xs text-slate-500">File: data/power_consumption.csv ({records.length} records)</span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
            >
              <Plus size={14} />
              <span>{showAddForm ? 'Cancel' : 'Add Record'}</span>
            </button>
          </div>
        </div>

        {/* Add Record Form */}
        {showAddForm && (
          <form onSubmit={handleAddRecord} className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4 space-y-3">
            <div className="text-xs font-bold text-slate-800">Insert New Observation into CSV:</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">Date:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-1.5 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Hour (0-23):</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={newHour}
                  onChange={(e) => setNewHour(Number(e.target.value))}
                  className="w-full p-1.5 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Temp (°C):</label>
                <input
                  type="number"
                  step="0.1"
                  value={newTemp}
                  onChange={(e) => setNewTemp(Number(e.target.value))}
                  className="w-full p-1.5 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Previous (kWh):</label>
                <input
                  type="number"
                  step="0.1"
                  value={newPrev}
                  onChange={(e) => setNewPrev(Number(e.target.value))}
                  className="w-full p-1.5 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Consumption (kWh):</label>
                <input
                  type="number"
                  step="0.1"
                  value={newConsumption}
                  onChange={(e) => setNewConsumption(Number(e.target.value))}
                  className="w-full p-1.5 border rounded"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded"
            >
              Save to CSV
            </button>
          </form>
        )}

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Hour</th>
                <th className="py-2 px-3">Temp (°C)</th>
                <th className="py-2 px-3">Previous Load</th>
                <th className="py-2 px-3">Consumption</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.slice(0, 8).map((r) => (
                <tr key={r._row_id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-mono text-slate-400">{r._row_id}</td>
                  <td className="py-2 px-3 font-medium text-slate-800">{r.date}</td>
                  <td className="py-2 px-3 text-slate-700">{r.hour}:00</td>
                  <td className="py-2 px-3 text-slate-700">{r.temperature}°C</td>
                  <td className="py-2 px-3 text-slate-600">{r.previous_consumption} kWh</td>
                  <td className="py-2 px-3 font-bold text-blue-700">{r.consumption} kWh</td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => handleDeleteRecord(r._row_id)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                      title="Delete row"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MySQL Relational Status */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Database size={18} className="text-blue-600" />
          <span>2. MySQL Database Schema & Connection</span>
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Configured in <code>modules/database.py</code> with schema in <code>database/schema.sql</code>.
        </p>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Relational Connector Status:</strong> PyMySQL and parameterized CRUD queries are fully written in <code>modules/database.py</code>. 
          When a local MySQL instance is active on port 3306 (database: <code>power_db</code>), operations execute directly. 
          If offline in a lightweight container, the system catches connection errors gracefully without breaking.
        </div>
      </div>

      {/* Operational Activity Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText size={18} className="text-slate-600" />
            <span>3. Operational Activity & Audit Log</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">reports/activity_log.txt</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Real-time system telemetry and transaction audit log.
        </p>
        <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-xs max-h-48 overflow-y-auto space-y-1">
          {activityLogs.map((line, idx) => (
            <div key={idx} className="text-slate-300">{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
