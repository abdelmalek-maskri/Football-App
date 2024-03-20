import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPitchBooking } from '../pitch-booking.model';

@Component({
  selector: 'jhi-pitch-booking-detail',
  templateUrl: './pitch-booking-detail.component.html',
  styleUrls: ['pitch-booking-detail.component.scss'],
})
export class PitchBookingDetailComponent implements OnInit {
  pitchBooking: IPitchBooking | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pitchBooking }) => {
      this.pitchBooking = pitchBooking;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
