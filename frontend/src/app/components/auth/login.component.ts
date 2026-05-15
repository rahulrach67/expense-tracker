import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <mat-icon class="logo-icon">account_balance_wallet</mat-icon>
          <h1>ExpenseTracker</h1>
          <p>Sign in to manage your finances</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="you@example.com">
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput [type]="showPass ? 'text' : 'password'" formControlName="password">
            <mat-icon matSuffix style="cursor:pointer" (click)="showPass=!showPass">{{showPass?'visibility_off':'visibility'}}</mat-icon>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading" class="submit-btn">
            <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
            <span *ngIf="!loading">Sign In</span>
          </button>
        </form>
        <p class="switch-link">Don't have an account? <a routerLink="/register">Register</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#4c51bf 0%,#6b46c1 100%); padding:20px; }
    .auth-card { background:#fff; border-radius:16px; padding:40px; width:100%; max-width:420px; box-shadow:0 20px 60px rgba(0,0,0,0.2); }
    .auth-header { text-align:center; margin-bottom:32px; }
    .logo-icon { font-size:48px; width:48px; height:48px; color:#4c51bf; }
    h1 { font-size:28px; font-weight:700; color:#1a202c; margin:8px 0 4px; }
    p { color:#718096; font-size:14px; }
    mat-form-field { margin-bottom:12px; }
    .submit-btn { width:100%; height:48px; font-size:16px; font-weight:600; margin-top:8px; border-radius:8px; }
    .switch-link { text-align:center; margin-top:20px; color:#718096; font-size:14px; }
    .switch-link a { color:#4c51bf; text-decoration:none; font-weight:500; }
  `]
})
export class LoginComponent {
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  loading = false;
  showPass = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;
    this.authService.login(email, password).subscribe(
      () => this.router.navigate(['/dashboard']),
      err => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Login failed', 'Close', { duration: 3000, panelClass: 'snack-error' });
      }
    );
  }
}
