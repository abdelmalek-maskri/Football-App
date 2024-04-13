import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalPlayerComponent } from './historical-player.component';

describe('HistoricalPlayerComponent', () => {
  let component: HistoricalPlayerComponent;
  let fixture: ComponentFixture<HistoricalPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoricalPlayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricalPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
