import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeRateService } from '../../services/exchange-rate';
import { CurrencyConverter } from '../currency-converter/currency-converter';
import { Subscription } from 'rxjs';
import { CurrencyChart } from '../currency-chart/currency-chart';

interface SummaryCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  loading?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyConverter, CurrencyChart],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  summaryCards: SummaryCard[] = [
    {
      title: 'Total Balance',
      value: '$12,450.00',
      change: '+2.5% today',
      changeType: 'positive',
      icon: '💰',
    },
    {
      title: 'USD/EUR',
      value: 'Loading...',
      change: 'Loading...',
      changeType: 'neutral',
      icon: '🇪🇺',
      loading: true,
    },
    {
      title: 'USD/BRL',
      value: 'Loading...',
      change: 'Loading...',
      changeType: 'neutral',
      icon: '🇧🇷',
      loading: true,
    },
    {
      title: 'Portfolio Value',
      value: '$8,230.50',
      change: '+1.2% today',
      changeType: 'positive',
      icon: '📈',
    },
  ];

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.loadExchangeRates();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadExchangeRates(): void {
    const ratesSub = this.exchangeRateService.getRates('USD').subscribe((rates) => {
      const eurRate = rates.find((r) => r.currency === 'EUR');
      if (eurRate) {
        this.summaryCards[1] = {
          title: 'USD/EUR',
          value: eurRate.rate.toFixed(4),
          change: 'Live rate',
          changeType: 'neutral',
          icon: '🇪🇺',
          loading: false,
        };
      }

      const brlRate = rates.find((r) => r.currency === 'BRL');
      if (brlRate) {
        this.summaryCards[2] = {
          title: 'USD/BRL',
          value: brlRate.rate.toFixed(2),
          change: 'Live rate',
          changeType: 'neutral',
          icon: '🇧🇷',
          loading: false,
        };
      }
    });

    this.subscription.add(ratesSub);
  }
}
