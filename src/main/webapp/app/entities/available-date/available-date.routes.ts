import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AvailableDateComponent } from './list/available-date.component';
import { AvailableDateDetailComponent } from './detail/available-date-detail.component';
import { AvailableDateUpdateComponent } from './update/available-date-update.component';
import AvailableDateResolve from './route/available-date-routing-resolve.service';

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
      availableDate: AvailableDateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AvailableDateUpdateComponent,
    resolve: {
      availableDate: AvailableDateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AvailableDateUpdateComponent,
    resolve: {
      availableDate: AvailableDateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default availableDateRoute;
