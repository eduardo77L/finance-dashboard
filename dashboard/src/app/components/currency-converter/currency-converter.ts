import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExchangeRateService } from '../../services/exchange-rate';
import { Subscription } from 'rxjs';

interface Currency {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currency-converter.html',
  styleUrls: ['./currency-converter.scss'],
})
export class CurrencyConverter implements OnInit, OnDestroy {
  amount: number = 1;
  fromCurrency: string = 'USD';
  toCurrency: string = 'EUR';
  convertedAmount: number = 0;
  isLoading: boolean = false;

  private subscription: Subscription = new Subscription();
  private exchangeRates: { [key: string]: number } = {};

  currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  ];

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.loadExchangeRates();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadExchangeRates(): void {
    this.isLoading = true;

    const ratesSub = this.exchangeRateService.getRates('USD').subscribe((rates) => {
      this.exchangeRates['USD'] = 1;
      rates.forEach((rate) => {
        this.exchangeRates[rate.currency] = rate.rate;
      });

      this.isLoading = false;
      this.convert();
    });

    this.subscription.add(ratesSub);
  }

  convert(): void {
    if (this.amount && this.fromCurrency && this.toCurrency) {
      const usdAmount =
        this.fromCurrency === 'USD'
          ? this.amount
          : this.amount / this.exchangeRates[this.fromCurrency];

      this.convertedAmount =
        this.toCurrency === 'USD' ? usdAmount : usdAmount * this.exchangeRates[this.toCurrency];
    }
  }

  swapCurrencies(): void {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
    this.convert();
  }
}
