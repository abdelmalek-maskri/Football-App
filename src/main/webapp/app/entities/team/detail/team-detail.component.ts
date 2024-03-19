import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITeam } from '../team.model';
import { DataUtils } from 'app/core/util/data-util.service';

import { Positions } from 'app/entities/enumerations/positions.model';

import { TeamService } from '../service/team.service';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
})
export class TeamDetailComponent implements OnInit {
  team: ITeam | null = null;
  account: Account | null = null;

  constructor(
    private accountService: AccountService,
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    protected teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ team }) => {
      this.team = team;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  joinTeam(teamId: number): void {
    console.log('Clicked join team on team id: ' + teamId);
    console.log(111111111);
    var response = this.teamService.joinTeam(teamId);

    response.subscribe(res => {
      console.log('RES:', res);
      if (res != null) {
        this.team = this.teamService.convertDateFromServer(res);
      }
    });
    console.log(222222222);
    //response.subscribe(resp => {
    //console.log("RESULT:", resp.body);
    //});
  }

  getNameOfPositionEnum(EnumName: Positions): string {
    //return (Positions as any)[EnumName] || 'N/A';

    const enumAsString = (Positions as any)[EnumName];
    if (!enumAsString) return 'N/A';

    // Split enum string by capital letters
    const words = enumAsString.match(/[A-Z][a-z]+/g);

    // Join words with space
    return words ? words.join(' ') : 'N/A';
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
