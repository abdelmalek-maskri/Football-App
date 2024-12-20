import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserProfile } from '../user-profile.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, UserProfileService } from '../service/user-profile.service';
import { UserProfileDeleteDialogComponent } from '../delete/user-profile-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';
import { IUser } from '../../user/user.model';
import { AccountService } from '../../../core/auth/account.service';
import { UserService } from '../../user/user.service';
import { Account } from '../../../core/auth/account.model';
import { FontResizeService } from '../../../layouts/navbar/navbar.service';
import { Observable } from 'rxjs';
import { VERSION } from 'app/app.constants';

@Component({
  selector: 'jhi-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userProfiles?: IUserProfile[];
  theAccount?: Account;
  isLoading = false;
  predicate = 'id';
  ascending = true;

  searchQuery: string = '';
  version = '';
  account: Account | null = null;
  fontSizeMultiplier: number = 1; // Font size multiplier property

  constructor(
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    private fontResizeService: FontResizeService,
    private accountService: AccountService
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  trackId = (_index: number, item: IUserProfile): number => this.userProfileService.getUserProfileIdentifier(item);

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        this.theAccount = account;
      }
    });
    this.load();
    this.fontResizeService.fontSizeMultiplier$.subscribe(multiplier => {
      this.fontSizeMultiplier = multiplier;
    });
  }

  // Font size adjustment methods
  getFontSizeKey(): string {
    return `fontSizeMultiplier_${this.account?.login || 'default'}`;
  }

  updateFontSize(): void {
    localStorage.setItem(this.getFontSizeKey(), this.fontSizeMultiplier.toString());
    this.fontResizeService.setFontSizeMultiplier(this.fontSizeMultiplier);
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(userProfile: IUserProfile): void {
    const modalRef = this.modalService.open(UserProfileDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userProfile = userProfile;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  loadSearchResultsMP(hey: string): void {
    this.isLoading = true;
    console.log('Searching for Players w/ query: ' + this.searchQuery);
    var a: Observable<EntityArrayResponseType> = this.userProfileService.searchMP(this.searchQuery);
    a.subscribe({
      next: (res: EntityArrayResponseType) => {
        this.isLoading = false;
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.userProfiles = this.refineData(dataFromBody);
  }

  protected refineData(data: IUserProfile[]): IUserProfile[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IUserProfile[] | null): IUserProfile[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.userProfileService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
  scrollDown() {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  }
}
