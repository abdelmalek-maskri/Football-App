import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPitch, NewPitch } from '../pitch.model';

export type PartialUpdatePitch = Partial<IPitch> & Pick<IPitch, 'id'>;

export type EntityResponseType = HttpResponse<IPitch>;
export type EntityArrayResponseType = HttpResponse<IPitch[]>;

@Injectable({ providedIn: 'root' })
export class PitchService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pitches');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pitch: NewPitch): Observable<EntityResponseType> {
    return this.http.post<IPitch>(this.resourceUrl, pitch, { observe: 'response' });
  }

  update(pitch: IPitch): Observable<EntityResponseType> {
    return this.http.put<IPitch>(`${this.resourceUrl}/${this.getPitchIdentifier(pitch)}`, pitch, { observe: 'response' });
  }

  partialUpdate(pitch: PartialUpdatePitch): Observable<EntityResponseType> {
    return this.http.patch<IPitch>(`${this.resourceUrl}/${this.getPitchIdentifier(pitch)}`, pitch, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPitch>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPitch[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPitchIdentifier(pitch: Pick<IPitch, 'id'>): number {
    return pitch.id;
  }

  comparePitch(o1: Pick<IPitch, 'id'> | null, o2: Pick<IPitch, 'id'> | null): boolean {
    return o1 && o2 ? this.getPitchIdentifier(o1) === this.getPitchIdentifier(o2) : o1 === o2;
  }

  addPitchToCollectionIfMissing<Type extends Pick<IPitch, 'id'>>(
    pitchCollection: Type[],
    ...pitchesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pitches: Type[] = pitchesToCheck.filter(isPresent);
    if (pitches.length > 0) {
      const pitchCollectionIdentifiers = pitchCollection.map(pitchItem => this.getPitchIdentifier(pitchItem)!);
      const pitchesToAdd = pitches.filter(pitchItem => {
        const pitchIdentifier = this.getPitchIdentifier(pitchItem);
        if (pitchCollectionIdentifiers.includes(pitchIdentifier)) {
          return false;
        }
        pitchCollectionIdentifiers.push(pitchIdentifier);
        return true;
      });
      return [...pitchesToAdd, ...pitchCollection];
    }
    return pitchCollection;
  }
}
