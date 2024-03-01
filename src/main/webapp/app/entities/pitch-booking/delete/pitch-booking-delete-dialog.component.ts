import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPitchBooking } from '../pitch-booking.model';
import { PitchBookingService } from '../service/pitch-booking.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './pitch-booking-delete-dialog.component.html',
})
export class PitchBookingDeleteDialogComponent {
  pitchBooking?: IPitchBooking;

  constructor(protected pitchBookingService: PitchBookingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pitchBookingService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
