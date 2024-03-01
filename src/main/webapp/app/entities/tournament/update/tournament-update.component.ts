import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TournamentFormService, TournamentFormGroup } from './tournament-form.service';
import { ITournament } from '../tournament.model';
import { TournamentService } from '../service/tournament.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';

@Component({
  selector: 'jhi-tournament-update',
  templateUrl: './tournament-update.component.html',
})
export class TournamentUpdateComponent implements OnInit {
  isSaving = false;
  tournament: ITournament | null = null;

  teamsSharedCollection: ITeam[] = [];

  editForm: TournamentFormGroup = this.tournamentFormService.createTournamentFormGroup();

  constructor(
    protected tournamentService: TournamentService,
    protected tournamentFormService: TournamentFormService,
    protected teamService: TeamService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTeam = (o1: ITeam | null, o2: ITeam | null): boolean => this.teamService.compareTeam(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tournament }) => {
      this.tournament = tournament;
      if (tournament) {
        this.updateForm(tournament);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tournament = this.tournamentFormService.getTournament(this.editForm);
    if (tournament.id !== null) {
      this.subscribeToSaveResponse(this.tournamentService.update(tournament));
    } else {
      this.subscribeToSaveResponse(this.tournamentService.create(tournament));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITournament>>): void {
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

  protected updateForm(tournament: ITournament): void {
    this.tournament = tournament;
    this.tournamentFormService.resetForm(this.editForm, tournament);

    this.teamsSharedCollection = this.teamService.addTeamToCollectionIfMissing<ITeam>(
      this.teamsSharedCollection,
      ...(tournament.teams ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing<ITeam>(teams, ...(this.tournament?.teams ?? []))))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));
  }
}
