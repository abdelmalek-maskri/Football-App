import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PitchBookingFormService, PitchBookingFormGroup } from './pitch-booking-form.service';
import { IPitchBooking } from '../pitch-booking.model';
import { PitchBookingService } from '../service/pitch-booking.service';
import { IPitch } from 'app/entities/pitch/pitch.model';
import { PitchService } from 'app/entities/pitch/service/pitch.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';

@Component({
  selector: 'jhi-pitch-booking-update',
  templateUrl: './pitch-booking-update.component.html',
})
export class PitchBookingUpdateComponent implements OnInit {
  isSaving = false;
  pitchBooking: IPitchBooking | null = null;

  pitchesCollection: IPitch[] = [];
  teamsSharedCollection: ITeam[] = [];

  editForm: PitchBookingFormGroup = this.pitchBookingFormService.createPitchBookingFormGroup();

  constructor(
    protected pitchBookingService: PitchBookingService,
    protected pitchBookingFormService: PitchBookingFormService,
    protected pitchService: PitchService,
    protected teamService: TeamService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePitch = (o1: IPitch | null, o2: IPitch | null): boolean => this.pitchService.comparePitch(o1, o2);

  compareTeam = (o1: ITeam | null, o2: ITeam | null): boolean => this.teamService.compareTeam(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pitchBooking }) => {
      this.pitchBooking = pitchBooking;
      if (pitchBooking) {
        this.updateForm(pitchBooking);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pitchBooking = this.pitchBookingFormService.getPitchBooking(this.editForm);
    if (pitchBooking.id !== null) {
      this.subscribeToSaveResponse(this.pitchBookingService.update(pitchBooking));
    } else {
      this.subscribeToSaveResponse(this.pitchBookingService.create(pitchBooking));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPitchBooking>>): void {
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

  protected updateForm(pitchBooking: IPitchBooking): void {
    this.pitchBooking = pitchBooking;
    this.pitchBookingFormService.resetForm(this.editForm, pitchBooking);

    this.pitchesCollection = this.pitchService.addPitchToCollectionIfMissing<IPitch>(this.pitchesCollection, pitchBooking.pitch);
    this.teamsSharedCollection = this.teamService.addTeamToCollectionIfMissing<ITeam>(this.teamsSharedCollection, pitchBooking.team);
  }

  protected loadRelationshipsOptions(): void {
    this.pitchService
      .query({ filter: 'pitchbooking-is-null' })
      .pipe(map((res: HttpResponse<IPitch[]>) => res.body ?? []))
      .pipe(map((pitches: IPitch[]) => this.pitchService.addPitchToCollectionIfMissing<IPitch>(pitches, this.pitchBooking?.pitch)))
      .subscribe((pitches: IPitch[]) => (this.pitchesCollection = pitches));

    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing<ITeam>(teams, this.pitchBooking?.team)))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));
  }
}
