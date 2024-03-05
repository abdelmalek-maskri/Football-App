import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserProfile } from '../user-profile.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { Account } from '../../../core/auth/account.model';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  selector: 'jhi-user-profile-detail',
  templateUrl: './user-profile-detail.component.html',
  styleUrls: ['./user-profile-detail.component.scss'],
})
export class UserProfileDetailComponent implements OnInit {
  theAccount?: Account;
  userProfile: IUserProfile | null = null;
  theAccount?: Account;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute, private accountService: AccountService) {}

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
