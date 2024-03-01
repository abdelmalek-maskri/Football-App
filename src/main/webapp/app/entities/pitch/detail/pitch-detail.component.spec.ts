import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PitchDetailComponent } from './pitch-detail.component';

describe('Pitch Management Detail Component', () => {
  let comp: PitchDetailComponent;
  let fixture: ComponentFixture<PitchDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PitchDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pitch: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PitchDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PitchDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pitch on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pitch).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
