import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/expense.model';

@Component({
  selector: 'app-layout',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav" fixedInViewport>
        <div class="sidenav-header">
          <mat-icon class="logo-icon">account_balance_wallet</mat-icon>
          <div>
            <div class="app-name">ExpenseTracker</div>
            <div class="user-name" *ngIf="user">{{user.name}}</div>
          </div>
        </div>
        <mat-nav-list class="nav-list">
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon><span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/expenses" routerLinkActive="active">
            <mat-icon>receipt_long</mat-icon><span>Expenses</span>
          </a>
          <a mat-list-item routerLink="/reports" routerLinkActive="active">
            <mat-icon>bar_chart</mat-icon><span>Reports</span>
          </a>
          <a mat-list-item routerLink="/categories" routerLinkActive="active">
            <mat-icon>category</mat-icon><span>Categories</span>
          </a>
        </mat-nav-list>
        <div class="sidenav-footer">
          <button mat-button (click)="logout()" class="logout-btn">
            <mat-icon>logout</mat-icon> Logout
          </button>
        </div>
      </mat-sidenav>
      <mat-sidenav-content class="main-content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height:100vh; }
    .sidenav { width:240px; background:#1a202c; color:#fff; display:flex; flex-direction:column; }
    .sidenav-header { padding:24px 16px; display:flex; align-items:center; gap:12px; border-bottom:1px solid rgba(255,255,255,0.1); }
    .logo-icon { color:#667eea; font-size:32px; width:32px; height:32px; }
    .app-name { font-size:16px; font-weight:700; color:#fff; }
    .user-name { font-size:12px; color:#a0aec0; margin-top:2px; }
    .nav-list { flex:1; padding-top:16px; }
    .nav-list a { color:#a0aec0; border-radius:8px; margin:4px 8px; display:flex; align-items:center; gap:12px; height:48px; transition:all 0.2s; }
    .nav-list a mat-icon { color:#a0aec0; }
    .nav-list a.active, .nav-list a:hover { color:#fff; background:rgba(102,126,234,0.2); }
    .nav-list a.active mat-icon, .nav-list a:hover mat-icon { color:#667eea; }
    .sidenav-footer { padding:16px; border-top:1px solid rgba(255,255,255,0.1); }
    .logout-btn { color:#a0aec0; width:100%; justify-content:flex-start; gap:8px; }
    .logout-btn:hover { color:#fff; }
    .main-content { background:#f4f6fb; overflow-y:auto; }
  `]
})
export class LayoutComponent implements OnInit {
  user: User | null = null;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() { this.authService.user$.subscribe(u => this.user = u); }
  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}
