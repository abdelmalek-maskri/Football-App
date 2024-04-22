import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TournamentComponent } from './list/tournament.component';
import { TournamentDetailComponent } from './detail/tournament-detail.component';
import { TournamentUpdateComponent } from './update/tournament-update.component';
import TournamentResolve from './route/tournament-routing-resolve.service';

const tournamentRoute: Routes = [
  {
    path: '',
    component: TournamentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TournamentDetailComponent,
    resolve: {
      tournament: TournamentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TournamentUpdateComponent,
    resolve: {
      tournament: TournamentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TournamentUpdateComponent,
    resolve: {
      tournament: TournamentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default tournamentRoute;
