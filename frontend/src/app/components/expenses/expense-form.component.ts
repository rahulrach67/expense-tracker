import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExpenseService } from '../../services/expense.service';
import { Category, Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  template: `
    <h2 mat-dialog-title>{{data.expense ? 'Edit' : 'Add'}} Transaction</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            <mat-option value="expense">Expense</mat-option>
            <mat-option value="income">Income</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="e.g. Grocery shopping">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Amount (₹)</mat-label>
          <input matInput type="number" formControlName="amount" placeholder="0.00">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Date</mat-label>
          <input matInput type="date" formControlName="date">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category_id">
            <mat-option [value]="null">None</mat-option>
            <mat-option *ngFor="let cat of categories" [value]="cat.id">
              {{cat.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Notes (optional)</mat-label>
          <textarea matInput formControlName="notes" rows="3" placeholder="Additional details..."></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid || saving">
        {{saving ? 'Saving...' : 'Save'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.form-grid { display:flex; flex-direction:column; gap:4px; min-width:340px; } textarea { resize:none; }`]
})
export class ExpenseFormComponent implements OnInit {
  form = this.fb.group({
    type: ['expense', Validators.required],
    title: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    category_id: [null],
    notes: ['']
  });
  categories: Category[] = [];
  saving = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExpenseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { expense?: Expense },
    private expenseService: ExpenseService
  ) {}

  ngOnInit() {
    this.expenseService.getCategories().subscribe(c => this.categories = c);
    if (this.data.expense) {
      this.form.patchValue({ ...this.data.expense });
    }
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    const value = this.form.value;
    const obs = this.data.expense
      ? this.expenseService.updateExpense(this.data.expense.id!, value)
      : this.expenseService.createExpense(value);
    obs.subscribe(
      result => this.dialogRef.close(result),
      () => { this.saving = false; }
    );
  }
}
