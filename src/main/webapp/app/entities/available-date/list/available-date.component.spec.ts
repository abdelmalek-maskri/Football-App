import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AvailableDateService } from '../service/available-date.service';

import { AvailableDateComponent } from './available-date.component';

describe('AvailableDate Management Component', () => {
  let comp: AvailableDateComponent;
  let fixture: ComponentFixture<AvailableDateComponent>;
  let service: AvailableDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'available-date', component: AvailableDateComponent }]), HttpClientTestingModule],
      declarations: [AvailableDateComponent],
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
      .overrideTemplate(AvailableDateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AvailableDateComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AvailableDateService);

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
    expect(comp.availableDates?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to availableDateService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAvailableDateIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAvailableDateIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
