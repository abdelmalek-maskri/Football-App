import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITeam } from '../team.model';
import { DataUtils } from 'app/core/util/data-util.service';

import { Positions } from 'app/entities/enumerations/positions.model';

@Component({
  selector: 'jhi-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
})
export class TeamDetailComponent implements OnInit {
  team: ITeam | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ team }) => {
      this.team = team;
    });
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
