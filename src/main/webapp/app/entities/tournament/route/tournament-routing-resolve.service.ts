import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITournament } from '../tournament.model';
import { TournamentService } from '../service/tournament.service';

@Injectable({ providedIn: 'root' })
export class TournamentRoutingResolveService implements Resolve<ITournament | null> {
  constructor(protected service: TournamentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITournament | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tournament: HttpResponse<ITournament>) => {
          if (tournament.body) {
            return of(tournament.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
