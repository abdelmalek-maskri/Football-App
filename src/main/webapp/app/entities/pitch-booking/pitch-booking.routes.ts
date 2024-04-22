import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PitchBookingComponent } from './list/pitch-booking.component';
import { PitchBookingDetailComponent } from './detail/pitch-booking-detail.component';
import { PitchBookingUpdateComponent } from './update/pitch-booking-update.component';
import PitchBookingResolve from './route/pitch-booking-routing-resolve.service';

const pitchBookingRoute: Routes = [
  {
    path: '',
    component: PitchBookingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PitchBookingDetailComponent,
    resolve: {
      pitchBooking: PitchBookingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PitchBookingUpdateComponent,
    resolve: {
      pitchBooking: PitchBookingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PitchBookingUpdateComponent,
    resolve: {
      pitchBooking: PitchBookingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pitchBookingRoute;
