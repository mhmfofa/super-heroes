import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DataProviderService } from '../../services';
import { ChartDataModel, HeroModel } from '../../models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { NgFor } from '@angular/common';
import { Subject, delay, takeUntil } from 'rxjs';
import { HeroDialogComponent } from '../hero-dialog/hero-dialog.component';
import { generateUniqueId } from '../../utils';
import { ChartTypeEnum, DialogModeEnum } from '../../enums';
import { HeroesTableComponent } from '../heroes-table/heroes-table.component';

@Component({
  selector: 'app-heroes-report',
  templateUrl: './heroes-report.component.html',
  styleUrls: ['./heroes-report.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    HeroesTableComponent
  ],
})
export class HeroesReportComponent implements OnInit, OnDestroy {
  chartDataCache: Record<string, ChartDataModel> = {};
  displayedColumns: (keyof HeroModel | 'actions')[] = ['nameLabel', 'genderLabel', 'citizenshipLabel', 'skillsLabel', 'actions'];
  chartColumns: string[] = ['nameLabel_chart', 'genderLabel_chart', 'citizenshipLabel_chart', 'skillsLabel_chart', 'actions_chart'];
  allHeroes: HeroModel[] = [];
  filteredHeroes = new MatTableDataSource<HeroModel>([]);
  chips: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  loading: boolean = true;

  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();

  constructor(
    private dataProviderService: DataProviderService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dataProviderService.LoadData()
      .pipe(delay(2000), takeUntil(this.destroy$))
      .subscribe((heroes: HeroModel[]) => {
        this.allHeroes = heroes;
        this.applyFilters(); // Ensure the filters are applied when the data is loaded
        this.loading = false;
        this.cdr.detectChanges();
        this.filteredHeroes.sort = this.sort;
      });
  }

  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.chips.push(value);
      this.applyFilters(); // Reapply the filters after adding a chip
    }
    event.chipInput!.clear();
  }

  editChip(chip: string, event: any): void {
    const newChip = event.value.trim();
    const index = this.chips.indexOf(chip);
    if (index !== -1) {
      this.chips[index] = newChip;
      this.applyFilters(); // Reapply the filters after editing a chip
    }
  }

  removeChip(chip: string): void {
    const index = this.chips.indexOf(chip);
    if (index >= 0) {
      this.chips.splice(index, 1);
      this.applyFilters(); // Reapply the filters after removing a chip
    }
  }

  applyFilters(): void {
    if (this.chips.length === 0) {
      this.filteredHeroes.data = this.allHeroes;
    } else {
      this.filteredHeroes.data = this.allHeroes.filter(hero =>
        this.chips.some(chip => hero.nameLabel.toLowerCase().includes(chip.toLowerCase()))
      );
    }
    this.filteredHeroes.sort = this.sort;
    this.chartDataCache = {};
  }

  openHeroDetails(hero: HeroModel): void {
    this.dialog.open(HeroDialogComponent, {
      width: '400px',
      data: { hero, dialogMode: DialogModeEnum.Details },
    });
  }

  editHero(hero: HeroModel, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(HeroDialogComponent, {
      width: '400px',
      data: { hero, dialogMode: DialogModeEnum.Edit },
    });

    dialogRef.afterClosed().subscribe((updatedHero: HeroModel | undefined) => {
      if (updatedHero) {
        this.allHeroes = this.allHeroes.map(h => h.id === updatedHero.id ? updatedHero : h);
        this.applyFilters(); // Reapply the filters after editing a hero
      }
    });
  }

  deleteHero(hero: HeroModel, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete ${hero.nameLabel}?`)) {
      this.allHeroes = this.allHeroes.filter(h => h.id !== hero.id);
      this.applyFilters(); // Reapply the filters after deleting a hero
      this.dataProviderService.saveHeroes(this.allHeroes);
    }
  }

  createHero(): void {
    const dialogRef = this.dialog.open(HeroDialogComponent, {
      width: '400px',
      data: { dialogMode: DialogModeEnum.Add },
    });

    dialogRef.afterClosed().subscribe((result: HeroModel | undefined) => {
      if (result) {
        const newHero = { ...result, id: generateUniqueId() };
        this.allHeroes = [newHero, ...this.allHeroes];
        this.applyFilters(); // Reapply the filters after adding a new hero
      }
    });
  }

  getColumnUniqueValues(columnName: string): Set<string> {
    return new Set(this.filteredHeroes.data.map(hero => hero[columnName as keyof HeroModel]));
  }

  getChartData(chartColumnName: string): ChartDataModel {
    const columnName = chartColumnName.split('_')[0];
    if (this.chartDataCache[columnName]) {
      return this.chartDataCache[columnName];
    }

    const uniqueValues = this.getColumnUniqueValues(columnName);
    const columnItemsCount = Array.from(uniqueValues).map(value =>
      this.filteredHeroes.data.filter(hero => hero[columnName as keyof HeroModel] === value).length
    );

    const chartData: ChartDataModel = {
      type: uniqueValues.size > 5 ? ChartTypeEnum.Bar : ChartTypeEnum.Pie,
      labels: Array.from(uniqueValues),
      dataset: {
        label: columnName,
        data: columnItemsCount,
      },
    };

    this.chartDataCache[columnName] = chartData;

    return chartData;
  }

  getColumnData(columnName: keyof HeroModel): any[] {
    return this.allHeroes.map(hero => hero[columnName]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
