import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { ExpenseService } from '../../services/expense.service';
import { Expense, Category } from '../../models/expense.model';
import { ExpenseFormComponent } from './expense-form.component';

@Component({
  selector: 'app-expenses',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Transactions</h1>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Add Transaction
        </button>
      </div>

      <!-- Filters -->
      <div class="card filters-row">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="filters.search" (input)="onSearch()" placeholder="Search...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Type</mat-label>
          <mat-select [(ngModel)]="filters.type" (selectionChange)="load()">
            <mat-option value="">All</mat-option>
            <mat-option value="expense">Expense</mat-option>
            <mat-option value="income">Income</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="filters.category_id" (selectionChange)="load()">
            <mat-option value="">All</mat-option>
            <mat-option *ngFor="let c of categories" [value]="c.id">{{c.name}}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>From</mat-label>
          <input matInput type="date" [(ngModel)]="filters.start_date" (change)="load()">
        </mat-form-field>
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>To</mat-label>
          <input matInput type="date" [(ngModel)]="filters.end_date" (change)="load()">
        </mat-form-field>
      </div>

      <!-- Table -->
      <div class="card table-card">
        <div class="loading-bar" *ngIf="loading"><mat-progress-bar mode="indeterminate"></mat-progress-bar></div>
        <table mat-table [dataSource]="expenses" class="mat-elevation-z0">
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let e">{{e.date | date:'MMM d, y'}}</td>
          </ng-container>
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let e">
              <div class="title-cell">
                <div class="cat-dot" [style.background]="e.category_color || '#667eea'">
                  <mat-icon>{{e.category_icon || 'receipt'}}</mat-icon>
                </div>
                <div>
                  <div class="expense-title">{{e.title}}</div>
                  <div class="expense-notes" *ngIf="e.notes">{{e.notes}}</div>
                </div>
              </div>
            </td>
          </ng-container>
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let e">{{e.category_name || '—'}}</td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let e">
              <span [class]="e.type === 'income' ? 'badge-income' : 'badge-expense'">{{e.type | titlecase}}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef style="text-align:right">Amount</th>
            <td mat-cell *matCellDef="let e" style="text-align:right">
              <span class="amount-cell" [class.income-color]="e.type==='income'" [class.expense-color]="e.type==='expense'">
                {{e.type === 'income' ? '+' : '-'}}₹{{e.amount | number:'1.2-2'}}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let e">
              <button mat-icon-button (click)="openForm(e)" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="delete(e)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <div class="empty-state" *ngIf="!loading && expenses.length === 0">
          <mat-icon>receipt_long</mat-icon>
          <p>No transactions found</p>
        </div>
        <mat-paginator [length]="total" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .filters-row { display:flex; flex-wrap:wrap; gap:12px; align-items:center; padding:16px 24px; }
    .filter-field { flex:1; min-width:140px; margin:0 !important; }
    .table-card { padding:0; overflow:hidden; }
    .loading-bar { position:sticky; top:0; z-index:10; }
    .title-cell { display:flex; align-items:center; gap:10px; }
    .cat-dot { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .cat-dot mat-icon { color:#fff; font-size:18px; width:18px; height:18px; }
    .expense-title { font-weight:500; font-size:14px; }
    .expense-notes { font-size:12px; color:#a0aec0; }
    .amount-cell { font-weight:600; }
    .empty-state { text-align:center; padding:60px; color:#a0aec0; }
    .empty-state mat-icon { font-size:48px; width:48px; height:48px; }
    td, th { padding:12px 16px !important; }
  `]
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  categories: Category[] = [];
  total = 0;
  loading = false;
  columns = ['date', 'title', 'category', 'type', 'amount', 'actions'];
  filters: any = { type: '', category_id: '', search: '', start_date: '', end_date: '', page: 1, limit: 20 };
  searchTimer: any;

  constructor(private expenseService: ExpenseService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.expenseService.getCategories().subscribe(c => this.categories = c);
    this.load();
  }

  load() {
    this.loading = true;
    this.expenseService.getExpenses(this.filters).subscribe(r => {
      this.expenses = r.data;
      this.total = r.total;
      this.loading = false;
    }, () => this.loading = false);
  }

  onSearch() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.load(), 400);
  }

  onPage(e: any) { this.filters.page = e.pageIndex + 1; this.load(); }

  openForm(expense?: Expense) {
    const ref = this.dialog.open(ExpenseFormComponent, { data: { expense }, width: '480px' });
    ref.afterClosed().subscribe(r => { if (r) { this.load(); this.snackBar.open('Saved!', '', { duration: 2000 }); } });
  }

  delete(expense: Expense) {
    if (!confirm(`Delete "${expense.title}"?`)) return;
    this.expenseService.deleteExpense(expense.id!).subscribe(() => {
      this.load();
      this.snackBar.open('Deleted', '', { duration: 2000 });
    });
  }
}
