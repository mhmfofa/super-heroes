import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesReportComponent } from './heroes-report.component';

describe('HeroesReportComponent', () => {
  let component: HeroesReportComponent;
  let fixture: ComponentFixture<HeroesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeroesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
