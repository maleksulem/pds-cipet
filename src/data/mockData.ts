import { PowerRecord, ModelMetrics } from '../types';

export const INITIAL_METRICS: ModelMetrics = {
  mae: 7.06,
  rmse: 9.83,
  r2_score: 0.8214,
  accuracy_percentage: 82.14,
  intercept: 44.2716,
  coefficients: {
    hour: 0.4375,
    day_of_week: -0.7407,
    month: 0.0,
    temperature: 0.5239,
    previous_consumption: 0.7301
  }
};

export const INITIAL_RECORDS: PowerRecord[] = [
  { _row_id: 0, date: '2026-01-01', time: '00:00:00', hour: 0, day: 1, month: 1, day_of_week: 3, temperature: 18.2, previous_consumption: 185.0, consumption: 178.4 },
  { _row_id: 1, date: '2026-01-01', time: '01:00:00', hour: 1, day: 1, month: 1, day_of_week: 3, temperature: 17.5, previous_consumption: 178.4, consumption: 169.2 },
  { _row_id: 2, date: '2026-01-01', time: '02:00:00', hour: 2, day: 1, month: 1, day_of_week: 3, temperature: 16.9, previous_consumption: 169.2, consumption: 164.5 },
  { _row_id: 3, date: '2026-01-01', time: '03:00:00', hour: 3, day: 1, month: 1, day_of_week: 3, temperature: 16.5, previous_consumption: 164.5, consumption: 161.8 },
  { _row_id: 4, date: '2026-01-01', time: '04:00:00', hour: 4, day: 1, month: 1, day_of_week: 3, temperature: 16.2, previous_consumption: 161.8, consumption: 163.0 },
  { _row_id: 5, date: '2026-01-01', time: '05:00:00', hour: 5, day: 1, month: 1, day_of_week: 3, temperature: 16.8, previous_consumption: 163.0, consumption: 174.6 },
  { _row_id: 6, date: '2026-01-01', time: '06:00:00', hour: 6, day: 1, month: 1, day_of_week: 3, temperature: 17.4, previous_consumption: 174.6, consumption: 192.1 },
  { _row_id: 7, date: '2026-01-01', time: '07:00:00', hour: 7, day: 1, month: 1, day_of_week: 3, temperature: 19.1, previous_consumption: 192.1, consumption: 218.4 },
  { _row_id: 8, date: '2026-01-01', time: '08:00:00', hour: 8, day: 1, month: 1, day_of_week: 3, temperature: 21.3, previous_consumption: 218.4, consumption: 242.0 },
  { _row_id: 9, date: '2026-01-01', time: '09:00:00', hour: 9, day: 1, month: 1, day_of_week: 3, temperature: 23.8, previous_consumption: 242.0, consumption: 258.7 },
  { _row_id: 10, date: '2026-01-01', time: '10:00:00', hour: 10, day: 1, month: 1, day_of_week: 3, temperature: 26.0, previous_consumption: 258.7, consumption: 264.3 },
  { _row_id: 11, date: '2026-01-01', time: '11:00:00', hour: 11, day: 1, month: 1, day_of_week: 3, temperature: 27.8, previous_consumption: 264.3, consumption: 259.8 },
  { _row_id: 12, date: '2026-01-01', time: '12:00:00', hour: 12, day: 1, month: 1, day_of_week: 3, temperature: 29.1, previous_consumption: 259.8, consumption: 251.2 },
  { _row_id: 13, date: '2026-01-01', time: '13:00:00', hour: 13, day: 1, month: 1, day_of_week: 3, temperature: 29.9, previous_consumption: 251.2, consumption: 249.6 },
  { _row_id: 14, date: '2026-01-01', time: '14:00:00', hour: 14, day: 1, month: 1, day_of_week: 3, temperature: 30.2, previous_consumption: 249.6, consumption: 253.1 },
  { _row_id: 15, date: '2026-01-01', time: '15:00:00', hour: 15, day: 1, month: 1, day_of_week: 3, temperature: 29.5, previous_consumption: 253.1, consumption: 257.4 },
  { _row_id: 16, date: '2026-01-01', time: '16:00:00', hour: 16, day: 1, month: 1, day_of_week: 3, temperature: 28.1, previous_consumption: 257.4, consumption: 262.8 },
  { _row_id: 17, date: '2026-01-01', time: '17:00:00', hour: 17, day: 1, month: 1, day_of_week: 3, temperature: 26.2, previous_consumption: 262.8, consumption: 271.5 },
  { _row_id: 18, date: '2026-01-01', time: '18:00:00', hour: 18, day: 1, month: 1, day_of_week: 3, temperature: 24.5, previous_consumption: 271.5, consumption: 284.9 },
  { _row_id: 19, date: '2026-01-01', time: '19:00:00', hour: 19, day: 1, month: 1, day_of_week: 3, temperature: 23.1, previous_consumption: 284.9, consumption: 289.4 }
];
