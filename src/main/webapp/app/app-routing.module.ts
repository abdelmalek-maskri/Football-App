import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { TestComponent } from 'app/test/test.component';

import { GdprPageComponent } from 'app/gdpr-page/gdpr-page.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'test',
          component: TestComponent,
          data: {
            pageTitle: 'Testing!!!',
          }
        },
        {
          path: 'gdpr',
          component: GdprPageComponent,
          data: {
            pageTitle: 'GDPR Policy',
          },
        },
        {
          path: 'cookie-policy',
          component: CookiePolicyComponent,
          data: {
            pageTitle: 'Cookie Policy',
          },
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
