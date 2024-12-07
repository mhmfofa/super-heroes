import { Component, OnDestroy, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartType } from 'chart.js';
import { ChartDataModel } from '../../models';
import { ChartTypeEnum } from '../../enums';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ChartComponent implements OnDestroy, OnChanges {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() chartData!: ChartDataModel;
  private chart: Chart | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['chartData'])
      this.createChart();
    
  }

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas?.nativeElement.getContext('2d');
    if (ctx && this.chartData) {
      const chartConfig: ChartConfiguration<ChartType, number[], string> = this.getChartConfig();
      this.chart = new Chart(ctx, chartConfig);
    }
  }

  getChartConfig() {
    const chartConfig: ChartConfiguration<ChartType, number[], string> = {
      type: this.chartData.type,
      data: {
        labels: this.chartData.labels,
        datasets: [{
          label: 'Data Distribution',
          data: this.chartData.dataset.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: this.chartData.type === ChartTypeEnum.Bar ? {
          x: {
            display:false
          },
          y: {
            beginAtZero: true
          }
        } : {},
      }
    };

    return chartConfig;
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
