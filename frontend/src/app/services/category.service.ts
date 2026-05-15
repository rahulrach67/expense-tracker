import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private url = `${environment.apiUrl}/categories`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<any> { return this.http.get(this.url); }
  create(cat: Category): Observable<any> { return this.http.post(this.url, cat); }
  update(id: number, cat: Category): Observable<any> { return this.http.put(`${this.url}/${id}`, cat); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}
