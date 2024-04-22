import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { Account } from 'app/core/auth/account.model';

import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { IUserProfile, NewUserProfile } from 'app/entities/user-profile/user-profile.model';
import { HttpResponse } from '@angular/common/http';
type EntityResponseType = HttpResponse<IUserProfile>;

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account> | null;

  constructor(
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private router: Router,
    private applicationConfigService: ApplicationConfigService,
    private userProfileService: UserProfileService
  ) {}

  save(account: Account): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/account'), account);
  }

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
    if (!identity) {
      this.accountCache$ = null;
    }
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.fetch().pipe(
        tap((account: Account) => {
          this.authenticate(account);

          // Redirect to User Profile Creation page if user profile doesn't exist
          console.log("Checking if logged in user's UserProfile exists..");
          var foundUserProfile: Observable<EntityResponseType> = this.userProfileService.find(account.id);
          console.log('Done checking if UserProfile exists');

          foundUserProfile.subscribe({
            next: (res: EntityResponseType) => {
              //console.log("MP: ONE")
              console.log('MP foundUserProfile RESPONSE STATUS:', res.status);
              console.log('FOUND USER PROFILE INFO', res.body);

              this.navigateToStoredUrl();
            },
            error: (any: any) => {
              console.log('NO USER PROFILE EXISTS FOR THE USER THAT JUST LOGGED IN...');
              this.router.navigate(['/user-profile/new']);
            },
          });

          //this.navigateToStoredUrl(); // Moved this up, so that this only happens if a User Profile exists.
        }),
        shareReplay()
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null)));
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  private fetch(): Observable<Account> {
    return this.http.get<Account>(this.applicationConfigService.getEndpointFor('api/account'));
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}
