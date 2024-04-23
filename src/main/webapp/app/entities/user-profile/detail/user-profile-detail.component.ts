import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserProfile } from '../user-profile.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { Account } from '../../../core/auth/account.model';
import { AccountService } from '../../../core/auth/account.service';
import { EntityResponseType, RestTeam, TeamService } from '../../team/service/team.service';
import { TeamComponent } from '../../team/list/team.component';
import { ITeam } from '../../team/team.model';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { UserProfileDeleteDialogComponent } from '../delete/user-profile-delete-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, switchMap } from 'rxjs';
import { ITEM_DELETED_EVENT } from '../../../config/navigation.constants';
import { EntityArrayResponseType } from '../service/user-profile.service';
import { CommentService } from '../../comment/service/comment.service';
import { IComment } from '../../comment/comment.model';
import { IContact } from '../../contact/contact.model';
import { AvailableDateService } from '../../available-date/service/available-date.service';
import dayjs, { Dayjs } from 'dayjs';
import { Router } from '@angular/router';
import { FontResizeService } from '../../../layouts/navbar/navbar.service';
import { Observable } from 'rxjs';
import { VERSION } from 'app/app.constants';

@Component({
  selector: 'jhi-user-profile-detail',
  templateUrl: './user-profile-detail.component.html',
  styleUrls: ['./user-profile-detail.component.scss'],
})
export class UserProfileDetailComponent implements OnInit {
  theAccount?: Account;
  userProfile: IUserProfile | null = null;
  usersTeam: RestTeam | null | undefined;
  userRating: number = 0;
  listOfComments: IComment[] | undefined;
  dayAvaliability: number[] = [0, 0, 0, 0, 0, 0, 0];
  version = '';
  account: Account | null = null;
  fontSizeMultiplier: number = 1; // Font size multiplier property

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private teamService: TeamService,
    public matDialog: MatDialog,
    protected modalService: NgbModal,
    protected commentService: CommentService,
    protected avaliableService: AvailableDateService,
    private fontResizeService: FontResizeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        this.theAccount = account;
      }
    });
    this.fontResizeService.fontSizeMultiplier$.subscribe(multiplier => {
      this.fontSizeMultiplier = multiplier;
    });

    this.activatedRoute.data.subscribe(({ userProfile }) => {
      this.userProfile = userProfile;
    });

    if (this.userProfile?.team?.id) {
      this.teamService.findTeam(this.userProfile.team.id).subscribe(team => {
        this.usersTeam = team.body;
      });
    }

    let totalRating = 0;
    let counter = 0;

    this.commentService.query().subscribe(response => {
      if (response.body) {
        this.listOfComments = response.body;
      }
      if (this.listOfComments != null) {
        for (const comment of this.listOfComments!) {
          if (comment.targetUser != null && comment.rating != null) {
            if (comment.targetUser.id == this.userProfile!.id) {
              totalRating = totalRating + comment.rating!;
              counter = counter + 1;
            }
          }
        }
      }
      this.userRating = counter;
      this.userRating = Math.round(totalRating / counter);
    });

    const today = dayjs();

    const startOfWeek = today.startOf('week').add(1, 'day');

    this.avaliableService.findUser(this.userProfile!.id).subscribe(response => {
      if (response) {
        let userAvaliability = response.body;

        for (let avaliablity of userAvaliability!) {
          for (let i = 0; i < 7; i++) {
            if (isSameDay(avaliablity.fromTime!, startOfWeek.add(i, 'day'))) {
              if (avaliablity.isAvailable) {
                this.dayAvaliability[i] = 1;
              } else {
                this.dayAvaliability[i] = 2;
              }
            }
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

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  goToUsersComments(userProfileId: number) {
    this.router.navigate(['/comment/detail', userProfileId], { queryParams: { section: 'Player' } });
  }

  previousState(): void {
    window.history.back();
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { size: 'lg', backdrop: 'static', centered: true });
    modalRef.componentInstance.userProfile = this.userProfile;
  }
}
function isSameDay(date1: Dayjs, date2: Dayjs): boolean {
  return date1.isSame(date2, 'day');
}
