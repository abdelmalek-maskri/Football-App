import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CommentComponent } from '../list/comment.component';
import { CommentDetailComponent } from '../detail/comment-detail.component';
import { CommentUpdateComponent } from '../update/comment-update.component';
import { CommentRoutingResolveService } from './comment-routing-resolve.service';
import { UserProfileRoutingResolveService } from '../../user-profile/route/user-profile-routing-resolve.service';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { ASC } from 'app/config/navigation.constants';

const commentRoute: Routes = [
  {
    path: '',
    component: CommentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommentDetailComponent,
    resolve: {
      comment: CommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommentUpdateComponent,
    resolve: {
      comment: CommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommentUpdateComponent,
    resolve: {
      comment: CommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'detail/:id',
    component: LeaderboardComponent,
    resolve: {
      userProfile: UserProfileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(commentRoute)],
  exports: [RouterModule],
})
export class CommentRoutingModule {}
