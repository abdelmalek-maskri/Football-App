import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TournamentDetailComponent } from './tournament-detail.component';

describe('Tournament Management Detail Component', () => {
  let comp: TournamentDetailComponent;
  let fixture: ComponentFixture<TournamentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TournamentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ tournament: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TournamentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TournamentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load tournament on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.tournament).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
