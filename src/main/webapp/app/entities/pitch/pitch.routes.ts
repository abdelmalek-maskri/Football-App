import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PitchComponent } from './list/pitch.component';
import { PitchDetailComponent } from './detail/pitch-detail.component';
import { PitchUpdateComponent } from './update/pitch-update.component';
import PitchResolve from './route/pitch-routing-resolve.service';

const pitchRoute: Routes = [
  {
    path: '',
    component: PitchComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PitchDetailComponent,
    resolve: {
      pitch: PitchResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PitchUpdateComponent,
    resolve: {
      pitch: PitchResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PitchUpdateComponent,
    resolve: {
      pitch: PitchResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pitchRoute;
