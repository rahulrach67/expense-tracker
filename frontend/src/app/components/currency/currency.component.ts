import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-currency',
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Currency & Exchange Rates</h1></div>

      <!-- Preferred currency -->
      <div class="card">
        <h3>Preferred Currency</h3>
        <p class="subtitle">All amounts will be displayed in your preferred currency</p>
        <div class="currency-select-row">
          <div class="currency-option" *ngFor="let c of currencies"
            [class.selected]="selectedCurrency === c"
            (click)="selectCurrency(c)">
            <span class="flag">{{getFlag(c)}}</span>
            <span class="code">{{c}}</span>
          </div>
        </div>
        <button mat-raised-button color="primary" (click)="savePreference()" class="save-btn">
          <mat-icon>save</mat-icon> Save Preference
        </button>
      </div>

      <!-- Currency converter -->
      <div class="card">
        <h3>Currency Converter</h3>
        <div class="converter">
          <mat-form-field appearance="outline">
            <mat-label>Amount</mat-label>
            <input matInput type="number" [(ngModel)]="convertAmount" (input)="convert()">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>From</mat-label>
            <mat-select [(ngModel)]="fromCurrency" (selectionChange)="loadRates()">
              <mat-option *ngFor="let c of currencies" [value]="c">{{c}}</mat-option>
            </mat-select>
          </mat-form-field>
          <div class="swap-icon">
            <button mat-icon-button (click)="swapCurrencies()"><mat-icon>swap_horiz</mat-icon></button>
          </div>
          <mat-form-field appearance="outline">
            <mat-label>To</mat-label>
            <mat-select [(ngModel)]="toCurrency" (selectionChange)="convert()">
              <mat-option *ngFor="let c of currencies" [value]="c">{{c}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div class="result" *ngIf="convertedAmount !== null">
          <span class="from-amount">{{convertAmount}} {{fromCurrency}}</span>
          <mat-icon>arrow_forward</mat-icon>
          <span class="to-amount">{{convertedAmount | number:'1.2-4'}} {{toCurrency}}</span>
        </div>
      </div>

      <!-- Exchange rates table -->
      <div class="card">
        <div class="rates-header">
          <h3>Exchange Rates (Base: {{fromCurrency}})</h3>
          <span class="updated" *ngIf="ratesUpdated">Updated: {{ratesUpdated | date:'short'}}</span>
        </div>
        <div class="rates-grid" *ngIf="rates">
          <div class="rate-item" *ngFor="let c of currencies">
            <div class="rate-flag">{{getFlag(c)}}</div>
            <div class="rate-info">
              <div class="rate-code">{{c}}</div>
              <div class="rate-name">{{getCurrencyName(c)}}</div>
            </div>
            <div class="rate-value">{{rates[c] | number:'1.4-4'}}</div>
          </div>
        </div>
        <div class="loading-rates" *ngIf="!rates">
          <mat-spinner diameter="32"></mat-spinner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h3 { font-size:16px; font-weight:600; margin-bottom:8px; color:#2d3748; }
    .subtitle { color:#718096; font-size:13px; margin-bottom:16px; }
    .currency-select-row { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px; }
    .currency-option { padding:10px 16px; border-radius:10px; border:2px solid #e2e8f0; cursor:pointer; display:flex; align-items:center; gap:8px; transition:all 0.2s; }
    .currency-option:hover { border-color:#4c51bf; background:#ebf4ff; }
    .currency-option.selected { border-color:#4c51bf; background:#ebf4ff; font-weight:600; }
    .flag { font-size:20px; }
    .code { font-size:14px; font-weight:500; }
    .save-btn { height:44px; }
    .converter { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:16px; }
    .converter mat-form-field { flex:1; min-width:120px; margin:0; }
    .swap-icon { display:flex; align-items:center; }
    .result { background:#f7fafc; border-radius:10px; padding:16px 20px; display:flex; align-items:center; gap:16px; font-size:18px; }
    .from-amount { color:#718096; }
    .to-amount { font-weight:700; color:#4c51bf; font-size:22px; }
    .result mat-icon { color:#a0aec0; }
    .rates-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
    .updated { font-size:12px; color:#a0aec0; }
    .rates-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; }
    .rate-item { background:#f7fafc; border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:10px; }
    .rate-flag { font-size:24px; }
    .rate-info { flex:1; }
    .rate-code { font-weight:600; font-size:14px; }
    .rate-name { font-size:12px; color:#718096; }
    .rate-value { font-weight:700; color:#4c51bf; font-size:15px; }
    .loading-rates { display:flex; justify-content:center; padding:40px; }
  `]
})
export class CurrencyComponent implements OnInit {
  currencies = ['INR','USD','EUR','GBP','AED','SGD','AUD','CAD','JPY','CHF'];
  selectedCurrency = 'INR';
  fromCurrency = 'INR';
  toCurrency = 'USD';
  convertAmount = 1000;
  convertedAmount: number | null = null;
  rates: any = null;
  ratesUpdated: string | null = null;

  currencyNames: any = {
    INR:'Indian Rupee', USD:'US Dollar', EUR:'Euro', GBP:'British Pound',
    AED:'UAE Dirham', SGD:'Singapore Dollar', AUD:'Australian Dollar',
    CAD:'Canadian Dollar', JPY:'Japanese Yen', CHF:'Swiss Franc'
  };

  flags: any = {
    INR:'🇮🇳', USD:'🇺🇸', EUR:'🇪🇺', GBP:'🇬🇧',
    AED:'🇦🇪', SGD:'🇸🇬', AUD:'🇦🇺', CAD:'🇨🇦', JPY:'🇯🇵', CHF:'🇨🇭'
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() { this.loadRates(); }

  loadRates() {
    this.rates = null;
    this.http.get<any>(`${environment.apiUrl}/currency/rates?base=${this.fromCurrency}`).subscribe(r => {
      this.rates = r.rates;
      this.ratesUpdated = r.updated;
      this.convert();
    });
  }

  convert() {
    if (this.rates && this.rates[this.toCurrency]) {
      this.convertedAmount = this.convertAmount * this.rates[this.toCurrency];
    }
  }

  swapCurrencies() {
    [this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency];
    this.loadRates();
  }

  selectCurrency(c: string) { this.selectedCurrency = c; }

  savePreference() {
    this.http.put(`${environment.apiUrl}/currency/preference`, { currency: this.selectedCurrency }).subscribe(() => {
      this.snackBar.open(`Preferred currency set to ${this.selectedCurrency}`, '', { duration: 2000 });
    });
  }

  getFlag(c: string) { return this.flags[c] || '💱'; }
  getCurrencyName(c: string) { return this.currencyNames[c] || c; }
}
