import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TournamentService } from '../service/tournament.service';

import { TournamentComponent } from './tournament.component';

describe('Tournament Management Component', () => {
  let comp: TournamentComponent;
  let fixture: ComponentFixture<TournamentComponent>;
  let service: TournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'tournament', component: TournamentComponent }]), HttpClientTestingModule],
      declarations: [TournamentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(TournamentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TournamentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TournamentService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.tournaments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to tournamentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTournamentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTournamentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
