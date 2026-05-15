export interface Expense {
  id?: number;
  title: string;
  amount: number;
  date: string;
  category_id?: number;
  category_name?: string;
  category_icon?: string;
  category_color?: string;
  notes?: string;
  type: 'expense' | 'income';
  user_id?: number;
  created_at?: string;
}

export interface Category {
  id?: number;
  name: string;
  icon?: string;
  color?: string;
  is_default?: boolean;
  user_id?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ReportSummary {
  period: { start: string; end: string };
  summary: { totalIncome: number; totalExpense: number; balance: number };
  byCategory: any[];
  byDay: any[];
  byMonth: any[];
}
