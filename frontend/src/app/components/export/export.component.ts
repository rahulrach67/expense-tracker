import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-export',
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Export Data</h1></div>

      <div class="export-grid">
        <!-- CSV Export -->
        <div class="card export-card">
          <div class="export-icon csv"><mat-icon>table_chart</mat-icon></div>
          <h3>Export as CSV</h3>
          <p>Download your transactions as a spreadsheet. Compatible with Excel, Google Sheets.</p>
          <div class="export-filters">
            <mat-form-field appearance="outline">
              <mat-label>From Date</mat-label>
              <input matInput type="date" [(ngModel)]="startDate">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>To Date</mat-label>
              <input matInput type="date" [(ngModel)]="endDate">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Type</mat-label>
              <mat-select [(ngModel)]="filterType">
                <mat-option value="">All</mat-option>
                <mat-option value="expense">Expenses only</mat-option>
                <mat-option value="income">Income only</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <button mat-raised-button color="primary" (click)="exportCSV()" class="export-btn">
            <mat-icon>download</mat-icon> Download CSV
          </button>
        </div>

        <!-- JSON Export -->
        <div class="card export-card">
          <div class="export-icon json"><mat-icon>code</mat-icon></div>
          <h3>Export as JSON</h3>
          <p>Download complete data with summary in JSON format. Useful for backups or data migration.</p>
          <div class="export-filters">
            <mat-form-field appearance="outline">
              <mat-label>From Date</mat-label>
              <input matInput type="date" [(ngModel)]="startDate">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>To Date</mat-label>
              <input matInput type="date" [(ngModel)]="endDate">
            </mat-form-field>
          </div>
          <button mat-raised-button color="accent" (click)="exportJSON()" class="export-btn">
            <mat-icon>download</mat-icon> Download JSON
          </button>
        </div>
      </div>

      <!-- Quick export buttons -->
      <div class="card">
        <h3>Quick Export</h3>
        <div class="quick-btns">
          <button mat-stroked-button (click)="quickExport('this_month')">
            <mat-icon>today</mat-icon> This Month
          </button>
          <button mat-stroked-button (click)="quickExport('last_month')">
            <mat-icon>history</mat-icon> Last Month
          </button>
          <button mat-stroked-button (click)="quickExport('this_year')">
            <mat-icon>date_range</mat-icon> This Year
          </button>
          <button mat-stroked-button (click)="quickExport('all')">
            <mat-icon>all_inclusive</mat-icon> All Time
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .export-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; }
    @media(max-width:768px) { .export-grid { grid-template-columns:1fr; } }
    .export-card { text-align:center; }
    .export-icon { width:64px; height:64px; border-radius:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
    .export-icon mat-icon { font-size:36px; width:36px; height:36px; color:#fff; }
    .export-icon.csv { background:linear-gradient(135deg,#38a169,#276749); }
    .export-icon.json { background:linear-gradient(135deg,#4c51bf,#434190); }
    h3 { font-size:18px; font-weight:600; margin-bottom:8px; }
    p { color:#718096; font-size:14px; margin-bottom:16px; }
    .export-filters { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; text-align:left; }
    .export-filters mat-form-field { margin:0; }
    .export-btn { width:100%; height:48px; font-size:15px; }
    .quick-btns { display:flex; flex-wrap:wrap; gap:12px; }
    .quick-btns button { display:flex; align-items:center; gap:8px; }
  `]
})
export class ExportComponent {
  startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  endDate = new Date().toISOString().split('T')[0];
  filterType = '';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  exportCSV() {
    const params = `start_date=${this.startDate}&end_date=${this.endDate}&type=${this.filterType}`;
    const token = localStorage.getItem('token');
    fetch(`${environment.apiUrl}/export/csv?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob()).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `expenses_${this.startDate}_${this.endDate}.csv`; a.click();
        this.snackBar.open('CSV downloaded!', '', { duration: 2000 });
      });
  }

  exportJSON() {
    const params = `start_date=${this.startDate}&end_date=${this.endDate}`;
    const token = localStorage.getItem('token');
    fetch(`${environment.apiUrl}/export/json?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob()).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `expenses_${this.startDate}_${this.endDate}.json`; a.click();
        this.snackBar.open('JSON downloaded!', '', { duration: 2000 });
      });
  }

  quickExport(period: string) {
    const now = new Date();
    if (period === 'this_month') {
      this.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      this.endDate = now.toISOString().split('T')[0];
    } else if (period === 'last_month') {
      this.startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      this.endDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    } else if (period === 'this_year') {
      this.startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      this.endDate = now.toISOString().split('T')[0];
    } else {
      this.startDate = '2020-01-01';
      this.endDate = now.toISOString().split('T')[0];
    }
    this.exportCSV();
  }
}
