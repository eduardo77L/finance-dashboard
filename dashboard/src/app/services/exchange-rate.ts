import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface ExchangeRateResponse {
  result: string;
  base_code: string;
  conversion_rates: { [key: string]: number };
  time_last_update_utc: string;
}

interface CurrencyRate {
  currency: string;
  rate: number;
  change?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private apiKey = '79132889419f2b14cef54bf7';
  private baseUrl = 'https://v6.exchangerate-api.com/v6';
  
  private ratesSubject = new BehaviorSubject<CurrencyRate[]>([]);
  public rates$ = this.ratesSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getRates(baseCurrency: string = 'USD'): Observable<CurrencyRate[]> {
    this.loadingSubject.next(true);
    
    const url = `${this.baseUrl}/${this.apiKey}/latest/${baseCurrency}`;
    
    return this.http.get<ExchangeRateResponse>(url).pipe(
      map(response => {
        const rates: CurrencyRate[] = [
          { currency: 'EUR', rate: response.conversion_rates['EUR'] },
          { currency: 'BRL', rate: response.conversion_rates['BRL'] },
          { currency: 'GBP', rate: response.conversion_rates['GBP'] },
          { currency: 'JPY', rate: response.conversion_rates['JPY'] }
        ];
        
        this.ratesSubject.next(rates);
        this.loadingSubject.next(false);
        return rates;
      }),
      catchError(error => {
        console.error('Error fetching exchange rates:', error);
        this.loadingSubject.next(false);
        
        // Return mock data on error
        const mockRates: CurrencyRate[] = [
          { currency: 'EUR', rate: 0.85 },
          { currency: 'BRL', rate: 5.23 },
          { currency: 'GBP', rate: 0.73 },
          { currency: 'JPY', rate: 110.25 }
        ];
        
        this.ratesSubject.next(mockRates);
        return of(mockRates);
      })
    );
  }
}
