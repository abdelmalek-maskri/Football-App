import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PitchComponent } from '../list/pitch.component';
import { PitchDetailComponent } from '../detail/pitch-detail.component';
import { PitchUpdateComponent } from '../update/pitch-update.component';
import { PitchRoutingResolveService } from './pitch-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

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
      pitch: PitchRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PitchUpdateComponent,
    resolve: {
      pitch: PitchRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PitchUpdateComponent,
    resolve: {
      pitch: PitchRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pitchRoute)],
  exports: [RouterModule],
})
export class PitchRoutingModule {}
