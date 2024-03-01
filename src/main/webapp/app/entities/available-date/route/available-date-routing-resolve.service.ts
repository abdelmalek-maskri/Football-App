import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAvailableDate } from '../available-date.model';
import { AvailableDateService } from '../service/available-date.service';

@Injectable({ providedIn: 'root' })
export class AvailableDateRoutingResolveService implements Resolve<IAvailableDate | null> {
  constructor(protected service: AvailableDateService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAvailableDate | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((availableDate: HttpResponse<IAvailableDate>) => {
          if (availableDate.body) {
            return of(availableDate.body);
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
