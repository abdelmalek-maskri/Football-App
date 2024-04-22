import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MatchComponent } from './list/match.component';
import { MatchDetailComponent } from './detail/match-detail.component';
import { MatchUpdateComponent } from './update/match-update.component';
import MatchResolve from './route/match-routing-resolve.service';

const matchRoute: Routes = [
  {
    path: '',
    component: MatchComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MatchDetailComponent,
    resolve: {
      match: MatchResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MatchUpdateComponent,
    resolve: {
      match: MatchResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MatchUpdateComponent,
    resolve: {
      match: MatchResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default matchRoute;
