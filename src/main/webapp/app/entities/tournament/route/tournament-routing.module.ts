import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TournamentComponent } from '../list/tournament.component';
import { TournamentDetailComponent } from '../detail/tournament-detail.component';
import { TournamentUpdateComponent } from '../update/tournament-update.component';
import { TournamentRoutingResolveService } from './tournament-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

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
      tournament: TournamentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TournamentUpdateComponent,
    resolve: {
      tournament: TournamentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TournamentUpdateComponent,
    resolve: {
      tournament: TournamentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tournamentRoute)],
  exports: [RouterModule],
})
export class TournamentRoutingModule {}
