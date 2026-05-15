import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Expense, Category, PaginatedResponse, ReportSummary } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getExpenses(filters: any = {}): Observable<PaginatedResponse<Expense>> {
    let params = new HttpParams();
    Object.keys(filters).forEach(k => { if (filters[k] !== null && filters[k] !== undefined && filters[k] !== '') params = params.set(k, filters[k]); });
    return this.http.get<PaginatedResponse<Expense>>(`${this.api}/expenses`, { params });
  }

  getExpense(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.api}/expenses/${id}`);
  }

  createExpense(data: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${this.api}/expenses`, data);
  }

  updateExpense(id: number, data: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.api}/expenses/${id}`, data);
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.delete(`${this.api}/expenses/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories`);
  }

  createCategory(data: Category): Observable<Category> {
    return this.http.post<Category>(`${this.api}/categories`, data);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.api}/categories/${id}`);
  }

  getReport(start_date?: string, end_date?: string): Observable<ReportSummary> {
    let params = new HttpParams();
    if (start_date) params = params.set('start_date', start_date);
    if (end_date) params = params.set('end_date', end_date);
    return this.http.get<ReportSummary>(`${this.api}/reports/summary`, { params });
  }

  getTopExpenses(start_date?: string, end_date?: string): Observable<Expense[]> {
    let params = new HttpParams();
    if (start_date) params = params.set('start_date', start_date);
    if (end_date) params = params.set('end_date', end_date);
    return this.http.get<Expense[]>(`${this.api}/reports/top-expenses`, { params });
  }
}
