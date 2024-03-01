import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAvailableDate, NewAvailableDate } from '../available-date.model';

export type PartialUpdateAvailableDate = Partial<IAvailableDate> & Pick<IAvailableDate, 'id'>;

type RestOf<T extends IAvailableDate | NewAvailableDate> = Omit<T, 'fromTime' | 'toTime'> & {
  fromTime?: string | null;
  toTime?: string | null;
};

export type RestAvailableDate = RestOf<IAvailableDate>;

export type NewRestAvailableDate = RestOf<NewAvailableDate>;

export type PartialUpdateRestAvailableDate = RestOf<PartialUpdateAvailableDate>;

export type EntityResponseType = HttpResponse<IAvailableDate>;
export type EntityArrayResponseType = HttpResponse<IAvailableDate[]>;

@Injectable({ providedIn: 'root' })
export class AvailableDateService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/available-dates');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(availableDate: NewAvailableDate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(availableDate);
    return this.http
      .post<RestAvailableDate>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(availableDate: IAvailableDate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(availableDate);
    return this.http
      .put<RestAvailableDate>(`${this.resourceUrl}/${this.getAvailableDateIdentifier(availableDate)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(availableDate: PartialUpdateAvailableDate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(availableDate);
    return this.http
      .patch<RestAvailableDate>(`${this.resourceUrl}/${this.getAvailableDateIdentifier(availableDate)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAvailableDate>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAvailableDate[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAvailableDateIdentifier(availableDate: Pick<IAvailableDate, 'id'>): number {
    return availableDate.id;
  }

  compareAvailableDate(o1: Pick<IAvailableDate, 'id'> | null, o2: Pick<IAvailableDate, 'id'> | null): boolean {
    return o1 && o2 ? this.getAvailableDateIdentifier(o1) === this.getAvailableDateIdentifier(o2) : o1 === o2;
  }

  addAvailableDateToCollectionIfMissing<Type extends Pick<IAvailableDate, 'id'>>(
    availableDateCollection: Type[],
    ...availableDatesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const availableDates: Type[] = availableDatesToCheck.filter(isPresent);
    if (availableDates.length > 0) {
      const availableDateCollectionIdentifiers = availableDateCollection.map(
        availableDateItem => this.getAvailableDateIdentifier(availableDateItem)!
      );
      const availableDatesToAdd = availableDates.filter(availableDateItem => {
        const availableDateIdentifier = this.getAvailableDateIdentifier(availableDateItem);
        if (availableDateCollectionIdentifiers.includes(availableDateIdentifier)) {
          return false;
        }
        availableDateCollectionIdentifiers.push(availableDateIdentifier);
        return true;
      });
      return [...availableDatesToAdd, ...availableDateCollection];
    }
    return availableDateCollection;
  }

  protected convertDateFromClient<T extends IAvailableDate | NewAvailableDate | PartialUpdateAvailableDate>(availableDate: T): RestOf<T> {
    return {
      ...availableDate,
      fromTime: availableDate.fromTime?.toJSON() ?? null,
      toTime: availableDate.toTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAvailableDate: RestAvailableDate): IAvailableDate {
    return {
      ...restAvailableDate,
      fromTime: restAvailableDate.fromTime ? dayjs(restAvailableDate.fromTime) : undefined,
      toTime: restAvailableDate.toTime ? dayjs(restAvailableDate.toTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAvailableDate>): HttpResponse<IAvailableDate> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAvailableDate[]>): HttpResponse<IAvailableDate[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
