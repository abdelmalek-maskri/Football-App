import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/common';

import { IPitch } from '../pitch.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, PitchService } from '../service/pitch.service';
import { PitchDeleteDialogComponent } from '../delete/pitch-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
// import { PitchDetailComponent } from '../detail/pitch-detail.component';
import { PitchModalComponent } from '../modal/pitch-modal.component';

@Component({
  selector: 'jhi-pitch',
  templateUrl: './pitch.component.html',
  styleUrls: ['pitch.component.scss'],
})
export class PitchComponent implements OnInit {
  pitches?: IPitch[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  constructor(
    protected pitchService: PitchService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    @Inject(DOCUMENT) private document: Document
  ) {}

  trackId = (_index: number, item: IPitch): number => this.pitchService.getPitchIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  delete(pitch: IPitch): void {
    const modalRef = this.modalService.open(PitchDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pitch = pitch;
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
    this.pitches = this.refineData(dataFromBody);
  }

  protected refineData(data: IPitch[]): IPitch[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IPitch[] | null): IPitch[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.pitchService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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

  openModal(pitch: IPitch) {
    const modalOptions: NgbModalOptions = {
      centered: true, // Centers the modal vertically and horizontally
      // You can add more options here as needed
    };
    const modalRef = this.modalService.open(PitchModalComponent, modalOptions);
    modalRef.componentInstance.pitch = pitch; // Pass data to the modal component if needed
  }
}
