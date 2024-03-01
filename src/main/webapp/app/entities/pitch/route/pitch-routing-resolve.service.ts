import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPitch } from '../pitch.model';
import { PitchService } from '../service/pitch.service';

@Injectable({ providedIn: 'root' })
export class PitchRoutingResolveService implements Resolve<IPitch | null> {
  constructor(protected service: PitchService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPitch | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pitch: HttpResponse<IPitch>) => {
          if (pitch.body) {
            return of(pitch.body);
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
