import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PitchBookingFormService, PitchBookingFormGroup } from './pitch-booking-form.service';
import { IPitchBooking } from '../pitch-booking.model';
import { PitchBookingService } from '../service/pitch-booking.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { IPitch } from 'app/entities/pitch/pitch.model';
import { PitchService } from 'app/entities/pitch/service/pitch.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'jhi-pitch-booking-update',
  templateUrl: './pitch-booking-update.component.html',
})
export class PitchBookingUpdateComponent implements OnInit {
  isSaving = false;
  pitchBooking: IPitchBooking | null = null;
  selectedPitchId: number | null = null; // To store the selected pitch ID

  teamsSharedCollection: ITeam[] = [];
  pitchesSharedCollection: IPitch[] = [];

  editForm: PitchBookingFormGroup = this.pitchBookingFormService.createPitchBookingFormGroup();
  bookingDate: NgbDateStruct | null = null;

  constructor(
    protected pitchBookingService: PitchBookingService,
    protected pitchBookingFormService: PitchBookingFormService,
    protected teamService: TeamService,
    protected pitchService: PitchService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient // Inject HttpClient
  ) {}

  compareTeam = (o1: ITeam | null, o2: ITeam | null): boolean => this.teamService.compareTeam(o1, o2);

  comparePitch = (o1: IPitch | null, o2: IPitch | null): boolean => this.pitchService.comparePitch(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.pitch) {
        const pitchData = JSON.parse(params.pitch);
        console.log(JSON.parse(params.pitch));
        if (pitchData.id) {
          console.log('selectedPitchId:', pitchData.id);
          this.selectedPitchId = pitchData.id;
        }
      }
    });
    console.log('pitchesSharedCollection:', this.pitchesSharedCollection);
    console.log('selectedPitchId:', this.selectedPitchId);

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

    this.teamsSharedCollection = this.teamService.addTeamToCollectionIfMissing<ITeam>(this.teamsSharedCollection, pitchBooking.team);
    this.pitchesSharedCollection = this.pitchService.addPitchToCollectionIfMissing<IPitch>(
      this.pitchesSharedCollection,
      pitchBooking.pitch
    );
  }

  protected loadRelationshipsOptions(): void {
    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing<ITeam>(teams, this.pitchBooking?.team)))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));

    this.pitchService
      .query()
      .pipe(map((res: HttpResponse<IPitch[]>) => res.body ?? []))
      .pipe(map((pitches: IPitch[]) => this.pitchService.addPitchToCollectionIfMissing<IPitch>(pitches, this.pitchBooking?.pitch)))
      .subscribe((pitches: IPitch[]) => (this.pitchesSharedCollection = pitches));
  }

  checkAvailability() {
    if (this.bookingDate) {
      const selectedDate = `${this.bookingDate.year}-${this.bookingDate.month}-${this.bookingDate.day}`;
      this.http.get<any[]>(`/api/available-bookings?date=${selectedDate}`).subscribe(
        response => {
          console.log('Available bookings:', response);
          // Handle the response from the backend
          // You can display the available bookings or perform other actions here
        },
        error => {
          console.error('Error occurred while checking availability:', error);
        }
      );
    } else {
      console.warn('Please select a date before checking availability.');
    }
  }
}
