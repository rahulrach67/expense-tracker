export interface Summary {
  total_count: number;
  total_amount: number;
  avg_amount: number;
  max_amount: number;
  min_amount: number;
}
export interface CategoryReport {
  id: number;
  name: string;
  color: string;
  icon: string;
  count: number;
  total: number;
}
export interface MonthlyTrend {
  month: string;
  month_label: string;
  total: number;
  count: number;
}
export interface DailyTrend {
  date: string;
  total: number;
  count: number;
}
