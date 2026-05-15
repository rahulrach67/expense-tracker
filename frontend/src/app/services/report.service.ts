import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private url = `${environment.apiUrl}/reports`;
  constructor(private http: HttpClient) {}
  private params(obj: any): HttpParams {
    let p = new HttpParams();
    Object.keys(obj).forEach(k => { if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') p = p.set(k, obj[k]); });
    return p;
  }
  getSummary(filter: any = {}): Observable<any> { return this.http.get(`${this.url}/summary`, { params: this.params(filter) }); }
  getByCategory(filter: any = {}): Observable<any> { return this.http.get(`${this.url}/by-category`, { params: this.params(filter) }); }
  getMonthlyTrend(filter: any = {}): Observable<any> { return this.http.get(`${this.url}/monthly-trend`, { params: this.params(filter) }); }
  getDailyTrend(filter: any = {}): Observable<any> { return this.http.get(`${this.url}/daily-trend`, { params: this.params(filter) }); }
  getTopExpenses(filter: any = {}): Observable<any> { return this.http.get(`${this.url}/top-expenses`, { params: this.params(filter) }); }
}
