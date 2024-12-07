import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroDialogComponent } from './hero-dialog.component';

describe('CreateHeroDialogComponent', () => {
  let component: HeroDialogComponent;
  let fixture: ComponentFixture<HeroDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
