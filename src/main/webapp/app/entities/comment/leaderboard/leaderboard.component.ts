import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IComment } from '../comment.model';
import { ITeam } from '../../team/team.model';
import { EntityResponseType, RestTeam, TeamService } from '../../team/service/team.service';
import { IUserProfile } from '../../user-profile/user-profile.model';
import { UserProfileService } from '../../user-profile/service/user-profile.service';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, CommentService } from '../service/comment.service';
import { CommentDeleteDialogComponent } from '../delete/comment-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { userNamePipe } from '../pipes/userNamePipe.pipe';

@Component({
  selector: 'jhi-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  providers: [userNamePipe],
})
export class LeaderboardComponent implements OnInit {
  comments?: IComment[] = [];
  commentsTo?: IComment[] = [];
  userProfile: IUserProfile | null = null;
  userTeam: RestTeam | null | undefined;

  userId = 0;
  sectionToShow: string = '';
  itemsPerPage = 3;
  currentPage = 1;
  constructor(
    protected commentService: CommentService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected UserProfileService: UserProfileService,
    protected TeamService: TeamService,
    protected userNamePipe: userNamePipe
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      this.sectionToShow = params['section'];
    });
    this.UserProfileService.find(this.userId).subscribe(user => {
      this.userProfile = user.body;
      if (this.userProfile?.team?.id) {
        this.TeamService.findTeam(this.userProfile.team.id).subscribe(team => {
          this.userTeam = team.body;
        });
      }
    });
    this.commentService.query().subscribe(response => {
      if (response.body) {
        this.comments = response.body;
      }
      if (this.comments != null) {
        //             this.commentsTo = this.comments.filter((comment:IComment) => comment.targetUser!.id == this.userId);
        for (const comment of this.comments) {
          if (comment.targetUser != null && comment.targetUser.id == this.userId) {
            this.commentsTo!.push(comment);
          }
        }
      }
    });
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  // 获取当前页的结束索引
  getEndIndex(): number {
    return this.currentPage * this.itemsPerPage;
  }

  // 加载下一页数据
  nextPage() {
    if (this.getEndIndex() < this.comments!.length) {
      this.currentPage++;
    }
  }

  // 加载上一页数据
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
