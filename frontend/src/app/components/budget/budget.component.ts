import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-budget',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Budget Management</h1>
        <div class="month-nav">
          <button mat-icon-button (click)="changeMonth(-1)"><mat-icon>chevron_left</mat-icon></button>
          <span class="month-label">{{displayMonth}}</span>
          <button mat-icon-button (click)="changeMonth(1)"><mat-icon>chevron_right</mat-icon></button>
        </div>
      </div>

      <!-- Summary cards -->
      <div class="budget-summary" *ngIf="summary">
        <div class="sum-card total">
          <mat-icon>account_balance_wallet</mat-icon>
          <div>
            <div class="sum-label">Total Budget</div>
            <div class="sum-value">₹{{summary.total_budget_amount | number:'1.0-0'}}</div>
          </div>
        </div>
        <div class="sum-card spent">
          <mat-icon>shopping_cart</mat-icon>
          <div>
            <div class="sum-label">Total Spent</div>
            <div class="sum-value">₹{{summary.total_spent | number:'1.0-0'}}</div>
          </div>
        </div>
        <div class="sum-card remaining">
          <mat-icon>savings</mat-icon>
          <div>
            <div class="sum-label">Remaining</div>
            <div class="sum-value">₹{{(summary.total_budget_amount - summary.total_spent) | number:'1.0-0'}}</div>
          </div>
        </div>
        <div class="sum-card alert" *ngIf="summary.over_budget_count > 0">
          <mat-icon>warning</mat-icon>
          <div>
            <div class="sum-label">Over Budget</div>
            <div class="sum-value">{{summary.over_budget_count}} categories</div>
          </div>
        </div>
      </div>

      <!-- Add budget form -->
      <div class="card">
        <h3>Set Budget</h3>
        <form [formGroup]="form" (ngSubmit)="save()" class="budget-form">
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category_id">
              <mat-option *ngFor="let c of categories" [value]="c.id">{{c.name}}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Budget Amount (₹)</mat-label>
            <input matInput type="number" formControlName="amount" placeholder="0.00">
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
            <mat-icon>save</mat-icon> Set Budget
          </button>
        </form>
      </div>

      <!-- Budget progress list -->
      <div class="card">
        <h3>Budget Progress</h3>
        <div class="budget-list">
          <div class="budget-item" *ngFor="let b of budgets">
            <div class="budget-header">
              <div class="cat-info">
                <div class="cat-icon" [style.background]="b.category_color || '#667eea'">
                  <mat-icon>{{b.category_icon || 'category'}}</mat-icon>
                </div>
                <span class="cat-name">{{b.category_name}}</span>
              </div>
              <div class="budget-amounts">
                <span [class]="b.spent > b.amount ? 'over' : 'under'">
                  ₹{{b.spent | number:'1.0-0'}}
                </span>
                <span class="divider">/</span>
                <span>₹{{b.amount | number:'1.0-0'}}</span>
              </div>
              <button mat-icon-button color="warn" (click)="delete(b)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            <mat-progress-bar
              [mode]="'determinate'"
              [value]="getProgress(b)"
              [color]="b.spent > b.amount ? 'warn' : b.spent / b.amount > 0.8 ? 'accent' : 'primary'">
            </mat-progress-bar>
            <div class="budget-footer">
              <span class="pct">{{getProgress(b) | number:'1.0-0'}}% used</span>
              <span [class]="b.spent > b.amount ? 'over-text' : 'remaining-text'">
                {{b.spent > b.amount ? 'Over by ₹' + (b.spent - b.amount | number:'1.0-0') : '₹' + (b.amount - b.spent | number:'1.0-0') + ' left'}}
              </span>
            </div>
          </div>
          <div class="empty-state" *ngIf="budgets.length === 0">
            <mat-icon>account_balance_wallet</mat-icon>
            <p>No budgets set for this month</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .month-nav { display:flex; align-items:center; gap:8px; background:#f7fafc; border-radius:8px; padding:4px 8px; }
    .month-label { font-weight:600; color:#2d3748; min-width:120px; text-align:center; }
    .budget-summary { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-bottom:20px; }
    .sum-card { background:#fff; border-radius:12px; padding:16px 20px; display:flex; align-items:center; gap:14px; box-shadow:0 2px 12px rgba(0,0,0,0.07); }
    .sum-card mat-icon { font-size:32px; width:32px; height:32px; }
    .sum-card.total mat-icon { color:#4c51bf; }
    .sum-card.spent mat-icon { color:#e53e3e; }
    .sum-card.remaining mat-icon { color:#38a169; }
    .sum-card.alert mat-icon { color:#d69e2e; }
    .sum-label { font-size:12px; color:#718096; }
    .sum-value { font-size:20px; font-weight:700; color:#2d3748; }
    h3 { font-size:16px; font-weight:600; margin-bottom:16px; color:#2d3748; }
    .budget-form { display:flex; gap:12px; flex-wrap:wrap; align-items:flex-start; }
    .budget-form mat-form-field { flex:1; min-width:160px; margin:0; }
    .budget-list { display:flex; flex-direction:column; gap:16px; }
    .budget-item { background:#f7fafc; border-radius:10px; padding:14px 16px; }
    .budget-header { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
    .cat-info { display:flex; align-items:center; gap:10px; flex:1; }
    .cat-icon { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; }
    .cat-icon mat-icon { color:#fff; font-size:18px; width:18px; height:18px; }
    .cat-name { font-weight:500; font-size:14px; }
    .budget-amounts { display:flex; align-items:center; gap:4px; font-size:14px; font-weight:500; }
    .over { color:#e53e3e; font-weight:700; }
    .under { color:#38a169; }
    .divider { color:#a0aec0; }
    .budget-footer { display:flex; justify-content:space-between; margin-top:6px; font-size:12px; color:#718096; }
    .over-text { color:#e53e3e; font-weight:600; }
    .remaining-text { color:#38a169; font-weight:600; }
    .empty-state { text-align:center; padding:40px; color:#a0aec0; }
    .empty-state mat-icon { font-size:48px; width:48px; height:48px; }
  `]
})
export class BudgetComponent implements OnInit {
  budgets: any[] = [];
  categories: any[] = [];
  summary: any = null;
  currentMonth = new Date().toISOString().slice(0, 7);
  displayMonth = '';

  form = this.fb.group({
    category_id: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1)]]
  });

  constructor(private http: HttpClient, private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.updateDisplayMonth();
    this.loadCategories();
    this.load();
  }

  updateDisplayMonth() {
    const [y, m] = this.currentMonth.split('-');
    this.displayMonth = new Date(+y, +m - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  changeMonth(dir: number) {
    const [y, m] = this.currentMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + dir);
    this.currentMonth = d.toISOString().slice(0, 7);
    this.updateDisplayMonth();
    this.load();
  }

  load() {
    this.http.get<any[]>(`${environment.apiUrl}/budgets?month=${this.currentMonth}`).subscribe(b => this.budgets = b);
    this.http.get<any>(`${environment.apiUrl}/budgets/summary`).subscribe(s => this.summary = s);
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe(c => this.categories = c);
  }

  getProgress(b: any): number {
    return Math.min((b.spent / b.amount) * 100, 100);
  }

  save() {
    if (this.form.invalid) return;
    this.http.post(`${environment.apiUrl}/budgets`, { ...this.form.value, month: this.currentMonth }).subscribe(() => {
      this.load();
      this.form.reset();
      this.snackBar.open('Budget saved!', '', { duration: 2000 });
    });
  }

  delete(b: any) {
    if (!confirm('Delete this budget?')) return;
    this.http.delete(`${environment.apiUrl}/budgets/${b.id}`).subscribe(() => { this.load(); });
  }
}
