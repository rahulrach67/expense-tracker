import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Charts
import { ChartsModule } from 'ng2-charts';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { ExpenseFormComponent } from './components/expenses/expense-form.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { BudgetComponent } from './components/budget/budget.component';
import { RecurringComponent } from './components/recurring/recurring.component';
import { ExportComponent } from './components/export/export.component';
import { CurrencyComponent } from './components/currency/currency.component';

// Services
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LayoutComponent,
    DashboardComponent,
    ExpensesComponent,
    ExpenseFormComponent,
    ReportsComponent,
    CategoriesComponent,
    BudgetComponent,
    RecurringComponent,
    ExportComponent,
    CurrencyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule,
    MatToolbarModule, MatSidenavModule, MatListModule, MatButtonModule, MatIconModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTableModule, MatPaginatorModule, MatDialogModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatProgressBarModule, MatTooltipModule, MatBadgeModule,
    MatSlideToggleModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  entryComponents: [ExpenseFormComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
