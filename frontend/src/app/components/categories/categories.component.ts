import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseService } from '../../services/expense.service';
import { Category } from '../../models/expense.model';

@Component({
  selector: 'app-categories',
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Categories</h1></div>

      <div class="card add-card">
        <h3>Add Custom Category</h3>
        <form [formGroup]="form" (ngSubmit)="add()" class="add-form">
          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" placeholder="e.g. Subscriptions">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Icon (Material icon name)</mat-label>
            <input matInput formControlName="icon" placeholder="e.g. subscriptions">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Color</mat-label>
            <input matInput type="color" formControlName="color">
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
            <mat-icon>add</mat-icon> Add
          </button>
        </form>
      </div>

      <div class="card">
        <h3>All Categories</h3>
        <div class="cat-grid">
          <div class="cat-card" *ngFor="let c of categories">
            <div class="cat-icon-wrap" [style.background]="c.color || '#667eea'">
              <mat-icon>{{c.icon || 'category'}}</mat-icon>
            </div>
            <div class="cat-name">{{c.name}}</div>
            <div class="cat-badge" *ngIf="c.is_default">Default</div>
            <button mat-icon-button color="warn" *ngIf="!c.is_default" (click)="remove(c)" class="del-btn">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-card h3, .card h3 { font-size:16px; font-weight:600; color:#2d3748; margin-bottom:16px; }
    .add-form { display:flex; flex-wrap:wrap; gap:12px; align-items:flex-start; }
    .add-form mat-form-field { flex:1; min-width:160px; margin:0; }
    .cat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:16px; }
    .cat-card { background:#f7fafc; border-radius:12px; padding:16px; text-align:center; position:relative; }
    .cat-icon-wrap { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; }
    .cat-icon-wrap mat-icon { color:#fff; }
    .cat-name { font-size:13px; font-weight:500; color:#2d3748; }
    .cat-badge { font-size:11px; color:#718096; margin-top:4px; }
    .del-btn { position:absolute; top:4px; right:4px; width:28px; height:28px; }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  form = this.fb.group({ name: ['', Validators.required], icon: ['category'], color: ['#667eea'] });

  constructor(private expenseService: ExpenseService, private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit() { this.load(); }
  load() { this.expenseService.getCategories().subscribe(c => this.categories = c); }

  add() {
    if (this.form.invalid) return;
    this.expenseService.createCategory(this.form.value).subscribe(() => {
      this.load();
      this.form.reset({ icon: 'category', color: '#667eea' });
      this.snackBar.open('Category added', '', { duration: 2000 });
    });
  }

  remove(c: Category) {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    this.expenseService.deleteCategory(c.id!).subscribe(() => { this.load(); this.snackBar.open('Deleted', '', { duration: 2000 }); });
  }
}
