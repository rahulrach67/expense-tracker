import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { ReportSummary, Expense } from '../../models/expense.model';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-reports',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Reports & Analytics</h1>
        <div class="date-filters">
          <mat-form-field appearance="outline" class="date-field">
            <mat-label>From</mat-label>
            <input matInput type="date" [(ngModel)]="startDate" (change)="load()">
          </mat-form-field>
          <mat-form-field appearance="outline" class="date-field">
            <mat-label>To</mat-label>
            <input matInput type="date" [(ngModel)]="endDate" (change)="load()">
          </mat-form-field>
        </div>
      </div>

      <div *ngIf="report">
        <!-- Summary -->
        <div class="summary-grid">
          <div class="summary-card income">
            <div class="label">Total Income</div>
            <div class="amount">₹{{report.summary.totalIncome | number:'1.2-2'}}</div>
            <mat-icon class="icon">trending_up</mat-icon>
          </div>
          <div class="summary-card expense">
            <div class="label">Total Expenses</div>
            <div class="amount">₹{{report.summary.totalExpense | number:'1.2-2'}}</div>
            <mat-icon class="icon">trending_down</mat-icon>
          </div>
          <div class="summary-card balance">
            <div class="label">Net Balance</div>
            <div class="amount">₹{{report.summary.balance | number:'1.2-2'}}</div>
            <mat-icon class="icon">account_balance</mat-icon>
          </div>
        </div>

        <div class="charts-grid">
          <!-- Daily trend -->
          <div class="card chart-card">
            <h3>Daily Trend</h3>
            <div class="chart-wrap" *ngIf="lineLabels.length > 0">
              <canvas baseChart [datasets]="lineData" [labels]="lineLabels"
                [chartType]="'line'" [options]="lineOptions"></canvas>
            </div>
            <div class="no-data" *ngIf="lineLabels.length === 0"><mat-icon>show_chart</mat-icon><p>No data</p></div>
          </div>

          <!-- Category pie -->
          <div class="card chart-card">
            <h3>Expenses by Category</h3>
            <div class="chart-wrap" *ngIf="pieLabels.length > 0">
              <canvas baseChart [data]="pieData" [labels]="pieLabels"
                [chartType]="'pie'" [options]="pieOptions" [colors]="pieColors"></canvas>
            </div>
            <div class="no-data" *ngIf="pieLabels.length === 0"><mat-icon>pie_chart</mat-icon><p>No data</p></div>
          </div>
        </div>

        <!-- Category breakdown table -->
        <div class="card">
          <h3>Category Breakdown</h3>
          <table mat-table [dataSource]="report.byCategory" class="mat-elevation-z0">
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let c">
                <div class="cat-row">
                  <div class="cat-icon" [style.background]="c.color||'#667eea'"><mat-icon>{{c.icon||'category'}}</mat-icon></div>
                  {{c.name || 'Uncategorized'}}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let c">
                <span [class]="c.type==='income'?'badge-income':'badge-expense'">{{c.type | titlecase}}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="count">
              <th mat-header-cell *matHeaderCellDef>Transactions</th>
              <td mat-cell *matCellDef="let c">{{c.count}}</td>
            </ng-container>
            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef style="text-align:right">Total</th>
              <td mat-cell *matCellDef="let c" style="text-align:right">
                <strong [class]="c.type==='income'?'income-color':'expense-color'">₹{{c.total | number:'1.2-2'}}</strong>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="catColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: catColumns;"></tr>
          </table>
        </div>

        <!-- Top expenses -->
        <div class="card" *ngIf="topExpenses.length > 0">
          <h3>Top Expenses</h3>
          <div class="top-list">
            <div class="top-item" *ngFor="let e of topExpenses; let i = index">
              <span class="rank">#{{i+1}}</span>
              <div class="cat-icon" [style.background]="e.category_color||'#667eea'">
                <mat-icon>{{e.category_icon||'receipt'}}</mat-icon>
              </div>
              <div class="top-info">
                <div class="top-title">{{e.title}}</div>
                <div class="top-meta">{{e.date | date:'MMM d'}} · {{e.category_name || 'Uncategorized'}}</div>
              </div>
              <span class="expense-color top-amount">₹{{e.amount | number:'1.2-2'}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="loading-center" *ngIf="loading"><mat-spinner diameter="48"></mat-spinner></div>
    </div>
  `,
  styles: [`
    .date-filters { display:flex; gap:12px; }
    .date-field { margin:0; }
    .summary-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px; margin-bottom:20px; }
    .charts-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; }
    @media(max-width:768px) { .charts-grid { grid-template-columns:1fr; } }
    .chart-card h3 { margin-bottom:16px; }
    .chart-wrap { height:280px; }
    .no-data { height:200px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#a0aec0; }
    .no-data mat-icon { font-size:48px; width:48px; height:48px; }
    h3 { font-size:16px; font-weight:600; color:#2d3748; margin-bottom:16px; }
    .cat-row { display:flex; align-items:center; gap:10px; }
    .cat-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .cat-icon mat-icon { color:#fff; font-size:16px; width:16px; height:16px; }
    td, th { padding:12px 16px !important; }
    .top-list { display:flex; flex-direction:column; gap:12px; }
    .top-item { display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid #f7fafc; }
    .top-item:last-child { border:none; }
    .rank { width:28px; text-align:center; font-weight:700; color:#a0aec0; font-size:14px; }
    .top-info { flex:1; }
    .top-title { font-weight:500; font-size:14px; }
    .top-meta { font-size:12px; color:#a0aec0; }
    .top-amount { font-weight:700; font-size:15px; }
    .loading-center { display:flex; justify-content:center; padding:60px; }
  `]
})
export class ReportsComponent implements OnInit {
  report: ReportSummary | null = null;
  topExpenses: Expense[] = [];
  loading = false;

  startDate = '';
  endDate = '';

  pieLabels: Label[] = [];
  pieData: number[] = [];
  pieColors: any[] = [{ backgroundColor: [] }];
  pieOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };

  lineLabels: Label[] = [];
  lineData: ChartDataSets[] = [
    { data: [], label: 'Income', borderColor: '#38a169', backgroundColor: 'rgba(56,161,105,0.1)', fill: true },
    { data: [], label: 'Expense', borderColor: '#e53e3e', backgroundColor: 'rgba(229,62,62,0.1)', fill: true }
  ];
  lineOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };

  catColumns = ['category', 'type', 'count', 'total'];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    const now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    this.endDate = now.toISOString().split('T')[0];
    this.load();
  }

  load() {
    this.loading = true;
    this.expenseService.getReport(this.startDate, this.endDate).subscribe(r => {
      this.report = r;
      const expCats = r.byCategory.filter(c => c.type === 'expense');
      this.pieLabels = expCats.map(c => c.name || 'Uncategorized');
      this.pieData = expCats.map(c => parseFloat(c.total));
      this.pieColors = [{ backgroundColor: expCats.map(c => c.color || '#667eea') }];

      const dayMap: any = {};
      r.byDay.forEach(d => {
        if (!dayMap[d.date]) dayMap[d.date] = { income: 0, expense: 0 };
        dayMap[d.date][d.type] = parseFloat(d.total);
      });
      const days = Object.keys(dayMap).sort();
      this.lineLabels = days.map(d => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' }));
      (this.lineData[0] as any).data = days.map(d => dayMap[d].income);
      (this.lineData[1] as any).data = days.map(d => dayMap[d].expense);
      this.loading = false;
    }, () => this.loading = false);

    this.expenseService.getTopExpenses(this.startDate, this.endDate).subscribe(r => this.topExpenses = r);
  }
}
