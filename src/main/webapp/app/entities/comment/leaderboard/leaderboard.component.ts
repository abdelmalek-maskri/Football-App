import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IComment } from '../comment.model';
import { ITeam } from '../../team/team.model';
import { IMatch } from '../../match/match.model';
import { EntityResponseType, RestTeam, TeamService } from '../../team/service/team.service';
import { IUserProfile } from '../../user-profile/user-profile.model';
import { UserProfileService } from '../../user-profile/service/user-profile.service';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, CommentService } from '../service/comment.service';
import { CommentDeleteDialogComponent } from '../delete/comment-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { MatchService } from '../../match/service/match.service';
import { userNamePipe } from '../pipes/userNamePipe.pipe';

@Component({
  selector: 'jhi-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  providers: [userNamePipe],
})
export class LeaderboardComponent implements OnInit {
  comments?: (IComment & { isLiked?: boolean })[] = [];
  commentsTo?: (IComment & { isLiked?: boolean })[] = [];
  match?: IMatch;
  users?: IUserProfile[] = [];
  userProfile: IUserProfile | null = null;
  userTeam: RestTeam | null | undefined;

  Id = 0;
  sectionToShow: string = '';
  itemsPerPage = 3;
  currentPage = 1;
  isLiked = false;

  constructor(
    protected commentService: CommentService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected UserProfileService: UserProfileService,
    protected TeamService: TeamService,
    protected userNamePipe: userNamePipe,
    protected MatchService: MatchService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.Id = params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.sectionToShow = params['section'];
    });
    this.UserProfileService.query().subscribe(res => {
      if (res.body != null) {
        this.users = res.body;
      }
    });
    if (this.sectionToShow == 'Match') {
      this.MatchService.find(this.Id).subscribe(match => {
        if (match.body) {
          this.match = match.body;
        }
      });
    }
    if (this.sectionToShow == 'Player') {
      this.UserProfileService.find(this.Id).subscribe(user => {
        this.userProfile = user.body;
        if (this.userProfile?.team?.id) {
          this.TeamService.findTeam(this.userProfile.team.id).subscribe(team => {
            this.userTeam = team.body;
          });
        }
      });
      this.commentService.query().subscribe(response => {
        if (response.body) {
          this.comments = response.body.map(comment => ({ ...comment, isLiked: false }));
        }
        if (this.comments != null) {
          //             this.commentsTo = this.comments.filter((comment:IComment) => comment.targetUser!.id == this.userId);
          for (const comment of this.comments) {
            if (comment.targetUser != null && comment.targetUser.id == this.Id) {
              this.commentsTo!.push(comment);
            }
          }
        }
      });
    }
  }

  handleDivClick(): void {
    if (this.sectionToShow == 'Player') {
      this.router.navigate(['/comment/new'], { queryParams: { id: this.Id, section: 'Player' } });
    } else if (this.sectionToShow == 'Match') {
      this.router.navigate(['/comment/new'], { queryParams: { id: this.Id, section: 'Match' } });
    }
  }
  toggleLike(comment: IComment & { isLiked?: boolean }) {
    comment.isLiked = !comment.isLiked;
    if (comment.isLiked == true) {
      comment!.likeCount! += 1;
    } else if (comment.isLiked == false) {
      comment!.likeCount! -= 1;
    }
    this.commentService.update(comment).subscribe();
  }
}
