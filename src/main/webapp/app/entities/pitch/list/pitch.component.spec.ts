import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PitchService } from '../service/pitch.service';

import { PitchComponent } from './pitch.component';

describe('Pitch Management Component', () => {
  let comp: PitchComponent;
  let fixture: ComponentFixture<PitchComponent>;
  let service: PitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'pitch', component: PitchComponent }]), HttpClientTestingModule],
      declarations: [PitchComponent],
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
      .overrideTemplate(PitchComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PitchComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PitchService);

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
    expect(comp.pitches?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to pitchService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPitchIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPitchIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
