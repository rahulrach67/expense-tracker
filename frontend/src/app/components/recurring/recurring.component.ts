import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-recurring',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Recurring Transactions</h1>
        <button mat-raised-button color="accent" (click)="process()">
          <mat-icon>sync</mat-icon> Process Due
        </button>
      </div>

      <!-- Add form -->
      <div class="card">
        <h3>Add Recurring Transaction</h3>
        <form [formGroup]="form" (ngSubmit)="save()" class="rec-form">
          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="expense">Expense</mat-option>
              <mat-option value="income">Income</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" placeholder="e.g. Rent, Netflix">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Amount (₹)</mat-label>
            <input matInput type="number" formControlName="amount">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category_id">
              <mat-option [value]="null">None</mat-option>
              <mat-option *ngFor="let c of categories" [value]="c.id">{{c.name}}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Frequency</mat-label>
            <mat-select formControlName="frequency">
              <mat-option value="daily">Daily</mat-option>
              <mat-option value="weekly">Weekly</mat-option>
              <mat-option value="monthly">Monthly</mat-option>
              <mat-option value="yearly">Yearly</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Next Date</mat-label>
            <input matInput type="date" formControlName="next_date">
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid" class="full-btn">
            <mat-icon>add</mat-icon> Add Recurring
          </button>
        </form>
      </div>

      <!-- Recurring list -->
      <div class="card">
        <h3>Active Recurring Transactions</h3>
        <div class="rec-list">
          <div class="rec-item" *ngFor="let r of recurring" [class.inactive]="!r.is_active">
            <div class="rec-icon" [style.background]="r.category_color || '#667eea'">
              <mat-icon>{{r.category_icon || 'repeat'}}</mat-icon>
            </div>
            <div class="rec-info">
              <div class="rec-title">{{r.title}}</div>
              <div class="rec-meta">
                <span class="freq-badge">{{r.frequency | titlecase}}</span>
                <span>Next: {{r.next_date | date:'MMM d, y'}}</span>
                <span>· {{r.category_name || 'Uncategorized'}}</span>
              </div>
            </div>
            <div class="rec-amount" [class.income-color]="r.type==='income'" [class.expense-color]="r.type==='expense'">
              {{r.type==='income' ? '+' : '-'}}₹{{r.amount | number:'1.2-2'}}
            </div>
            <mat-slide-toggle [checked]="r.is_active" (change)="toggleActive(r, $event)"></mat-slide-toggle>
            <button mat-icon-button color="warn" (click)="delete(r)"><mat-icon>delete</mat-icon></button>
          </div>
          <div class="empty-state" *ngIf="recurring.length === 0">
            <mat-icon>repeat</mat-icon>
            <p>No recurring transactions set up</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h3 { font-size:16px; font-weight:600; margin-bottom:16px; color:#2d3748; }
    .rec-form { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; }
    .rec-form mat-form-field { margin:0; }
    .full-btn { grid-column:1/-1; height:48px; }
    .rec-list { display:flex; flex-direction:column; gap:12px; }
    .rec-item { display:flex; align-items:center; gap:12px; padding:12px; background:#f7fafc; border-radius:10px; }
    .rec-item.inactive { opacity:0.5; }
    .rec-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rec-icon mat-icon { color:#fff; }
    .rec-info { flex:1; }
    .rec-title { font-weight:500; font-size:14px; }
    .rec-meta { font-size:12px; color:#718096; display:flex; gap:6px; margin-top:2px; flex-wrap:wrap; }
    .freq-badge { background:#e2e8f0; border-radius:10px; padding:2px 8px; font-size:11px; color:#4a5568; }
    .rec-amount { font-weight:700; font-size:15px; min-width:100px; text-align:right; }
    .empty-state { text-align:center; padding:40px; color:#a0aec0; }
    .empty-state mat-icon { font-size:48px; width:48px; height:48px; }
  `]
})
export class RecurringComponent implements OnInit {
  recurring: any[] = [];
  categories: any[] = [];
  form = this.fb.group({
    type: ['expense', Validators.required],
    title: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    category_id: [null],
    frequency: ['monthly', Validators.required],
    next_date: [new Date().toISOString().split('T')[0], Validators.required]
  });

  constructor(private http: HttpClient, private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.load();
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe(c => this.categories = c);
  }

  load() { this.http.get<any[]>(`${environment.apiUrl}/recurring`).subscribe(r => this.recurring = r); }

  save() {
    if (this.form.invalid) return;
    this.http.post(`${environment.apiUrl}/recurring`, this.form.value).subscribe(() => {
      this.load(); this.form.reset({ type: 'expense', frequency: 'monthly', next_date: new Date().toISOString().split('T')[0] });
      this.snackBar.open('Recurring transaction added!', '', { duration: 2000 });
    });
  }

  toggleActive(r: any, event: any) {
    this.http.put(`${environment.apiUrl}/recurring/${r.id}`, { ...r, is_active: event.checked }).subscribe(() => this.load());
  }

  delete(r: any) {
    if (!confirm(`Delete "${r.title}"?`)) return;
    this.http.delete(`${environment.apiUrl}/recurring/${r.id}`).subscribe(() => this.load());
  }

  process() {
    this.http.post<any>(`${environment.apiUrl}/recurring/process`, {}).subscribe(res => {
      this.snackBar.open(`Processed ${res.count} transactions`, '', { duration: 3000 });
      this.load();
    });
  }
}
