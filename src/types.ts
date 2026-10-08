export interface PowerRecord {
  _row_id: number;
  date: string;
  time: string;
  hour: number;
  day: number;
  month: number;
  day_of_week: number;
  temperature: number;
  previous_consumption: number;
  consumption: number;
}

export interface ModelMetrics {
  mae: number;
  rmse: number;
  r2_score: number;
  accuracy_percentage: number;
  intercept: number;
  coefficients: {
    hour: number;
    day_of_week: number;
    month: number;
    temperature: number;
    previous_consumption: number;
  };
}

export type ActiveTab = 
  | 'dashboard'
  | 'data'
  | 'preprocessing'
  | 'statistics'
  | 'visualizations'
  | 'forecast'
  | 'records';
