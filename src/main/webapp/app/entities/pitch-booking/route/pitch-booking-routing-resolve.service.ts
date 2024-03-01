import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPitchBooking } from '../pitch-booking.model';
import { PitchBookingService } from '../service/pitch-booking.service';

@Injectable({ providedIn: 'root' })
export class PitchBookingRoutingResolveService implements Resolve<IPitchBooking | null> {
  constructor(protected service: PitchBookingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPitchBooking | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pitchBooking: HttpResponse<IPitchBooking>) => {
          if (pitchBooking.body) {
            return of(pitchBooking.body);
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
