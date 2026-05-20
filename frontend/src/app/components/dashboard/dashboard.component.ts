import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { ReportSummary, Expense } from '../../models/expense.model';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Dashboard</h1>
        <span class="period-label">{{currentDateTime}}</span>
      </div>

      <!-- Summary Cards -->
      <div class="summary-grid" *ngIf="report">
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
        <!-- Expense by Category -->
        <div class="card">
          <h3>Expense by Category</h3>
          <div class="chart-container" *ngIf="pieChartLabels.length > 0">
            <canvas baseChart [data]="pieChartData" [labels]="pieChartLabels"
              [chartType]="'doughnut'" [options]="pieOptions" [colors]="pieColors"></canvas>
          </div>
          <div class="empty-chart" *ngIf="pieChartLabels.length === 0">
            <mat-icon>pie_chart</mat-icon><p>No expense data</p>
          </div>
        </div>

        <!-- Monthly Trend -->
        <div class="card">
          <h3>Monthly Trend</h3>
          <div class="chart-container" *ngIf="barChartLabels.length > 0">
            <canvas baseChart [datasets]="barChartData" [labels]="barChartLabels"
              [chartType]="'bar'" [options]="barOptions"></canvas>
          </div>
          <div class="empty-chart" *ngIf="barChartLabels.length === 0">
            <mat-icon>bar_chart</mat-icon><p>No data yet</p>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="card">
        <div class="section-header">
          <h3>Recent Transactions</h3>
          <a mat-button color="primary" routerLink="/expenses">View All</a>
        </div>
        <div class="transaction-list">
          <div class="transaction-item" *ngFor="let e of recentExpenses">
            <div class="cat-icon" [style.background]="e.category_color || '#667eea'">
              <mat-icon>{{e.category_icon || 'receipt'}}</mat-icon>
            </div>
            <div class="transaction-info">
              <div class="transaction-title">{{e.title}}</div>
              <div class="transaction-date">{{e.date | date:'MMM d, y'}} · {{e.category_name || 'Uncategorized'}}</div>
            </div>
            <div class="transaction-amount" [class.income-color]="e.type==='income'" [class.expense-color]="e.type==='expense'">
              {{e.type === 'income' ? '+' : '-'}}₹{{e.amount | number:'1.2-2'}}
            </div>
          </div>
          <div class="empty-state" *ngIf="recentExpenses.length === 0">
            <mat-icon>receipt_long</mat-icon>
            <p>No transactions yet. <a routerLink="/expenses">Add your first expense</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .summary-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px; margin-bottom:20px; }
    .charts-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; }
    @media(max-width:768px) { .charts-grid { grid-template-columns:1fr; } }
    .chart-container { height:260px; display:flex; align-items:center; justify-content:center; }
    .empty-chart { height:200px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#a0aec0; }
    .empty-chart mat-icon { font-size:48px; width:48px; height:48px; }
    h3 { font-size:16px; font-weight:600; color:#2d3748; margin-bottom:16px; }
    .section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
    .section-header h3 { margin:0; }
    .transaction-list { display:flex; flex-direction:column; gap:12px; }
    .transaction-item { display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid #f7fafc; }
    .transaction-item:last-child { border-bottom:none; }
    .cat-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .cat-icon mat-icon { color:#fff; font-size:20px; width:20px; height:20px; }
    .transaction-info { flex:1; }
    .transaction-title { font-weight:500; color:#2d3748; font-size:14px; }
    .transaction-date { font-size:12px; color:#a0aec0; margin-top:2px; }
    .transaction-amount { font-weight:600; font-size:15px; }
    .empty-state { text-align:center; padding:40px; color:#a0aec0; }
    .empty-state mat-icon { font-size:48px; width:48px; height:48px; }
    .empty-state a { color:#4c51bf; }
    .period-label { font-size:14px; color:#718096; background:#edf2f7; padding:6px 14px; border-radius:20px; }
  `]
})
export class DashboardComponent implements OnInit {
  report: ReportSummary | null = null;
  recentExpenses: Expense[] = [];
  currentDateTime: string = '';


  pieChartLabels: Label[] = [];
  pieChartData: number[] = [];
  pieColors: any[] = [{ backgroundColor: [] }];
  pieOptions: ChartOptions = { responsive: true, maintainAspectRatio: false, legend: { position: 'right' } };

  barChartLabels: Label[] = [];
  barChartData: ChartDataSets[] = [
    { data: [], label: 'Income', backgroundColor: 'rgba(56,161,105,0.8)' },
    { data: [], label: 'Expense', backgroundColor: 'rgba(229,62,62,0.8)' }
  ];
  barOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };

  constructor(private expenseService: ExpenseService) { }

  ngOnInit() {
    const now = new Date();
  this.updateTime();

  setInterval(() => {
    this.updateTime();
  }, 1000); // updates every second
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const end = now.toISOString().split('T')[0];

    this.expenseService.getReport(start, end).subscribe(r => {
      console.log("the responceeeeeeeeeeeeeeeeeeeeeeeveeeeeeeeeeeeeeeeeeeee=================", r);

      this.report = r;
      // Pie chart - expenses by category
      const expCats = r.byCategory.filter(c => c.type === 'expense');
      this.pieChartLabels = expCats.map(c => c.name || 'Uncategorized');
      this.pieChartData = expCats.map(c => parseFloat(c.total));
      this.pieColors = [{ backgroundColor: expCats.map(c => c.color || '#667eea') }];

      // Bar chart - monthly
      const months: any = {};
      r.byMonth.forEach(m => {
        if (!months[m.month]) months[m.month] = { income: 0, expense: 0 };
        months[m.month][m.type] = parseFloat(m.total);
      });
      const labels = Object.keys(months).slice(-6);
      this.barChartLabels = labels;
      (this.barChartData[0] as any).data = labels.map(l => months[l].income);
      (this.barChartData[1] as any).data = labels.map(l => months[l].expense);
    });

    this.expenseService.getExpenses({ limit: 5, page: 1 }).subscribe(r => {
      this.recentExpenses = r.data;
    });
  }

updateTime() {
  const now = new Date();

  this.currentDateTime = now.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}
}
