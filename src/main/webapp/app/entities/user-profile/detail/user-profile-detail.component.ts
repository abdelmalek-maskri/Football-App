import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserProfile } from '../user-profile.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { Account } from '../../../core/auth/account.model';
import { AccountService } from '../../../core/auth/account.service';
import { EntityResponseType, RestTeam, TeamService } from '../../team/service/team.service';
import { TeamComponent } from '../../team/list/team.component';
import { ITeam } from '../../team/team.model';
import { CommentService } from '../../comment/service/comment.service';

@Component({
  selector: 'jhi-user-profile-detail',
  templateUrl: './user-profile-detail.component.html',
  styleUrls: ['./user-profile-detail.component.scss'],
})
export class UserProfileDetailComponent implements OnInit {
  theAccount?: Account;
  userProfile: IUserProfile | null = null;
  usersTeam: RestTeam | null | undefined;
  userRating: number | null = 0;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private teamService: TeamService,
    protected commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        this.theAccount = account;
      }
    });
    this.activatedRoute.data.subscribe(({ userProfile }) => {
      this.userProfile = userProfile;
    });
    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        this.theAccount = account;
      }
    });

    if (this.userProfile?.team?.id) {
      this.teamService.findTeam(this.userProfile.team.id).subscribe(team => {
        this.usersTeam = team.body;
      });
    }

    this.commentService.getUserAverage(this.userProfile!.id).subscribe(response => {
      this.userRating = response.body;
    });

    console.log(this.usersTeam);
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
