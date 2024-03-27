import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMatch, IMatchDated } from '../match.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, MatchService } from '../service/match.service';
import { MatchDeleteDialogComponent } from '../delete/match-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

@Component({
  selector: 'jhi-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {
  matches?: IMatch[];
  matchesDated: IMatchDated[] = [];
  isLoading = false;

  date = dayjs().format('DD-MM-YYYY');
  month: string = dayjs().format('MMMM');

  constructor(
    protected matchService: MatchService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IMatch): number => this.matchService.getMatchIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  nextMonth(): void {
    var tempDate = dayjs(this.date, 'DD-MM-YYYY');
    var newDate = tempDate.add(1, 'month');
    this.date = newDate.format('DD-MM-YYYY');
    this.navigateToWithComponentValues();
  }

  prevMonth(): void {
    var tempDate = dayjs(this.date, 'DD-MM-YYYY');
    var newDate = tempDate.subtract(1, 'month');
    this.month = newDate.format('MMMM');
    this.date = newDate.format('DD-MM-YYYY');
    this.navigateToWithComponentValues();
  }

  delete(match: IMatch): void {
    const modalRef = this.modalService.open(MatchDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.match = match;
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
    this.handleNavigation(this.date);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.date))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    var tempDate = params.get('date');
    if (tempDate != null) {
      this.date = tempDate;
      this.month = dayjs(tempDate, 'DD-MM-YYYY').format('MMMM');
    }
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.matchesDated = this.refineData(dataFromBody);
  }

  protected refineData(data: IMatch[]): IMatchDated[] {
    let dateRepeated: string;
    let matchesDatedTemp: IMatchDated[] = [];
    data.forEach((item: IMatch) => {
      if (item.date != null) {
        dateRepeated = item.date.format('MMMM d');

        const itemIndex = matchesDatedTemp.findIndex((i: IMatchDated) => i.date != null && dateRepeated != null && i.date == dateRepeated);
        // if same date
        if (itemIndex > -1) {
          matchesDatedTemp[itemIndex].list.push(item);
          return;
        }

        matchesDatedTemp.push({
          date: dateRepeated,
          list: [item],
        });
      }
    });
    return matchesDatedTemp;
  }

  protected fillComponentAttributesFromResponseBody(data: IMatch[] | null): IMatch[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: string): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      date: this.date,
    };
    return this.matchService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(date?: string): void {
    const queryParamsObj = {
      date: this.date,
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }
}
