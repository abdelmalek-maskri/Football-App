import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITournament, NewTournament } from '../tournament.model';

export type PartialUpdateTournament = Partial<ITournament> & Pick<ITournament, 'id'>;

type RestOf<T extends ITournament | NewTournament> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestTournament = RestOf<ITournament>;

export type NewRestTournament = RestOf<NewTournament>;

export type PartialUpdateRestTournament = RestOf<PartialUpdateTournament>;

export type EntityResponseType = HttpResponse<ITournament>;
export type EntityArrayResponseType = HttpResponse<ITournament[]>;

@Injectable({ providedIn: 'root' })
export class TournamentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tournaments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tournament: NewTournament): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tournament);
    return this.http
      .post<RestTournament>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(tournament: ITournament): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tournament);
    return this.http
      .put<RestTournament>(`${this.resourceUrl}/${this.getTournamentIdentifier(tournament)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(tournament: PartialUpdateTournament): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tournament);
    return this.http
      .patch<RestTournament>(`${this.resourceUrl}/${this.getTournamentIdentifier(tournament)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTournament>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTournament[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTournamentIdentifier(tournament: Pick<ITournament, 'id'>): number {
    return tournament.id;
  }

  compareTournament(o1: Pick<ITournament, 'id'> | null, o2: Pick<ITournament, 'id'> | null): boolean {
    return o1 && o2 ? this.getTournamentIdentifier(o1) === this.getTournamentIdentifier(o2) : o1 === o2;
  }

  // joinTournament(tournamentId: number): Observable<EntityResponseType> {
  //   return this.http
  //     .patch<RestTournament>(`${this.resourceUrl}/${tournamentId}/join`, { observe: 'response' })
  //     .pipe(map(res => this.convertResponseFromServer(res)));
  // }

  addTournamentToCollectionIfMissing<Type extends Pick<ITournament, 'id'>>(
    tournamentCollection: Type[],
    ...tournamentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tournaments: Type[] = tournamentsToCheck.filter(isPresent);
    if (tournaments.length > 0) {
      const tournamentCollectionIdentifiers = tournamentCollection.map(tournamentItem => this.getTournamentIdentifier(tournamentItem)!);
      const tournamentsToAdd = tournaments.filter(tournamentItem => {
        const tournamentIdentifier = this.getTournamentIdentifier(tournamentItem);
        if (tournamentCollectionIdentifiers.includes(tournamentIdentifier)) {
          return false;
        }
        tournamentCollectionIdentifiers.push(tournamentIdentifier);
        return true;
      });
      return [...tournamentsToAdd, ...tournamentCollection];
    }
    return tournamentCollection;
  }

  protected convertDateFromClient<T extends ITournament | NewTournament | PartialUpdateTournament>(tournament: T): RestOf<T> {
    return {
      ...tournament,
      startDate: tournament.startDate?.toJSON() ?? null,
      endDate: tournament.endDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTournament: RestTournament): ITournament {
    return {
      ...restTournament,
      startDate: restTournament.startDate ? dayjs(restTournament.startDate) : undefined,
      endDate: restTournament.endDate ? dayjs(restTournament.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTournament>): HttpResponse<ITournament> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTournament[]>): HttpResponse<ITournament[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
