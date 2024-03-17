import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPitchBooking, NewPitchBooking } from '../pitch-booking.model';
import { Dayjs } from 'dayjs';
import { DatePipe } from '@angular/common';

export type PartialUpdatePitchBooking = Partial<IPitchBooking> & Pick<IPitchBooking, 'id'>;

type RestOf<T extends IPitchBooking | NewPitchBooking> = Omit<T, 'bookingDate' | 'startTime' | 'endTime'> & {
  bookingDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
};

export type RestPitchBooking = RestOf<IPitchBooking>;

export type NewRestPitchBooking = RestOf<NewPitchBooking>;

export type PartialUpdateRestPitchBooking = RestOf<PartialUpdatePitchBooking>;

export type EntityResponseType = HttpResponse<IPitchBooking>;
export type EntityArrayResponseType = HttpResponse<IPitchBooking[]>;

@Injectable({ providedIn: 'root' })
export class PitchBookingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pitch-bookings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pitchBooking: NewPitchBooking): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pitchBooking);
    return this.http
      .post<RestPitchBooking>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pitchBooking: IPitchBooking): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pitchBooking);
    return this.http
      .put<RestPitchBooking>(`${this.resourceUrl}/${this.getPitchBookingIdentifier(pitchBooking)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pitchBooking: PartialUpdatePitchBooking): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pitchBooking);
    return this.http
      .patch<RestPitchBooking>(`${this.resourceUrl}/${this.getPitchBookingIdentifier(pitchBooking)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPitchBooking>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPitchBooking[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  // Method to get available time slots for a specified date
  getAvailableTimeSlots(date: Dayjs): Observable<EntityArrayResponseType> {
    const isoDateString = date.toISOString(); // Convert Dayjs to ISO string bcs its weird
    return this.http
      .get<RestPitchBooking[]>(`api/time-slots`, { params: { date: isoDateString }, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPitchBookingIdentifier(pitchBooking: Pick<IPitchBooking, 'id'>): number {
    return pitchBooking.id;
  }

  comparePitchBooking(o1: Pick<IPitchBooking, 'id'> | null, o2: Pick<IPitchBooking, 'id'> | null): boolean {
    return o1 && o2 ? this.getPitchBookingIdentifier(o1) === this.getPitchBookingIdentifier(o2) : o1 === o2;
  }

  addPitchBookingToCollectionIfMissing<Type extends Pick<IPitchBooking, 'id'>>(
    pitchBookingCollection: Type[],
    ...pitchBookingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pitchBookings: Type[] = pitchBookingsToCheck.filter(isPresent);
    if (pitchBookings.length > 0) {
      const pitchBookingCollectionIdentifiers = pitchBookingCollection.map(
        pitchBookingItem => this.getPitchBookingIdentifier(pitchBookingItem)!
      );
      const pitchBookingsToAdd = pitchBookings.filter(pitchBookingItem => {
        const pitchBookingIdentifier = this.getPitchBookingIdentifier(pitchBookingItem);
        if (pitchBookingCollectionIdentifiers.includes(pitchBookingIdentifier)) {
          return false;
        }
        pitchBookingCollectionIdentifiers.push(pitchBookingIdentifier);
        return true;
      });
      return [...pitchBookingsToAdd, ...pitchBookingCollection];
    }
    return pitchBookingCollection;
  }

  protected convertDateFromClient<T extends IPitchBooking | NewPitchBooking | PartialUpdatePitchBooking>(pitchBooking: T): RestOf<T> {
    return {
      ...pitchBooking,
      bookingDate: pitchBooking.bookingDate?.toJSON() ?? null,
      startTime: pitchBooking.startTime?.toJSON() ?? null,
      endTime: pitchBooking.endTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPitchBooking: RestPitchBooking): IPitchBooking {
    return {
      ...restPitchBooking,
      bookingDate: restPitchBooking.bookingDate ? dayjs(restPitchBooking.bookingDate) : undefined,
      startTime: restPitchBooking.startTime ? dayjs(restPitchBooking.startTime) : undefined,
      endTime: restPitchBooking.endTime ? dayjs(restPitchBooking.endTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPitchBooking>): HttpResponse<IPitchBooking> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPitchBooking[]>): HttpResponse<IPitchBooking[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
