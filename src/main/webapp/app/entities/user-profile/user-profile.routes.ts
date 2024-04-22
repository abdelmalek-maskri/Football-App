import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { UserProfileComponent } from './list/user-profile.component';
import { UserProfileDetailComponent } from './detail/user-profile-detail.component';
import { UserProfileUpdateComponent } from './update/user-profile-update.component';
import UserProfileResolve from './route/user-profile-routing-resolve.service';

const userProfileRoute: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserProfileDetailComponent,
    resolve: {
      userProfile: UserProfileResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserProfileUpdateComponent,
    resolve: {
      userProfile: UserProfileResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserProfileUpdateComponent,
    resolve: {
      userProfile: UserProfileResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default userProfileRoute;
