import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-currency-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h3>Currency Trends</h3>

      <div class="period-buttons">
        <button
          *ngFor="let period of periods"
          [style.background-color]="selectedPeriod === period.value ? '#2196F3' : 'white'"
          [style.color]="selectedPeriod === period.value ? 'white' : 'black'"
          (click)="changePeriod(period.value)"
          style="margin: 5px; padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;"
        >
          {{ period.label }}
        </button>
      </div>

      <!-- Canvas stay hidden while loading -->
      <div style="width: 100%; height: 400px; position: relative;">
        <div
          *ngIf="isLoading"
          style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; z-index: 10;"
        >
          <div
            style="display: inline-block; width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 2s linear infinite;"
          ></div>
          <p style="margin-top: 15px;">Loading chart data...</p>
        </div>
        <canvas id="testChart" width="600" height="300"></canvas>
      </div>
    </div>
  `,
  styles: [
    `
      .chart-container {
        background: white;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #ddd;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class CurrencyChart implements AfterViewInit, OnDestroy {
  chart: any;
  isLoading = true;
  selectedPeriod = '7d';

  periods = [
    { value: '1d', label: '1 Day' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

  ngAfterViewInit(): void {
    console.log('AfterViewInit called');

    // Wait some time to make sure DOM is ready
    setTimeout(() => {
      console.log('Trying to create chart...');
      this.createSimpleChart();
    }, 1500);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  changePeriod(period: string): void {
    console.log('Period changed to:', period);
    this.selectedPeriod = period;
    this.isLoading = true;

    setTimeout(() => {
      this.createSimpleChart();
    }, 800);
  }

  private createSimpleChart(): void {
    console.log('Creating chart...');

    if (this.chart) {
      console.log('Destroying existing chart');
      this.chart.destroy();
    }

    const canvas = document.getElementById('testChart') as HTMLCanvasElement;
    console.log('Canvas element:', canvas);
    console.log('Canvas found:', !!canvas);

    if (!canvas) {
      console.error('Canvas not found!');
      this.isLoading = false;
      return;
    }

    // Just a mock since free API doesnt give historical data
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const eurData = [0.85, 0.86, 0.84, 0.87, 0.85, 0.88, 0.86];
    const brlData = [5.2, 5.3, 5.1, 5.4, 5.2, 5.5, 5.3];

    try {
      console.log('Creating Chart instance...');

      this.chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'USD/EUR',
              data: eurData,
              borderColor: '#2196F3',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              borderWidth: 3,
              fill: false,
              tension: 0.3,
            },
            {
              label: 'USD/BRL',
              data: brlData,
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderWidth: 3,
              fill: false,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Currency Trends - ${this.selectedPeriod}`,
              font: {
                size: 16,
              },
            },
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Exchange Rate',
              },
            },
          },
        },
      });

      console.log('Chart created successfully!', this.chart);
      this.isLoading = false;
    } catch (error) {
      console.error('Error creating chart:', error);
      this.isLoading = false;
    }
  }
}
