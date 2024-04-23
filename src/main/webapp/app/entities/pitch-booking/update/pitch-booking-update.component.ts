import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { NgbDateStruct, NgbModule, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { PitchBookingFormService, PitchBookingFormGroup } from './pitch-booking-form.service';
import { IPitchBooking } from '../pitch-booking.model';
import { PitchBookingService, RestPitchBooking } from '../service/pitch-booking.service';
import { ITeam } from 'app/entities/team/team.model';
import { EntityArrayResponseType, TeamService } from 'app/entities/team/service/team.service';
import { IPitch } from 'app/entities/pitch/pitch.model';
import { PitchService } from 'app/entities/pitch/service/pitch.service';
import { FormBuilder } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { ChangeDetectorRef } from '@angular/core';
import { tryUnwrapForwardRef } from '@angular/compiler-cli/src/ngtsc/annotations/common';

@Component({
  selector: 'jhi-pitch-booking-update',
  templateUrl: './pitch-booking-update.component.html',
  styleUrls: ['./pitch-booking-update.component.scss'],
})
export class PitchBookingUpdateComponent implements OnInit {
  isSaving = false;
  pitchBooking: IPitchBooking | null = null;
  selectedPitchId: number | null = null;
  selectedPitchName: string | null = null;
  doesIdExistFromJson: boolean = true;

  teamsSharedCollection: ITeam[] = [];
  pitchesSharedCollection: IPitch[] = [];
  parsedCollection: IPitch | undefined;
  editForm: PitchBookingFormGroup = this.pitchBookingFormService.createPitchBookingFormGroup();
  bookingDate: NgbDateStruct | null = null;
  isDateSelected: boolean = false;
  startTime: string | null = null;
  endTime: string | null = null;
  selected: Date | null = null;
  dayjsDate: dayjs.Dayjs | null = null;
  timeSlots = [
    { value: '08:00-10:00', viewValue: '08:00 - 10:00' },
    { value: '10:00-12:00', viewValue: '10:00 - 12:00' },
    { value: '12:00-14:00', viewValue: '12:00 - 14:00' },
    { value: '14:00-16:00', viewValue: '14:00 - 16:00' },
    { value: '16:00-18:00', viewValue: '16:00 - 18:00' },

    // Add more slots as needed
  ];
  existingBookings: { startTime: Dayjs | null | undefined; endTime: Dayjs | null | undefined }[] = [];
  // Filtered time slots based on existing bookings
  filteredTimeSlots: { value: string; viewValue: string }[] = [];
  constructor(
    protected pitchBookingService: PitchBookingService,
    protected pitchBookingFormService: PitchBookingFormService,
    protected teamService: TeamService,
    protected pitchService: PitchService,
    protected activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  compareTeam = (o1: ITeam | null, o2: ITeam | null): boolean => this.teamService.compareTeam(o1, o2);

  comparePitch = (o1: IPitch | null, o2: IPitch | null): boolean => this.pitchService.comparePitch(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.pitch) {
        this.parsedCollection = JSON.parse(params.pitch);
        console.log(this.parsedCollection);
        const pitchData = JSON.parse(params.pitch);
        const pitchId = pitchData.id; // Get the pitch ID from pitchData
        console.log(JSON.parse(params.pitch));
        if (pitchId) {
          this.selectedPitchId = pitchId; // Set selectedPitchId with the found pitch ID
          this.editForm.get('pitch')?.setValue(this.parsedCollection); // Set the default value of the form control
          console.log(this.editForm.get('pitch'));
          this.selectedPitchName = pitchData.name;
        }
        /*
        if (pitchData.id) {
          console.log('selectedPitchId:', pitchData);
          this.selectedPitchId = pitchData;
        }*/
      } else {
        this.doesIdExistFromJson = false;
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
    // Get the form values
    const pitchBooking = this.pitchBookingFormService.getPitchBooking(this.editForm);
    // @ts-ignore
    pitchBooking.bookingDate = this.dayjsDate;
    // Convert startTime and endTime to Date objects if they are strings and are not null or empty
    if (this.startTime && this.endTime) {
      const bookingDate = this.dayjsDate?.format('YYYY-MM-DD') || ''; // Get the bookingDate in the format 'YYYY-MM-DD'

      const startTimeDate = new Date(`${bookingDate}T${this.startTime}`);
      const endTimeDate = new Date(`${bookingDate}T${this.endTime}`);

      // Check if the parsed date is valid
      if (!isNaN(startTimeDate.getTime()) && !isNaN(endTimeDate.getTime())) {
        // @ts-ignore
        pitchBooking.startTime = startTimeDate;
        // @ts-ignore
        pitchBooking.endTime = endTimeDate;
      } else {
        console.error('Invalid time format for startTime or endTime');
        return;
      }
    } else {
      console.error('startTime or endTime is null or empty');
      return;
    }
    console.log('Start Time:', pitchBooking.startTime);
    console.log('End Time:', pitchBooking.endTime);
    console.log('booking', pitchBooking);
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
  checkAvailability(selectedDate: Date | null): void {
    if (!selectedDate) {
      console.error('No date selected');
      return;
    }
    const conver = this.convertToDate(selectedDate);
    this.pitchBookingService.getAvailableTimeSlots(conver).subscribe(
      response => {
        console.log('Available time slots:', response);
        const responseBody: IPitchBooking[] = response.body ?? []; // Extract the array from the response body
        console.log(responseBody);
        // Handle  response data
        this.existingBookings = responseBody.map(storedBooking => ({
          startTime: storedBooking.startTime,
          endTime: storedBooking.endTime,
        }));
        this.filterTimeSlots();
      },
      error => {
        console.error('Error fetching available time slots:', error);
      }
    );
    console.log(this.existingBookings);
  }

  filterTimeSlots(): void {
    // Reset filtered time slots
    this.filteredTimeSlots = [...this.timeSlots];
    console.log('the current time slots: ' + this.filteredTimeSlots);
    // Iterate through existing bookings
    this.existingBookings.forEach(booking => {
      // Extract start and end time from existing booking
      const startTime = booking.startTime?.format('HH:mm');
      console.log(startTime);
      const endTime = booking.endTime?.format('HH:mm');
      // Filter out the time slots that match existing booking
      this.filteredTimeSlots = this.filteredTimeSlots.filter(slot => {
        const [slotStartTime, slotEndTime] = slot.value.split('-');
        console.log(this.filteredTimeSlots);
        return !(startTime === slotStartTime && endTime === slotEndTime);
      });
    });
  }

  // Function to handle date selection
  selectedTimeSlot: any | boolean;
  onDateSelected(date: Date): void {
    console.log(this.filteredTimeSlots);
    console.log('Selected date:', date);
    this.isDateSelected = true;
    this.checkAvailability(date);

    if (date instanceof Date && !isNaN(date.getTime())) {
      this.dayjsDate = this.convertToDate(date);
      //  assign the dayjsDate to bookingDate
      // @ts-ignore
      this.bookingDate = this.dayjsDate;
      console.log('Booking date set:', this.bookingDate);
    } else {
      console.error('Invalid date selected:', date);
    }
  }

  convertToDate(date: Date): dayjs.Dayjs {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Note: Month is zero-indexed, so we add 1
    const day = date.getDate();
    return dayjs(`${year}-${month}-${day}`);
  }
  onTimeSlotSelected(timeSlotValue: string): void {
    this.selectedTimeSlot = true;
    console.log('slo Time: ' + timeSlotValue);
    [this.startTime, this.endTime] = timeSlotValue.split('-');
    console.log('Start Time:', this.startTime);
    console.log('End Time:', this.endTime);
  }
}
