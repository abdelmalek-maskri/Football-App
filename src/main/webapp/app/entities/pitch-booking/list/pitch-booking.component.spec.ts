import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PitchBookingService } from '../service/pitch-booking.service';

import { PitchBookingComponent } from './pitch-booking.component';

describe('PitchBooking Management Component', () => {
  let comp: PitchBookingComponent;
  let fixture: ComponentFixture<PitchBookingComponent>;
  let service: PitchBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'pitch-booking', component: PitchBookingComponent }]), HttpClientTestingModule],
      declarations: [PitchBookingComponent],
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
      .overrideTemplate(PitchBookingComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PitchBookingComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PitchBookingService);

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
    expect(comp.pitchBookings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to pitchBookingService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPitchBookingIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPitchBookingIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
