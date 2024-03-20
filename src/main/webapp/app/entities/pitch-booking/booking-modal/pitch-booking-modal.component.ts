import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLinkWithHref } from '@angular/router';
import { NgIf } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-pitch-booking-modal',
  templateUrl: './pitch-booking-modal.component.html',
  standalone: true,
  imports: [NgIf, SharedModule, RouterLinkWithHref],
  styleUrls: ['./pitch-booking-modal.component.scss'],
})
export class PitchBookingModalComponent {
  @Input() pitchBooking: any;
  modalRef: any; // Declare modalRef variable

  constructor(public activeModal: NgbActiveModal, private router: Router) {}
  setModalRef(modalRef: any) {
    this.modalRef = modalRef;
  }
  navigateToBooking(pitchBooking: any) {
    // Close the modal before navigating (if needed)
    this.activeModal.close();
    this.router.navigate(['/pitch-booking', pitchBooking.id, 'edit']);
  }

  navigateToEdit(pitchBooking: any) {
    this.activeModal.close();
    this.router.navigate(['/pitch-booking', pitchBooking.id, 'view']);
  }
}
