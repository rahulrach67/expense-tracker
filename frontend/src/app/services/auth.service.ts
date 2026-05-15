import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) this.loadUser();
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, { name, email, password }).pipe(
      tap((res: any) => { localStorage.setItem('token', res.token); this.userSubject.next(res.user); })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res: any) => { localStorage.setItem('token', res.token); this.userSubject.next(res.user); })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  loadUser() {
    this.http.get<User>(`${environment.apiUrl}/auth/me`).subscribe(
      user => this.userSubject.next(user),
      () => this.logout()
    );
  }

  getToken() { return localStorage.getItem('token'); }
  isLoggedIn() { return !!localStorage.getItem('token'); }
  getUser() { return this.userSubject.value; }
}
