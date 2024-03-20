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

@Component({
  selector: 'jhi-user-profile-detail',
  templateUrl: './user-profile-detail.component.html',
  styleUrls: ['./user-profile-detail.component.scss'],
})
export class UserProfileDetailComponent implements OnInit {
  theAccount?: Account;
  userProfile: IUserProfile | null = null;
  usersTeam: RestTeam | null | undefined;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private teamService: TeamService,
    public matDialog: MatDialog,
    protected modalService: NgbModal
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

    if (this.userProfile?.team?.id) {
      this.teamService.findTeam(this.userProfile.team.id).subscribe(team => {
        this.usersTeam = team.body;
      });
    }
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

  openModal() {
    // const modalRef = this.modalService.open(ModalComponent, { size: 'lg', backdrop: 'static' });
    // modalRef.componentInstance.userProfile = this.userProfile;
    //
    // this.modalService.open(ModalComponent).result.then((result) => {
    //   // this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   console.log(reason);
    // });

    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.height = '350px';
    dialogConfig.width = '600px';
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
  }
}
