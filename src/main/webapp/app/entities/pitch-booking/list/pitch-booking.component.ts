import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, switchMap, tap } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { IPitchBooking } from '../pitch-booking.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, PitchBookingService } from '../service/pitch-booking.service';
import { PitchBookingDeleteDialogComponent } from '../delete/pitch-booking-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { IPitch } from '../../pitch/pitch.model';
import { PitchModalComponent } from '../../pitch/modal/pitch-modal.component';
import { PitchBookingModalComponent } from '../booking-modal/pitch-booking-modal.component';
import { Account } from 'app/core/auth/account.model';
import { FontResizeService } from '../../../layouts/navbar/navbar.service';
import { Observable } from 'rxjs';
import { VERSION } from 'app/app.constants';
import { User } from '../../../admin/user-management/user-management.model';
import { AccountService } from 'app/core/auth/account.service';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-pitch-booking',
  templateUrl: './pitch-booking.component.html',
  styleUrls: ['pitch-booking.component.scss'],
})
export class PitchBookingComponent implements OnInit {
  pitchBookings?: IPitchBooking[];
  pitchBookingSorted?: IPitchBooking[];
  isLoading = false;
  pitch: any;

  predicate = 'id';
  ascending = true;
  keyword = '';
  version = '';
  account: Account | null = null;
  fontSizeMultiplier: number = 1; // Font size multiplier property
  user_profile_id: number | null = null; // User profile ID

  constructor(
    protected pitchBookingService: PitchBookingService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    private route: ActivatedRoute,
    private fontResizeService: FontResizeService,
    private accountService: AccountService // Inject AccountService
  ) {}

  trackId = (_index: number, item: IPitchBooking): number => this.pitchBookingService.getPitchBookingIdentifier(item);

  ngOnInit(): void {
    //this.load();
    // Retrieve pitch details from query parameters
    this.route.queryParams.subscribe(params => {
      if (params.pitch) {
        this.pitch = JSON.parse(params.pitch);
      }
    });
    this.fontResizeService.fontSizeMultiplier$.subscribe(multiplier => {
      this.fontSizeMultiplier = multiplier;
    });
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.user_profile_id = account.id; // Retrieve user profile ID
      }
    });

    // Retrieve user ID from route or authentication service
    this.activatedRoute.params.subscribe(params => {
      if (this.user_profile_id) {
        this.queryByUserProfileIdBackend();
      }
    });
    console.log(this.pitchBookings);
  }

  delete(pitchBooking: IPitchBooking): void {
    const modalRef = this.modalService.open(PitchBookingDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pitchBooking = pitchBooking;
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
    console.log(dataFromBody);
    this.pitchBookings = this.refineData(dataFromBody);
  }

  protected refineData(data: IPitchBooking[]): IPitchBooking[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IPitchBooking[] | null): IPitchBooking[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.pitchBookingService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
  openModal(pitchBooking: IPitchBooking) {
    console.log(this.user_profile_id);
    const options: NgbModalOptions = {
      centered: true,
      animation: true,
      size: 'lg',
    };
    const modalRef = this.modalService.open(PitchBookingModalComponent, options);
    modalRef.componentInstance.pitchBooking = pitchBooking;

    // Call setModalRef on the instance of PitchModalComponent created by modalService.open
    const pitchModalComponentInstance = modalRef.componentInstance as PitchBookingModalComponent;
    pitchModalComponentInstance.setModalRef(modalRef);
  }
  searchPitches(): void {
    this.isLoading = true;
    console.log('Searching for Teams w/ query: ' + this.keyword);
    var a: Observable<EntityArrayResponseType> = this.pitchBookingService.searchPitches(this.keyword);
    a.subscribe({
      next: (res: EntityArrayResponseType) => {
        this.isLoading = false;
        this.onResponseSuccess(res);
      },
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
  scrollDown() {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  }

  queryByUserProfileIdBackend(): void {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(), // You can pass additional parameters if needed
    };

    this.pitchBookingService.queryByUserProfileId(this.user_profile_id).subscribe({
      next: (res: EntityArrayResponseType) => {
        this.isLoading = false;
        this.onResponseSuccess(res);
        console.log('Pitch Bookings:', res.body);
      },
      error: error => {
        this.isLoading = false;
        // Handle error
      },
    });
  }

  // Method to convert Day.js object to readable format
  getReadableDate(bookingDate: dayjs.Dayjs | null | undefined): string {
    return dayjs(bookingDate).format('MMM DD, YYYY'); // Adjust format string as needed
  }
}
