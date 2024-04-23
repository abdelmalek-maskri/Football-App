import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MatchFormService, MatchFormGroup } from './match-form.service';
import { IMatch } from '../match.model';
import { MatchService } from '../service/match.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { IPitch } from 'app/entities/pitch/pitch.model';
import { PitchService } from 'app/entities/pitch/service/pitch.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { ITournament } from 'app/entities/tournament/tournament.model';
import { TournamentService } from 'app/entities/tournament/service/tournament.service';

@Component({
  selector: 'jhi-match-update',
  templateUrl: './match-update.component.html',
  styleUrls: ['../../../../content/scss/updatePage.scss'],
})
export class MatchUpdateComponent implements OnInit {
  isSaving = false;
  match: IMatch | null = null;

  userProfilesSharedCollection: IUserProfile[] = [];
  pitchesSharedCollection: IPitch[] = [];
  teamsSharedCollection: ITeam[] = [];
  tournamentsSharedCollection: ITournament[] = [];

  editForm: MatchFormGroup = this.matchFormService.createMatchFormGroup();

  constructor(
    protected matchService: MatchService,
    protected matchFormService: MatchFormService,
    protected userProfileService: UserProfileService,
    protected pitchService: PitchService,
    protected teamService: TeamService,
    protected tournamentService: TournamentService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  comparePitch = (o1: IPitch | null, o2: IPitch | null): boolean => this.pitchService.comparePitch(o1, o2);

  compareTeam = (o1: ITeam | null, o2: ITeam | null): boolean => this.teamService.compareTeam(o1, o2);

  compareTournament = (o1: ITournament | null, o2: ITournament | null): boolean => this.tournamentService.compareTournament(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ match }) => {
      this.match = match;
      if (match) {
        this.updateForm(match);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const match = this.matchFormService.getMatch(this.editForm);
    if (match.id !== null) {
      this.subscribeToSaveResponse(this.matchService.update(match));
    } else {
      this.subscribeToSaveResponse(this.matchService.create(match));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMatch>>): void {
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

  protected updateForm(match: IMatch): void {
    this.match = match;
    this.matchFormService.resetForm(this.editForm, match);

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      match.referee
    );
    this.pitchesSharedCollection = this.pitchService.addPitchToCollectionIfMissing<IPitch>(this.pitchesSharedCollection, match.pitch);
    this.teamsSharedCollection = this.teamService.addTeamToCollectionIfMissing<ITeam>(this.teamsSharedCollection, match.home, match.away);
    this.tournamentsSharedCollection = this.tournamentService.addTournamentToCollectionIfMissing<ITournament>(
      this.tournamentsSharedCollection,
      match.tournament
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.match?.referee)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));

    this.pitchService
      .query()
      .pipe(map((res: HttpResponse<IPitch[]>) => res.body ?? []))
      .pipe(map((pitches: IPitch[]) => this.pitchService.addPitchToCollectionIfMissing<IPitch>(pitches, this.match?.pitch)))
      .subscribe((pitches: IPitch[]) => (this.pitchesSharedCollection = pitches));

    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing<ITeam>(teams, this.match?.home, this.match?.away)))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));

    this.tournamentService
      .query()
      .pipe(map((res: HttpResponse<ITournament[]>) => res.body ?? []))
      .pipe(
        map((tournaments: ITournament[]) =>
          this.tournamentService.addTournamentToCollectionIfMissing<ITournament>(tournaments, this.match?.tournament)
        )
      )
      .subscribe((tournaments: ITournament[]) => (this.tournamentsSharedCollection = tournaments));
  }
}
