import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IComment } from '../comment.model';
import { IMatch } from '../../match/match.model';
import { IUserProfile } from '../../user-profile/user-profile.model';
import { UserProfileService } from '../../user-profile/service/user-profile.service';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, CommentService } from '../service/comment.service';
import { CommentDeleteDialogComponent } from '../delete/comment-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { TeamService } from '../../team/service/team.service';
import { MatchService } from '../../match/service/match.service';
import { Account } from '../../../core/auth/account.model';
import { FontResizeService } from '../../../layouts/navbar/navbar.service';
import { Observable } from 'rxjs';
import { VERSION } from 'app/app.constants';

@Component({
  selector: 'jhi-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  comments?: IComment[];
  matches?: IMatch[] = [];
  userProfiles?: (IUserProfile & { averageRating?: number } & { contentOfHighestLikedComment?: string | undefined })[] = [];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  userPerPage = 3;
  currentUserPage = 1;
  matchPerPage = 5;
  currentMatchPage = 1;

  version = '';
  account: Account | null = null;
  fontSizeMultiplier: number = 1; // Font size multiplier property
  constructor(
    protected commentService: CommentService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected UserProfileService: UserProfileService,
    protected TeamService: TeamService,
    private fontResizeService: FontResizeService,
    protected MatchService: MatchService
  ) {
    if (this.userProfiles) {
      this.userProfiles.sort((a, b) => b!.averageRating! - a!.averageRating!);
    }
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  getUserStartIndex(): number {
    return (this.currentUserPage - 1) * this.userPerPage;
  }

  getUserEndIndex(): number {
    return this.currentUserPage * this.userPerPage;
  }

  nextUserPage() {
    if (this.getUserEndIndex() < this.userProfiles!.length) {
      this.currentUserPage++;
    }
  }

  prevUserPage() {
    if (this.currentUserPage > 1) {
      this.currentUserPage--;
    }
  }
  getMatchStartIndex(): number {
    return (this.currentMatchPage - 1) * this.matchPerPage;
  }

  getMatchEndIndex(): number {
    return this.currentMatchPage * this.matchPerPage;
  }

  nextMatchPage() {
    if (this.getMatchEndIndex() < this.matches!.length) {
      this.currentMatchPage++;
    }
  }

  prevMatchPage() {
    if (this.currentMatchPage > 1) {
      this.currentMatchPage--;
    }
  }

  trackId = (_index: number, item: IComment): number => this.commentService.getCommentIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.MatchService.query().subscribe(res => {
      if (res.body) {
        this.matches = res.body;
      }
    });
    this.fontResizeService.fontSizeMultiplier$.subscribe(multiplier => {
      this.fontSizeMultiplier = multiplier;
    });
    this.UserProfileService.query().subscribe(response => {
      if (response.body) {
        this.userProfiles = response.body;
      }
      if (this.comments != null) {
        for (const userProfile of this.userProfiles!) {
          let counter = 0;
          let totalRating = 0;
          let highestLikeCount = 0;
          userProfile.contentOfHighestLikedComment = 'No popular comments yet';
          for (const comment of this.comments!) {
            if (userProfile.id != null) {
              if (comment.targetUser != null && comment.rating != null) {
                if (comment.targetUser.id == userProfile!.id) {
                  totalRating = totalRating + comment.rating!;
                  counter = counter + 1;
                  if (comment.likeCount != null && comment.likeCount > highestLikeCount) {
                    highestLikeCount = comment.likeCount;
                    userProfile.contentOfHighestLikedComment = comment.content as string;
                  }
                }
              }
            }
          }
          userProfile.averageRating = Math.round(totalRating / counter);
          if (userProfile.averageRating >= 1 && userProfile.averageRating < 1.5) {
            userProfile.averageRating = 1;
          } else if (userProfile.averageRating >= 1.5 && userProfile.averageRating < 2) {
            userProfile.averageRating = 1.5;
          } else if (userProfile.averageRating >= 2 && userProfile.averageRating < 2.5) {
            userProfile.averageRating = 2;
          } else if (userProfile.averageRating >= 2.5 && userProfile.averageRating < 3) {
            userProfile.averageRating = 2.5;
          } else if (userProfile.averageRating >= 3 && userProfile.averageRating < 3.5) {
            userProfile.averageRating = 3;
          } else if (userProfile.averageRating >= 3.5 && userProfile.averageRating < 4) {
            userProfile.averageRating = 3.5;
          } else if (userProfile.averageRating >= 4 && userProfile.averageRating < 4.5) {
            userProfile.averageRating = 4;
          } else if (userProfile.averageRating >= 4.5 && userProfile.averageRating < 5) {
            userProfile.averageRating = 4.5;
          } else {
            userProfile.averageRating = 5;
          }
        }
      }
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
  navigateToUserLD(id: number): void {
    this.router.navigate(['./comment/detail', id], { queryParams: { section: 'Player' } });
  }
  navigateToMatchLD(id: number): void {
    this.router.navigate(['./comment/detail', id], { queryParams: { section: 'Match' } });
  }
  scrollDown() {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  }
}
