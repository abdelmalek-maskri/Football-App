import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AvailableDateDetailComponent } from './available-date-detail.component';

describe('AvailableDate Management Detail Component', () => {
  let comp: AvailableDateDetailComponent;
  let fixture: ComponentFixture<AvailableDateDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvailableDateDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ availableDate: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AvailableDateDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AvailableDateDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load availableDate on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.availableDate).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
