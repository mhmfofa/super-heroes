import { Component, Input, Output, EventEmitter, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HeroModel, ChartDataModel } from '../../models';
import { ChartTypeEnum } from '../../enums';
import { NgFor } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-heroes-table',
  templateUrl: './heroes-table.component.html',
  styleUrls: ['./heroes-table.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    ChartComponent,
  ],
})
export class HeroesTableComponent implements OnInit {
  @Input() heroes: HeroModel[] = [];
  @Output() editHero = new EventEmitter<{ hero: HeroModel; event: Event }>();
  @Output() deleteHero = new EventEmitter<{ hero: HeroModel; event: Event }>();
  @Output() openHeroDetails = new EventEmitter<HeroModel>();

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nameLabel', 'genderLabel', 'citizenshipLabel', 'skillsLabel', 'actions'];
  displayedColumnsChart: string[] = ['nameLabel_chart', 'genderLabel_chart', 'citizenshipLabel_chart', 'skillsLabel_chart', 'actions_chart'];

  dataSource = new MatTableDataSource<HeroModel>();
  chartDataCache: Record<string, ChartDataModel> = {};

  ngOnInit() {
    this.dataSource.data = this.heroes;
  }

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges() {
    this.chartDataCache = {};
    this.dataSource.data = this.heroes;
    this.cdr.detectChanges()
    this.dataSource.sort = this.sort;
  }

  getColumnUniqueValues(columnName: keyof HeroModel): Set<string> {
    return new Set(this.dataSource.data.map(hero => hero[columnName]));
  }

getChartData(chartColumnName: string): ChartDataModel {
  if (this.chartDataCache[chartColumnName]) {
    return this.chartDataCache[chartColumnName]; // Use cached data
  }

  const columnName = chartColumnName.split('_')[0] as keyof HeroModel;
  const uniqueValues = this.getColumnUniqueValues(columnName);

  const columnItemsCount = Array.from(uniqueValues).map(value => {
    return this.dataSource.data.filter(hero => hero[columnName] === value).length;
  });

  const chartData = {
    type: uniqueValues.size > 5 ? ChartTypeEnum.Bar : ChartTypeEnum.Pie,
    labels: Array.from(uniqueValues),
    dataset: {
      label: columnName,
      data: columnItemsCount,
    },
  };

  this.chartDataCache[chartColumnName] = chartData;
  return chartData;
}


  onEditHero(hero: HeroModel, event: Event) {
    this.editHero.emit({ hero, event });
  }

  onDeleteHero(hero: HeroModel, event: Event) {
    this.deleteHero.emit({ hero, event });
  }

  onOpenHeroDetails(hero: HeroModel) {
    this.openHeroDetails.emit(hero);
  }
}
