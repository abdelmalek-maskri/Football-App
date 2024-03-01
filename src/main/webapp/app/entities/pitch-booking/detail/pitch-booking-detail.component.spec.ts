import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PitchBookingDetailComponent } from './pitch-booking-detail.component';

describe('PitchBooking Management Detail Component', () => {
  let comp: PitchBookingDetailComponent;
  let fixture: ComponentFixture<PitchBookingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PitchBookingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pitchBooking: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PitchBookingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PitchBookingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pitchBooking on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pitchBooking).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
