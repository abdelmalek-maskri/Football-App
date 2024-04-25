import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPitchBooking } from '../pitch-booking.model';
import { EntityArrayResponseType, PitchBookingService } from '../service/pitch-booking.service';
import { Account } from '../../../core/auth/account.model';
import { FontResizeService } from '../../../layouts/navbar/navbar.service';
import { Observable } from 'rxjs';
import { VERSION } from 'app/app.constants';

@Component({
  selector: 'jhi-pitch-booking-detail',
  templateUrl: './pitch-booking-detail.component.html',
  styleUrls: ['pitch-booking-detail.component.scss'],
})
export class PitchBookingDetailComponent implements OnInit {
  @Output() deleteRequest = new EventEmitter<number>(); // Event emitter to notify parent component about delete request
  version = '';
  account: Account | null = null;
  fontSizeMultiplier: number = 1; // Font size multiplier property

  pitchBooking: IPitchBooking | null = null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected pitchBookingService: PitchBookingService,
    private fontResizeService: FontResizeService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pitchBooking }) => {
      this.pitchBooking = pitchBooking;
    });

    this.fontResizeService.fontSizeMultiplier$.subscribe(multiplier => {
      this.fontSizeMultiplier = multiplier;
    });
  }

  previousState(): void {
    window.history.back();
  }

  deletePb(id: number): void {
    this.pitchBookingService.delete(id).subscribe({
      next: () => {
        // Handle success
        console.log(`Pitch booking with ID ${id} deleted successfully.`);
        this.previousState();
      },
      error: error => {
        // Handle error
        console.error('Error deleting pitch booking:', error);
      },
    });
  }
  // Font size adjustment methods
  getFontSizeKey(): string {
    return `fontSizeMultiplier_${this.account?.login || 'default'}`;
  }

  updateFontSize(): void {
    localStorage.setItem(this.getFontSizeKey(), this.fontSizeMultiplier.toString());
    this.fontResizeService.setFontSizeMultiplier(this.fontSizeMultiplier);
  }
}
