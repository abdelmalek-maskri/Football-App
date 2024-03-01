import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AvailableDateFormService, AvailableDateFormGroup } from './available-date-form.service';
import { IAvailableDate } from '../available-date.model';
import { AvailableDateService } from '../service/available-date.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';

@Component({
  selector: 'jhi-available-date-update',
  templateUrl: './available-date-update.component.html',
})
export class AvailableDateUpdateComponent implements OnInit {
  isSaving = false;
  availableDate: IAvailableDate | null = null;

  userProfilesSharedCollection: IUserProfile[] = [];
  teamsSharedCollection: ITeam[] = [];

  editForm: AvailableDateFormGroup = this.availableDateFormService.createAvailableDateFormGroup();

  constructor(
    protected availableDateService: AvailableDateService,
    protected availableDateFormService: AvailableDateFormService,
    protected userProfileService: UserProfileService,
    protected teamService: TeamService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  compareTeam = (o1: ITeam | null, o2: ITeam | null): boolean => this.teamService.compareTeam(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ availableDate }) => {
      this.availableDate = availableDate;
      if (availableDate) {
        this.updateForm(availableDate);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const availableDate = this.availableDateFormService.getAvailableDate(this.editForm);
    if (availableDate.id !== null) {
      this.subscribeToSaveResponse(this.availableDateService.update(availableDate));
    } else {
      this.subscribeToSaveResponse(this.availableDateService.create(availableDate));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAvailableDate>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(availableDate: IAvailableDate): void {
    this.availableDate = availableDate;
    this.availableDateFormService.resetForm(this.editForm, availableDate);

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      availableDate.userProfile
    );
    this.teamsSharedCollection = this.teamService.addTeamToCollectionIfMissing<ITeam>(this.teamsSharedCollection, availableDate.team);
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.availableDate?.userProfile)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));

    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing<ITeam>(teams, this.availableDate?.team)))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));
  }
}
