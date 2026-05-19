import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { BudgetComponent } from './components/budget/budget.component';
import { RecurringComponent } from './components/recurring/recurring.component';
import { ExportComponent } from './components/export/export.component';
import { CurrencyComponent } from './components/currency/currency.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'budget', component: BudgetComponent },
      { path: 'recurring', component: RecurringComponent },
      { path: 'export', component: ExportComponent },
      { path: 'currency', component: CurrencyComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
