import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AvailableDateComponent } from '../list/available-date.component';
import { AvailableDateDetailComponent } from '../detail/available-date-detail.component';
import { AvailableDateUpdateComponent } from '../update/available-date-update.component';
import { AvailableDateRoutingResolveService } from './available-date-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const availableDateRoute: Routes = [
  {
    path: '',
    component: AvailableDateComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AvailableDateDetailComponent,
    resolve: {
      availableDate: AvailableDateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AvailableDateUpdateComponent,
    resolve: {
      availableDate: AvailableDateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AvailableDateUpdateComponent,
    resolve: {
      availableDate: AvailableDateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(availableDateRoute)],
  exports: [RouterModule],
})
export class AvailableDateRoutingModule {}
