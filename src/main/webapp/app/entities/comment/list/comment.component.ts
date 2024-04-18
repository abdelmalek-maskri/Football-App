import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IComment } from '../comment.model';
import { IUserProfile } from '../../user-profile/user-profile.model';
import { UserProfileService } from '../../user-profile/service/user-profile.service';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, CommentService } from '../service/comment.service';
import { CommentDeleteDialogComponent } from '../delete/comment-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';

@Component({
  selector: 'jhi-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  comments?: IComment[];
  userProfiles?: (IUserProfile & { averageRating?: number } & { contentOfHighestLikedComment?: string | undefined })[] = [];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  data: any[] = [];
  itemsPerPage = 3;
  currentPage = 1;
  constructor(
    protected commentService: CommentService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected UserProfileService: UserProfileService
  ) {
    // 根据分数进行排序
    if (this.userProfiles) {
      this.userProfiles.sort((a, b) => b!.averageRating! - a!.averageRating!);
    }
  }

  // 获取当前页的起始索引
  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  // 获取当前页的结束索引
  getEndIndex(): number {
    return this.currentPage * this.itemsPerPage;
  }

  // 加载下一页数据
  nextPage() {
    if (this.getEndIndex() < this.userProfiles!.length) {
      this.currentPage++;
    }
  }

  // 加载上一页数据
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  trackId = (_index: number, item: IComment): number => this.commentService.getCommentIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.UserProfileService.query().subscribe(response => {
      if (response.body) {
        this.userProfiles = response.body;
      }
      if (this.comments != null) {
        for (const userProfile of this.userProfiles!) {
          let counter = 0;
          let totalRating = 0;
          userProfile.contentOfHighestLikedComment = 'No popular comments yet';
          for (const comment of this.comments!) {
            let highestLikeCount = 0;
            if (userProfile.id != null) {
              if (comment.targetUser != null && comment.rating != null) {
                if (comment.targetUser.id == userProfile!.id) {
                  totalRating = totalRating + comment.rating!;
                  counter = counter + 1;
                }
                if (comment.likeCount != null && comment.likeCount > highestLikeCount) {
                  userProfile.contentOfHighestLikedComment = comment.content as string;
                }
              }
            }
          }
          userProfile.averageRating = Math.round(totalRating / counter);
        }
      }
    });
  }

  delete(comment: IComment): void {
    const modalRef = this.modalService.open(CommentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.comment = comment;
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
    this.comments = this.refineData(dataFromBody);
  }

  protected refineData(data: IComment[]): IComment[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IComment[] | null): IComment[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.commentService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
  navigateToSection(section: string): void {
    this.router.navigate(['./comment/detail'], { fragment: section });
  }
}
