import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PitchBookingComponent } from '../list/pitch-booking.component';
import { PitchBookingDetailComponent } from '../detail/pitch-booking-detail.component';
import { PitchBookingUpdateComponent } from '../update/pitch-booking-update.component';
import { PitchBookingRoutingResolveService } from './pitch-booking-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

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
      pitchBooking: PitchBookingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PitchBookingUpdateComponent,
    resolve: {
      pitchBooking: PitchBookingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PitchBookingUpdateComponent,
    resolve: {
      pitchBooking: PitchBookingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pitchBookingRoute)],
  exports: [RouterModule],
})
export class PitchBookingRoutingModule {}
